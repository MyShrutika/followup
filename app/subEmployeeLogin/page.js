'use client'
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Image from 'next/image';


const SubEmployeeLoginForm = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleEmailChange = (e) => {
        setEmail(e.target.value)
    };


    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Send a POST request to the /login endpoint for sub-employees
            const response = await axios.post('http://localhost:5000/api/subemployee/login', {
                email,
                password,
            });

            console.log('Authentication successful', response.data);
            const token = response.data.token;

            localStorage.setItem('authToken', token);
            localStorage.setItem('subUsername', email); // Save the email or any other user information

            router.push('/'); // Redirect to the employee dashboard or any other route

        } catch (error) {
            // Handle any errors that occur during the request
            console.error('Error logging in sub-employee:', error);
            setError('An error occurred. Please try again later.');
        }
    };

    const backgroundImageUrl = 'https://exergic.in/wp-content/uploads/2018/04/Orange-Background-Vector-Wallpaper.jpg';


    return (
        <>
            <div className="min-h-screen flex items-center justify-center sm:px-6 lg:px-8"
                style={{ backgroundImage: `url(${backgroundImageUrl})` }}>
                <div className="w-1/3 p-6 bg-white rounded-lg shadow-md mt-5">
                    <div className="flex items-center justify-center">
                        <Image
                        src="/images/log.png"
                        alt="img"
                        width={100}
                        height={100} // You can adjust the height as needed
                    />
                    </div>
                    <h2 className="text-2xl font-semibold text-center mb-5 mt-5">Employee Login</h2>
                    <form onSubmit={handleSubmit} className="mt-2 space-y-4">
                        <div>
                            <label className="block text-sm font-medium">Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={handleEmailChange}
                                placeholder='example@gmail.com'
                                required
                                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-indigo-400 "
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Password:</label>
                            <input
                                type="password"
                                name="password"
                                placeholder='******'
                                value={password}
                                onChange={handlePasswordChange}
                                required
                                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-indigo-400"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2 px-4 text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-400"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>




            <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundImage: `url(${backgroundImageUrl})` }}>
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Employee Login</h2>
                    </div>
                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="email" className="sr-only">
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border 
                  border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none 
                  focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={handleEmailChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border 
                  border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none 
                  focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                                    placeholder="Password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                />
                            </div>
                        </div>

                        {error && (
                            <p className="mt-2 text-sm text-red-600">
                                {error}
                            </p>
                        )}

                        <div>
                            <button
                                type="submit"
                                className='bg-indigo-600 hover:bg-indigo-600 text-white font-medium w-full py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-3'

                            >
                                Sign in
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default SubEmployeeLoginForm;
