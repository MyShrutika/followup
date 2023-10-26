'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import AdminSidebar from '../components/AdminSidebar';

const TodaysTask = () => {
  const [todaysTasks, setTodaysTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    const fetchTodaysTasks = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://localhost:5000/api/task/tasks/today', {
          headers: {
            Authorization: token,
          },
        });

        // Function to fetch the user's name based on their ID
        const fetchUserName = async (assignTo) => {
          try {
            const token = localStorage.getItem('authToken');
            const userResponse = await axios.get(`http://localhost:5000/api/subemployee/${assignTo}`, {
              headers: {
                Authorization: token,
              },
            });
            return userResponse.data.name; // Replace 'name' with the actual field containing the user's name.
          } catch (error) {
            console.error(`Error fetching user name for user ID ${assignTo}:`, error);
            return 'Unknown User'; // Default value or error handling as needed.
          }
        };

        // Update the 'assignTo' field with the user's name
        const tasksWithUserName = await Promise.all(
          response.data.todayAddedTasks.map(async (task) => {
            const userName = await fetchUserName(task.assignTo);
            return { ...task, assignTo: userName };
          })
        );

        setTodaysTasks(tasksWithUserName);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching today\'s tasks:', error);
        setLoading(false);
      }
    };

    fetchTodaysTasks();
  }, []);

  const handleViewTask = (task) => {
    setSelectedTask(task);
    setViewModalOpen(true);
  };

  const handleCancelView = () => {
    setViewModalOpen(false);
    setSelectedTask(null);
  };

  return (
    <>
      <Navbar />
      <AdminSidebar/>
      <div className="container mx-auto mt-20 m-10 pl-64">
        <h1 className="text-2xl font-semibold mb-4">Today&rsquo;s added Tasks</h1>
        {loading ? (
          <p className="text-gray-600">Loading today&rsquo;s tasks...</p>
        ) : (
          <div>
            {Array.isArray(todaysTasks) && todaysTasks.length === 0 ? (
              <p className="text-gray-600">No tasks added today.</p>
            ) : (
              <table className="min-w-full table-auto">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Task</th>
                    <th className="px-4 py-2">Assigned To</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {todaysTasks.map((task) => (
                    <tr key={task._id}>
                      <td className="border px-4 py-2">
                        <h2 className="text-lg font-medium text-blue-800 text-center">{task.title}</h2>
                      </td>
                      <td className="border px-4 py-2 text-center">{task.assignTo}</td>
                      <td className="border px-4 py-2 text-center">
                        <span className={`px-3 py-1 font-semibold ${task.status === 'completed' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'} rounded-lg`}>
                          {task.status === 'completed' ? 'Completed' : 'Pending'}
                        </span>
                      </td>
                      <td className="border px-4 py-2 text-center">
                        <button
                          onClick={() => handleViewTask(task)}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded-lg"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
      {viewModalOpen && selectedTask && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 bg-gray-700">
            
          <div className="modal-container bg-white w-96 p-6 rounded shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="absolute top-3 right-3 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-full text-lg w-8 h-8 inline-flex justify-center items-center dark:hover-bg-gray-600 dark:hover-text-white" onClick={handleCancelView}>
              &#x2715;{/* Close button icon */}
            </div>
            <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-gray-400">Task Details</h3>
            <div className="mb-2">
              <label className="block text-gray-800 dark:text-gray-200 text-sm font-medium mb-2">
                Task Title
              </label>
              <p>{selectedTask.title}</p>
            </div>
            <div className="mb-2">
              <label className="block text-gray-800 dark:text-gray-200 text-sm font-medium mb-2">
                Description
              </label>
              <p>{selectedTask.description}</p>
            </div>
            <div className="mb-2">
              <label className="block text-gray-800 dark:text-gray-200 text-sm font-medium mb-2">
                Assigned To
              </label>
              <p>{selectedTask.assignTo}</p>
            </div>
            <div className="mb-2">
              <label className="block text-gray-800 dark:text-gray-200 text-sm font-medium mb-2">
                Start Date
              </label>
              <p>{selectedTask.startDate}</p>
            </div>
            <div className="mb-2">
              <label className="block text-gray-800 dark:text-gray-200 text-sm font-medium mb-2">
                DeadLine
              </label>
              <p>{selectedTask.deadlineDate}</p>
            </div>
            <div className="mb-2">
              <label className="block text-gray-800 dark:text-gray-200 text-sm font-medium mb-2">
                Start Time
              </label>
              <p>{selectedTask.startTime}</p>
            </div>
            <div className="mb-2">
              <label className="block text-gray-800 dark:text-gray-200 text-sm font-medium mb-2">
                End Time
              </label>
              <p>{selectedTask.endTime}</p>
            </div>
            {/* Add more task details here */}
            <div className="text-center">
              <button onClick={handleCancelView} className="bg-blue-500 hover:bg-gray-400 text-white hover:text-gray-900 font-medium rounded-lg px-4 py-2 mt-4">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TodaysTask;
