import React, { useState, useEffect } from "react";
import taskService from "../services/adminService";

const Sidebar = ({ active }) => {
  return (
    <div className="w-64 bg-gray-800 text-white p-4 flex flex-col">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
      <nav className="space-y-4">
        <a
          href="/admin"
          className={`block py-2 px-4 rounded ${
            active === "usuarios" ? "bg-gray-700" : "hover:bg-gray-700"
          }`}
          aria-label="Usuarios"
        >
          Usuarios
        </a>
        <a
          href="/admin-tareas"
          className={`block py-2 px-4 rounded ${
            active === "tareas" ? "bg-gray-700" : "hover:bg-gray-700"
          }`}
          aria-label="Tareas"
        >
          Tareas
        </a>
      </nav>
    </div>
  );
};

const Card = ({ title, value, color }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full sm:w-64 lg:w-80">
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className={`text-3xl font-semibold text-${color}-600`}>{value}</p>
    </div>
  );
};

const Table = ({ data }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
      <h2 className="text-lg font-bold mb-4">Tareas de la plataforma</h2>
      <table className="min-w-full divide-y divide-gray-200 w-full">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap">{row.id}</td>
              <td className="px-6 py-4 whitespace-nowrap">{row.title}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {row.completed ? "Terminado" : "No Terminado"}
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <a href={`/admin-get-task/${row.id}`} 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Ver
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const AdminDashboardTareas = () => {
  const [data, setData] = useState([]);
  const [dataInfo, setDataInfo] = useState({
    numTasks: 0,
    numUsers: 0,
    numTasksCompleted: 0,
    numTasksNotCompleted: 0,
  });

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await taskService.getData();
        setDataInfo(response);
      } catch (error) {
        console.error("Error al obtener estadísticas:", error);
      }
    };

    const fetchTasks = async () => {
      try {
        const response = await taskService.getTasks();
        setData(response);
      } catch (error) {
        console.error("Error al obtener tareas:", error);
      }
    };

    // Llamada inicial
    fetchStatistics();
    fetchTasks();

    // Configurar actualización periódica
    const interval = setInterval(() => {
      fetchStatistics();
      fetchTasks();
    }, 3000);

    // Limpiar el intervalo al desmontar el componente
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar active="usuarios" />

      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">
            ¡Hola!,{" "}
            <span className="text-blue-500">
              {localStorage.getItem("name")}
            </span>{" "}
            Bienvenido al Panel de Administración
          </h1>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card title="Usuarios" value={dataInfo.numUsers} color="green" />
          <Card title="Tareas" value={dataInfo.numTasks} color="blue" />
          <Card
            title="Tareas Terminadas"
            value={dataInfo.numTasksCompleted}
            color="yellow"
          />
          <Card
            title="Tareas No Terminadas"
            value={dataInfo.numTasksNotCompleted}
            color="red"
          />
        </div>

        <Table data={data} />
      </div>
    </div>
  );
};

export default AdminDashboardTareas;
