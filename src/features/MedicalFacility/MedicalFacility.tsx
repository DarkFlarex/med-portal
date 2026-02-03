// MedicalFacility.tsx
import { Card, CardContent, Typography, Box, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {type Clinic, useSearchDoctorsMutation} from "../../app/api/search.ts";

const MedicalFacility = () => {
    const navigate = useNavigate();

    // ✅ ЯВНО УКАЗЫВАЕМ ТИП
    const [clinics, setClinics] = useState<Clinic[]>([]);

    const [searchDoctors, { isLoading }] = useSearchDoctorsMutation();

    const onClickClinic = () => {
        navigate("/directions");
    };

    const handleSearch = async () => {
        try {
            const result = await searchDoctors({ departmentId: 2 }).unwrap();

            // ✅ result.clinics имеет тип Clinic[]
            setClinics(result.clinics);
        } catch (error) {
            console.error("Ошибка поиска клиник:", error);
        }
    };

    return (
        <Box sx={{ width: "100%" }}>
            <button onClick={handleSearch} disabled={isLoading}>
                {isLoading ? "Поиск..." : "Поиск докторов"}
            </button>

            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                Выберите медучреждение
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
                {clinics.map((clinic) => (
                    <Card
                        key={clinic.codeid}
                        onClick={onClickClinic}
                        sx={{
                            cursor: "pointer",
                            width: "300px",
                            padding: "2.5rem",
                            backgroundImage:
                                "linear-gradient(to bottom left, #e0e4e5, #f2f6f9)",
                            borderRadius: "2rem",
                            display: "flex",
                            flexDirection: "column",
                            color: "#444447",
                            boxShadow:
                                "inset -2px 2px hsl(0 0 100% / 1), -20px 20px 40px hsl(0 0 0 / 0.25)",
                            transition: ".3s",
                            "&:hover": {
                                transform: "translateY(-5px)",
                                boxShadow: "0 12px 25px rgba(37, 99, 235, 0.25)",
                            },
                        }}
                    >
                        <CardContent
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "1.5rem",
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{ fontSize: "18px", fontWeight: 600 }}
                            >
                                {clinic.name}
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{ fontSize: "16px", color: "#475569" }}
                            >
                                {clinic.address || "Адрес не указан"}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}

                {!isLoading && clinics.length === 0 && (
                    <Typography>Клиники не найдены</Typography>
                )}
            </Grid>
        </Box>
    );
};

export default MedicalFacility;
