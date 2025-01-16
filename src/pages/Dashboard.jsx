import React, { useState, useEffect } from "react";
import taskService from "../services/taskService.js";
import Swal from "sweetalert2";
import { subirImagen } from "../services/subirImagen.js";
import "../styles/Dashboard.css";
import "../styles/HooksMessage.css";
import useLoading from "../hooks/useLoading";

const Dashboard = () => {
  const name = localStorage.getItem("name");

  // Estados
  // Estados
  const [file, setFile] = useState(null); // Guardar la URL de la imagen
  const [isUploading, setIsUploading] = useState(false); // Estado para controlar la carga de la imagen
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "",
    tags: "",
    completed: false,
  });
  const { isLoading, loadingMessage, showLoading, hideLoading } = useLoading();

  const handleTaskChange = (e) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    try {
      // Esperar a que el archivo esté completamente cargado
      if (!file) {
        throw new Error("Por favor, sube una imagen antes de crear la tarea.");
      }

      const taskData = {
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        priority: task.priority,
        tags: task.tags,
        completed: task.completed,
        imageUrl: file, // Aquí se usa la URL del archivo subido
      };

      const response = await taskService.createTask(taskData);
      console.log("Tarea creada:", response);
      setTasks((prev) => [...prev, response]);

      // Resetear el estado después de la creación de la tarea
      setTask({
        title: "",
        description: "",
        dueDate: "",
        priority: "",
        tags: "",
        completed: false,
      });
      setFile(null); // Limpiar el archivo después de enviar la tarea
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error al crear tarea:", error);
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setTaskToEdit((prev) => ({ ...prev, [name]: value }));
  };

  // Manejo de archivo
  const handleFileChange = async (e) => {
    try {
      const selectedFile = e.target.files[0];
      if (selectedFile) {
        // Indicar que la imagen está siendo cargada
        setIsUploading(true);

        // Esperar la URL del archivo subido
        const uploadedFileUrl = await subirImagen(selectedFile);
        setFile(uploadedFileUrl); // Guardar la URL en el estado

        // Una vez cargada la imagen, quitar el estado de carga
        setIsUploading(false);
        console.log("Archivo subido:", uploadedFileUrl);
      }
    } catch (error) {
      console.error("Error al subir archivo:", error);
      Swal.fire("Error", "Hubo un problema al subir el archivo.", "error");
      setIsUploading(false); // Asegurarse de que el estado de carga se desactive
    }
  };
  // Actualizar tarea
  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      await taskService.updateTask(taskToEdit.id, taskToEdit);
      setTasks((prev) =>
        prev.map((t) => (t.id === taskToEdit.id ? { ...t, ...taskToEdit } : t))
      );
      setIsEditModalOpen(false);

      Swal.fire({
        icon: "success",
        title: "Tarea actualizada exitosamente",
        timer: 2000,
      });
    } catch (error) {
      console.error(
        "Error al actualizar tarea:",
        error.response?.data || error.message
      );
      Swal.fire({
        icon: "error",
        title: "Error al actualizar la tarea",
      });
    }
  };

  // Eliminar tarea
  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      Swal.fire({
        icon: "success",
        title: "Tarea eliminada exitosamente",
        timer: 2000,
      });
    } catch (error) {
      console.error(
        "Error al eliminar tarea:",
        error.response?.data || error.message
      );
      Swal.fire({
        icon: "error",
        title: "Error al eliminar la tarea",
      });
    }
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        showLoading("Cargando tareas...");
        const tasks = await taskService.getTasks();
        setTasks(tasks);
      } catch (error) {
        console.error("Error al cargar las tareas:", error);
      } finally {
        hideLoading();
      }
    };

    fetchTasks();
  }, [showLoading, hideLoading]);

  // Abrir y cerrar modales
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = (e) => {
    if (e.target.className === "modal") {
      setIsModalOpen(false);
      setIsEditModalOpen(false);
    }
  };

  const handleOpenEditModal = (task) => {
    setTaskToEdit(task);
    setTask({
      ...task,
      dueDate: task.dueDate?.split("T")[0] || "",
    });
    setIsEditModalOpen(true);
  };

  return (
    <div className="home bg-gray-100 container-fluid mx-auto p-4 alto">
      <h1 className="text-5xl font-bold text-gray-800 text-center mb-4 md:mb-8">
        ¡Hola!, <span className="text-blue-500">{name}</span> Bienvenido a Task
        Manager
      </h1>
      <p className="text-lg mt-2 text-gray-600">
        Tienes el control total de tus tareas. Organiza, prioriza y gestiona
        todo fácilmente desde un solo lugar.
      </p>

      <div className="mt-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-800"
          onClick={handleOpenModal}
        >
          Añadir Tarea
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {tasks.map((task) =>
            task?.id &&
            task?.imageUrl &&
            task?.title &&
            task?.tags &&
            task?.priority &&
            task?.dueDate !== undefined ? (
              <div
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105"
                key={task.id}
                style={{ height: "100%" }}
              >
                <div className="flex flex-col h-full">
                  <img
                    src={task.imageUrl}
                    alt="Task Image"
                    className="w-full h-40 object-cover rounded-t-lg"
                    style={{ objectFit: "cover" }}
                  />
                  <div className="p-4 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-semibold text-gray-800">
                        {task.title}
                      </h3>
                      <p> Tareas: {task.tags}</p>
                      <p className="text-gray-600">
                        Prioridad:{" "}
                        <span
                          className={`font-bold ${
                            task.priority === "high"
                              ? "text-red-500"
                              : task.priority === "medium"
                              ? "text-yellow-500"
                              : "text-green-500"
                          }`}
                        >
                          {task.priority}
                        </span>
                      </p>
                      <p className="text-gray-600">
                        Estado:{" "}
                        <span
                          className={`font-bold ${
                            task.completed ? "text-green-600" : "text-gray-600"
                          }`}
                        >
                          {task.completed ? "Completada" : "Pendiente"}
                        </span>
                      </p>
                      <p className="text-gray-600">
                        Fecha:{" "}
                        <span className="font-bold">
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </p>
                    </div>
                    <div className="mt-6 flex justify-between items-center">
                      <a
                        href={`/get-task/${task.id}`}
                        className="px-4 py-2 text-blue-600 hover:text-blue-800 transition duration-300 ease-in-out"
                      >
                        <span className="font-medium">Ver</span>
                      </a>
                      <button
                        className="px-4 py-2 bg-yellow-400 text-white rounded-md hover:bg-yellow-600 transition duration-300 ease-in-out transform hover:scale-105"
                        onClick={() => handleOpenEditModal(task)}
                      >
                        Editar
                      </button>
                      <button
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-100 transition duration-300 ease-in-out transform hover:scale-105"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : null
          )}
        </div>

        {/* Modal de creación */}
        {isModalOpen && (
          <div className="modal" onClick={handleCloseModal}>
            <div className="modal-content">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Crear nueva tarea</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-lg"
                >
                  X
                </button>
              </div>
              <form className="mt-4" onSubmit={handleTaskSubmit}>
                <label htmlFor="task-title" className="block text-gray-700">
                  Título de la tarea:
                </label>
                <input
                  type="text"
                  id="task-title"
                  name="title"
                  value={task.title}
                  onChange={handleTaskChange}
                  className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                  required
                />

                <label
                  htmlFor="task-description"
                  className="block text-gray-700 mt-4"
                >
                  Descripción de la tarea:
                </label>
                <textarea
                  id="task-description"
                  name="description"
                  value={task.description}
                  onChange={handleTaskChange}
                  className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                  required
                ></textarea>

                <label htmlFor="task-tag" className="block text-gray-700 mt-4">
                  Etiqueta:
                </label>
                <input
                  value={task.tags}
                  onChange={handleTaskChange}
                  type="text"
                  id="task-tag"
                  name="tags"
                  className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                />

                <label
                  htmlFor="task-priority"
                  className="block text-gray-700 mt-4"
                >
                  Prioridad:
                </label>
                <select
                  id="task-priority"
                  name="priority"
                  className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                  required
                  value={task.priority}
                  onChange={handleTaskChange}
                >
                  <option value="" disabled>
                    Selecciona una opcion
                  </option>
                  <option value="high">Alto</option>
                  <option value="medium">Media</option>
                  <option value="low">Baja</option>
                </select>

                <label htmlFor="task-date" className="block text-gray-700 mt-4">
                  Fecha de entrega:
                </label>
                <input
                  type="date"
                  id="task-date"
                  name="dueDate"
                  className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                  required
                  value={task.dueDate}
                  onChange={handleTaskChange}
                />

                <input
                  type="file"
                  id="file"
                  name="file"
                  accept="image/*"
                  className="w-full  mt-4 border border-gray-300 rounded-md"
                  onChange={handleFileChange}
                />

                {/* Botón de envío deshabilitado si no se ha subido la imagen */}
                <button
                  type="submit"
                  disabled={isUploading || !file}
                  className="w-full mt-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  {isUploading ? "Cargando imagen..." : "Guardar Tarea"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Modal de edición */}
        {isEditModalOpen && (
          <div
            className="modal fixed inset-0 flex justify-center items-center bg-black bg-opacity-50"
            onClick={handleCloseModal}
          >
            <div className="p-6 rounded-lg shadow-md modal-content">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Actualizar tarea</h2>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-lg"
                >
                  X
                </button>
              </div>
              <form onSubmit={handleUpdateTask} className="mt-4">
                <label
                  htmlFor="edit-task-title"
                  className="block text-gray-700"
                >
                  Título de la tarea:
                </label>
                <input
                  type="text"
                  id="edit-task-title"
                  name="title"
                  value={taskToEdit.title}
                  onChange={handleEditChange}
                  className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                  required
                />

                <label
                  htmlFor="edit-task-description"
                  className="block text-gray-700 mt-4"
                >
                  Descripción de la tarea:
                </label>
                <textarea
                  id="edit-task-description"
                  name="description"
                  value={taskToEdit.description}
                  onChange={handleEditChange}
                  className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                  required
                ></textarea>

                <label
                  htmlFor="edit-task-tag"
                  className="block text-gray-700 mt-4"
                >
                  Etiqueta:
                </label>
                <input
                  type="text"
                  id="edit-task-tag"
                  name="tags"
                  value={taskToEdit.tags}
                  onChange={handleEditChange}
                  className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                />

                <label
                  htmlFor="edit-task-priority"
                  className="block text-gray-700 mt-4"
                >
                  Prioridad:
                </label>
                <select
                  id="edit-task-priority"
                  name="priority"
                  value={taskToEdit.priority}
                  onChange={handleEditChange}
                  className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="high">Alta</option>
                  <option value="medium">Media</option>
                  <option value="low">Baja</option>
                </select>

                <label
                  htmlFor="edit-task-date"
                  className="block text-gray-700 mt-4"
                >
                  Fecha de entrega:
                </label>
                <input
                  type="date"
                  id="edit-task-date"
                  name="dueDate"
                  value={taskToEdit.dueDate}
                  onChange={handleEditChange}
                  className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                  required
                />

                <button
                  type="submit"
                  className="w-full mt-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Actualizar tarea
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
