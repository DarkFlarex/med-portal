import {
    Box,
    Card,
    CardContent,
    Grid,
    Typography,
    TextField,
    Button,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { type Doctor, useSearchDoctorsQuery } from "../../app/api/search.ts";
import { useState, useEffect } from "react";

const PageDoctors = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const departmentId = location.state?.departmentId;

    // Роль (здесь можно заменить на реальную проверку)
    const isAdmin = false; // false для клиента

    // Загрузка докторов
    const { data, isLoading } = useSearchDoctorsQuery({ departmentId });
    const doctorsFromServer: Doctor[] = data ?? [];

    // Локальный стейт для редактирования (копируем данные из сервера)
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);

    useEffect(() => {
        // Сравниваем списки по JSON (упрощённо)
        const prevDoctorsJSON = JSON.stringify(doctors);
        const newDoctorsJSON = JSON.stringify(doctorsFromServer);

        if (prevDoctorsJSON !== newDoctorsJSON) {
            setDoctors(doctorsFromServer);
            setEditingId(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [doctorsFromServer]);

    const updateDoctor = (id: number, field: keyof Doctor, value: string) => {
        setDoctors((prev) =>
            prev.map((doc) => (doc.doctor_id === id ? { ...doc, [field]: value } : doc))
        );
    };

    const onAvatarChange = (id: number, file: File) => {
        const url = URL.createObjectURL(file);
        updateDoctor(id, "img", url);
    };

    // Переход на запись — срабатывает только если не редактируем сейчас этого доктора
    const onCardClick = (doctor: Doctor) => {
        if (editingId !== doctor.doctor_id) {
            navigate("/appointments", {
                state: { doctor, departmentId, doctorId: doctor.doctor_id },
            });
        }
    };

    return (
        <Box sx={{ width: "100%" }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                Выберите врача
            </Typography>

            {isLoading && <Typography>Загрузка...</Typography>}

            <Grid
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: "16px",
                    marginTop: "20px",
                    width: "100%",
                }}
            >
                {doctors.length === 0 && !isLoading && <Typography>Врачи не найдены</Typography>}

                {doctors.map((doctor) => {
                    const isEditing = editingId === doctor.doctor_id;

                    return (
                        <Card
                            key={`${doctor.doctor_id}-${doctor.department_id}`}
                            sx={{
                                cursor: isEditing ? "default" : "pointer",
                                width: 320,
                                p: 3,
                                borderRadius: "24px",
                                background: "linear-gradient(to bottom left, #e0e4e5, #f2f6f9)",
                                boxShadow: "0 12px 30px rgba(0,0,0,.15)",
                                transition: ".3s",
                                "&:hover": {
                                    transform: isEditing ? "none" : "translateY(-6px)",
                                },
                            }}
                            onClick={() => onCardClick(doctor)}
                        >
                            <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                {/* Аватар */}
                                <Box
                                    sx={{
                                        position: "relative",
                                        width: 96,
                                        height: 96,
                                        mx: "auto",
                                        mb: 2,
                                        borderRadius: "50%",
                                        overflow: "hidden",
                                        border: "3px solid #fff",
                                        backgroundColor: doctor.img ? "transparent" : "#bbb",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        cursor: isEditing ? "pointer" : "default",
                                    }}
                                >
                                    {doctor.img ? (
                                        <Box
                                            component="img"
                                            src={doctor.img}
                                            alt="Аватар врача"
                                            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        />
                                    ) : (
                                        <Typography
                                            sx={{ color: "#fff", fontWeight: "bold", fontSize: 24, userSelect: "none" }}
                                        >
                                            ?
                                        </Typography>
                                    )}

                                    {isEditing && (
                                        <Box
                                            component="label"
                                            sx={{
                                                position: "absolute",
                                                inset: 0,
                                                borderRadius: "50%",
                                                backgroundColor: "rgba(0,0,0,0.45)",
                                                color: "#fff",
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                opacity: 0,
                                                transition: "opacity .25s",
                                                fontSize: 12,
                                                fontWeight: 500,
                                                "&:hover": {
                                                    opacity: 1,
                                                },
                                            }}
                                        >
                                            <Typography sx={{ fontSize: 12 }}>Сменить фото</Typography>
                                            <input
                                                hidden
                                                type="file"
                                                accept="image/*"
                                                onClick={(e) => e.stopPropagation()}
                                                onChange={(e) => {
                                                    if (e.target.files) onAvatarChange(doctor.doctor_id, e.target.files[0]);
                                                }}
                                            />
                                        </Box>
                                    )}
                                </Box>

                                {/* ФИО */}
                                {isEditing ? (
                                    <TextField
                                        label="ФИО"
                                        value={doctor.fio}
                                        size="small"
                                        fullWidth
                                        onChange={(e) => updateDoctor(doctor.doctor_id, "fio", e.target.value)}
                                        sx={{ mb: 1 }}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                ) : (
                                    <Typography sx={{ padding: "8.5px 14px" }}>{doctor.fio}</Typography>
                                )}

                                {/* Специализация */}
                                {isEditing ? (
                                    <TextField
                                        label="Специализация"
                                        value={doctor.department_name}
                                        size="small"
                                        fullWidth
                                        onChange={(e) => updateDoctor(doctor.doctor_id, "department_name", e.target.value)}
                                        sx={{ mb: 1 }}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                ) : (
                                    <Typography sx={{ padding: "8.5px 14px" }} color="text.secondary">
                                        {doctor.department_name}
                                    </Typography>
                                )}

                                {/* Кнопки Редактировать / Сохранить (только для админа) */}
                                {isAdmin && (
                                    <>
                                        {isEditing ? (
                                            <Button
                                                variant="contained"
                                                color="success"
                                                sx={{ borderRadius: "12px", mt: 1 }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditingId(null);
                                                    // Здесь можно добавить сохранение на сервер
                                                }}
                                            >
                                                Сохранить
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="outlined"
                                                sx={{ borderRadius: "12px", mt: 1 }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditingId(doctor.doctor_id);
                                                }}
                                            >
                                                Редактировать
                                            </Button>
                                        )}
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </Grid>
        </Box>
    );
};

export default PageDoctors;
