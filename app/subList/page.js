'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import AdminSidebar from '../components/AdminSidebar';



const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [editedEmployee, setEditedEmployee] = useState(null);
  const [viewEmployeeData, setViewEmployeeData] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  let serialNumber = 1; // Initialize the serial number

  const clearSuccessMessage = () => {
    setTimeout(() => {
      setSuccessMessage('');
    }, 2000); // 2000 milliseconds (2 seconds)
  };

  const router = useRouter();

  useEffect(() => {
    // Fetch the list of employees from your API endpoint
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/employee/subemployees/list`,
          {
            headers: {
              Authorization: localStorage.getItem('authToken'),
              // Other headers if needed
            }
          });
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
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
        email: editedEmployee.email,
      };

      // Send a PUT request to update the employee's details
      await axios.put(`http://localhost:5000/api/subemployee/update/${editedEmployee._id}`, updatedEmployee,
        {
          headers: {
            Authorization: localStorage.getItem('authToken'),
            // Other headers if needed
          }
        });

      // Update the employee list with the edited data (optional)
      setEmployees(employees.map((employee) =>
        employee._id === editedEmployee._id ? updatedEmployee : employee
      ));

      // Close the edit modal
      closeModal();

      setSuccessMessage('Employee details updated successfully');
      clearSuccessMessage();

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
      const response = await axios.get(`http://localhost:5000/api/subemployee/${employeeId}`,
        {
          headers: {
            Authorization: localStorage.getItem('authToken'),
            // Other headers if needed
          }
        });
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
      await axios.delete(`http://localhost:5000/api/subemployee/delete/${employeeId}`);

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
    setEmployeeToDelete(null);
  };

  const handleAddClick = () => {
    // Redirect to the "Add Employee" page
    router.push('/subemp');
  };

  return (
    <>
      <Navbar />
      {/* <Sidebar /> */}
      <AdminSidebar />
      <div className="container mx-auto mt-20 m-14 pl-64">
        {/* Display error message */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Display success message */}
        {successMessage && (
          <div className="text-green-500">
            {successMessage}
          </div>
        )}
        <h2 className="text-2xl font-semibold mb-4 text-orange-500">Employee List</h2>
        {/* Add Employee button */}
        <button
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-full py-2 px-4 font-medium absolute top-8 right-14 mt-24"
          onClick={handleAddClick}
        >
          Add Employee
        </button>

        <table className="min-w-full table-auto mt-14">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-gray-800">Sr.No.</th>
              <th className="px-4 py-2 text-left text-gray-800">Name</th>
              <th className="px-4 py-2 text-left text-gray-800">Email</th>
              <th className="px-4 py-2 text-left text-gray-800">Phone Number</th>
              <th className="px-4 py-2 text-left text-gray-800">Company Name</th>
              <th className="px-4 py-2 text-center text-gray-800">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee._id}>
                <td className="border px-4 py-2 text-center">{serialNumber++}</td>
                <td className="border px-4 py-2">{employee.name}</td>
                <td className="border px-4 py-2">{employee.email}</td>
                <td className="border px-4 py-2">{employee.phoneNumber}</td>
                <td className="border px-4 py-2">{employee.adminCompanyName}</td>
                <td className="border px-4 py-2">

                  <FontAwesomeIcon
                    icon={faPenToSquare}
                    className="text-orange-500 hover:underline mr-5 cursor-pointer pl-5 "
                    onClick={() => handleEditClick(employee._id)}
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="text-red-500 hover:underline mr-5 cursor-pointer pl-5"
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
                <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-gray-400">Edit Employee</h3>
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
                  <input
                    type="text"
                    className="w-full border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 rounded-md text-center"
                    value={editedEmployee.adminCompanyName || ''}
                    onChange={(e) => setEditedEmployee({ ...editedEmployee, adminCompanyName: e.target.value })}
                  />
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
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          >
            <div
              className="modal-container bg-white w-96 p-6 rounded shadow-lg"
              onClick={closeModal}
            >
              <button
                type="button"
                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={closeModal}
              >
                {/* Close button icon */}
              </button>
              <div className="p-6 text-center">
                <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <h3 className="mb-5 text-lg font-normal text-gray-800 dark:text-gray-400">Are you sure you want to delete this Employee?</h3>
                {/* Modal content */}
                <button
                  type="button"
                  className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                  onClick={() => confirmDelete(employeeToDelete)}
                >
                  Yes, I&rsquo;m sure
                </button>
                <button
                  type="button"
                  className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                  onClick={closeModal}
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
                onClick={() => setIsViewModalOpen(false)}
              >
                {/* Close button icon */}
              </button>
              <div className="p-6 text-center">
                <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-gray-400">Employee Details</h3>
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
                    {/* Add more details here */}
                  </div>
                )}
                <button
                  type="button"
                  className="px-4 py-2 text-blue-500 hover:text-blue-600 rounded-md hover:underline mt-4"
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

export default EmployeeList;