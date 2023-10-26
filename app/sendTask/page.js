'use client';


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash, faEye, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { format, parse, isBefore } from 'date-fns';
import { useRouter } from 'next/navigation';
import AdminSidebar from '../components/AdminSidebar';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const SendTask = () => {
  const [tasks, setTasks] = useState([]);
  const [viewTask, setViewTask] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(true); // Add a loading state

  let serialNumber = 1;

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTasks, setFilteredTasks] = useState([]);
  const router = useRouter()

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    const fetchAllTasks = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://localhost:5000/api/task/list', {
          headers: {
            Authorization: token,
          },
        });

        if (response.status === 200) {
          if (Array.isArray(response.data.tasks)) {
            const currentDate = new Date();
            const tasksWithAssignedNames = await Promise.all(
              response.data.tasks.map(async (task) => {
                const employeeResponse = await axios.get(`http://localhost:5000/api/subemployee/${task.assignTo}`, {
                  headers: {
                    Authorization: token,
                  },
                });

                if (employeeResponse.status === 200) {
                  task.assigneeName = employeeResponse.data.name;
                }

                task.startDate = formatDate(task.startDate);
                const formattedDeadlineDate = format(new Date(task.deadlineDate), 'dd/MM/yyyy');
                task.deadlineDate = parse(formattedDeadlineDate, 'dd/MM/yyyy', new Date());

                // Check if the task is completed or overdue
                if (task.status === 'completed') {
                  // Task is completed, no need to check deadline
                } else if (isBefore(task.deadlineDate, currentDate)) {
                  task.status = 'overdue';
                } else {
                  task.status = 'pending';
                }

                return task;
              })
            );

            setTasks(tasksWithAssignedNames);
          } else {
            console.error('API response is not an array:', response.data);
          }
        } else {
          console.error('Failed to fetch tasks');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllTasks();
  }, []);

  useEffect(() => {
    const filtered = tasks.filter((task) => {
      const assigneeName = task.assigneeName.toLowerCase();
      const startDate = task.startDate.toLowerCase();
      const deadlineDate = formatDate(task.deadlineDate);
      const status = task.status.toLowerCase();
      const title = task.title.toLowerCase();
      const query = searchQuery.toLowerCase();

      return (
        assigneeName.includes(query) ||
        title.includes(query) ||
        status.includes(query) ||
        startDate.includes(query) ||
        deadlineDate.includes(query)
      );
    });

    setFilteredTasks(filtered);
  }, [searchQuery, tasks]);

  const handleDeleteClick = (taskId) => {
    setDeleteTaskId(taskId);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.delete(`http://localhost:5000/api/task/delete/${deleteTaskId}`, {
        headers: {
          Authorization: token,
        },
      });

      if (response.status === 200) {
        console.log('Task deleted successfully');
        setIsDeleteModalOpen(false);
        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== deleteTaskId));
      } else {
        console.error('Failed to delete task');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (taskId) => {
    router.push(`/editForm/${taskId}`);
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
        taskData.startDate = formatDate(taskData.startDate);
        taskData.deadlineDate = formatDate(taskData.deadlineDate);

        const employeeResponse = await axios.get(`http://localhost:5000/api/subemployee/${taskData.assignTo}`, {
          headers: {
            Authorization: token,
          },
        });

        if (employeeResponse.status === 200) {
          taskData.assigneeName = employeeResponse.data.name;
        }

        setViewTask(taskData);
        setIsViewModalOpen(true);
      } else {
        console.error('Failed to fetch task details');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <Navbar />
      {/* <Sidebar /> */}
      <AdminSidebar/>
      <div className="m-5 pl-72 mt-20">
        <h1 className="text-2xl font-semibold mb-4 text-center">Tasks Send</h1>
        <div className="flex justify-center items-center mb-4">
          <input
            type="text"
            placeholder="Search Tasks"
            className="px-3 py-1 border border-gray-400 rounded-full w-1/2"
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
        </div>

        
        {loading ? (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 bg-gray-700">
            <FontAwesomeIcon
              icon={faSpinner} // Use your FontAwesome spinner icon
              spin // Add the "spin" prop to make the icon spin
              className="text-white text-4xl" // You can customize the size and color
            />
          </div>
        ) : (

          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Sr.No.</th>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Deadline</th>
                <th className="px-4 py-2 text-left">Assign To</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr
                  key={task._id}
                  className={`${task.status === 'overdue' ? 'bg-red-400' : task.status === 'completed' ? 'bg-green-400' : 'bg-orange-500'} hover:bg-gray-100`}
                >
                  <td className="border px-4 py-2 text-center">{serialNumber++}</td>
                  <td className="border px-4 py-2">{task.title}</td>
                  <td className={`border px-4 py-2 font-bold ${task.status === 'overdue' ? 'text-red-500' : ''}`}>{task.status}</td>
                  <td className="border px-4 py-2">{task.startDate}</td>
                  <td className="border px-4 py-2">{formatDate(task.deadlineDate)}</td>

                  <td className="border px-4 py-2">{task.assigneeName}</td>
                  <td className="border px-4 py-2">
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      className="text-blue-500 hover:underline mr-5 cursor-pointer"
                      onClick={() => handleEdit(task._id)}
                    />
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="text-blue-500 hover:underline mr-5 cursor-pointer pl-5"
                      onClick={() => handleDeleteClick(task._id)}
                    />
                    <FontAwesomeIcon
                      icon={faEye}
                      className="text-blue-500 hover:underline mr-5 cursor-pointer pl-5"
                      onClick={() => handleViewClick(task._id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {isViewModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-container bg-white w-96 p-6 rounded shadow-lg" onClick={(e) => e.stopPropagation()}>
              <button type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => setIsViewModalOpen(false)}></button>
              <div className="p-1 text-center">
                <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-gray-400">Task Details</h3>
                {viewTask && (
                  <div>
                    <p className="mb-2 text-left justify-center">
                      <strong>AssignTo:</strong> {viewTask.assigneeName}
                    </p>
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
                      <strong>Date:</strong> {viewTask.startDate}
                    </p>
                    <p className="mb-2 text-left justify-center">
                      <strong>Start Time:</strong> {viewTask.startTime}
                    </p>
                    <p className="mb-2 text-left justify-center">
                      <strong>DeadLine:</strong> {viewTask.deadlineDate}
                    </p>
                    <p className="mb-2 text-left justify-center">
                      <strong>End Time:</strong> {viewTask.endTime}
                    </p>
                    <p className="mb-2 text-left justify-center">
                      <strong>Photo:</strong> {viewTask.picture}
                    </p>
                    <p className="mb-2 text-left justify-center">
                      <strong>Audio:</strong> {viewTask.audio}
                    </p>
                  </div>
                )}
                <button
                  type="button"
                  className="bg-red-500 hover:bg-red-700 text-black font-bold py-2 px-4 rounded mt-4 mr-2"
                  onClick={() => setIsViewModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-container bg-white w-96 p-6 rounded shadow-lg" onClick={(e) => e.stopPropagation()}>
              <button type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => setIsDeleteModalOpen(false)}></button>
              <div className="p-1 text-center">
                <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-gray-400">Confirm Deletion</h3>
                <p className="mb-5 text-left justify-center">
                  Are you sure you want to delete this task?
                </p>
                <button
                  type="button"
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4 mr-2"
                  onClick={() => handleDelete()}
                >
                  Confirm
                </button>
                <button
                  type="button"
                  className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mt-4"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SendTask;
