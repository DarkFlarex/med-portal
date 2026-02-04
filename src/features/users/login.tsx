import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Grid,
    TextField,
    Typography,
    CardMedia,
} from "@mui/material";
import type { LoginMutation } from "../../types/types";
import CloudBackground from "../users/UsersUi/CloudBackGround/CloudBackground";
import BekemLogo from "../../../src/assets/images/bekem.png";
import Logo from "../../assets/images/bekem.svg";
import "../users/UsersUi/login.css";
import { styled } from "@mui/system";
import {useLoginMutation} from "../../app/api/users.ts";

const StyledLink = styled(Link)({
    color: "inherit",
    textDecoration: "none",
    "&:hover": { color: "inherit" },
});

const Login = () => {
    const navigate = useNavigate();
    const [login, { isLoading, error }] = useLoginMutation(); // RTK Query хук

    const [state, setState] = useState<LoginMutation>({
        login: '',
        password: '',
    });

    const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setState(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const submitFormHandler = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            await login(state).unwrap();// вызываем мутацию с данными
            // например, тут можно сохранить токен в localStorage или в redux
            // localStorage.setItem('token', result.token);

            navigate("/"); // переход после успешного логина
        } catch (err) {
            // обработка ошибки, например уведомление пользователя
            console.error('Ошибка при логине:', err);
        }
    };

    return (
        <>
            <CloudBackground />
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    gap: 1,
                    zIndex: 10,
                }}
            >
                <Box
                    sx={{
                        background: "transparent",
                        borderRadius: "20px",
                        padding: "25px 40px 10px",
                        width: "90%",
                        maxWidth: "420px",
                        color: "#1e293b",
                    }}
                >
                    <StyledLink to="/" style={{ display: "flex", justifyContent: "center" }}>
                        <CardMedia
                            component="img"
                            image={BekemLogo}
                            alt="Логотип"
                            sx={{ width: 210, height: "auto", mb: "20px" }}
                        />
                    </StyledLink>
                    <Box component="form" onSubmit={submitFormHandler}>
                        <Typography
                            sx={{
                                fontSize: "28px",
                                fontWeight: 700,
                                textAlign: "center",
                                color: "#0f172a",
                            }}
                        >
                            Авторизация
                        </Typography>
                        <Grid container direction="column" spacing={1}>
                            <Grid>
                                <Typography className="login-field-label">Логин</Typography>
                                <TextField
                                    required
                                    fullWidth
                                    name="login"
                                    autoComplete="new-login"
                                    value={state.login}
                                    onChange={inputChangeHandler}
                                    InputLabelProps={{ shrink: false }}
                                    className="login-textfield"
                                />
                            </Grid>
                            <Grid>
                                <Typography className="login-field-label">Пароль</Typography>
                                <TextField
                                    required
                                    fullWidth
                                    type="password"
                                    name="password"
                                    autoComplete="current-password"
                                    value={state.password}
                                    onChange={inputChangeHandler}
                                    InputLabelProps={{ shrink: false }}
                                    className="login-textfield"
                                />
                            </Grid>
                        </Grid>

                        <Box sx={{ display: "flex", justifyContent: "center", width: "100%", mt: 2, mb: 2 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={isLoading}
                                sx={{
                                    width: "45%",
                                    maxWidth: "100%",
                                    py: "9px",
                                    fontSize: "16px",
                                    fontWeight: 600,
                                    textTransform: "none",
                                    borderRadius: "50px",
                                    backgroundColor: "#0284c7",
                                    '&:hover': {
                                        backgroundColor: "#0369a1",
                                    },
                                }}
                            >
                                Войти
                            </Button>
                        </Box>
                    </Box>

                    {error && (
                        <Typography sx={{ color: 'red', textAlign: 'center', mb: 2 }}>
                            Ошибка при входе. Проверьте логин и пароль.
                        </Typography>
                    )}

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            textAlign: "left",
                            color: "#1e293b",
                        }}
                    >
                        <Box sx={{ width: "100%" }}>
                            <Box>
                                <Typography sx={{ fontSize: "16px", fontWeight: 500, color: "#1e293b", pr: 1 }}>
                                    Цифровые решения от:
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "center" }}>
                                <StyledLink to="/" sx={{ display: "inline-block" }}>
                                    <CardMedia
                                        component="img"
                                        image={Logo}
                                        alt="Логотип"
                                        sx={{ width: 100, height: "auto", mb: "20px" }}
                                    />
                                </StyledLink>
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    width: "100%",
                                }}
                            >
                                <Typography sx={{ fontSize: "14px", color: "#0f172a", fontWeight: 500 }}>
                                    +996 (555) 954-120
                                </Typography>
                                <Typography sx={{ fontSize: "14px", color: "#0f172a", fontWeight: 500 }}>
                                    admin@333.kg
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    width: "100%",
                                    gap: 2,
                                }}
                            >
                                <Typography sx={{ fontSize: "14px", color: "#0f172a", fontWeight: 500, opacity: 0.9 }}>
                                    +996 (551) 338-368
                                </Typography>
                                <Typography sx={{ fontSize: "14px", color: "#0f172a", fontWeight: 500, opacity: 0.9 }}>
                                    altynsuleimankg@gmail.com
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </>
    );
};

export default Login;
