import React from "react";
import "../styles/Home.css";

const Home = () => {
  return (
    <div className="home">
      <div className="banner">
        <h1>Bienvenido a ¡Task Manager!</h1>
        <p>
          Gestiona tus tareas de manera eficiente con herramientas diseñadas
          para facilitar tu día a día.
        </p>
        <a href="#video" className="btn-doc">Como usar la plataforma</a>
      </div>

      <div className="features">
        <div className="feature">
          <h2>Organización de Tareas</h2>
          <p>
            Organiza tus tareas de manera eficiente con etiquetas para mejorar
            la eficiencia de tu día a día.
          </p>
        </div>
        <div className="feature">
          <h2>Seguridad de Datos</h2>
          <p>
            Mantén tus datos seguros y protegidos con medidas de seguridad
            avanzadas.
          </p>
        </div>
        <div className="feature">
          <h2>Acceso 24/7</h2>
          <p>
            Accede a tus tareas desde cualquier lugar y en cualquier momento.
          </p>
        </div>
      </div>

      <div className="video" id="video"> 
        <h2>Video de Presentación</h2>
        <p>
          Descubre todo lo que necesitas saber sobre el funcionamiento de la
          plataforma aquí.
        </p>
        <div className="video-container">
          <iframe
            className="video-frame"
            width="560"
            height="315"
            src="https://www.youtube.com/embed/hfdqtJPZ-qQ?si=ywNM5qEbz1j31EGy"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Home;
