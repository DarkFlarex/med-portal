import "./Footer.css";

const Footer = () => {
    return (
        <>
            <footer className="page-footer">
                <div className="container footer-content">
                    <div className="footer-section">
                        <h4>Контакты</h4>
                        <p>Телефон: +996 (XXX) XX-XX-XX</p>
                        <p>Email: example@gmail.com</p>
                        <p>Адрес: XXXXXXXXXX</p>
                    </div>
                    <div className="footer-section">
                        <h4>Навигация</h4>
                        <a href="#">Клиники</a>
                        <a href="#">Врачи</a>
                        <a href="#">Запись</a>
                        <a href="#">Контакты</a>
                    </div>
                    <div className="footer-section">
                        <h4>Мы в соцсетях</h4>
                        <div className="social-links">
                            <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/733/733547.png"
                                             alt="Facebook"/></a>
                            <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/733/733558.png"
                                             alt="Instagram"/></a>
                            <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/733/733579.png"
                                             alt="Telegram"/></a>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© 2025 Медицинский центр "XXXXXXXX". Все права защищены.</p>
                </div>
            </footer>

        </>
    );
};

export default Footer;