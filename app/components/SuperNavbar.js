'use client'


import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';


const SuperNavbar = () => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [profilePictureURL, setProfilePictureURL] = useState(null);

    const router = useRouter();

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        localStorage.removeItem('empUsername');
        localStorage.removeItem('subUsername');
        router.push('/login');
    };


    useEffect(() => {
        const closeDropdown = (event) => {
            if (isDropdownOpen) {
                if (
                    event.target.closest('.dropdown') === null &&
                    event.target.closest('.dropdown-toggle') === null
                ) {
                    setDropdownOpen(false);
                }
            }
        };

        if (typeof window !== 'undefined') {
            document.addEventListener('click', closeDropdown);
        }

        return () => {
            if (typeof window !== 'undefined') {
                document.removeEventListener('click', closeDropdown);
            }
        };
    }, [isDropdownOpen]);


    const handleProfilePictureUpload = async (file) => {
        try {
            const formData = new FormData();
            formData.append('profilePicture', file);
            const response = await axios.post('http://localhost:5000/api/task/upload-profile-picture', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setProfilePictureURL(response.data.profilePictureURL);
            setDropdownOpen(false);
        } catch (error) {
            console.error('Error uploading profile picture:', error);
        }
    };

    const handleProfilePictureClick = (e) => {
        e.preventDefault();
        const fileInput = document.getElementById('profilePictureUpload');
        fileInput.click();
    };

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleProfilePictureUpload(file);
        }
    };


    return (
        <>

            <nav className="fixed top-0 left-0 right-0 bg-cyan-500 text-gray-600 body-font z-50">
                <div className="container mx-auto flex flex-wrap p-4 flex-col md:flex-row items-center justify-between">
                    <div className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
                        <span className="ml-3 text-xl text-black font-bold">Super Admin</span>
                    </div>

                    <div className="relative inline-block text-left dropdown">
                        <button
                            onClick={toggleDropdown}
                            className="dropdown-toggle text-white flex items-center focus:outline-none"
                        >
                            {profilePictureURL ? (
                                <Image
                                    src={profilePictureURL}
                                    alt="Profile"
                                    width={32} // Set your desired width
                                    height={32} // Set your desired height
                                    className="rounded-full cursor-pointer"
                                    onClick={handleProfilePictureClick}
                                />
                            ) : (
                                <FontAwesomeIcon icon={faUser} size='xl' style={{color: "#ffffff", marginLeft: '20px'}}
                                />
                            )}

                            <span className="ml-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-4 h-4 inline-block"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </span>
                        </button>
                        {isDropdownOpen && (
                            <div className="origin-top-right absolute right-0 mt-3 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                <div
                                    className="py-1"
                                    role="menu"
                                    aria-orientation="vertical"
                                    aria-labelledby="options-menu"
                                >
                                    <Link
                                        href="#"
                                        onClick={handleProfilePictureClick}
                                        className="px-4 py-1 text-sm text-gray-700 hover:bg-gray-300 hover:text-gray-900 flex items-center font-light"

                                    >
                                        <FontAwesomeIcon icon={faUser} className="" />
                                        User Profile Picture
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="px-4 py-1 w-full text-left text-sm text-gray-700 hover:bg-gray-300  hover:text-gray-900 flex items-center font-medium"
                                        role="menuitem"
                                    >
                                        <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <input
                        type="file"
                        id="profilePictureUpload"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleProfilePictureChange}
                    />
                </div>
            </nav>
        </>
    );
};

export default SuperNavbar;