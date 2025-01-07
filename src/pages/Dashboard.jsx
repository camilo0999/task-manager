import React, { useState, useEffect } from "react"; // Importación de useState y useEffect
import taskService from "../services/taskService.js";
import "../styles/Dashboard.css";
import Swal from 'sweetalert2';


const Dashboard = () => {
  const name = localStorage.getItem("name");
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal de creación de tarea
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Modal de actualización de tarea
  const [task, setTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "",
    tags: "",
    completed: false,
  });
  const [file, setFile] = useState(null);
  const [taskToEdit, setTaskToEdit] = useState(null); // Tarea a editar
  const [tasks, setTasks] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", task.title);
    formData.append("description", task.description);
    formData.append("dueDate", task.dueDate);
    formData.append("priority", task.priority);
    formData.append("tags", task.tags);
    formData.append("completed", task.completed);

    try {

      const createdTask = await taskService.createTask(formData);
      setTasks((prevTasks) => [...prevTasks, createdTask]);
      setIsModalOpen(false);
      Swal.fire({
        icon: 'success',
        title: 'Tarea creada exitosamente!',
        showConfirmButton: false,
        timer: 2000
      })
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al intentar registrar una tarea',
      })
      console.error(
        
        "Error creating task:",
        error.response ? error.response.data : error.message
      );
      alert("Error al crear la tarea. Por favor, intenta nuevamente.");
    }
  };

  // Obtener las tareas al montar el componente
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasks = await taskService.getTasks();
        setTasks(tasks);
      } catch (error) {
        console.error(
          "Error getting tasks:",
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchTasks();
  }, []);

  // Abrir modal para crear tarea
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Abrir modal para editar tarea
  const handleOpenEditModal = (task) => {
    setTaskToEdit(task);
    setTask({
      ...task,
      dueDate: task.dueDate ? task.dueDate.split("T")[0] : "", // Asegurar que la fecha sea compatible con el input
    });
    setIsEditModalOpen(true);
  };

  // Cerrar modal
  const handleCloseModal = (e) => {
    if (e.target.className === "modal") {
      setIsModalOpen(false);
      setIsEditModalOpen(false);
    }
  };

  // Manejo del cambio de inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  // Manejo del cambio de inputs en el modal de edición
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setTaskToEdit((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  // Eliminar tarea
  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error(
        "Error deleting task:",
        error.response ? error.response.data : error.message
      );
    }
  };

  // Actualizar tarea
  const handleUpdateTask = async (e) => {
    e.preventDefault();

    try {
      await taskService.updateTask(taskToEdit.id, taskToEdit);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskToEdit.id ? { ...task, ...taskToEdit } : task
        )
      );
      setIsEditModalOpen(false); // Cerrar modal de edición

      Swal.fire({
        icon: 'success',
        title: 'Tarea actualizada exitosamente!',
        showConfirmButton: false,
        timer: 2000
      })

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar la tarea',
        timer: 2000
      })
      console.error(
        "Error updating task:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div className="bg-gray-100 container-fluid mx-auto p-4">
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
          {tasks.map((task) => (
            <div
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105"
              key={task.id}
            >
              <img
                src={`https://task-manager-api-uzzf.onrender.com${task.imageUrl}`}
                alt="Task Image"
                className="w-full h-40 object-cover rounded-t-lg"
              />
              <div className="p-4">
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
          ))}
        </div>

        {/* Modal de creación */}
        {isModalOpen && (
          <div
            className="modal fixed inset-0 flex justify-center items-center bg-black bg-opacity-70"
            onClick={handleCloseModal}
          >
            <div className="p-6 rounded-lg shadow-lg modal-content">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Crear nueva tarea</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-lg"
                >
                  X
                </button>
              </div>
              <form onSubmit={handleSubmit} className="mt-4">
                <label htmlFor="task-title" className="block text-gray-700">
                  Título de la tarea:
                </label>
                <input
                  type="text"
                  id="task-title"
                  name="title"
                  value={task.title}
                  onChange={handleChange}
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
                  onChange={handleChange}
                  className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                  required
                ></textarea>

                <label htmlFor="task-tag" className="block text-gray-700 mt-4">
                  Etiqueta:
                </label>
                <input
                  type="text"
                  id="task-tag"
                  name="tags"
                  value={task.tags}
                  onChange={handleChange}
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
                  value={task.priority}
                  onChange={handleChange}
                  className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                  required
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
                  value={task.dueDate}
                  onChange={handleChange}
                  className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                  required
                />

                <input
                  type="file"
                  id="file"
                  name="file"
                  accept="image/*"
                  className="w-full  mt-4 border border-gray-300 rounded-md"
                  onChange={handleFileChange}
                />

                <button
                  type="submit"
                  className="w-full mt-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Guardar tarea
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
