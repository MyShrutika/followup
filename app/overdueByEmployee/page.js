'use client'

'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye,faSpinner } from '@fortawesome/free-solid-svg-icons';
import EmployeeSidebar from '../components/EmployeeSidebar';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Helper function to fetch employee name by ID
const getEmployeeName = async (employeeId, authToken) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/employee/${employeeId}`, {
      headers: {
        Authorization: authToken,
      },
    });
    return response.data.name;
  } catch (error) {
    console.error(`Error fetching employee name for ID ${employeeId}:`, error);
    return '';
  }
};

const OverdueByEmployee = () => {
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewTask, setViewTask] = useState(null);

  useEffect(() => {
    const fetchOverdueTasks = async () => {
      try {
        const token = localStorage.getItem('authToken');

        const response = await axios.get('http://localhost:5000/api/task/tasks/over', {
          headers: {
            Authorization: token,
          },
        });
        
        if (response.data && response.data.overdueTasks) {
          setOverdueTasks(response.data.overdueTasks);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching overdue tasks:', error);
        setLoading(false);
      }
    };

    fetchOverdueTasks();
  }, []);

  // Function to handle viewing a task
  const handleViewTask = async (task) => {
    const authToken = localStorage.getItem('authToken');

    // Fetch and set names for assignedBy and assignTo
    const assignedByName = await getEmployeeName(task.assignedBy, authToken);
    const assignToName = await getEmployeeName(task.assignTo, authToken);

    setViewTask({
      ...task,
      assignedBy: assignedByName,
      assignTo: assignToName,
    });
  };

  // Function to close the view modal
  const handleCloseViewModal = () => {
    setViewTask(null); // Clear the task to close the modal
  };

  return (
    <>
      <Navbar />
      {/* <Sidebar /> */}
      <EmployeeSidebar/>
      <div className="container mx-auto m-12 pl-72 mt-20">
        <h1 className="text-2xl font-bold mb-4 text-orange-800">Overdue Tasks</h1>
        {loading ? (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 bg-gray-700">
            <FontAwesomeIcon
              icon={faSpinner} // Use your FontAwesome spinner icon
              spin // Add the "spin" prop to make the icon spin
              className="text-white text-4xl" // You can customize the size and color
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse table-auto">
              <thead className='bg-red-600 text-white'>
                <tr>
                  <th className="px-4 py-2 border-b">Sr. No.</th>
                  <th className="px-4 py-2 border-b">Title</th>
                  <th className="px-4 py-2 border-b">Status</th>
                  <th className="px-4 py-2 border-b">Date</th>
                  <th className="px-4 py-2 border-b">Deadline Date</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {overdueTasks.length > 0 ? (
                  overdueTasks.map((task, index) => (
                    <tr key={task._id}>
                      <td className="px-4 py-2 border text-center border-red-300">{index + 1}</td>
                      <td className="px-4 py-2 border text-center border-red-300">{task.title}</td>
                      <td className="px-4 py-2 border text-center font-semibold text-red-950 border-red-300">Overdue</td>
                      <td className="px-4 py-2 border text-center border-red-300">{formatDate(task.startDate)}</td>
                      <td className="px-4 py-2 border text-center border-red-300">{formatDate(task.deadlineDate)}</td>
                      <td className="border px-12 py-2 text-center border-red-300 ">
                        <FontAwesomeIcon
                          icon={faEye}
                          className="text-blue-500 hover:underline cursor-pointer text-xl"
                          onClick={() => handleViewTask(task)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-4 py-2 border">
                      No overdue tasks found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Task Modal */}
      {viewTask && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 bg-gray-700">
          <div className="bg-white p-4 w-1/2 rounded-md">
            <h2 className="text-2xl font-semibold mb-4">Task Details</h2>
            <div>
              <p className="mb-2 text-left justify-center">
                <strong>Assigned By:</strong> {viewTask.assignedBy}
              </p>
              
              <p className="mb-2 text-left justify-center">
                <strong>Title:</strong> {viewTask.title}
              </p>
              <p className="mb-2 text-left justify-center">
                <strong>Description:</strong> {viewTask.description}
              </p>
              <p className="mb-2 text-left justify-center"> 
                <strong>Status:</strong> Overdue
              </p>
              <p className="mb-2 text-left justify-center">
                <strong>Date:</strong> {formatDate(viewTask.startDate)}
              </p>
              <p className="mb-2 text-left justify-center">
                <strong>Start Time:</strong> {viewTask.startTime}
              </p>
              <p className="mb-2 text-left justify-center">
                <strong>Deadline:</strong> {formatDate(viewTask.deadlineDate)}
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
              <p className='text-center'>
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                  onClick={handleCloseViewModal}
                >
                  Close
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OverdueByEmployee;