'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faSpinner } from '@fortawesome/free-solid-svg-icons';
import AdminSidebar from '../components/AdminSidebar';
import Image from 'next/image';


const PendingTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [completeImageUrl, setPreviewImageUrl] = useState('');
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

    const handlePicturePreview = (imageUrl) => {
        const completeImageUrl = `http://localhost:5000/${imageUrl}`;
        setPreviewImageUrl(completeImageUrl);
        setIsPreviewModalOpen(true);
    };


    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    useEffect(() => {
        const fetchPendingTasks = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await axios.get('http://localhost:5000/api/task/tasks/pending', {
                    headers: {
                        Authorization: token,
                    },
                });

                const tasksWithNames = await Promise.all(
                    response.data.map(async (task) => {
                        // Fetch the employee name associated with the ID
                        const assigneeResponse = await axios.get(`http://localhost:5000/api/subemployee/${task.assignTo}`, {
                            headers: {
                                Authorization: token,
                            },
                        });
                        const assigneeName = assigneeResponse.data.name;

                        // Format the date as dd/mm/yyyy
                        const formattedStartDate = formatDate(task.startDate);
                        const formattedDeadlineDate = formatDate(task.deadlineDate);

                        // Update the task object with the formatted date and name
                        return {
                            ...task,
                            startDate: formattedStartDate,
                            deadlineDate: formattedDeadlineDate,
                            assignTo: assigneeName,
                        };
                    })
                );

                setTasks(tasksWithNames);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching pending tasks:', error);
                setLoading(false);
            }
        };

        fetchPendingTasks();
    }, []);

    const handleViewClick = (taskId) => {
        // Find the selected task based on taskId
        const task = tasks.find((t) => t._id === taskId);
        setSelectedTask(task);
        // Open the view modal
        setViewModalOpen(true);
    };

    const closeViewModal = () => {
        // Close the view modal
        setViewModalOpen(false);
    };


    return (
        <>
            <Navbar />
            {/* <Sidebar /> */}
            <AdminSidebar />
            <div className="m-10 pl-64 mt-20">
                <h1 className="text-2xl font-semibold mb-4 text-left text-orange-500">Pending Tasks</h1>

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
                                <th className="px-4 py-2 text-center">Sr.No</th>
                                <th className="px-4 py-2 text-center">Task Title</th>
                                <th className="px-4 py-2 text-center">Status</th>
                                <th className="px-4 py-2 text-center">Start Date</th>
                                <th className="px-4 py-2 text-center">Deadline Date</th>
                                <th className="px-4 py-2 text-center">Assign To</th>
                                <th className="px-4 py-2 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map((task, index) => (
                                <tr key={task._id}>
                                    <td className="border px-4 py-2 text-center">{index + 1}</td>
                                    <td className="border px-4 py-2 text-center text-orange-600 font-semibold">
                                        {task.title}
                                    </td>
                                    <td className="border px-4 py-2 text-center"><span className='px-4 py-1 bg-blue-200 text-blue-800 rounded-full text-sm'>{task.status}</span></td>
                                    <td className="border px-4 py-2 text-center">{task.startDate}</td>
                                    <td className="border px-4 py-2 text-center">{task.deadlineDate}</td>
                                    <td className="border px-4 py-2 text-center">{task.assignTo}</td>
                                    <td className="border px-4 py-2">
                                        <FontAwesomeIcon
                                            icon={faEye}
                                            className="text-blue-500 hover:underline mr-5 cursor-pointer pl-5 text-xl"
                                            onClick={() => handleViewClick(task._id)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* View Task Modal */}
            {viewModalOpen && selectedTask && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 bg-gray-700">
                    <div className="bg-white p-4 w-1/2 rounded-md">
                        <h2 className="text-2xl font-semibold mb-4">View Task</h2>

                        <div>
                            <p className="mb-2 text-left justify-center">
                                <strong>AssignTo:</strong> {selectedTask.assignTo}
                            </p>
                            <p className="mb-2 text-left justify-center">
                                <strong>Title:</strong> {selectedTask.title}
                            </p>
                            <p className="mb-2 text-left justify-center">
                                <strong>Description:</strong> {selectedTask.description}
                            </p>
                            <p className="mb-2 text-left justify-center">
                                <strong>Status:</strong> {selectedTask.status}
                            </p>
                            <p className="mb-2 text-left justify-center">
                                <strong>Date:</strong> {selectedTask.startDate}
                            </p>
                            <p className="mb-2 text-left justify-center">
                                <strong>Start Time:</strong> {selectedTask.startTime}
                            </p>
                            <p className="mb-2 text-left justify-center">
                                <strong>DeadLine:</strong> {selectedTask.deadlineDate}
                            </p>
                            <p className="mb-2 text-left justify-center">
                                <strong>End Time:</strong> {selectedTask.endTime}
                            </p>
                            {/* <p className="mb-2 text-left justify-center">
                                <strong>Photo:</strong> {selectedTask.picture}
                            </p> */}
                            <p className="mb-2 text-left justify-center">
                                <strong>Picture:</strong> {selectedTask.picture}
                                <button
                                    type="button"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mt-1 ml-2"
                                    onClick={() => handlePicturePreview(selectedTask.picture)}
                                >
                                    Preview
                                </button>
                            </p>
                            <p className="mb-2 text-left justify-center">
                                <strong>Audio:</strong> {selectedTask.audio}
                            </p>

                            <p className='text-center'>
                                <button
                                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                                    onClick={closeViewModal}
                                >
                                    Close
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {isPreviewModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <div className="modal-container bg-white w-96 p-6 rounded shadow-lg" onClick={(e) => e.stopPropagation()}>
                        <button type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => setIsPreviewModalOpen(false)}></button>
                        <div className="p-1 text-center">
                            <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-gray-400">Image Preview</h3>
                            {/* <img src={completeImageUrl} alt="Preview" className="mb-2" style={{ maxWidth: '100%', maxHeight: '300px' }} /> */}
                            <Image
                                src={completeImageUrl}
                                alt="Preview"
                                width={400} // Adjust the width as needed
                                height={300} // Adjust the height as needed
                            />
                            <button
                                type="button"
                                className="bg-red-500 hover:bg-red-700 text-black font-bold py-2 px-4 rounded mt-4 mr-2"
                                onClick={() => setIsPreviewModalOpen(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PendingTasks;