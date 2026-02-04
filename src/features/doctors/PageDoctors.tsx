import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useSearchDoctorsQuery } from "../../app/api/search.ts";

const PageDoctors = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const departmentId = location.state?.departmentId;
  const { data: doctors = [] } = useSearchDoctorsQuery({
    departmentId: departmentId,
  });

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
        {doctors.map((doctor: any) => (
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
          >
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
              onClick={() =>
                navigate("/appointments", {
                  state: {
                    doctor,
                    departmentId: departmentId,
                    doctorId: doctor.codeid,
                  },
                })
              }
            >
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

              <TextField
                label="ФИО"
                value={doctor.fio}
                size="small"
                fullWidth
                sx={{ mb: 1 }}
                onClick={(e) => e.stopPropagation()}
              />

              <TextField
                label="Специализация"
                value={doctor.department_name} // Тут тоже department_id
                size="small"
                fullWidth
                sx={{ mb: 1 }}
                onClick={(e) => e.stopPropagation()}
              />
            </CardContent>
          </Card>
        ))}

        {doctors.length === 0 && <Typography>Врачи не найдены</Typography>}
      </Grid>
    </Box>
  );
};

export default PageDoctors;
