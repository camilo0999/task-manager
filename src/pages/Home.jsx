import React from "react";
import '../styles/Home.css';

const Home = () => {
    return (
        <div className="home">
            <div className="banner">
                <h1>Bienvenido a ¡Task Manager!</h1>
                <p>Gestiona tus tareas de manera eficiente con herramientas diseñadas para facilitar tu día a día.</p>
                <button>Documentacion</button>
            </div>

            <div className="features">
                <div className="feature">
                    <h2>Organización de Tareas</h2>
                    <p>Organiza tus tareas de manera eficiente con etiquetas para mejorar la eficiencia de tu dia a dia.</p>
                </div>
                <div className="feature">
                    <h2>Seguridad de Datos</h2>
                    <p>Mantener tus datos seguros y protegidos con medidas de seguridad avanzadas.</p>
                </div>
                <div className="feature">
                    <h2>Acceso 24/7</h2>
                    <p>Accede a tus tareas desde cualquier lugar y en cualquier momento.</p>
                </div>
                <div className="feature">
                    <h2>Notificaciones</h2>
                    <p>Recibe notificaciones en tiempo real para estar al tanto de tus tareas.</p>
                </div>
            </div>
        </div>
    );
};

export default Home;