'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner,faEye } from '@fortawesome/free-solid-svg-icons';
import EmployeeSidebar from '../components/EmployeeSidebar';


const formatDateString = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const ReceivedTaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [viewTask, setViewTask] = useState(null); // Store the task to be viewed
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [loading, setLoading] = useState(true); // Initialize loading state

  let serialNumber = 1; // Initialize the serial number


  const handleMarkAsCompleteClick = async (taskId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.put(
        `http://localhost:5000/api/task/complete/${taskId}`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.status === 200) {
        // Remove the task from the tasks state
        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
        console.log('Marked as Completed');
      } else {
        console.error('Failed to mark task as complete');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleViewClick = async (taskId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`http://localhost:5000/api/task/${taskId}`, {
        headers: {
          Authorization: token,
        },
      });

      if (response.status === 200) {
        const taskData = response.data;
        console.log(taskData);
        // Format the date for the task
        taskData.deadlineDate = formatDateString(taskData.deadlineDate);
        taskData.startDate = formatDateString(taskData.startDate);

        setViewTask(taskData);
        setIsViewModalOpen(true);
      } else {
        console.error('Failed to fetch task details');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    const loadFormattedTasks = async () => {
      setLoading(true);

      if (typeof window === 'undefined') {
        // Skip fetching tasks on the server side
        return;
      }

      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('JWT token not found in localStorage');
        return;
      }

      try {
        const response = await axios.get(
          'http://localhost:5000/api/task/tasksList/assignedTo',
          {
            headers: {
              Authorization: token,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.status === 200) {
          const formattedTasks = response.data.tasks.map((task) => ({
            ...task,
            deadlineDate: formatDateString(task.deadlineDate),
            startDate: formatDateString(task.startDate),
          }));
          setTasks(formattedTasks);
          setLoading(false); // Set loading to false when tasks are loaded

        } else {
          console.error('Failed to fetch tasks');
          setLoading(false); // Set loading to false when tasks are loaded

        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    loadFormattedTasks();
  }, []);
  
  return (
    <>
      <Navbar />
      {/* <Sidebar /> */}
      <EmployeeSidebar/>
      <div className="container mx-auto px-4 m-16 pl-60 mt-20">
        <h2 className="text-2xl font-semibold mb-4 m-3 text-orange-500">Pending Task List</h2>
        {loading ? (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 bg-gray-700">
            <FontAwesomeIcon
              icon={faSpinner} // Use your FontAwesome spinner icon
              spin // Add the "spin" prop to make the icon spin
              className="text-white text-4xl" // You can customize the size and color
            />
          </div>
        ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className='bg-orange-500 text-white'>
            <tr>
              <th className="px-4 py-2 text-center text-xs font-bold uppercase tracking-wider">
                Sr. No.
              </th>
              <th className="px-4 py-2 pl-10 text-left text-xs font-bold  uppercase tracking-wider">
                Title
              </th>
              {/* <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th> */}
              <th className="px-4 py-2 pl-10 text-left text-xs font-bold  uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-2 text-left text-xs font-bold  uppercase tracking-wider">
                Deadline Date
              </th>
              <th className="px-4 py-2 pl-5 text-left text-xs font-bold  uppercase tracking-wider">
                AssignedBy
              </th>
              <th className="px-20 py-2 text-left text-xs font-bold  uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 border border-gray-200">
            {tasks.map((task) => (
              <tr key={task._id}>
                <td className="px-6 py-1 whitespace-nowrap text-center border border-orange-400">{serialNumber++}</td>
                <td className="px-6 py-1 whitespace-nowrap border border-orange-400">{task.title}</td>
                <td className="px-6 py-1 whitespace-nowrap border border-orange-400">{task.startDate}</td>
                <td className="px-6 py-1 whitespace-nowrap border border-orange-400">{task.deadlineDate}</td>
                <td className="px-6 py-1 whitespace-nowrap border border-orange-400">{task.assignedBy?.name}</td>
                <td className="px-5 py-1 whitespace-nowrap border border-orange-400">
                  
                  {/* <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl text-sm"
                    onClick={() => handleViewClick(task._id)}
                  >
                    View
                  </button> */}
                  <FontAwesomeIcon
                        icon={faEye}
                        className="text-blue-500 hover:underline mr-5 cursor-pointer pl-5 text-lg"
                        onClick={() => handleViewClick(task._id)}
                      />
                  <button
                    className="bg-green-400 hover:bg-green-700 text-black font-bold py-2 px-4 rounded-xl mx-3 text-sm"
                    onClick={() => handleMarkAsCompleteClick(task._id)}
                  >
                    Mark as Complete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
        {/* View Task Modal */}
        {isViewModalOpen && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          >
            <div
              className="modal-container bg-white w-96 p-6 rounded shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={() => setIsViewModalOpen(false)}
              >
                {/* Close button icon */}
              </button>
              <div className="p-1 text-center">
                <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-gray-400">
                  Task Details
                </h3>
                {viewTask && (
                  <div>
                    {/* Display task details here */}
                    <p className="mb-2 text-left justify-center">
                      <strong>Title:</strong> {viewTask.title}
                    </p>
                    <p className="mb-2 text-left justify-center">
                      <strong>Description:</strong> {viewTask.description}
                    </p>
                    <p className="mb-2 text-left justify-center">
                      <strong>Status:</strong> {viewTask.status}
                    </p>
                    <p className="mb-2 text-left justify-center">
                      <strong>Start Date:</strong> {viewTask.startDate}
                    </p>
                    <p className="mb-2 text-left justify-center">
                      <strong>Start Time:</strong> {viewTask.startTime}
                    </p>
                    <p className="mb-2 text-left justify-center">
                      <strong>Deadline Date:</strong> {viewTask.deadlineDate}
                    </p>
                    <p className="mb-2 text-left justify-center">
                      <strong>End Time:</strong> {viewTask.endTime}
                    </p>
                    <p className="mb-2 text-left justify-center">
                      <strong>Assigned By:</strong> {viewTask.assignedBy.name}
                    </p>
                  </div>
                )}
                <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                  onClick={() => setIsViewModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ReceivedTaskList;

