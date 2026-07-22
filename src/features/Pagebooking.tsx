import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Chip,
  Drawer,
  IconButton,
  Divider,
  Skeleton,
  InputAdornment,
} from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  useBookPatientMutation,
  useGetDepartmentsWithServicesQuery,
  type DepartmentWithServices,
} from "../app/api/search";

// ---- design tokens ----------------------------------------------------
const ink = "#1C2B28";
const inkMuted = "#74857F";
const bg = "#F5F8F6";
const surface = "#FFFFFF";
const line = "#E4EAE7";
const primary = "#1F6F63";
const primaryDark = "#153F38";
const accent = "#F2725A";
const accentDark = "#D85B44";

const pad = (n: number) => String(n).padStart(2, "0");
const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const formatPhoneInput = (raw: string) => {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("996")) digits = digits.slice(3);
  if (digits.startsWith("0")) digits = digits.slice(1);
  digits = digits.slice(0, 9);
  let out = "+996";
  if (digits.length > 0) out += " " + digits.slice(0, 3);
  if (digits.length > 3) out += " " + digits.slice(3, 6);
  if (digits.length > 6) out += " " + digits.slice(6, 9);
  return out;
};

const PageBooking = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useGetDepartmentsWithServicesQuery();
  const departments: DepartmentWithServices[] = data?.data ?? [];

  const [bookPatient, { isLoading: isBooking }] = useBookPatientMutation();

  const [activeDepartmentId, setActiveDepartmentId] = useState<number | null>(
    null,
  );
  const [serviceQuery, setServiceQuery] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    null,
  );
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("+996 ");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // remember contact details between visits
  useEffect(() => {
    const savedName = localStorage.getItem("booking_fullname");
    const savedPhone = localStorage.getItem("booking_phone");
    if (savedName) setFullname(savedName);
    if (savedPhone) setPhone(savedPhone);
  }, []);

  const currentDepartmentId = activeDepartmentId ?? departments[0]?.id ?? null;
  const currentDepartment = departments.find(
    (d) => d.id === currentDepartmentId,
  );

  const filteredServices = useMemo(() => {
    if (!currentDepartment) return [];
    if (!serviceQuery.trim()) return currentDepartment.services;
    const q = serviceQuery.trim().toLowerCase();
    return currentDepartment.services.filter((s) =>
      s.name.toLowerCase().includes(q),
    );
  }, [currentDepartment, serviceQuery]);

  const selectedDepartment = departments.find((d) =>
    d.services.some((s) => s.id === selectedServiceId),
  );
  const selectedService = selectedDepartment?.services.find(
    (s) => s.id === selectedServiceId,
  );

  // next 14 days for the date strip
  const dateOptions = useMemo(() => {
    const arr: Date[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      arr.push(d);
    }
    return arr;
  }, []);

  // default the strip to today once opened
  useEffect(() => {
    if (sheetOpen && !selectedDate) setSelectedDate(dateOptions[0]);
  }, [sheetOpen, selectedDate, dateOptions]);

  // 30-minute slots, 9:00-18:00, hiding past slots for today
  const timeSlots = useMemo(() => {
    const all: string[] = [];
    for (let h = 9; h < 18; h++) {
      all.push(`${pad(h)}:00`);
      all.push(`${pad(h)}:30`);
    }
    all.push("18:00");

    if (!selectedDate || !isSameDay(selectedDate, new Date())) return all;

    const cutoff = Date.now() + 30 * 60000;
    return all.filter((t) => {
      const [hh, mm] = t.split(":").map(Number);
      const slot = new Date();
      slot.setHours(hh, mm, 0, 0);
      return slot.getTime() > cutoff;
    });
  }, [selectedDate]);

  const eventStartValue = useMemo(() => {
    if (!selectedDate || !selectedTime) return "";
    return `${selectedDate.getFullYear()}-${pad(
      selectedDate.getMonth() + 1,
    )}-${pad(selectedDate.getDate())}T${selectedTime}:00`;
  }, [selectedDate, selectedTime]);

  const onSubmit = async () => {
    setError(null);

    if (!selectedDepartment || !selectedServiceId) {
      setError("Выберите услугу");
      return;
    }
    if (!selectedDate || !selectedTime) {
      setError("Выберите дату и время");
      return;
    }
    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length < 12) {
      setError("Укажите номер телефона полностью");
      return;
    }

    try {
      const res = await bookPatient({
        code_department: selectedDepartment.id,
        code_dep_service: selectedServiceId,
        event_start: eventStartValue,
        fullname,
        phone,
        comments: `Отделение: ${selectedDepartment.name}, Услуга: ${selectedService?.name}`,
      }).unwrap();

      if (res.success) {
        localStorage.setItem("booking_fullname", fullname);
        localStorage.setItem("booking_phone", phone);
        setSuccess(true);
      } else {
        setError(res.message || "Не удалось записаться");
      }
    } catch (e: any) {
      setError(e?.data?.message || "Ошибка сервера, попробуйте ещё раз");
    }
  };

  // ---- success screen -----------------------------------------------
  if (success) {
    return (
      <Box
        sx={{
          minHeight: "100dvh",
          bgcolor: bg,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          px: 3,
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            bgcolor: primary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 3,
          }}
        >
          <EventAvailableRoundedIcon sx={{ color: "#fff", fontSize: 36 }} />
        </Box>
        <Typography sx={{ fontWeight: 700, fontSize: 22, color: ink, mb: 1 }}>
          Вы записаны
        </Typography>
        <Typography sx={{ color: inkMuted, mb: 0.5 }}>
          {selectedService?.name}
        </Typography>
        <Typography sx={{ color: inkMuted, mb: 4 }}>
          {new Date(eventStartValue).toLocaleString("ru-RU", {
            day: "numeric",
            month: "long",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/")}
          sx={{
            bgcolor: primary,
            borderRadius: "14px",
            px: 4,
            py: 1.3,
            textTransform: "none",
            fontWeight: 600,
            "&:hover": { bgcolor: primaryDark },
          }}
        >
          На главную
        </Button>
      </Box>
    );
  }

  // ---- main screen -----------------------------------------------------
  return (
    <Box
      sx={{
        minHeight: "100dvh",
        width: "100%",
        maxWidth: "100vw",
        overflowX: "hidden",
        bgcolor: bg,
      }}
    >
      <Box sx={{ pt: 3, pb: selectedServiceId ? 12 : 4, minWidth: 0 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 22, color: ink, mb: 0.3 }}>
          Запись на приём
        </Typography>
        <Typography sx={{ color: inkMuted, fontSize: 14, mb: 2.5 }}>
          Выберите направление и услугу
        </Typography>

        {/* department chip rail */}
        {isLoading ? (
          <Box sx={{ display: "flex", gap: 1, mb: 2.5 }}>
            {[0, 1, 2].map((i) => (
              <Skeleton
                key={i}
                variant="rounded"
                width={100}
                height={40}
                sx={{ borderRadius: "20px" }}
              />
            ))}
          </Box>
        ) : (
          departments.length > 0 && (
            <Box
              sx={{
                position: "sticky",
                top: 0,
                bgcolor: bg,
                zIndex: 2,
                pt: 0.5,
                pb: 1.5,
                mb: 1,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  overflowX: "auto",
                  minWidth: 0,
                  "&::-webkit-scrollbar": { display: "none" },
                  scrollbarWidth: "none",
                }}
              >
                {departments.map((dep) => {
                  const isActive = dep.id === currentDepartmentId;
                  return (
                    <Chip
                      key={dep.id}
                      onClick={() => {
                        setActiveDepartmentId(dep.id);
                        setServiceQuery("");
                      }}
                      label={dep.name}
                      icon={
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            bgcolor: dep.color || primary,
                            ml: "10px !important",
                            border: "1.5px solid rgba(255,255,255,.6)",
                          }}
                        />
                      }
                      sx={{
                        flexShrink: 0,
                        height: 44,
                        px: 0.5,
                        fontWeight: 700,
                        fontSize: 14.5,
                        color: isActive ? "#fff" : ink,
                        bgcolor: isActive ? primary : surface,
                        border: `1.5px solid ${isActive ? primary : "#D3DEDA"}`,
                        boxShadow: isActive
                          ? "0 4px 12px rgba(31,111,99,.25)"
                          : "0 1px 3px rgba(20,40,35,.08)",
                        "& .MuiChip-icon": { order: -1 },
                      }}
                    />
                  );
                })}
              </Box>

              {/* service search */}
              {currentDepartment && currentDepartment.services.length > 4 && (
                <TextField
                  placeholder="Найти услугу"
                  size="small"
                  fullWidth
                  value={serviceQuery}
                  onChange={(e) => setServiceQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchRoundedIcon
                          sx={{ fontSize: 20, color: inkMuted }}
                        />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mt: 1.5,
                    bgcolor: surface,
                    "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                  }}
                />
              )}
            </Box>
          )
        )}

        {/* service list */}
        {isLoading ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
            {[0, 1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                variant="rounded"
                height={64}
                sx={{ borderRadius: "16px" }}
              />
            ))}
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
            {currentDepartment && filteredServices.length === 0 && (
              <Typography sx={{ color: inkMuted, fontSize: 14, py: 2 }}>
                Ничего не найдено по запросу «{serviceQuery}»
              </Typography>
            )}

            {filteredServices.map((service) => {
              const isSelected = selectedServiceId === service.id;
              return (
                <Box
                  key={service.id}
                  onClick={() => setSelectedServiceId(service.id)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1.5,
                    bgcolor: surface,
                    borderRadius: "16px",
                    border: `1.5px solid ${isSelected ? primary : line}`,
                    px: 2,
                    py: 1.6,
                    cursor: "pointer",
                    transition: "border-color .15s, background-color .15s",
                  }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: 15,
                        color: ink,
                        lineHeight: 1.3,
                      }}
                    >
                      {service.name}
                    </Typography>
                    {service.comment && (
                      <Typography
                        sx={{
                          color: inkMuted,
                          fontSize: 13,
                          mt: 0.3,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {service.comment}
                      </Typography>
                    )}
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      flexShrink: 0,
                    }}
                  >
                    <Typography
                      sx={{ fontWeight: 700, fontSize: 15, color: primary }}
                    >
                      {service.cost} с
                    </Typography>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: isSelected ? primary : bg,
                        border: `1.5px solid ${isSelected ? primary : line}`,
                      }}
                    >
                      {isSelected && (
                        <CheckRoundedIcon
                          sx={{ fontSize: 16, color: "#fff" }}
                        />
                      )}
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>

      {/* sticky bottom bar */}
      {selectedService && !sheetOpen && (
        <Box
          sx={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: surface,
            borderTop: `1px solid ${line}`,
            px: 2.5,
            py: 1.5,
            pb: "calc(12px + env(safe-area-inset-bottom))",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            boxShadow: "0 -8px 24px rgba(0,0,0,.06)",
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: 12,
                color: inkMuted,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {selectedService.name}
            </Typography>
            <Typography sx={{ fontWeight: 700, fontSize: 17, color: ink }}>
              {selectedService.cost} сом
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => setSheetOpen(true)}
            sx={{
              bgcolor: accent,
              borderRadius: "14px",
              px: 3,
              py: 1.2,
              fontWeight: 700,
              fontSize: 15,
              textTransform: "none",
              whiteSpace: "nowrap",
              "&:hover": { bgcolor: accentDark },
            }}
          >
            Выбрать время
          </Button>
        </Box>
      )}

      {/* bottom sheet - booking form */}
      <Drawer
        anchor="bottom"
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        PaperProps={{
          sx: {
            borderTopLeftRadius: "24px",
            borderTopRightRadius: "24px",
            px: 2.5,
            pt: 1.5,
            pb: "calc(20px + env(safe-area-inset-bottom))",
            maxHeight: "90dvh",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 4,
            borderRadius: 2,
            bgcolor: line,
            mx: "auto",
            mb: 2,
            flexShrink: 0,
          }}
        />

        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            mb: 2,
            flexShrink: 0,
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: 18, color: ink }}>
              Когда вам удобно?
            </Typography>
            <Typography sx={{ color: inkMuted, fontSize: 13, mt: 0.3 }}>
              {selectedDepartment?.name} · {selectedService?.name}
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={() => setSheetOpen(false)}
            sx={{ bgcolor: bg, mt: -0.5 }}
          >
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ overflowY: "auto", flex: 1 }}>
          {/* date strip */}
          <Box
            sx={{
              display: "flex",
              gap: 1,
              overflowX: "auto",
              pb: 1,
              mb: 2,
              "&::-webkit-scrollbar": { display: "none" },
              scrollbarWidth: "none",
            }}
          >
            {dateOptions.map((d) => {
              const isActive = selectedDate && isSameDay(d, selectedDate);
              const weekday = d
                .toLocaleDateString("ru-RU", { weekday: "short" })
                .replace(".", "");
              return (
                <Box
                  key={d.toISOString()}
                  onClick={() => {
                    setSelectedDate(d);
                    setSelectedTime(null);
                  }}
                  sx={{
                    flexShrink: 0,
                    width: 52,
                    py: 1,
                    borderRadius: "14px",
                    textAlign: "center",
                    cursor: "pointer",
                    bgcolor: isActive ? primary : surface,
                    border: `1.5px solid ${isActive ? primary : line}`,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: isActive ? "rgba(255,255,255,.75)" : inkMuted,
                      textTransform: "capitalize",
                    }}
                  >
                    {weekday}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: isActive ? "#fff" : ink,
                    }}
                  >
                    {d.getDate()}
                  </Typography>
                </Box>
              );
            })}
          </Box>

          {/* time slots */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 1,
              mb: 2.5,
            }}
          >
            {timeSlots.length === 0 && (
              <Typography
                sx={{ gridColumn: "1 / -1", color: inkMuted, fontSize: 13 }}
              >
                На сегодня свободных слотов не осталось - выберите другой день
              </Typography>
            )}
            {timeSlots.map((t) => {
              const isActive = selectedTime === t;
              return (
                <Box
                  key={t}
                  onClick={() => setSelectedTime(t)}
                  sx={{
                    textAlign: "center",
                    py: 1,
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 600,
                    color: isActive ? "#fff" : ink,
                    bgcolor: isActive ? primary : bg,
                    border: `1px solid ${isActive ? primary : line}`,
                  }}
                >
                  {t}
                </Box>
              );
            })}
          </Box>

          <Divider sx={{ borderColor: line, mb: 2.5 }} />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="ФИО"
              fullWidth
              size="small"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />

            <TextField
              label="Телефон"
              fullWidth
              size="small"
              value={phone}
              onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
              inputProps={{ inputMode: "tel" }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />

            {error && (
              <Alert severity="error" sx={{ borderRadius: "12px" }}>
                {error}
              </Alert>
            )}
          </Box>
        </Box>

        <Button
          variant="contained"
          fullWidth
          disabled={isBooking}
          onClick={onSubmit}
          sx={{
            bgcolor: accent,
            borderRadius: "14px",
            py: 1.4,
            fontWeight: 700,
            fontSize: 16,
            textTransform: "none",
            mt: 2,
            flexShrink: 0,
            "&:hover": { bgcolor: accentDark },
          }}
        >
          {isBooking ? "Записываем..." : "Подтвердить запись"}
        </Button>
      </Drawer>
    </Box>
  );
};

export default PageBooking;
