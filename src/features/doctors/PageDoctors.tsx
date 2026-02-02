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
    Button,
    TextField, type SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Doctor = {
    id: number;
    name: string;
    specialization: string;
    avatar?: string;
};

const appointmentDurations = [
    { label: "15 мин", value: 15 },
    { label: "30 мин", value: 30 },
    { label: "1 час", value: 60 },
];

const PageDoctors = () => {
    const navigate = useNavigate();

    const [doctors, setDoctors] = useState<Doctor[]>([
        {
            id: 1,
            name: "Ашералиев Мухтар Есенжанович",
            specialization: "Аллерголог",
            avatar: "",
        },
    ]);

    const [selectedDurations, setSelectedDurations] = useState<number[]>(
        doctors.map(() => 30)
    );

    const [editingId, setEditingId] = useState<number | null>(null);

    const updateDoctor = (id: number, field: keyof Doctor, value: string) => {
        setDoctors((prev) =>
            prev.map((doc) => (doc.id === id ? { ...doc, [field]: value } : doc))
        );
    };

    const onAvatarChange = (id: number, file: File) => {
        const url = URL.createObjectURL(file);
        updateDoctor(id, "avatar", url);
    };


    const onChangeDuration = (
        index: number,
        e: SelectChangeEvent<number | string>
    ) => {
        e.stopPropagation();
        const newDurations = [...selectedDurations];
        newDurations[index] = Number(e.target.value);
        setSelectedDurations(newDurations);
    };


    const onCardContentClick = (doctor: Doctor, duration: number) => {
        if (editingId !== doctor.id) {
            navigate("/appointments", { state: { doctor, duration } });
        }
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
                {doctors.map((doctor, index) => {
                    const isEditing = editingId === doctor.id;

                    return (
                        <Card
                            key={doctor.id}
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
                        >
                            <CardContent
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 1,
                                }}
                                onClick={() => onCardContentClick(doctor, selectedDurations[index])} // Переход тут
                            >
                                {/* Аватар */}
                                <Box
                                    sx={{
                                        position: "relative",
                                        width: 96,
                                        height: 96,
                                        mx: "auto",
                                        mb: 2,
                                        cursor: isEditing ? "pointer" : "default",
                                        borderRadius: "50%",
                                        overflow: "hidden",
                                        border: "3px solid #fff",
                                        backgroundColor: doctor.avatar ? "transparent" : "#bbb",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    {doctor.avatar ? (
                                        <Box
                                            component="img"
                                            src={doctor.avatar}
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
                                                onChange={(e) =>
                                                    e.target.files && onAvatarChange(doctor.id, e.target.files[0])
                                                }
                                            />
                                        </Box>
                                    )}
                                </Box>

                                {/* ФИО */}
                                <TextField
                                    label="ФИО"
                                    value={doctor.name}
                                    size="small"
                                    fullWidth
                                    onChange={(e) => updateDoctor(doctor.id, "name", e.target.value)}
                                    InputProps={{
                                        readOnly: !isEditing,
                                    }}
                                    sx={{
                                        mb: 1,
                                        "& .MuiInputBase-root.Mui-disabled": {
                                            backgroundColor: "transparent",
                                        },
                                        "& .MuiInputBase-root": {
                                            backgroundColor: "transparent",
                                        },
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                />

                                {/* Специализация */}
                                <TextField
                                    label="Специализация"
                                    value={doctor.specialization}
                                    size="small"
                                    fullWidth
                                    onChange={(e) =>
                                        updateDoctor(doctor.id, "specialization", e.target.value)
                                    }
                                    InputProps={{
                                        readOnly: !isEditing,
                                    }}
                                    sx={{
                                        mb: 1,
                                        "& .MuiInputBase-root.Mui-disabled": {
                                            backgroundColor: "transparent",
                                        },
                                        "& .MuiInputBase-root": {
                                            backgroundColor: "transparent",
                                        },
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                />

                                {/* Длительность приёма */}
                                <FormControl fullWidth>
                                    <InputLabel id={`duration-${index}`}>Время приёма</InputLabel>
                                    <Select
                                        labelId={`duration-${index}`}
                                        value={selectedDurations[index]}
                                        label="Время приёма"
                                        onChange={(e) => onChangeDuration(index, e)}
                                        disabled={false}
                                        sx={{
                                            borderRadius: "12px",
                                            backgroundColor: "#f7f9fc",
                                            pointerEvents: "auto",
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {appointmentDurations.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                {/* Кнопки */}
                                {isEditing ? (
                                    <Button
                                        variant="contained"
                                        color="success"
                                        sx={{ borderRadius: "12px", mt: 1 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingId(null);
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
                                            setEditingId(doctor.id);
                                        }}
                                    >
                                        Редактировать
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
                {doctors.length === 0 && <Typography>Врачи не найдены</Typography>}
            </Grid>
        </Box>
    );
};
export default PageDoctors;
