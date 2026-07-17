import { useState, useEffect } from "react";

const API_URL = "https://allergo-online.mis.kg"; // поменяй если нужно
const CORRECT_PIN = "0000";

export default function Blacklist() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");

  const [phoneInput, setPhoneInput] = useState("");
  const [phoneList, setPhoneList] = useState([]);
  const [error, setError] = useState("");

  // Загрузка всех номеров при монтировании компонента (только если авторизован)
  useEffect(() => {
    if (isAuthenticated) {
      loadPhones();
    }
  }, [isAuthenticated]);

  // Проверка ПИН-кода
  const handlePinSubmit = (e: any) => {
    e.preventDefault();
    if (pinInput === CORRECT_PIN) {
      setIsAuthenticated(true);
      setPinError("");
    } else {
      setPinError("Неверный ПИН-код");
      setPinInput("");
    }
  };

  // Загрузка всех номеров
  const loadPhones = async () => {
    try {
      const response = await fetch(`${API_URL}/blacklist/all`);
      const data = await response.json();
      setPhoneList(data.res || []);
      setError("");
    } catch (err) {
      console.error("Ошибка при загрузке:", err);
    }
  };

  // Добавление номера
  const addPhone = async () => {
    if (!phoneInput.trim()) {
      alert("Введите номер");
      return;
    }

    try {
      await fetch(`${API_URL}/blacklist/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: phoneInput }),
      });

      setPhoneInput(""); // Очищаем инпут
      loadPhones(); // Обновляем список
    } catch (err) {
      console.error("Ошибка при добавлении:", err);
    }
  };

  // Поиск номера

  // Удаление номера
  const deletePhone = async (phone: any) => {
    try {
      await fetch(`${API_URL}/blacklist/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone }),
      });

      loadPhones(); // Обновляем список
    } catch (err) {
      console.error("Ошибка при удалении:", err);
    }
  };

  // Экран ввода ПИН-кода
  if (!isAuthenticated) {
    return (
      <div style={styles.body}>
        <div style={styles.container}>
          <h1 style={styles.h1}>Доступ ограничен</h1>
          <form onSubmit={handlePinSubmit} style={styles.pinForm}>
            <input
              type="password"
              maxLength={4}
              style={styles.input}
              placeholder="Введите ПИН-код"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
            />
            <button
              type="submit"
              style={{ ...styles.btn, ...styles.searchBtn }}
            >
              Войти
            </button>
          </form>
          {pinError && <p style={styles.pinErrorMessage}>{pinError}</p>}
        </div>
      </div>
    );
  }

  // Основной экран (если ПИН верный)
  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1 style={styles.h1}>Черный список номеров</h1>
        </div>

        <div style={styles.inputGroup}>
          <input
            type="text"
            style={styles.input}
            placeholder="Введите номер телефона"
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
          />
          <button
            style={{ ...styles.btn, ...styles.addBtn }}
            onClick={addPhone}
          >
            Добавить
          </button>
        </div>

        <div style={styles.phoneList}>
          {error && <p style={styles.emptyMessage}>{error}</p>}

          {!error && phoneList.length === 0 && (
            <p style={styles.emptyMessage}>Список пуст</p>
          )}

          {phoneList.map((item: any, index: any) => (
            <div key={index} style={styles.phoneItem}>
              <span>{item.phone}</span>
              <button
                style={{ ...styles.btn, ...styles.deleteBtn }}
                onClick={() => deletePhone(item.phone)}
              >
                Удалить
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Стили
const styles: any = {
  body: {
    fontFamily: "Arial, sans-serif",
    background: "#f4f6f9",
    padding: "40px",
    minHeight: "100vh",
    boxSizing: "border-box",
  },
  container: {
    maxWidth: "600px",
    margin: "auto",
    background: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  },
  h1: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "24px",
  },
  pinForm: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
  },
  pinErrorMessage: {
    color: "#dc3545",
    textAlign: "center",
    marginTop: "10px",
    fontWeight: "bold",
  },
  inputGroup: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  input: {
    padding: "10px",
    flex: "1 1 60%",
    borderRadius: "4px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
  },
  btn: {
    padding: "10px 15px",
    cursor: "pointer",
    border: "none",
    borderRadius: "4px",
    fontWeight: "bold",
  },
  addBtn: {
    background: "#28a745",
    color: "white",
  },
  searchBtn: {
    background: "#007bff",
    color: "white",
  },
  deleteBtn: {
    background: "#dc3545",
    color: "white",
  },
  phoneList: {
    marginTop: "15px",
  },
  phoneItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 12px",
    background: "#f1f1f1",
    marginTop: "8px",
    borderRadius: "4px",
  },
  emptyMessage: {
    textAlign: "center",
    color: "#666",
    fontStyle: "italic",
  },
};
