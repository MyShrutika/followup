'use client'

import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import AdminSidebar from '../components/AdminSidebar';


const LeadForm = () => {
    const [formData, setFormData] = useState({
        customerName: '',
        companyName: '',
        contactNo: '',
        email: '',
        description: '',
        ownerName: '',
        website: '',
        leadPicture: null, // Initialize with null since it's a file input
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleChange = (e) => {
        const file = e.target.files[0]; // Assuming a single file upload
        setFormData({ ...formData, leadPicture: file });
    };

    const clearForm = () => {
        setFormData({
            customerName: '',
            companyName: '',
            contactNo: '',
            email: '',
            description: '',
            ownerName: '',
            website: '',
            leadPicture: null,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataWithFile = new FormData();
        for (const key in formData) {
            formDataWithFile.append(key, formData[key]);
        }

        // Get the token from localStorage
        const token = localStorage.getItem('authToken');

        // Create headers object with the Authorization token
        const headers = { Authorization: token };

        // Make an API call to create a lead with the token in the headers
        try {
            const response = await axios.post('http://localhost:5000/api/lead/createLead', formDataWithFile, { headers });
            console.log('Lead created:', response.data);

            const leadNotificationData = {
                message: 'A new lead has been created',
                description: formData.description,
                customerName: formData.customerName,
                companyName: formData.companyName,
                contactNo: formData.contactNo,
                email: formData.email,
                ownerName: formData.ownerName,
                website: formData.website,
                leadPicture:formData.leadPicture
            };

            const leadNotificationResponse = await axios.post('http://localhost:5000/api/lead/create/Notification', leadNotificationData, { headers });
            console.log('Lead notification created:', leadNotificationResponse.data);


            clearForm()
        } catch (error) {
            console.error('Error creating lead:', error);
        }
    };

    return (
        <>
            <Navbar />  
            <AdminSidebar />
            <div className="container mx-auto flex justify-center items-center mt-28 mb-15 pl-64">
                <div className="w-1/2 ">
                    <div className="bg-white shadow-md rounded px-8 py-8 mb-4 border border-gray-800">
                        <h1 className="text-2xl font-bold mb-4 text-orange-500">Create Lead</h1>
                        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                            <div className="mb-2">
                                <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="customerName">
                                    Customer Name
                                </label>
                                <input
                                    type="text"
                                    id="customerName"
                                    name="customerName"
                                    value={formData.customerName}
                                    onChange={handleInputChange}
                                    placeholder='name'
                                    className="border rounded-md px-3 py-1 w-full"
                                />
                            </div>
                            <div className="mb-2 pl-3">
                                <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="companyName">
                                    Company Name
                                </label>
                                <input
                                    type="text"
                                    id="companyName"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleInputChange}
                                    placeholder='Company name'
                                    className="border rounded-md px-3 py-1 w-full" />
                            </div>
                            <div className="mb-2">
                                <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="contactNo">
                                    Mobile No
                                </label>
                                <input
                                    type="text"
                                    id="contactNo"
                                    name="contactNo"
                                    value={formData.contactNo}
                                    onChange={handleInputChange}
                                    placeholder='+123-456-7890'
                                    className="border rounded-md px-3 py-1 w-full" />
                            </div>
                            <div className="mb-2 pl-3">
                                <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    type="text"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder='****@gmail.com'
                                    className="border rounded-md px-3 py-1 w-full" />
                            </div>
                            <div className="mb-2">
                                <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="description">
                                    Lead Description
                                </label>
                                <input
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="border rounded-md px-3 py-1 w-full" />
                            </div>
                            <div className="mb-2 pl-3">
                                <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="ownerName">
                                    Company Owner&apos;s Name
                                </label>
                                <input
                                    type="text"
                                    id="ownerName"
                                    name="ownerName"
                                    value={formData.ownerName}
                                    onChange={handleInputChange}
                                    className="border rounded-md px-3 py-1 w-full" />
                            </div>
                            <div className="mb-2">
                                <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="website">
                                    Website
                                </label>
                                <input
                                    type="text"
                                    id="website"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleInputChange}
                                    placeholder='www.example.com'
                                    className="border rounded-md px-3 py-1 w-full" />
                            </div>
                            <div className="mb-4 pl-3">
                                <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="leadPicture">
                                    Lead Picture
                                </label>
                                <input
                                    type="file"
                                    id="leadPicture"
                                    name="leadPicture"
                                    onChange={handleChange}
                                    className="border rounded-md px-3 py-1 w-full"
                                />
                            </div>

                            <div className="col-span-2 flex justify-center">
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Create Lead
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LeadForm;
