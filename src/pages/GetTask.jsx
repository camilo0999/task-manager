import React, { useState, useEffect } from "react";
import taskService from "../services/taskService";

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
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">{task.title}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <img
            src="https://cdn.mises.org/styles/responsive_4_3_870w/s3/static-page/img/market1_1.jpg.webp?itok=niN_I7wY"
            alt="Task illustration"
            className="rounded-lg shadow-md w-full h-auto"
          />
          <div>
            <div className="mb-4">
              <p className="text-gray-700 text-lg">
                <span className="font-semibold">Description:</span> {task.description || "No description"}
              </p>
            </div>
            <div className="mb-4">
              <p className="text-gray-700 text-lg">
                <span className="font-semibold">Due Date:</span> {new Date(task.dueDate).toLocaleDateString()}
              </p>
            </div>
            <div className="mb-4">
              <p className="text-gray-700 text-lg">
                <span className="font-semibold">Priority:</span>{" "}
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
                <span className="font-semibold">Completed:</span> {task.completed ? "Yes" : "No"}
              </p>
            </div>
            {!task.completed && (
              <a href="#" className="block">
                <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded">
                  Complete Task
                </button>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetTask;
