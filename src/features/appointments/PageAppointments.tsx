import { useState, useMemo, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Paper,
} from "@mui/material";
import "./PageAppointments.css";
import {
  useGetEventsQuery,
  useUpsertEventMutation,
} from "../../app/api/search.ts";

type WeekDay =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

const weekMap: Record<number, WeekDay> = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
};

const PageAppointments = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const doctorFromState = location.state?.doctor ?? {
    fio: "Ашералиев Мухтар Есенжанович",
    department_name: "Аллерголог 5",
  };
  console.log(doctorFromState);

  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const durationFromState = location.state?.duration ?? 30;
  const doctorId = location.state?.doctorId;
  const departmentId = location.state?.departmentId;

  const selectedDateISO = selectedDate ? selectedDate.toISOString() : undefined;
  const { data: busySlots = [] } = useGetEventsQuery({
    doctorId,
    departmentId,
    selectedDate: selectedDateISO,
  });

  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [consent, setConsent] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    fullname: "",
    phone: "",
    dob: "",
  });

  // Хук для вызова API создания записи
  const [upsertEvent, { isLoading }] = useUpsertEventMutation();

  const generateDates = (): Date[] => {
    const dates: Date[] = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const dates = generateDates();

  // Генерация временных слотов
  //   const generateTimeSlots = (stepMinutes: number): string[] => {
  //     const slots: string[] = [];
  //     const startHour = 8;
  //     const endHour = 18;

  //     let current = startHour * 60; // 08:00
  //     const end = endHour * 60; // 18:00

  //     while (current < end) {
  //       const hours = Math.floor(current / 60);
  //       const minutes = current % 60;

  //       slots.push(
  //         `${hours.toString().padStart(2, "0")}:${minutes
  //           .toString()
  //           .padStart(2, "0")}`
  //       );

  //       current += stepMinutes;
  //     }

  //     return slots;
  //   };

  //   const timeSlots = generateTimeSlots(durationFromState);

  // Форматирование даты
  const formatDate = (date: Date): string =>
    date
      .toLocaleDateString("ru-RU", {
        weekday: "short",
        day: "numeric",
        month: "short",
      })
      .replace(".", "");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!consent) {
      alert("Вы должны согласиться на обработку персональных данных!");
      return;
    }

    if (!selectedDate || !selectedTime) {
      alert("Выберите дату и время!");
      return;
    }

    // Формируем дату-время начала записи в ISO формате для API
    const dateString = selectedDate.toISOString().split("T")[0];
    const eventStart = `${dateString}T${selectedTime}:00`;

    try {
      const response = await upsertEvent({
        code_department: doctorFromState.department_id,
        code_doctor: doctorFromState.doctor_id,
        event_start: eventStart,
        event_end: undefined,
        fullname: formData.fullname,
        phone: formData.phone,
        dob: formData.dob,
        comments: "",
      }).unwrap();

      if (response.success) {
        const recordId = response.res?.[0]?.codeid;

        navigate("/records", {
          state: {
            recordId,
            fullname: formData.fullname,
            phone: formData.phone,
            doctor: doctorFromState.fio,
            department: doctorFromState.department_name,
            date: selectedDate.toLocaleDateString("ru-RU"),
            time: selectedTime,
          },
        });
      } else {
        alert("Ошибка при создании записи: " + response.message);
      }
    } catch (error) {
      alert("Произошла ошибка при отправке данных. Попробуйте позже.");
      console.error(error);
    }
  };

  // Проверка занятых/недоступных слотов
  const DEFAULT_DURATION = 30;

  const isTimeSlotBusy = (time: string): boolean => {
    const [h, m] = time.split(":").map(Number);
    const minutes = h * 60 + m;

    return busySlots.some((slot: any) => {
      const start = new Date(slot.event_start);
      const end = new Date(slot.event_end);

      const startMinutes = start.getHours() * 60 + start.getMinutes();
      const endMinutes =
        start.getTime() === end.getTime()
          ? startMinutes + DEFAULT_DURATION
          : end.getHours() * 60 + end.getMinutes();

      return minutes >= startMinutes && minutes < endMinutes;
    });
  };

  const isSlotTooEarly = (time: string, date: Date) => {
    const [h, m] = time.split(":").map(Number);

    const slotDate = new Date(date);
    slotDate.setHours(h, m, 0, 0);

    const nowPlus2h = new Date();
    nowPlus2h.setMinutes(nowPlus2h.getMinutes() + 120);

    return slotDate < nowPlus2h;
  };

  const isTimeSlotDisabled = (time: string): boolean => {
    const disabledSlots = ["18:00"];
    return disabledSlots.includes(time);
  };

  const getDoctorWorkTime = (date: Date) => {
    const dayKey = weekMap[date.getDay()]; // monday, tuesday и т.д.

    const startISO = doctorFromState?.[`${dayKey}_start`];
    const endISO = doctorFromState?.[`${dayKey}_end`];

    // дефолт: 09:00–16:00
    const DEFAULT_START = 9 * 60;
    const DEFAULT_END = 16 * 60;

    if (!startISO || !endISO) {
      return {
        startMinutes: DEFAULT_START,
        endMinutes: DEFAULT_END,
      };
    }

    const start = new Date(startISO);
    const end = new Date(endISO);

    // если 1970-01-01 → считаем дефолтным рабочим днём
    if (start.getTime() === 0 || end.getTime() === 0) {
      return {
        startMinutes: DEFAULT_START,
        endMinutes: DEFAULT_END,
      };
    }

    return {
      startMinutes: start.getUTCHours() * 60 + start.getUTCMinutes(),
      endMinutes: end.getUTCHours() * 60 + end.getUTCMinutes(),
    };
  };

  const generateTimeSlots = (date: Date, stepMinutes: number): string[] => {
    const workTime = getDoctorWorkTime(date);
    if (!workTime) return []; // врач не работает

    const slots: string[] = [];

    let current = workTime.startMinutes;
    while (current + stepMinutes <= workTime.endMinutes) {
      const h = Math.floor(current / 60);
      const m = current % 60;

      slots.push(
        `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`
      );

      current += stepMinutes;
    }

    return slots;
  };

  const timeSlots = useMemo(() => {
    if (!selectedDate) return [];
    return generateTimeSlots(selectedDate, durationFromState);
  }, [selectedDate, durationFromState]);

  const datePickerRef = useRef<HTMLDivElement>(null);
  const isHoveringRef = useRef(false);

  useEffect(() => {
    const el = datePickerRef.current;
    if (!el) return;

    const onMouseEnter = () => {
      isHoveringRef.current = true;
    };

    const onMouseLeave = () => {
      isHoveringRef.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      if (!isHoveringRef.current) return;

      if (e.deltaY !== 0) {
        e.preventDefault();

        // ⛔ запрещаем скролл влево (в прошлое)
        if (e.deltaY < 0 && el.scrollLeft <= 0) {
          el.scrollLeft = 0;
          return;
        }

        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener("mouseenter", onMouseEnter);
    el.addEventListener("mouseleave", onMouseLeave);
    el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      el.removeEventListener("mouseenter", onMouseEnter);
      el.removeEventListener("mouseleave", onMouseLeave);
      el.removeEventListener("wheel", onWheel);
    };
  }, []);

  return (
    <Box className="container">
      <Box className="infoBox">
        <Typography className="infoText">
          <strong>Специальность:</strong> {doctorFromState.department_name}
        </Typography>
        <Typography className="infoText">
          <strong>Врач:</strong> {doctorFromState.fio}
        </Typography>
        <Typography className="infoText">
          <strong>Длительность приёма:</strong> {durationFromState} минут
        </Typography>
      </Box>

      <Paper component="form" onSubmit={handleSubmit} className="formPaper">
        <Box style={{ marginBottom: 24 }}>
          <Typography className="formLabel">Ф.И.О. пациента</Typography>
          <TextField
            name="fullname"
            placeholder="Иван Иванов"
            required
            fullWidth
            value={formData.fullname}
            onChange={handleInputChange}
            InputProps={{
              classes: {
                root: "textFieldRoot",
                input: "textFieldInput",
              },
            }}
          />
        </Box>

        <Box style={{ marginBottom: 24 }}>
          <Typography className="formLabel">Номер телефона</Typography>
          <TextField
            name="phone"
            placeholder="996"
            type="tel"
            required
            fullWidth
            value={formData.phone}
            onChange={handleInputChange}
          />
        </Box>

        <Box style={{ marginBottom: 24 }}>
          <Typography className="formLabel">Дата рождения</Typography>
          <TextField
            name="dob"
            type="date"
            required
            fullWidth
            value={formData.dob}
            onChange={handleInputChange}
          />
        </Box>

        <Typography className="sectionTitle">Выберите дату и время</Typography>

        {/* Простой для больших экранов */}
        <Box className="datePicker">
          {dates.map((date: Date, index: number) => (
            <Box
              key={index}
              onClick={() => setSelectedDate(date)}
              className={
                selectedDate?.toDateString() === date.toDateString()
                  ? "dateSlot dateSlotSelected"
                  : "dateSlot"
              }
            >
              {formatDate(date)}
            </Box>
          ))}
        </Box>

        {/* С прокруткой для маленьких экранов */}
        <Box className="datePickerWrapper">
          <Box className="datePickerScroll" ref={datePickerRef}>
            {dates.map((date: Date, index: number) => (
              <Box
                key={index}
                onClick={() => setSelectedDate(date)}
                className={
                  selectedDate?.toDateString() === date.toDateString()
                    ? "dateSlot dateSlotSelected"
                    : "dateSlot"
                }
              >
                {formatDate(date)}
              </Box>
            ))}
          </Box>
        </Box>

        {timeSlots.length === 0 && (
          <Typography color="error">
            В выбранный день врач не принимает
          </Typography>
        )}
        <Box className="timeTable">
          {timeSlots.map((time: string, index: number) => {
            // ⛔ скрываем прошедшее и +2 часа только для сегодняшней даты
            if (
              selectedDate &&
              selectedDate.toDateString() === new Date().toDateString() &&
              isSlotTooEarly(time, selectedDate)
            ) {
              return null;
            }

            const isBusy = isTimeSlotBusy(time);
            const isDisabled = isTimeSlotDisabled(time);

            let classNames = "timeSlot";
            if (selectedTime === time && !isBusy && !isDisabled)
              classNames += " timeSlotSelected";
            if (isBusy) classNames += " timeSlotBusy";
            if (isDisabled) classNames += " timeSlotDisabled";

            return (
              <Box
                key={index}
                onClick={() => !isBusy && !isDisabled && setSelectedTime(time)}
                className={classNames}
                style={{
                  cursor: isBusy || isDisabled ? "not-allowed" : "pointer",
                }}
              >
                {time}
              </Box>
            );
          })}
        </Box>

        <FormControlLabel
          control={
            <Checkbox
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              classes={{ root: "checkboxRoot" }}
            />
          }
          label="Я соглашаюсь на обработку персональных данных"
          className="consentLabel"
        />

        <Button
          type="submit"
          variant="contained"
          disabled={!consent || isLoading}
          className="submitButton"
        >
          {isLoading ? "Отправка..." : "Записаться"}
        </Button>
      </Paper>
    </Box>
  );
};

export default PageAppointments;
