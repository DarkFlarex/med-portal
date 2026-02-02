import { useState } from "react";
import { useLocation } from "react-router-dom";
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

const PageAppointments = () => {
    const location = useLocation();

    const doctorFromState = location.state?.doctor ?? {
        name: "Ашералиев Мухтар Есенжанович",
        specialization: "Аллерголог 5",
    };

    const durationFromState = location.state?.duration ?? 30;

    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [consent, setConsent] = useState<boolean>(false);

    const [formData, setFormData] = useState({
        fullname: "",
        phone: "",
        dob: "",
    });

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
    const generateTimeSlots = (stepMinutes: number): string[] => {
        const slots: string[] = [];
        const startHour = 8;
        const endHour = 18;

        let current = startHour * 60; // 08:00
        const end = endHour * 60;     // 18:00

        while (current < end) {
            const hours = Math.floor(current / 60);
            const minutes = current % 60;

            slots.push(
                `${hours.toString().padStart(2, "0")}:${minutes
                    .toString()
                    .padStart(2, "0")}`
            );

            current += stepMinutes;
        }

        return slots;
    };


    const timeSlots = generateTimeSlots(durationFromState);

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

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!consent) {
            alert("Вы должны согласиться на обработку персональных данных!");
            return;
        }

        if (!selectedDate || !selectedTime) {
            alert("Выберите дату и время!");
            return;
        }

        console.log("Отправка данных:", {
            ...formData,
            selectedDate,
            selectedTime,
            duration: durationFromState,
            doctor: doctorFromState,
        });
    };

    // Проверка занятых/недоступных слотов
    const isTimeSlotBusy = (time: string): boolean => {
        const busySlots = ["09:00", "11:30", "14:00", "16:30"];
        return busySlots.includes(time);
    };

    const isTimeSlotDisabled = (time: string): boolean => {
        const disabledSlots = ["18:00"];
        return disabledSlots.includes(time);
    };

    return (
        <Box className="container">
            <Typography className="title">Запишитесь к врачу</Typography>

            <Box className="infoBox">
                <Typography className="infoText">
                    <strong>Специальность:</strong> {doctorFromState.specialization}
                </Typography>
                <Typography className="infoText">
                    <strong>Врач:</strong> {doctorFromState.name}
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
                        inputProps={{
                            pattern: "\\+?\\d{9,15}",
                        }}
                        InputProps={{
                            classes: {
                                root: "textFieldRoot",
                                input: "textFieldInput",
                            },
                        }}
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
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                            classes: {
                                root: "textFieldRoot",
                                input: "textFieldInput",
                            },
                        }}
                    />
                </Box>

                <Typography className="sectionTitle">Выберите дату и время</Typography>

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

                <Box className="timeTable">
                    {timeSlots.map((time: string, index: number) => {
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
                                style={{ cursor: isBusy || isDisabled ? "not-allowed" : "pointer" }}
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
                    disabled={!consent}
                    className="submitButton"
                >
                    Записаться
                </Button>
            </Paper>
        </Box>
    );
};

export default PageAppointments;
