import React from "react";
import { Container } from "@mui/material";
import AppToolbar from "../AppToolbar/AppToolbar";
import Footer from "../Footer/Footer.tsx";
import {useLocation} from "react-router-dom";

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
    const location = useLocation();


    const onExcludedPage =
        location.pathname.includes("/login") ||
        location.pathname.includes("/register");
    return (
        <>
            {!onExcludedPage && <AppToolbar />}
            <Container  maxWidth="lg"
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "20px",
                        }}>
                {children}
            </Container>
            {!onExcludedPage && <Footer/>}
        </>
    );
};


export default Layout;
