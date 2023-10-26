'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import SuperSidebar from '../components/SuperSidebar';
import SuperNavbar from '../components/SuperNavbar';


const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);
    const [employeeToEdit, setEmployeeToEdit] = useState(null);
    const [editedEmployee, setEditedEmployee] = useState({});
    const [viewEmployeeData, setViewEmployeeData] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false); // State to control the view modal

    const [companies, setCompanies] = useState([]); // State to store the list of companies

    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const router = useRouter();


    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/company/companies');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setCompanies(data);
            } catch (error) {
                console.error('Error fetching companies:', error);
            }
        };
        fetchCompanies();
    }, []);




    useEffect(() => {
        // Fetch the list of employees from your API endpoint
        fetch('http://localhost:5000/api/employee/list')
            .then((response) => response.json())
            .then((data) => {
                setEmployees(data);
            })
            .catch((error) => {
                console.error('Error fetching employees:', error);
            });
    }, []);

    const handleEditClick = (employeeId) => {
        // Open the edit modal when the "Edit" button is clicked
        setIsEditModalOpen(true);
        const selectedEmployee = employees.find((employee) => employee._id === employeeId);

        // Set the selected employee for editing
        setEditedEmployee(selectedEmployee);

    };


    const editEmployee = async () => {
        try {
            // Update the editedEmployee object with the new values
            const updatedEmployee = {
                ...editedEmployee,
                phoneNumber: editedEmployee.phoneNumber,
                email: editedEmployee.email
            };

            // Send a PUT request to update the employee's details
            await axios.put(`http://localhost:5000/api/employee/edit/${editedEmployee._id}`, updatedEmployee);

            // Update the employee list with the edited data (optional)
            setEmployees(employees.map((employee) =>
                employee._id === editedEmployee._id ? updatedEmployee : employee
            ));

            // Close the edit modal
            closeModal();


            setSuccessMessage('Employee details updated successfully');
            setError(null); // Clear any previous errors
        } catch (error) {
            console.error('Error editing employee:', error);

            setError('Failed to update employee details');
            setSuccessMessage(''); // Clear any previous success messages

        }
    };


    const handleDeleteClick = (employeeId) => {
        // Open the delete modal when the "Delete" button is clicked
        setIsDeleteModalOpen(true);
        // Set the selected employee for deletion
        setEmployeeToDelete(employeeId);
    };


    const handleViewClick = async (employeeId) => {
        try {
            // Send a GET request to fetch the employee by ID
            const response = await axios.get(`http://localhost:5000/api/employee/${employeeId}`);
            const employeeData = response.data;

            // Set the employee data to the state
            setViewEmployeeData(employeeData);

            // Open the view modal
            setIsViewModalOpen(true);
        } catch (error) {
            console.error('Error fetching employee details:', error);
        }
    };

    const confirmDelete = async (employeeId) => {
        try {
            // Send a DELETE request to delete the employee by ID
            await axios.delete(`http://localhost:5000/api/employee/delete/${employeeId}`);

            // Update the employee list after successful deletion (optional)
            setEmployees(employees.filter((employee) => employee._id !== employeeId));

            // Close the delete modal
            closeModal();
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    };

    const closeModal = () => {
        // Close both edit and delete modals when the close button or backdrop is clicked
        setIsEditModalOpen(false);
        setIsDeleteModalOpen(false);
        // Reset the selected employee IDs
        setEmployeeToEdit(null);
        setEmployeeToDelete(null);
    };

    const handleAddClick = () => {
        // Redirect to the "Add Employee" page
        router.push('/employee');
    };

    return (
        <>
            {/* <Navbar /> */}
            <SuperNavbar/>
            <SuperSidebar/>
            <div className="container mx-auto mt-20 m-14 pl-72 ">
                {/* Display error message */}
                {error && <p className="text-red-500">{error}</p>}

                {/* Display success message */}
                {successMessage && <p className="text-green-500">{successMessage}</p>}

                <h2 className="text-2xl font-semibold mb-4">Admin List</h2>
                {/* Add Employee button */}

                <button
                    className="bg-orange-500 rounded-full hover:bg-orange-700 text-white py-2 px-4 font-medium absolute top-8 right-8 mt-16"
                    onClick={handleAddClick}
                >
                    Add Employee
                </button>


                <table className="min-w-full table-auto mt-10">
                    <thead className='bg-orange-500 text-white'>
                        <tr>
                            <th className="px-4 py-2 text-center">Name</th>
                            <th className="px-4 py-2 text-center">Email</th>
                            <th className="px-4 py-2 text-center">Phone Number</th>
                            <th className="px-4 py-2 text-center">Company Name</th>
                            <th className="px-4 py-2 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((employee) => (
                            <tr key={employee._id}>
                                <td className="border px-4 py-2 text-left">{employee.name}</td>
                                <td className="border px-4 py-2">{employee.email}</td>
                                <td className="border px-4 py-2 text-center">{employee.phoneNumber}</td>
                                <td className="border px-4 py-2 text-center">{employee.adminCompanyName}</td>
                                <td className="border px-4 py-2">
                                    <FontAwesomeIcon
                                        icon={faPenToSquare}
                                        className="text-blue-500 hover:underline mr-5 cursor-pointer pl-5"
                                        onClick={() => handleEditClick(employee._id)}
                                    />
                                    <FontAwesomeIcon
                                        icon={faTrash}
                                        className="text-blue-500 hover:underline mr-5 cursor-pointer pl-5"
                                        onClick={() => handleDeleteClick(employee._id)}
                                    />
                                    <FontAwesomeIcon
                                        icon={faEye}
                                        className="text-blue-500 hover:underline mr-5 cursor-pointer pl-5"
                                        onClick={() => handleViewClick(employee._id)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Edit Employee Modal */}
                {isEditModalOpen && (
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
                                onClick={closeModal}
                            >
                                {/* Close button icon */}
                            </button>
                            <div className="p-6 text-center">
                                <h3 className="mb-5 text-2xl font-semibold text-gray-800 dark:text-gray-400">Update Admin</h3>
                                {/* Modal content */}
                                <div className="mb-4">
                                    <label className="block text-gray-800 dark:text-gray-200 text-sm font-medium mb-2">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 rounded-md text-center"
                                        value={editedEmployee.name || ''}
                                        onChange={(e) => setEditedEmployee({ ...editedEmployee, name: e.target.value })}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-800 dark:text-gray-200 text-sm font-medium mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 rounded-md text-center"
                                        value={editedEmployee.email || ''}
                                        onChange={(e) => setEditedEmployee({ ...editedEmployee, email: e.target.value })}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-800 dark:text-gray-200 text-sm font-medium mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 rounded-md text-center"
                                        value={editedEmployee.phoneNumber || ''}
                                        onChange={(e) => setEditedEmployee({ ...editedEmployee, phoneNumber: e.target.value })}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-800 dark:text-gray-200 text-sm font-medium mb-2">
                                        Company Name
                                    </label>
                                    <select
                                        className="w-full border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 rounded-md text-center"
                                        value={editedEmployee.adminCompanyName || ''}
                                        onChange={(e) => setEditedEmployee({ ...editedEmployee, adminCompanyName: e.target.value })}
                                    >
                                        <option value="">Select a Company</option>
                                        {companies.map((company) => (
                                            <option key={company._id} value={company.companyName}>
                                                {company.companyName}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    type="button"
                                    className="px-4 py-2 text-white bg-green-500 hover:bg-green-600 rounded-md mr-4 transition duration-300 ease-in-out"
                                    onClick={editEmployee}
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    className="px-4 py-2 text-white bg-green-700 hover:bg-green-600 rounded-md mr-4 transition duration-300 ease-in-out"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Employee Modal */}
                {isDeleteModalOpen && (
                    <div
                        className="fixed inset-0 flex items-center justify-center z-50"
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} // Semi-transparent background
                    >
                        <div
                            className="modal-container bg-white w-96 p-6 rounded shadow-lg"
                            onClick={closeModal} // Close the modal when the backdrop is clicked
                        >
                            <button
                                type="button"
                                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                onClick={closeModal} // Close the modal when the close button is clicked
                            >
                                {/* Close button icon */}
                            </button>
                            <div className="p-6 text-center">
                                <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                <h3 className="mb-5 text-lg font-normal text-gray-800 dark:text-gray-400">Are you sure you want to delete this Admin?</h3>
                                {/* Modal content */}
                                {/* ... (content of the delete modal) */}
                                <button
                                    type="button"
                                    className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                                    onClick={() => confirmDelete(employeeToDelete)} // Pass the selected employee's ID
                                // Call the confirmDelete function when "Yes, I'm sure" is clicked
                                >
                                      Yes, I&apos;m sure
                                </button>
                                <button
                                    type="button"
                                    className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                                    onClick={closeModal} // Close the modal when "No, cancel" is clicked
                                >
                                    No, cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}


                {isViewModalOpen && (
                    <div
                        className="fixed inset-0 flex items-center justify-center z-50"
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                    >
                        <div className="modal-container bg-white w-96 p-6 rounded shadow-lg">
                            <button
                                type="button"
                                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                onClick={() => setIsViewModalOpen(false)} // Close the modal when the close button is clicked
                            >
                                {/* Close button icon */}
                            </button>
                            <div className="p-6 text-center">
                                <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-gray-400">Admin Details</h3>
                                {viewEmployeeData && (
                                    <div>
                                        <p className="mb-2 text-left justify-center">
                                            <strong>Name:</strong> {viewEmployeeData.name}
                                        </p>
                                        <p className="mb-2 text-left justify-center">
                                            <strong>Phone Number:</strong> {viewEmployeeData.phoneNumber}
                                        </p>
                                        <p className="mb-2 text-left justify-center">
                                            <strong>Email:</strong> {viewEmployeeData.email}
                                        </p>
                                        <p className="mb-2 text-left justify-center">
                                            <strong>Company Name:</strong> {viewEmployeeData.adminCompanyName}
                                        </p>
                                    </div>
                                )}
                                <button
                                    type="button"
                                    className="px-6 py-2 text-white bg-indigo-500 hover:bg-indigo-800 rounded-md  mt-4"
                                    onClick={() => setIsViewModalOpen(false)} // Close the modal when "Close" is clicked
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

export default EmployeeList;