import { Box, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSearchDoctorsMutation } from "../../app/api/search"; // путь подкорректируй

const PageDirections = () => {
    const navigate = useNavigate();
    const [searchDoctors] = useSearchDoctorsMutation();
    const [departmentsGrouped, setDepartmentsGrouped] = useState<
        Record<string, { codeid: number; name: string }[]>
    >({});

    useEffect(() => {
        async function fetchDepartments() {
            try {
                const result = await searchDoctors({}).unwrap();
                const departments = result.departaments || [];

                // группируем по первой букве
                const grouped = departments.reduce((groups, dept) => {
                    const letter = dept.name[0].toUpperCase();
                    if (!groups[letter]) groups[letter] = [];
                    groups[letter].push(dept);
                    return groups;
                }, {} as Record<string, { codeid: number; name: string }[]>);

                setDepartmentsGrouped(grouped);
            } catch (error) {
                console.error("Ошибка загрузки департаментов", error);
            }
        }

        fetchDepartments();
    }, [searchDoctors]);

    return (
        <Box sx={{ width: "100%" }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                Выберите специальность
            </Typography>

            <Grid
                sx={{
                    margin: "20px auto",
                    fontFamily: "Arial, sans-serif",
                }}
            >
                {Object.entries(departmentsGrouped)
                    .sort(([a], [b]) => a.localeCompare(b)) // сортируем буквы по алфавиту
                    .map(([letter, items]) => (
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
                            {items.map(({ codeid, name }) => (
                                <Box
                                    key={codeid}
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
