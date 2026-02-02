import { Box, Grid, Typography } from "@mui/material";
import {useNavigate} from "react-router-dom";

const departmentsData = [
    { letter: "А", items: [{ id: 5, name: "Аллерголог 5" }] },
    { letter: "Г", items: [{ id: 41, name: "Гематолог" }] },
    { letter: "Д", items: [{ id: 58, name: "Детский хирург" }] },
    { letter: "К", items: [{ id: 8, name: "Кардиолог - ЭХО КГ" }] },
    { letter: "Н", items: [{ id: 13, name: "Невропатолог 5" }] },
    {
        letter: "О",
        items: [
            { id: 10, name: "Ортопед-травматолог 5" },
            { id: 2, name: "Отоларинголог(ЛОР) 5" },
            { id: 3, name: "Офтальмолог 5" },
        ],
    },
    { letter: "П", items: [{ id: 1, name: "Педиатрия 5" }] },
    { letter: "У", items: [{ id: 9, name: "УЗИ 5" }] },
];

const PageDirections = () => {
    const navigate = useNavigate();
    return (
        <Box sx={{    width: "100%", }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                Выберите специальность
            </Typography>

            <Grid sx={{

                margin: "20px auto",
                fontFamily: "Arial, sans-serif",
            }}>
                {departmentsData.map(({ letter, items }) => (
                    <Grid
                        key={letter}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            marginBottom: "20px",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                            background: "#fff",
                            overflow: "hidden",
                        }}
                    >
                        {/* Заголовок буквы */}
                        <Typography
                            variant="h6"
                            sx={{
                                background: "#1e293b",
                                color: "white",
                                padding: "8px 12px",
                                fontWeight: "bold",
                                fontSize: "16px",
                            }}
                        >
                            {letter}
                        </Typography>

                        {/* Список отделений */}
                        {items.map(({ id, name }) => (
                            <Box
                                key={id}
                                onClick={() => navigate("/doctors")}
                                sx={{
                                    p: 1,
                                    borderRadius: 1,
                                    cursor: "pointer",
                                    "&:hover": { backgroundColor: "#e3f2fd" },
                                    fontSize: "1rem",
                                    userSelect: "none",
                                }}
                                role="button"
                                tabIndex={0}
                            >
                                {name}
                            </Box>
                        ))}
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default PageDirections;
