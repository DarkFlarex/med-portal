import {
    Box,
    Card,
    CardContent,
    Grid,
    Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import {
    type Doctor,
    useSearchDoctorsQuery,
} from "../../app/api/search.ts";

const PageDoctors = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const departmentId = location.state?.departmentId;

    // ✅ получаем SearchResponse
    const { data, isLoading } = useSearchDoctorsQuery({
        departmentId,
    });

    // ✅ БЕРЁМ ИМЕННО МАССИВ ДОКТОРОВ
    const doctors: Doctor[] = data?.doctors_list ?? [];

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
                {doctors.map((doctor: Doctor) => (
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
                        onClick={() =>
                            navigate("/appointments", {
                                state: {
                                    doctor,
                                    departmentId,
                                    doctorId: doctor.doctor_id,
                                },
                            })
                        }
                    >
                        <CardContent
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 1,
                            }}
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
                            <Box sx={{ padding: "8.5px 14px" }}>
                                <Typography variant="caption" color="text.secondary">
                                    ФИО
                                </Typography>
                                <Typography>{doctor.fio}</Typography>
                            </Box>

                            {/* Специализация */}
                            <Box sx={{ padding: "8.5px 14px" }}>
                                <Typography variant="caption" color="text.secondary">
                                    Специализация
                                </Typography>
                                <Typography>{doctor.department_name}</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                ))}

                {!isLoading && doctors.length === 0 && (
                    <Typography>Врачи не найдены</Typography>
                )}
            </Grid>
        </Box>
    );
};

export default PageDoctors;
