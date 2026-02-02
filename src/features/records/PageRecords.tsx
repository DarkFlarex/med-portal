import {Button, Grid, Typography} from "@mui/material";


const PageRecords = () => {
    return (
        <>
            <Grid  className="hidden">
                <Grid sx={{
                    background: "#fff",
                    padding: "20px 30px",
                    borderRadius: "12px",
                    maxWidth: "400px",
                    textAlign: "center",
                }}>
                    <img src="public/checkmark.png" width="130" height="130" alt=""/>
                    <Typography
                    sx={{
                        color: "#3b82f6",
                        fontSize: "24px",
                        fontWeight: "bold",
                    }}
                    >Запись успешно создана!</Typography>
                    <Typography
                    sx={{
                        fontSize: "14px",

                    }}
                    >
                        Уважаемые пациенты!
                        Если вы не сможете прийти на прием, отмените вашу он лайн запись, позвонив в регистратуру или
                        написав нам на вотсап! Ваш звонок поможет попасть на прием к врачу другому пациенту!
                    </Typography>
                    <Typography sx={{
                        fontSize: "18px",
                        fontWeight: "bold",
                    }}>Номер записи:
                        <span></span>
                    </Typography>
                    <p>
                        <strong>ФИО:</strong>
                        <span></span>
                    </p>
                    <p>
                        <strong>Номер телефона (Whatsapp):
                    </strong>
                        <span></span>
                    </p>
                    <p>
                        <strong>Врач:</strong>
                        <span></span>
                    </p>
                    <p>
                        <strong>Дата:</strong>
                        <span></span>
                    </p>
                    <p>
                        <strong>Время:</strong>
                        <span></span>
                    </p>
                    <Button
                    sx={{
                        marginTop: "15px",
                        background: "#3b82f6",
                        color: "white",
                        border: "none",
                        padding: "5px 15px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        transition: "background 0.3s",
                        textTransform: "capitalize",
                    }}
                    >Назад</Button>
                </Grid>
            </Grid>
        </>
    );
};

export default PageRecords;