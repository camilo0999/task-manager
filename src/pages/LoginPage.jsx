import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";
import authService from "../services/authService";
import Swal from "sweetalert2";
import useLoadingMessage from "../hooks/useLoadingMessage";
import '../styles/HooksMessage.css';

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const navigate = useNavigate();
  const { isLoading, loadingMessage, showLoadingMessage, hideLoadingMessage } = useLoadingMessage();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const credentials = { username, password };

    showLoadingMessage("Por favor, espera mientras procesamos tu solicitud...");

    try {
      const response = await authService.login(credentials);
      hideLoadingMessage();

      Swal.fire({
        icon: "success",
        title: "Inicio de sesión exitoso!",
        showConfirmButton: false,
        timer: 1500,
      });

      // Almacenar el rol del usuario en el localStorage
      localStorage.setItem("role", response.role);

      // Redirige según el rol del usuario
      if (response.role === "user") {
        navigate("/dashboard");
      } else if (response.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      hideLoadingMessage();

      Swal.fire({
        icon: "error",
        title: "Error al iniciar sesión",
        text: "Credenciales incorrectas",
      });

      console.error(
        "Error iniciando sesión:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div className="login-page">
      <div className="login-container bg-light">
        <h1>Iniciar Sesión</h1>
        {isLoading && <div className="loading-message">{loadingMessage}</div>}
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
          <button type="submit" className="btn">
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
