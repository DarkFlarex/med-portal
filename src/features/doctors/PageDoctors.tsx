import {
    Box,
    Card,
    CardContent,
    Grid,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { type Department, type Doctor, useSearchDoctorsMutation } from "../../app/api/search.ts";

const appointmentDurations = [
    { label: "15 мин", value: 15 },
    { label: "30 мин", value: 30 },
    { label: "1 час", value: 60 },
];

const PageDoctors = () => {
    const navigate = useNavigate();
    const [searchDoctors] = useSearchDoctorsMutation();

    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);

    // Для упрощения — все доктора будут с фиксированной длительностью 30 минут
    const [selectedDurations, setSelectedDurations] = useState<number[]>([]);

    useEffect(() => {
        async function fetchDoctors() {
            try {
                const res = await searchDoctors({}).unwrap();
                setDoctors(res.doctors_list);
                setDepartments(res.departaments);
                setSelectedDurations(res.doctors_list.map(() => 30));
            } catch (error) {
                console.error("Ошибка загрузки докторов", error);
            }
        }
        fetchDoctors();
    }, [searchDoctors]);

    // Получить название отдела по department_id врача
    const getDepartmentName = (id: number | string) => {
        return departments.find((d) => String(d.codeid) === String(id))?.name || "Неизвестно";
    };

    const onCardContentClick = (doctor: Doctor, duration: number) => {
        navigate("/appointments", {
            state: {
                doctor: {
                    name: doctor.fio,
                    specialization: getDepartmentName(doctor.department_id), // Обрати внимание на department_id
                },
                duration,
            },
        });
    };

    return (
        <Box sx={{ width: "100%" }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                Выберите врача
            </Typography>

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
                {doctors.map((doctor, index) => (
                    <Card
                        key={`${doctor.doctor_id}-${doctor.department_id}`}
                        sx={{
                            cursor: "pointer",
                            width: 320,
                            p: 3,
                            borderRadius: "24px",
                            background: "linear-gradient(to bottom left, #e0e4e5, #f2f6f9)",
                            boxShadow: "0 12px 30px rgba(0,0,0,.15)",
                            transition: ".3s",
                            "&:hover": {
                                transform: "translateY(-6px)",
                            },
                        }}
                    >
                        <CardContent
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 1,
                            }}
                            onClick={() =>
                                onCardContentClick(doctor, selectedDurations[index])
                            }
                        >
                            {/* Аватар */}
                            <Box
                                sx={{
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
                                }}
                            >
                                {doctor.img ? (
                                    <Box
                                        component="img"
                                        src={doctor.img}
                                        alt="Аватар врача"
                                        sx={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                        }}
                                    />
                                ) : (
                                    <Typography
                                        sx={{
                                            color: "#fff",
                                            fontWeight: "bold",
                                            fontSize: 24,
                                            userSelect: "none",
                                        }}
                                    >
                                        ?
                                    </Typography>
                                )}
                            </Box>

                            {/* ФИО */}
                            <TextField
                                label="ФИО"
                                value={doctor.fio}
                                size="small"
                                fullWidth
                                InputProps={{ readOnly: true }}
                                sx={{ mb: 1 }}
                                onClick={(e) => e.stopPropagation()}
                            />

                            {/* Специализация */}
                            <TextField
                                label="Специализация"
                                value={getDepartmentName(doctor.department_id)} // Тут тоже department_id
                                size="small"
                                fullWidth
                                InputProps={{ readOnly: true }}
                                sx={{ mb: 1 }}
                                onClick={(e) => e.stopPropagation()}
                            />

                            {/* Время приёма */}
                            <FormControl fullWidth>
                                <InputLabel
                                    id={`duration-${index}`}
                                    sx={{ color: "text.primary", "&.Mui-disabled": { color: "text.primary" } }}
                                >
                                    Время приёма
                                </InputLabel>

                                <Select
                                    labelId={`duration-${index}`}
                                    value={selectedDurations[index]}
                                    label="Время приёма"
                                    disabled
                                    sx={{ borderRadius: "12px", backgroundColor: "transparent" }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {appointmentDurations.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </CardContent>
                    </Card>
                ))}

                {doctors.length === 0 && <Typography>Врачи не найдены</Typography>}
            </Grid>
        </Box>
    );
};

export default PageDoctors;
