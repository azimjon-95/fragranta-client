import React, { useState, useEffect } from "react";
import { message } from "antd";
import styled, { keyframes, css } from "styled-components";

const blink = keyframes`
  0% { opacity: 0.2; }
  50% { opacity: 1; }
  100% { opacity: 0.2; }
`;

const PasscodeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f4f7;
`;

const DotsContainer = styled.div`
  display: flex;
  margin-bottom: 10px;
`;

const Dot = styled.div`
  width:  22px;
  height: 22px;
  margin: 0 5px;
  border-radius: 50%;
  background-color: ${(props) => (props.filled ? "#43B581" : "#bdbdbd")};
  ${(props) =>
        props.active &&
        css`
      animation: ${blink} 1s infinite;
    `}
`;

const Keypad = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  max-width: 300px;
  margin: 20px 0;
`;

const Key = styled.button`
  background-color: ${(props) => (props.special ? "#2f3437" : "#ffffff")};
  color: ${(props) => (props.special ? "#ffffff" : "#000000")};
  font-size:  ${(props) => (props.ok ? "26px" : "32px")};
  width:  80px;
  height: 80px;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${(props) => (props.special ? "#404040" : "#f2f2f2")};
  }

  &:disabled {
    background-color: #ddd;
    cursor: not-allowed;
  }
`;

export default function PasscodeScreen({ setIsAuthenticated }) {
    const [passcode, setPasscode] = useState([]);
    const [isSettingPasscode, setIsSettingPasscode] = useState(false);
    const [newPasscode, setNewPasscode] = useState(""); // Store the new passcode
    const storedPasscode = localStorage.getItem("myPasscode");

    // Tekshirish: sessionStorage'da passcode bormi?
    useEffect(() => {
        const sessionPasscode = sessionStorage.getItem("passcodeSession");

        if (!storedPasscode) {
            setIsSettingPasscode(true); // Parol saqlanmagan bo'lsa, uni o'rnatishga ruxsat berish
        } else if (!sessionPasscode) {
            // SessionStorage bo'sh bo'lsa, parolni kiritish talab qilinadi
            setPasscode([]);
        }
    }, [storedPasscode]);

    const handleKeyPress = (key) => {
        if (passcode.length < 4) {
            const newPasscodeEntry = [...passcode, key];
            setPasscode(newPasscodeEntry);

            // Passcode uzunligi 4 ga yetganda avtomatik yuborish
            if (newPasscodeEntry.length === 4) {
                if (isSettingPasscode) {
                    handleSetPasscode(newPasscodeEntry);
                } else {
                    handleSubmit(newPasscodeEntry);
                }
            }
        }
    };

    const handleDelete = () => {
        setPasscode(passcode.slice(0, -1));
    };

    const handleSetPasscode = (currentPasscode) => {
        if (!newPasscode) {
            // Birinchi marta parolni kiritish
            setNewPasscode(currentPasscode.join(''));
            setPasscode([]); // Parolni tasdiqlash uchun tozalash
            message.info("Iltimos, parolingizni tasdiqlang.");
        } else if (newPasscode === currentPasscode.join('')) {
            // Tasdiqlangan parolni saqlash
            localStorage.setItem("myPasscode", newPasscode);
            sessionStorage.setItem("passcodeSession", "authenticated"); // Sessiya davomida tasdiqlangan holat
            message.success("Parol muvaffaqiyatli o‘rnatildi!");
            setIsSettingPasscode(false);
            setPasscode([]);
        } else {
            // Parol mos kelmasa
            message.error("Parollar mos emas! Qaytadan urinib ko'ring.");
            setNewPasscode("");
            setPasscode([]);
        }
    };

    const handleSubmit = (currentPasscode) => {
        if (currentPasscode.join('') === storedPasscode) {
            sessionStorage.setItem("passcodeSession", "authenticated"); // Sessiya davomida kirish imkonini berish
            message.success("Parol to‘g‘ri!");
            setIsAuthenticated(true);
        } else {
            setPasscode([]); // Noto'g'ri parol kiritilganida tozalash
            message.error("Parol noto‘g‘ri. Qaytadan urinib ko'ring.");
        }
    };

    return (
        <PasscodeContainer>
            <h3 style={{ color: "#2f3437", fontSize: "27px", marginBottom: "12px" }}>
                {isSettingPasscode
                    ? passcode.length === 4
                        ? "Parolingizni tasdiqlang"
                        : "Parolingizni o'rnating"
                    : "Parolni kiriting"}
            </h3>

            <DotsContainer>
                {[0, 1, 2, 3].map((index) => (
                    <Dot
                        key={index}
                        filled={index < passcode.length}
                        active={index === passcode.length}
                    />
                ))}
            </DotsContainer>

            <Keypad>
                {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                    <Key key={num} onClick={() => handleKeyPress(num)}>
                        {num}
                    </Key>
                ))}


                {/* 0 ni ikkita o'chirish tugmasi orasiga joylashtirish */}
                <Key special onClick={handleDelete}>⌫</Key>
                <Key key="0" onClick={() => handleKeyPress("0")}>
                    0
                </Key>

                {/* Birinchi delete tugmasi */}
                <Key ok onClick={handleDelete}>
                    OK {/* Ant Design check icon */}
                </Key>
                {/* Ikkinchi delete tugmasi */}
            </Keypad>
        </PasscodeContainer>
    );
}
