import { Box, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { useGetDepartmentsQuery } from "../../app/api/search"; // путь подкорректируй
interface Department {
  codeid: number;
  name: string;
}
const PageDirections = () => {
  const navigate = useNavigate();
  const { data: departments = [] } = useGetDepartmentsQuery({ clinicId: 1 });
  const departmentsGrouped = useMemo(() => {
    if (!departments?.departaments?.length)
      return {} as Record<string, Department[]>;

    return departments?.departaments.reduce((acc: any, dep: any) => {
      const letter = dep.name[0].toUpperCase();

      if (!acc[letter]) acc[letter] = [];
      acc[letter].push(dep);

      return acc;
    }, {} as Record<string, Department[]>);
  }, [departments]);

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
          .sort(([a], [b]) => a.localeCompare(b, "ru")) // сортировка по русскому алфавиту
          .map(([letter, items]: any) => (
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
              {items.map((dep: any) => (
                <Box
                  key={dep.codeid}
                  onClick={() =>
                    navigate("/doctors", {
                      state: { departmentId: dep.codeid },
                    })
                  }
                  sx={{
                    p: 1,
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "#e3f2fd" },
                    fontSize: "1rem",
                    userSelect: "none",
                  }}
                  role="button"
                  tabIndex={0}
                >
                  {dep.name}
                </Box>
              ))}
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};

export default PageDirections;
