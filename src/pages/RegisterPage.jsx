import React, { useState } from "react";
import "../styles/RegisterPage.css";
import authService from "../services/authService";
import Swal from 'sweetalert2';
import useLoadingRegister from '../hooks/useLoadingRegister';
import "../styles/HooksMessage.css";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [telefono, setTelefono] = useState("");
  const blockaded = false;
  const role = "user";
  const { loading, startLoading, stopLoading } = useLoadingRegister();

  const handleSubmit = async (event) => {
    event.preventDefault();
    startLoading();
    const userData = { username, password, role, name, lastname, telefono, blockaded };
    try {
      const response = await authService.register(userData);
      Swal.fire({
        icon: 'success',
        title: 'Usuario registrado exitosamente!',
        showConfirmButton: false,
        timer: 1500
      });
      console.log(response);

      // Limpia el formulario después de un registro exitoso
      setUsername("");
      setPassword("");
      setName("");
      setLastname("");
      setTelefono("");
    } catch (error) {
      if (error.message === "El usuario ya está registrado") {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El usuario ya está registrado',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar usuario',
          text: 'Por favor, intenta de nuevo con un correo',
        });
      }
      console.error(
        "Error registrando usuario:",
        error.response ? error.response.data : error.message
      );
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="register-container">
      <h1>Regístrate en Task Manager</h1>
      {loading && <div className="loading-message">Cargando...</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nombre</label>
          <div className="input-icon-wrapper">
            <i className="fas fa-user icon"></i>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="lastname">Apellido</label>
          <div className="input-icon-wrapper">
            <i className="fas fa-user icon"></i>
            <input
              type="text"
              id="lastname"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="telefono">Telefono</label>
          <div className="input-icon-wrapper">
            <i className="fas fa-user icon"></i>
            <input
              type="text"
              id="telefono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="username">Usuario</label>
          <div className="input-icon-wrapper">
            <i className="fas fa-user icon"></i>
            <input
              type="email"
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
        <button type="submit" className="btn" disabled={loading}>
          Registrar
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
