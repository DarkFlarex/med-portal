import { Card, CardContent, Typography, Box, Grid } from "@mui/material";
import {useNavigate} from "react-router-dom";
// import { useEffect } from "react";
// import { selectClinics, selectClinicsFetching } from "./clinicsSlice.ts";
// import { useAppDispatch, useAppSelector } from "../../app/hooks.ts";
// import { fetchClinics } from "./clinicsThunks.ts";

const clinics = [
    {
        codeid: "kroha-5",
        name: "Кроха-Пятый",
        address: "ул. Суеркулова, 16/2",
    },
    {
        codeid: "kroha-center",
        name: "Кроха-Центр",
        address: "ул. Ибраимова, 84",
    },
];


const MedicalFacility = () => {
    const navigate = useNavigate();

    const onClickClinic = () => {
        navigate("/directions");
    };

    // const dispatch = useAppDispatch();
    // const clinics = useAppSelector(selectClinics);
    // const loading = useAppSelector(selectClinicsFetching);
    //
    // useEffect(() => {
    //     dispatch(fetchClinics());
    // }, [dispatch]);

    return (
        <Box sx={{
            width: "100%"
        }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                Выберите медучреждение
            </Typography>
            <Grid sx={{
                display: 'flex',
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "16px",
                marginTop: "20px",
                width: "100%"
            }}>
                {clinics.map((clinic) => (
                        <Card
                            key={clinic.codeid}
                            onClick={onClickClinic}
                            sx={{
                                cursor: "pointer",
                                width: "300px",
                                "--grad": "red, blue",
                                padding: "2.5rem",
                                backgroundImage:
                                    "linear-gradient(to bottom left, #e0e4e5, #f2f6f9)",
                                borderRadius: "2rem",
                                gap: "1.5rem",
                                display: "flex",
                                flexDirection: "column",
                                fontFamily: "system-ui, sans-serif",
                                color: "#444447",
                                boxShadow:
                                    "inset -2px 2px hsl(0 0 100% / 1), -20px 20px 40px hsl(0 0 0 / 0.25)",
                                "&:hover": {
                                    transform: "translateY(-5px)",
                                    boxShadow: "0 12px 25px rgba(37, 99, 235, 0.25)",
                                },
                            }}
                        >
                        <CardContent sx={{
                            display: "flex",
                         flexDirection: "column",
                            gap: "1.5rem",
                        }}>
                                <Typography
                                    variant="h3"
                                    sx={{ color: "#444447", fontSize: "18px", fontWeight: 600 }}
                                >
                                    {clinic.name}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    sx={{ fontSize: "16px",  color: "#475569" }}
                                >
                                    {clinic.address || "Адрес не указан"}
                                </Typography>
                            </CardContent>
                        </Card>
                ))}

                {clinics.length === 0 && (
                    <Typography>Клиники не найдены</Typography>
                )}
            </Grid>
        </Box>
    );
};

export default MedicalFacility;
