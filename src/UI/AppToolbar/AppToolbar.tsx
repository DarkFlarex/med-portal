import  { useState } from "react";
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Stack,
  Toolbar,
  Typography,
  Button,
  Drawer,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";

const navItems = [
  { label: "Клиники", to: "/" },
  { label: "Специальность", to: "/directions" },
  { label: "Запись", to: "/records" },
];

const AppToolbar = () => {
  const [open, setOpen] = useState(false);

  return (
      <>
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
              backgroundColor: "#fff",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
            }}
        >
          <Toolbar disableGutters>
            <Container
                maxWidth="lg"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  py: 1,
                }}
            >
              {/* ===== ЛОГО / НАЗВАНИЕ ===== */}
              <Typography
                  component={Link}
                  to="/"
                  sx={{
                    textDecoration: "none",
                    color: "#1e293b",
                    fontSize: 22,
                    fontWeight: 600,
                  }}
              >
                Медицинский портал
              </Typography>

              {/* ===== НАВИГАЦИЯ (DESKTOP) ===== */}
              <Stack
                  direction="row"
                  spacing={3}
                  sx={{ display: { xs: "none", md: "flex" } }}
              >
                {navItems.map((item) => (
                    <Button
                        key={item.to}
                        component={Link}
                        to={item.to}
                        sx={{
                          color: "#475569",
                          fontWeight: 500,
                          textTransform: "none",
                          "&:hover": {
                            color: "#2563eb",
                            background: "transparent",
                          },
                        }}
                    >
                      {item.label}
                    </Button>
                ))}
              </Stack>

              {/* ===== БУРГЕР (MOBILE) ===== */}
              <IconButton
                  onClick={() => setOpen(true)}
                  sx={{ display: { xs: "flex", md: "none" }, color: "#1e293b" }}
              >
                <MenuIcon />
              </IconButton>
            </Container>
          </Toolbar>
        </AppBar>

        {/* ===== MOBILE MENU ===== */}
        <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
          <Box sx={{ width: 250, p: 3 }}>
            <Stack spacing={2}>
              {navItems.map((item) => (
                  <Button
                      key={item.to}
                      component={Link}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      sx={{
                        justifyContent: "flex-start",
                        color: "#1e293b",
                        fontWeight: 500,
                        textTransform: "none",
                      }}
                  >
                    {item.label}
                  </Button>
              ))}
            </Stack>
          </Box>
        </Drawer>
      </>
  );
};

export default AppToolbar;
