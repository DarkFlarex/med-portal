import { Card, CardContent, Typography, Box, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useClinicsQuery } from "../../app/api/search";

const MedicalFacility = () => {
  const navigate = useNavigate();

  const { data: clinics, isLoading } = useClinicsQuery();

  const onClickClinic = (clinic: any) => {
    navigate("/directions", { state: { clinic } });
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Выберите медучреждение
      </Typography>

      {isLoading && <Typography>Загрузка...</Typography>}

      <Grid
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "16px",
          mt: 2,
          width: "100%",
        }}
      >
        {clinics?.map((clinic: any) => (
          <Card
            key={clinic.codeid}
            onClick={() => onClickClinic(clinic)}
            sx={{
              cursor: "pointer",
              width: 300,
              p: "2.5rem",
              backgroundImage:
                "linear-gradient(to bottom left, #e0e4e5, #f2f6f9)",
              borderRadius: "2rem",
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
            <CardContent sx={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {clinic.name}
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
