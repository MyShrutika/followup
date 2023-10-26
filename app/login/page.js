
'use client'
import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const LoginForm = () => {
    const router = useRouter();

    const handleAdminLogin = () => {
        // Redirect to the admin login page
        router.push('/adminLogin');
    };

    const handleEmployeeLogin = () => {
        // Redirect to the employee login page
        router.push('/employeeLogin');
    };

    const handleSubEmployeeLogin = () => {
        // Redirect to the subemployee login page
        router.push('/subEmployeeLogin'); // Replace with your subemployee login route
    };

    const backgroundImageUrl = 'https://img.freepik.com/free-vector/simple-blue-blank-background-vector-business_53876-175738.jpg?w=1060&t=st=1697710227~exp=1697710827~hmac=2ab6a050d4771018bf7db10f8ffd2245b223c5a37195b37716e080c4a5f0cf5c';


    return (
        
        <div className="bg-no-repeat bg-cover bg-center h-screen min-h-screen flex items-center justify-center sm:px-6 lg:px-8" style={{ backgroundImage: `url(${backgroundImageUrl})`  }}>

            {/* <div className="max-w-md w-full space-y-8"> */}
            <div className="border border-gray-300 rounded-md max-w-md w-full space-y-8 p-6 bg-white">

                <div className="text-center">
                    <Image
                        src="/images/main_login1.png"
                        alt="login"
                        width={150} // Set your desired width
                        height={150} // Set your desired height
                        className="mx-auto max-w-40 h-auto"
                    />
                    <h2 className="mt-1 text-3xl font-extrabold text-gray-900">Login </h2>
                </div>
                <div className="flex justify-center">
                    <div className="flex space-x-4"> {/* Added flex class here */}
                        <button
                            onClick={handleAdminLogin}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-xl"
                        >
                            SuperAdmin
                        </button>

                        <button
                            onClick={handleEmployeeLogin}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-2 rounded-xl"
                        >
                            Admin
                        </button>

                        <button
                            onClick={handleSubEmployeeLogin}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-xl"
                        >
                            Employee
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;