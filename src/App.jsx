// src/App.jsx o src/main.jsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './router/AppRouter.jsx';
import './App.css';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';

const App = () => {
  return (
    <Router> {/* Asegúrate de envolver la aplicación en el Router */}
      <Navbar />
      <AppRouter />
      <Footer />
    </Router>
  );
};

export default App;

