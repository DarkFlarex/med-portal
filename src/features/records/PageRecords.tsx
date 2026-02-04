import { Button, Grid, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const PageRecords = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    if (!state) {
        return <Typography>Запись не найдена</Typography>;
    }

    const {
        recordId,
        fullname,
        phone,
        doctor,
        department,
        date,
        time,
    } = state;

    return (
        <Grid display="flex" justifyContent="center" mt={4}>
            <Grid
                sx={{
                    background: "#fff",
                    padding: "20px 30px",
                    borderRadius: "12px",
                    maxWidth: "400px",
                    textAlign: "center",
                }}
            >
                <img src="/checkmark.png" width="130" height="130" alt="" />

                <Typography
                    sx={{ color: "#3b82f6", fontSize: "24px", fontWeight: "bold" }}
                >
                    Запись успешно создана!
                </Typography>

                <Typography fontSize={14} mt={1}>
                    Если вы не сможете прийти на приём, отмените запись, позвонив в
                    регистратуру.
                </Typography>

                <Typography fontSize={18} fontWeight="bold" mt={2}>
                    Номер записи: {recordId}
                </Typography>

                <p><strong>ФИО:</strong> {fullname}</p>
                <p><strong>Телефон:</strong> {phone}</p>
                <p><strong>Врач:</strong> {doctor}</p>
                <p><strong>Дата:</strong> {date}</p>
                <p><strong>Время:</strong> {time}</p>

                <Button
                    onClick={() => navigate("/")}
                    sx={{
                        marginTop: "15px",
                        background: "#3b82f6",
                        color: "white",
                        borderRadius: "6px",
                        textTransform: "capitalize",
                    }}
                >
                    Назад
                </Button>
            </Grid>
        </Grid>
    );
};

export default PageRecords;
