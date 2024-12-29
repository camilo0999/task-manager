import React, { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";
import authService from "../services/authService";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const credentials = { username, password };
        try {
            const response = await authService.login(credentials);
            toast.success('Inicio de sesión exitoso!');
            
            // Almacenar el rol del usuario en el localStorage
            localStorage.setItem('role', response.role);

            // Redirige según el rol del usuario
            if (response.role === "user") {
                navigate("/dashboard");
            } else if (response.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }
        } catch (error) {
            toast.error(error.response ? error.response.data : error.message);
            console.error("Error iniciando sesión:", error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="login-container bg-light">
            <ToastContainer />
            <h1>Iniciar Sesión</h1>
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
                <button type="submit" className="btn">Iniciar Sesión</button>
            </form>
        </div>
    );
};

export default LoginPage;
