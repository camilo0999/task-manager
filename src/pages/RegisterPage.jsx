import React, { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../styles/RegisterPage.css";
import authService from "../services/authService";

const RegisterPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const role = "user";

    const handleSubmit = async (event) => {
        event.preventDefault();
        const userData = { username, password, role };
        try {
            const response = await authService.register(userData);
            toast.success('Usuario registrado exitosamente!');
            console.log(response);
        } catch (error) {
            if (error.message === 'El usuario ya está registrado') {
                toast.error('El usuario ya está registrado');
            } else {
                toast.error(error.response ? error.response.data : error.message);
            }
            console.error("Error registrando usuario:", error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="register-container">
            <ToastContainer />
            <h1>Regístrate en Task Manager</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Nombre de usuario</label>
                    <div className="input-icon-wrapper">
                        <i className="fas fa-user icon"></i>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Contraseña</label>
                    <div className="input-icon-wrapper">
                        <i className="fas fa-lock icon"></i>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <button type="submit" className="btn">Registrar</button>
            </form>
        </div>
    );
};

export default RegisterPage;
