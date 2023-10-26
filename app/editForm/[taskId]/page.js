'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '@/app/components/Navbar';
import Sidebar from '@/app/components/Sidebar';
import AdminSidebar from '@/app/components/AdminSidebar';
import Image from 'next/image';


const EditForm = ({ params }) => {
    const router = useRouter();
    const { taskId } = params;
    const [taskData, setTaskData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [assignees, setAssignees] = useState([]); // Define the assignees state variable
    const [successMessage, setSuccessMessage] = useState(''); // Initialize success message state
    const [subemployees, setSubemployees] = useState([]);

    useEffect(() => {
        // Fetch task data by taskId when the component mounts
        const fetchTaskData = async () => {
            try {
                const authToken = localStorage.getItem('authToken'); // Retrieve the authToken from localStorage

                const response = await axios.get(`http://localhost:5000/api/task/${taskId}`, {
                    headers: {
                        Authorization: authToken, // Include the authToken in the headers
                    },
                });
                if (response.status === 200) {
                    setTaskData(response.data);
                } else {
                    console.error('Failed to fetch task data');
                }
                setIsLoading(false);
            } catch (error) {
                console.error('Error:', error);
                setIsLoading(false);
            }
        };

        const fetchAssignees = async () => {
            axios
                .get('http://localhost:5000/api/employee/subemployees/list', {
                    headers: {
                        Authorization: localStorage.getItem('authToken'), // Include your JWT token here
                    },
                })
                .then((response) => {
                    // Extract subemployee names and IDs from the response
                    const subemployeeList = response.data.map((subemployee) => ({
                        id: subemployee._id,
                        name: subemployee.name,
                    }));
                    setSubemployees(subemployeeList);
                })
                .catch((error) => {
                    console.error('Error fetching subemployees:', error);
                })
        };

        if (taskId) {
            fetchTaskData();
        }

        // Fetch assignees when the component mounts
        fetchAssignees();
    }, [taskId]);
    console.log(taskId)


    const handleFormSubmit = async (e) => {
        e.preventDefault();
        console.log("handlesubmit called")

        console.log('Sending taskId:', taskId);
        console.log('Sending taskData:', taskData);

        // Make the Fetch API PUT request here
        try {
            const authToken = localStorage.getItem('authToken'); // Retrieve the authToken from localStorage
            console.log(authToken);

            const response = await fetch(`http://localhost:5000/api/task/edit/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: authToken, // Include the authToken in the headers
                },
                body: JSON.stringify(taskData),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Task updated successfully:', data);
                router.push(`/taskList`);
            } else {
                console.error('Failed to update task');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };



    const handlePictureChange = (e) => {
        // Set the selected picture file in the state
        setPictureFile(e.target.files[0]);
    };

    const handleAudioChange = (e) => {
        // Set the selected audio file in the state
        setAudioFile(e.target.files[0]);
    };


    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Navbar />
            {/* <Sidebar/> */}
            <AdminSidebar />
            <div className="w-full flex justify-center items-center mt-20">
                <div className="w-full max-w-lg">
                    <h1 className="text-2xl font-semibold mb-2 text-orange-500">Edit Task</h1>
                    {successMessage && ( // Conditionally render success message
                        <div className="mb-4 text-green-500">{successMessage}</div>
                    )}
                    <div className="mb-1">
                        <label htmlFor="title" className="block text-gray-600 font-semibold mb-2">Title</label>
                        <input
                            type="text"
                            id="title"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
                            placeholder="Title"
                            value={taskData.title || ''}
                            onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
                            required
                        />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="description" className="block text-gray-600 font-semibold mb-2">Description</label>
                        <textarea
                            id="description"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
                            placeholder="Description"
                            value={taskData.description || ''}
                            onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
                            rows="4"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="assignTo" className="block text-gray-600 font-semibold mb-2">Assign To</label>
                        <select
                            id="assignTo"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
                            value={taskData.assigneeName ? taskData.assigneeName._id : ''}
                            onChange={(e) => {
                                // Find the subemployee object corresponding to the selected _id
                                const selectedSubemployee = subemployees.find((subemployee) => subemployee.id === e.target.value);
                                setTaskData({ ...taskData, assigneeName: selectedSubemployee });
                            }}
                        >
                            <option value="">Select an Assign To</option>
                            {subemployees.map((subemployee) => (
                                <option key={subemployee.id} value={subemployee.id}>
                                    {subemployee.name}
                                </option>
                            ))}
                        </select>
                    </div>


                    <form onSubmit={handleFormSubmit} className="grid grid-cols-2 gap-4">
                        <div className="mb-2">
                            <label htmlFor="startDate" className="block text-gray-600 font-semibold mb-2">Start Date</label>
                            <input
                                type="date"
                                id="startDate"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
                                value={taskData.startDate ? taskData.startDate.slice(0, 10) : ''}
                                onChange={(e) => setTaskData({ ...taskData, startDate: e.target.value })}
                            />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="startTime" className="block text-gray-600 font-semibold mb-2">Start Time</label>
                            <input
                                type="time"
                                id="startTime"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
                                value={taskData.startTime || ''}
                                onChange={(e) => setTaskData({ ...taskData, startTime: e.target.value })}
                            />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="endTime" className="block text-gray-600 font-semibold mb-2">End Time</label>
                            <input
                                type="time"
                                id="endTime"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
                                value={taskData.endTime || ''}
                                onChange={(e) => setTaskData({ ...taskData, endTime: e.target.value })}
                            />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="deadlineDate" className="block text-gray-600 font-semibold mb-2">Deadline Date</label>
                            <input
                                type="date"
                                id="deadlineDate"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
                                value={taskData.deadlineDate ? taskData.deadlineDate.slice(0, 10) : ''}
                                onChange={(e) => setTaskData({ ...taskData, deadlineDate: e.target.value })}
                            />
                        </div>

                        <div className="mb-2">
                            <label htmlFor="picture" className="block text-gray-600 font-semibold mb-2">
                                Picture
                            </label>
                            <input
                                type="file"
                                id="picture"
                                accept="image/*"
                                className="w-full px-4 py-1 border rounded-lg focus:outline-none focus:border-blue-400"
                                onChange={handlePictureChange}
                            />
                            {taskData.picture && (
                                <Image
                                    src={taskData.picture}
                                    alt="Task Picture"
                                    layout="responsive" // Use 'responsive' to maintain the aspect ratio
                                    width={500} // Set your desired width
                                    height={300} // Set your desired height
                                    className="mt-2"
                                />
                            )}
                        </div>

                        <div className="mb-2">
                            <label htmlFor="audio" className="block text-gray-600 font-semibold mb-2">
                                Audio
                            </label>
                            <input
                                type="file"
                                id="audio"
                                accept="audio/*"
                                className="w-full px-4 py-1 border rounded-lg focus:outline-none focus:border-blue-400"
                                onChange={handleAudioChange}
                            />
                            {taskData.audio && (
                                <audio controls className="mt-2">
                                    <source src={taskData.audio} type="audio/mp3" />
                                    Your browser does not support the audio element.
                                </audio>
                            )}
                        </div>


                        <button
                            type="submit"
                            className="col-span-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg mb-4"
                        >
                            Update Task
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default EditForm;