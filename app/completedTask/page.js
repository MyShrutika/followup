'use client'


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner,faEye } from '@fortawesome/free-solid-svg-icons';
import AdminSidebar from '../components/AdminSidebar';

const CompletedTaskList = () => {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModalOpen, setViewModalOpen] = useState(false); // State for "View Task" modal
  const [selectedTask, setSelectedTask] = useState(null);
  const [editedTask, setEditedTask] = useState(null);
  const [subemployees, setSubemployees] = useState([]); // State to store Subemployee names and ObjectIds
  const [successMessage, setSuccessMessage] = useState('');

  function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }

  function formatDateList(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are 0-based, so add 1
    const year = date.getFullYear();

    // Ensure two-digit formatting for day and month
    const formattedDay = String(day).padStart(2, '0');
    const formattedMonth = String(month).padStart(2, '0');

    return `${formattedDay}/${formattedMonth}/${year}`;
  }

  useEffect(() => {
    const fetchCompletedTasks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/task/tasks/completed', {
          headers: {
            Authorization: localStorage.getItem('authToken'),
          },
        });

        const completedTasksWithAssigneeNames = await Promise.all(
          response.data.completedTasks.map(async (task) => {
            const assigneeResponse = await axios.get(`http://localhost:5000/api/subemployee/${task.assignTo}`, {
              headers: {
                Authorization: localStorage.getItem('authToken'),
              },
            });
            const assigneeName = assigneeResponse.data.name;
            return { ...task, assignTo: assigneeName };
          })
        );

        setCompletedTasks(completedTasksWithAssigneeNames);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching completed tasks:', error);
        setLoading(false);
      }
    };

    fetchCompletedTasks();
  }, []);

  useEffect(() => {
    // Fetch Subemployee names and ObjectIds and populate the dropdown list
    const fetchSubemployees = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/employee/subemployees/list', {
          headers: {
            Authorization: localStorage.getItem('authToken'),
          },
        });

        const subemployeeData = response.data.map((subemployee) => ({
          _id: subemployee._id, // Assuming MongoDB ObjectId
          name: subemployee.name,
        }));

        setSubemployees(subemployeeData);
      } catch (error) {
        console.error('Error fetching Subemployee data:', error);
      }
    };

    fetchSubemployees();
  }, []);

  const closeViewModal = () => {
    setSelectedTask(null);
    setViewModalOpen(false);
  };

  const hideActions = typeof window !== 'undefined' ? window.localStorage.getItem('subUsername') : null;

  const openEditModal = (task) => {
    // Format the date to "yyyy-MM-dd" format
    const formattedStartDate = task.startDate.split('T')[0];
    const formattedDeadlineDate = task.deadlineDate.split('T')[0];
    setEditedTask({ ...task, startDate: formattedStartDate, deadlineDate: formattedDeadlineDate });
  };

  const saveChanges = async () => {
    try {
      // Format the date back to ISO format
      const formattedStartDate = editedTask.startDate + 'T00:00:00.000Z';
      const formattedDeadlineDate = editedTask.deadlineDate + 'T00:00:00.000Z';

      const updatedTaskData = {
        startDate: formattedStartDate,
        deadlineDate: formattedDeadlineDate,
        assignTo: editedTask.assignTo, // Pass the ObjectId of the selected Subemployee
      };

      console.log(updatedTaskData);
      await axios.put(`http://localhost:5000/api/task/open/${editedTask._id}`, updatedTaskData, {
        headers: {
          Authorization: localStorage.getItem('authToken'),
        },
      });

      // Remove the task from the list
      setCompletedTasks(completedTasks.filter((task) => task._id !== editedTask._id));

      setSuccessMessage('Task marked as open successfully.');

      setTimeout(() => {
        setSuccessMessage('');
      }, 2000);

      setEditedTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
      // Handle errors here
    }
  };

  const openViewModal = (task) => {
    setSelectedTask(task);
    setViewModalOpen(true);
  };

  return (
    <>
      <Navbar />
      {/* <Sidebar /> */}
      <AdminSidebar />
      <div className="container mx-auto mt-20 m-10 pl-64">
        <h1 className="text-2xl font-semibold mb-4 text-orange-500">Completed Task List</h1>
        {loading ? ( // Display a loading spinner while data is being fetched
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 bg-gray-700">
            <FontAwesomeIcon
              icon={faSpinner} // Use your FontAwesome spinner icon
              spin // Add the "spin" prop to make the icon spin
              className="text-white text-4xl" // You can customize the size and color
            />
          </div>
        ) : (
          <div>
            {completedTasks.length === 0 ? (
              <p className="text-gray-600">No completed tasks found.</p>
            ) : (
              <table className="min-w-full table-auto">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Sr. No.</th>
                    <th className="px-4 py-2">Task</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">DeadLine</th>
                    <th className="px-4 py-2">Assigned To</th>
                    {!hideActions ? (
                      <th className="px-4 py-2">Actions</th>
                    ) : null}
                  </tr>
                </thead>
                <tbody>
                  {completedTasks.map((task, index) => (
                    <tr key={task._id}>
                      <td className="border px-4 py-2 text-center">{index + 1}</td>
                      <td className="border px-4 py-2">
                        <div>
                          <h2 className="text-base font-medium text-blue-800 text-center">{task.title}</h2>
                        </div>
                      </td>
                      <td className="border px-4 py-2 text-center">
                        <span className="px-2 py-1 bg-green-200 text-green-800 rounded-full text-sm">
                          Completed
                        </span>
                      </td>
                      <td className="border px-4 py-2 text-center">{formatDateList(task.startDate)}</td>
                      <td className="border px-4 py-2 text-center">{formatDateList(task.deadlineDate)}</td>
                      <td className="border px-4 py-2 text-center">{task.assignTo}</td>
                      <td className={`border px-4 py-2 text-center ${hideActions ? 'hidden' : ''}`}>
                        {!hideActions && (
                          <div className="flex items-center">
                            <FontAwesomeIcon
                              icon={faEye}
                              className="text-blue-500 hover:underline mr-5 cursor-pointer pl-5 text-xl"
                              onClick={() => openViewModal(task)} // Add a View button here
                            />
                            {/* <button
                              className="bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-700 ml-2 text-sm"
                              onClick={() => openViewModal(task)} // Add a View button here
                            >
                              View
                            </button> */}
                            <button
                              className="bg-green-500 text-white py-1 px-3 rounded-lg hover:bg-blue-700 ml-4 text-sm"
                              onClick={() => openEditModal(task)}
                            >
                              Mark as Open
                            </button>

                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="fixed bottom-5 right-5 bg-green-500 text-white py-2 px-4 rounded-md">
          {successMessage}
        </div>
      )}

      {/* View Task Modal */}
      {viewModalOpen && selectedTask && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-gray-700">
          <div className="bg-white p-4 w-1/3 rounded-md">
            <h2 className="text-2xl font-semibold mb-4 text-center">View Task</h2>
            <div className='text-left pl-8'>
              {/* Display task details here */}
              

              

              <p><strong>Title:</strong> {selectedTask.title}</p>
              <p><strong>Description:</strong> {selectedTask.description}</p>
              <p><strong>Status:</strong> Completed</p>
              <p><strong>Date:</strong> {formatDateList(selectedTask.startDate)}</p>
              <p><strong>DeadLine:</strong> {formatDateList(selectedTask.deadlineDate)}</p>
              <p><strong>Assigned To:</strong> {selectedTask.assignTo}</p>
              <div className='text-center'>
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 mt-5"
                  onClick={closeViewModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ... (existing code) */}
    </>
  );
};

export default CompletedTaskList;
