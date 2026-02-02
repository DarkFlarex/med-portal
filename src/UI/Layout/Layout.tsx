import React from "react";
import { Container } from "@mui/material";
import AppToolbar from "../AppToolbar/AppToolbar";
import Footer from "../Footer/Footer.tsx";

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
    console.log("LAYOUT RENDER");
    return (
        <>
            <AppToolbar />
            <Container  maxWidth="lg"
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "20px",
                        }}>
                {children}
            </Container>
            <Footer/>
        </>
    );
};


export default Layout;
