import React, { useState, useEffect } from "react";
import adminService from "../services/adminService";
import Swal from "sweetalert2";

const handleBlockUser = async (userId) => {
  try {
    await adminService.blockUser(userId);
    // Actualiza el estado para reflejar el cambio de estado del usuario
  } catch (error) {
    console.error("Error al bloquear usuario:", error);
  }
};

const handleUnblockUser = async (userId) => {
  try {
    await adminService.unblockUser(userId);
    // Actualiza el estado para reflejar el cambio de estado del usuario
  } catch (error) {
    console.error("Error al desbloquear usuario:", error);
  }
};

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
    <div className={`bg-white p-6 rounded-lg shadow-md w-full sm:w-64 lg:w-80`}>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className={`text-3xl font-semibold text-${color}-600`}>{value}</p>
    </div>
  );
};

const Table = ({ data }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
      <h2 className="text-lg font-bold mb-4">Usuarios de la plataforma</h2>
      <table className="min-w-full divide-y divide-gray-200 w-full">
        <thead>
          <tr>
            {[
              "ID",
              "Nombre",
              "Apellido",
              "Usuario",
              "Rol",
              "Telefono",
              "Bloqueado",
              "Acciones",
            ].map((header) => (
              <th
                key={header}
                className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap">{row.id}</td>
              <td className="px-6 py-4 whitespace-nowrap">{row.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{row.lastname}</td>
              <td className="px-6 py-4 whitespace-nowrap">{row.username}</td>
              <td className="px-6 py-4 whitespace-nowrap">{row.role}</td>
              <td className="px-6 py-4 whitespace-nowrap">{row.telefono}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {row.blockaded ? "Si" : "No"}
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                {row.blockaded ? (
                  <button
                    onClick={async () => {
                      const result = await Swal.fire({
                        title: "¿Estás seguro?",
                        text: "Estás a punto de desbloquear a este usuario",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Sí, desbloquear",
                        cancelButtonText: "Cancelar",
                      });

                      if (result.isConfirmed) {
                        await handleUnblockUser(row.id);
                        setData((prevData) =>
                          prevData.map((user) =>
                            user.id === row.id
                              ? { ...user, blockaded: false }
                              : user
                          )
                        );
                        Swal.fire(
                          "¡Desbloqueado!",
                          "El usuario ha sido desbloqueado.",
                          "success"
                        );
                      }
                    }}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Desbloquear
                  </button>
                ) : (
                  <button
                    onClick={async () => {
                      const result = await Swal.fire({
                        title: "¿Estás seguro?",
                        text: "Estás a punto de bloquear a este usuario",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Sí, bloquear",
                        cancelButtonText: "Cancelar",
                      });

                      if (result.isConfirmed) {
                        await handleBlockUser(row.id);
                        setData((prevData) =>
                          prevData.map((user) =>
                            user.id === row.id
                              ? { ...user, blockaded: true }
                              : user
                          )
                        );
                        Swal.fire(
                          "¡Bloqueado!",
                          "El usuario ha sido bloqueado.",
                          "success"
                        );
                      }
                    }}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Bloquear
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const AdminDashboard = () => {
  const [data, setData] = useState([]);
  const [dataInfo, setDataInfo] = useState({
    numTasks: 0,
    numUsers: 0,
    numTasksCompleted: 0,
    numTasksNotCompleted: 0,
  });

  useEffect(() => {
    const fetchStatistics = async () => {
      const response = await adminService.getData(); // Llama a la API para obtener los datos de estadísticas
      setDataInfo(response); // Actualiza el estado con la respuesta de estadísticas
    };

    const fetchUsers = async () => {
      const response = await adminService.getUsers(); // Llama a la API para obtener los usuarios
      setData(response); // Actualiza el estado con la respuesta de usuarios
    };

    // Llamada inicial
    fetchStatistics();
    fetchUsers();

    // Configurar actualización periódica
    const interval = setInterval(() => {
      fetchStatistics();
      fetchUsers();
    }, 3000);

    // Limpiar el intervalo al desmontar
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex">
      <Sidebar active="usuarios" />

      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">
            ¡Hola!,{" "}
            <span className="text-blue-500">
              {" "}
              {localStorage.getItem("name")}{" "}
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

        <div className="bg-white p-4 rounded-lg shadow overflow-x-auto w-full">
          <Table data={data} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
