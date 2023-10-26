"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import SuperSidebar from '../components/SuperSidebar';
import SuperNavbar from '../components/SuperNavbar';

const initialFormData = {
    name: '',
    email: '',
    password: '',
    adminCompanyName: '',
    phoneNumber: '',

};

const EmployeeRegistration = () => {
    const [formData, setFormData] = useState(initialFormData);
    const [successMessage, setSuccessMessage] = useState('');


    const [adminCompanies, setAdminCompanies] = useState([]);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        // Fetch the list of admin's companies from the API
        const fetchAdminCompanies = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/company/companies');
                if (response.status === 200) {
                    setAdminCompanies(response.data);
                }
            } catch (err) {
                console.error('Error fetching admin companies:', err);
            }
        };

        fetchAdminCompanies();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();


        try {
            const response = await axios.post('http://localhost:5000/api/employee/register', formData);

            if (response.status === 201) {
                // Registration successful, redirect to login page or any other page
                setFormData(initialFormData)
                setSuccessMessage('Admin added successfully.');
                router.push('/empList')
            }


        } catch (err) {
            // Handle registration error
            if (err.response) {
                setError(err.response.data.error);
            } else {
                setError('An error occurred while registering the employee.');
            }
        }
    };

    return (
        <>
        <SuperNavbar/>
        {/* <Navbar/> */}
        {/* <Sidebar/> */}
        <SuperSidebar/>
            <div className="mx-auto max-w-md p-6 bg-white rounded-lg shadow-md mt-20 border border-gray-300">
                <h2 className="text-2xl font-semibold text-center text-orange-500">Admin Registration</h2>
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Name:</label>
                        <input
                            type="text"
                            name="name"
                            placeholder='Admin Name'
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-indigo-400"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Phone Number:</label>
                        <input
                            type="text"
                            name="phoneNumber"
                            placeholder='+123 456 7890'
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-indigo-400"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Email:</label>
                        <input
                            type="email"
                            name="email"
                            placeholder='example@gmail.com'
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-indigo-400"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Password:</label>
                        <input
                            type="password"
                            name="password"
                            placeholder='******'
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-indigo-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Select Company Name:</label>
                        <select
                            name="adminCompanyName"
                            value={formData.adminCompanyName}
                            onChange={handleChange}
                            required
                            className="w-full px-2 py-2 border rounded-md focus:ring focus:ring-indigo-400"
                        >
                            <option value="">Select Company</option>
                            {adminCompanies.map((company) => (
                                <option key={company._id} value={company.companyName}>
                                    {company.companyName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {error && <p className="text-red-500">{error}</p>}
                    {successMessage && <p className="text-green-500">{successMessage}</p>}

                    <button
                        type="submit"
                        className="w-full py-2 px-4 text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-400"
                    >
                        Register
                    </button>
                </form>
            </div>
        </>
    );
};

export default EmployeeRegistration;
