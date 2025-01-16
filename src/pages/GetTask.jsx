import React, { useState, useEffect } from "react";
import taskService from "../services/taskService";
import Swal from "sweetalert2";
import '../styles/GetTask.css';

const GetTask = () => {
  const [task, setTask] = useState(null);
  const [error, setError] = useState(null);
  const id = window.location.pathname.split("/")[2];

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const fetchedTask = await taskService.getTask(id);
        setTask(fetchedTask);
      } catch (error) {
        setError(
          error.response?.data || "Failed to fetch the task. Please try again."
        );
      }
    };
    fetchTask();
  }, [id]);

  const getPriorityColor = (priority) => {
    const colors = {
      High: "text-red-500",
      Medium: "text-orange-500",
      Low: "text-green-500",
    };
    return colors[priority] || "text-gray-700";
  };

  const completeTask = async () => {
    try {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "¡Estás a punto de completar esta tarea!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, completar tarea",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        const response = await taskService.completeTask(id);
        setTask(response);
        Swal.fire({
          icon: "success",
          title: "Tarea completada",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error(
        "Error completing task:",
        error.response ? error.response.data : error.message
      );
      setError("Error completing task. Please try again.");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response ? error.response.data : error.message,
      });
    }
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="p-6 text-sm text-red-800 bg-red-200 rounded-lg shadow-lg">
          <span className="font-semibold">Error:</span> {error}
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-blue-500 font-medium text-lg">Loading task...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          {task.title}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <img
            src={task.imageUrl}
            alt="Task Image"
            className="rounded-lg shadow-md w-full h-auto"
          />
          <div>
            <div className="mb-4">
              <p className="text-gray-700 text-lg">
                <span className="font-semibold">Descripcion:</span>{" "}
                {task.description || "No description"}
              </p>
            </div>
            <div className="mb-4">
              <p className="text-gray-700 text-lg">
                <span className="font-semibold">Fecha de vencimiento:</span>{" "}
                {new Date(task.dueDate).toLocaleDateString()}
              </p>
            </div>
            <div className="mb-4">
              <p className="text-gray-700 text-lg">
                <span className="font-semibold">Nivel de prioridad:</span>{" "}
                <span className={getPriorityColor(task.priority)}>
                  {task.priority || "Not set"}
                </span>
              </p>
            </div>
            <div className="mb-4">
              <p className="text-gray-700 text-lg">
                <span className="font-semibold">Tags:</span> {task.tags}
              </p>
            </div>
            <div className="mb-6">
              <p className="text-gray-700 text-lg">
                <span className="font-semibold">Estado:</span>{" "}
                {task.completed ? "Si" : "No"}
              </p>
            </div>
            {!task.completed && (
              <button
                onClick={completeTask}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
              >
                Terminar tarea
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetTask;
