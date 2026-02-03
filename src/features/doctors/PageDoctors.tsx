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

    const [doctors] = useState<Doctor[]>([
        {
            id: 1,
            name: "Ашералиев Мухтар Есенжанович",
            specialization: "Аллерголог",
            avatar: "",
        },
    ]);

    const [selectedDurations] = useState<number[]>(doctors.map(() => 30));

    // ❌ Админская логика (оставлена на будущее)
    // const [editingId, setEditingId] = useState<number | null>(null);
    // const updateDoctor = () => {};
    // const onAvatarChange = () => {};
    // const onChangeDuration = () => {};

    const onCardContentClick = (doctor: Doctor, duration: number) => {
        navigate("/appointments", { state: { doctor, duration } });
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
                        key={doctor.id}
                        sx={{
                            cursor: "pointer",
                            width: 320,
                            p: 3,
                            borderRadius: "24px",
                            background:
                                "linear-gradient(to bottom left, #e0e4e5, #f2f6f9)",
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
                                onCardContentClick(
                                    doctor,
                                    selectedDurations[index]
                                )
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
                                    backgroundColor: doctor.avatar
                                        ? "transparent"
                                        : "#bbb",
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
                            </Box>

                            {/* ФИО — display only, без hover/focus */}
                            <TextField
                                label="ФИО"
                                value={doctor.name}
                                size="small"
                                fullWidth
                                InputProps={{ readOnly: true }}
                                sx={{
                                    mb: 1,

                                    "& .MuiInputBase-root": {
                                        backgroundColor: "transparent",
                                        cursor: "default",
                                    },

                                    "& .MuiInputBase-input": {
                                        userSelect: "text",
                                        cursor: "text",
                                    },

                                    "& .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "rgba(0,0,0,0.23)",
                                    },

                                    "&:hover .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "rgba(0,0,0,0.23)",
                                    },

                                    "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "rgba(0,0,0,0.23)",
                                    },
                                }}
                                onClick={(e) => e.stopPropagation()}
                            />

                            {/* Специализация — display only */}
                            <TextField
                                label="Специализация"
                                value={doctor.specialization}
                                size="small"
                                fullWidth
                                InputProps={{ readOnly: true }}
                                sx={{
                                    mb: 1,

                                    "& .MuiInputBase-root": {
                                        backgroundColor: "transparent",
                                        cursor: "default",
                                    },

                                    "& .MuiInputBase-input": {
                                        userSelect: "text",
                                        cursor: "text",
                                    },

                                    "& .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "rgba(0,0,0,0.23)",
                                    },

                                    "&:hover .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "rgba(0,0,0,0.23)",
                                    },

                                    "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "rgba(0,0,0,0.23)",
                                    },
                                }}
                                onClick={(e) => e.stopPropagation()}
                            />

                            {/* Время приёма — disabled, но визуально как обычное */}
                            <FormControl fullWidth>
                                <InputLabel
                                    id={`duration-${index}`}
                                    sx={{
                                        color: "text.primary",
                                        "&.Mui-disabled": {
                                            color: "text.primary",
                                        },
                                    }}
                                >
                                    Время приёма
                                </InputLabel>

                                <Select
                                    labelId={`duration-${index}`}
                                    value={selectedDurations[index]}
                                    label="Время приёма"
                                    disabled
                                    sx={{
                                        borderRadius: "12px",
                                        backgroundColor: "transparent",

                                        "& .MuiSelect-select": {
                                            color: "text.primary",
                                            userSelect: "text",
                                        },

                                        "&.Mui-disabled .MuiSelect-select": {
                                            WebkitTextFillColor: "inherit",
                                        },

                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "rgba(0,0,0,0.23)",
                                        },

                                        "&:hover .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "rgba(0,0,0,0.23)",
                                        },
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {appointmentDurations.map((option) => (
                                        <MenuItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* ❌ Админская кнопка (оставлена закомментированной) */}
                            {/*
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
                            */}
                        </CardContent>
                    </Card>
                ))}

                {doctors.length === 0 && (
                    <Typography>Врачи не найдены</Typography>
                )}
            </Grid>
        </Box>
    );
};

export default PageDoctors;
