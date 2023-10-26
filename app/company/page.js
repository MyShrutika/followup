'use client'

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import SuperSidebar from '../components/SuperSidebar';
import SuperNavbar from '../components/SuperNavbar';


const CompanyCreationForm = () => {
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter()

  const handleCompanyNameChange = (e) => {
    setCompanyName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/company/createCompany', {
        companyName,
      });

      // Handle success
      setSuccessMessage('Company created successfully');
      setError(null);
      setCompanyName(''); // Clear the input field
      router.push('/compList')

      console.log(response.data);
    } catch (err) {
      // Handle errors
      setError(err.response?.data?.errors[0]?.msg || 'An error occurred');
      setSuccessMessage('');
    }
  };

  return (
    <>
    <SuperNavbar/>
    {/* <Navbar/> */}
    {/* <Sidebar/> */}
    <SuperSidebar/>
      <div>
        <section className="bg-gray-50 dark:bg-gray-900">
          <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
              <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Create a New Company
              </h2>
              <form onSubmit={handleSubmit} className="mt-4 space-y-4 lg:mt-5 md:space-y-5">
                <div>
                  <label htmlFor="companyName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    id="companyName"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Company Name"
                    required
                    value={companyName}
                    onChange={handleCompanyNameChange}
                  />
                </div>
                {error && <p className="mt-4 text-red-600">{error}</p>}
                {successMessage && <p className="mt-4 text-green-600">{successMessage}</p>}
                <button
                  type="submit"
                  className="col-span-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg w-full"
                >
                  Create
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default CompanyCreationForm;
