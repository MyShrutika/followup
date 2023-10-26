'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import AdminSidebar from '../components/AdminSidebar';
import { useRouter } from 'next/navigation';


const SubemployeeForm = () => {
    const router = useRouter()
    const [subEmployee, setSubEmployee] = useState({
        name: '',
        email: '',
        password: '',
        adminCompanyName: '', // Pre-fill with the admin company name
        phoneNumber: '',
    });
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        // Fetch the admin's company name and pre-fill it in the form
        const fetchAdminCompany = async () => {
            try {
                const token = localStorage.getItem('authToken'); // Retrieve JWT token from localStorage
                const response = await axios.get('http://localhost:5000/api/employee/subemployees/company', {
                    headers: {
                        Authorization: token, // Include JWT token in the request headers
                    },
                });
                setSubEmployee((prev) => ({
                    ...prev,
                    adminCompanyName: response.data.companyName,
                }));
            } catch (error) {
                console.error('Error fetching admin company:', error);
                setError('Error fetching admin company');
            }
        };

        fetchAdminCompany();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSubEmployee((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Send a POST request to create the subemployee
        try {
            const token = localStorage.getItem('authToken'); // Retrieve JWT token from localStorage
            await axios.post('http://localhost:5000/api/employee/registersub', subEmployee, {
                headers: {
                    Authorization: token, // Include JWT token in the request headers
                },
            });
            setSuccessMessage('Employee registered successfully');
            setError(null);

            // Clear the form fields
            setSubEmployee({
                name: '',
                email: '',
                password: '',
                adminCompanyName: subEmployee.adminCompanyName,
                phoneNumber: '',
            });

            router.push('/subList');

        } catch (error) {
            console.error('Error registering subemployee:', error);
            setError('Error registering subemployee');
        }
    };

    return (
        <>
            <Navbar />
            {/* <Sidebar/> */}
            <AdminSidebar />
            <div>
                <section className="bg-gray-50 dark:bg-gray-900 mt-4 p-8">
                    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                        <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
                            <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-orange-500 md:text-2xl dark:text-white">
                                Create Employee
                            </h2>
                            <form onSubmit={handleSubmit} className="mt-2 space-y-4 lg:mt-5 md:space-y-5">
                                <div>
                                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Employee Name"
                                        required
                                        value={subEmployee.name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="yourname@gmail.com"
                                        required
                                        value={subEmployee.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        id="password"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="********"
                                        required
                                        value={subEmployee.password}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="adminCompanyName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Admin Company</label>
                                    <input
                                        type="text"
                                        name="adminCompanyName"
                                        id="adminCompanyName"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 font-bold sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        readOnly
                                        value={subEmployee.adminCompanyName}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="phoneNumber" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone Number</label>
                                    <input
                                        type="text"
                                        name="phoneNumber"
                                        id="phoneNumber"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="123-456-789"
                                        value={subEmployee.phoneNumber}
                                        onChange={handleChange}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="col-span-2 bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg w-full"                            >
                                    Create Employee
                                </button>
                            </form>
                            {successMessage && <p className="mt-4 text-green-600">{successMessage}</p>}
                            {error && <p className="mt-4 text-red-600">{error}</p>}
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default SubemployeeForm;

