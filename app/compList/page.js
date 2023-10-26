'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import SuperSidebar from '../components/SuperSidebar';
import SuperNavbar from '../components/SuperNavbar';



const CompanyList = () => {
    const [companies, setCompanies] = useState([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [companyToDelete, setCompanyToDelete] = useState(null);
    const [editedCompany, setEditedCompany] = useState(null);
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const router=useRouter()

    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    useEffect(() => {
        // Fetch the list of companies from your API endpoint
        fetch('http://localhost:5000/api/company/companies')
            .then((response) => response.json())
            .then((data) => {
                setCompanies(data);
            })
            .catch((error) => {
                console.error('Error fetching companies:', error);
            });
    }, []);

    const handleEditClick = (companyId) => {
        // Open the edit modal when the "Edit" button is clicked
        setIsEditModalOpen(true);
        const selectedCompany = companies.find((company) => company._id === companyId);

        // Set the selected company for editing
        setEditedCompany(selectedCompany);
    };

    const editCompany = async () => {
        try {
            // Send a PUT request to update the company's details
            await axios.put(`http://localhost:5000/api/company/companies/${editedCompany._id}`, editedCompany);

            // Update the company list with the edited data (optional)
            setCompanies(companies.map((company) =>
                company._id === editedCompany._id ? editedCompany : company
            ));

            // Close the edit modal
            closeModal();
        } catch (error) {
            console.error('Error editing company:', error);
        }
    };

    const handleDeleteClick = (companyId) => {
        // Open the delete modal when the "Delete" button is clicked
        setIsDeleteModalOpen(true);
        // Set the selected company for deletion
        setCompanyToDelete(companyId);
    };

    const confirmDelete = async (companyId) => {
        try {
            // Send a DELETE request to delete the company by ID
            await axios.delete(`http://localhost:5000/api/company/companies/${companyId}`);

            // Update the company list after successful deletion (optional)
            setCompanies(companies.filter((company) => company._id !== companyId));

            // Close the delete modal
            closeModal();
        } catch (error) {
            console.error('Error deleting company:', error);
        }
    };

    const closeModal = () => {
        // Close both edit and delete modals when the close button or backdrop is clicked
        setIsEditModalOpen(false);
        setIsDeleteModalOpen(false);
        setCompanyToDelete(null);
        setEditedCompany(null);
    };

    return (
        <>
            <SuperSidebar />
            <SuperNavbar />
            <div className='m-2 md:mt-20 md:pl-28 pl-4'>
                <div className="container mx-auto">
                    <h2 className="text-2xl font-bold text-center align-middle mb-3 text-orange-700">List of Companies</h2>
                    <div className="mb-4 flex justify-center">

                        <input
                            type="text"
                            placeholder="Search by company name"
                            className="w-full md:w-1/3 border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 rounded-full px-2 py-1 text-center "
                            value={searchQuery}
                            onChange={handleSearchInputChange}
                        />

                    </div>
                    <div className="relative mb-4 md:mb-20">
                        <button
                            className="bg-orange-500  text-white font-bold py-2 px-7 rounded-full absolute top-2 right-2"
                            onClick={() => router.push('/company')}
                        >
                            Add Company
                        </button>
                    </div>

                    {/* <div className="flex justify-end mb-4">
                        <Link href='/company' className="bg-blue-500 hover:bg-blue-800 text-white rounded-md py-2 px-2 font-semibold p-5 cursor-pointer mr-80 -mb-10 text-sm">
                            Add Company
                        </Link>
                    </div> */}

                    <div className="flex justify-center items-center h-2/3 mb-56">
                        <table className="table-auto w-3/6">
                            <thead className='bg-orange-700 text-white'>
                                <tr>
                                    <th className="px-2 py-2 text-center">Sr.No.</th> {/* Add sr.no column */}
                                    <th className="px-2 py-2 text-center">Company Name</th>
                                    <th className="px-2 py-2 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {companies
                                    .filter((company) =>
                                        company.companyName.toLowerCase().includes(searchQuery.toLowerCase())
                                    )
                                    .map((company, index) => (
                                        <tr key={company._id}>
                                            <td className="border px-2 py-2 text-center">{index + 1}</td>
                                            <td className="border px-2 py-2 text-center">{company.companyName}</td>
                                            <td className="border px-2 py-2 text-center">
                                                <FontAwesomeIcon icon={faPenToSquare}
                                                    className="text-orange-500 hover:underline mr-1 pl-1 cursor-pointer"
                                                    onClick={() => handleEditClick(company._id)} />
                                                <FontAwesomeIcon icon={faTrash}
                                                    className="text-orange-500 hover:underline mr-1 pl-1 cursor-pointer"
                                                    onClick={() => handleDeleteClick(company._id)}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Edit Company Modal */}
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
                                    <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-gray-400">Edit Company</h3>
                                    <div className="mb-4">
                                        <label className="block text-gray-800 dark:text-gray-200 text-sm font-medium mb-2">
                                            Company Name
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 rounded-md text-center"
                                            value={editedCompany.companyName || ''}
                                            onChange={(e) => setEditedCompany({ ...editedCompany, companyName: e.target.value })}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        className="px-4 py-2 text-white bg-green-500 hover:bg-green-600 rounded-md mr-4 transition duration-300 ease-in-out"
                                        onClick={editCompany}
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

                    {/* Delete Company Modal */}
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
                                    <h3 className="mb-5 text-lg font-normal text-gray-800 dark:text-gray-400">Are you sure you want to delete this Company?</h3>
                                    <button
                                        type="button"
                                        className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                                        onClick={() => confirmDelete(companyToDelete)}
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



                </div>
            </div >
        </>
    );
};

export default CompanyList;



// 'use client'
// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import axios from 'axios';
// import Navbar from '../components/Navbar';
// import Sidebar from '../components/Sidebar';
// import Link from 'next/link';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
// import { faTrash } from '@fortawesome/free-solid-svg-icons';
// import SuperSidebar from '../components/SuperSidebar';
// import SuperNavbar from '../components/SuperNavbar';



// const CompanyList = () => {
//     const [companies, setCompanies] = useState([]);
//     const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//     const [companyToDelete, setCompanyToDelete] = useState(null);
//     const [editedCompany, setEditedCompany] = useState(null);
//     const [searchQuery, setSearchQuery] = useState(''); // State for search query
//     const router=useRouter()

//     const handleSearchInputChange = (e) => {
//         setSearchQuery(e.target.value);
//     };

//     useEffect(() => {
//         // Fetch the list of companies from your API endpoint
//         fetch('http://localhost:5000/api/company/companies')
//             .then((response) => response.json())
//             .then((data) => {
//                 setCompanies(data);
//             })
//             .catch((error) => {
//                 console.error('Error fetching companies:', error);
//             });
//     }, []);

//     const handleEditClick = (companyId) => {
//         // Open the edit modal when the "Edit" button is clicked
//         setIsEditModalOpen(true);
//         const selectedCompany = companies.find((company) => company._id === companyId);

//         // Set the selected company for editing
//         setEditedCompany(selectedCompany);
//     };

//     const editCompany = async () => {
//         try {
//             // Send a PUT request to update the company's details
//             await axios.put(`http://localhost:5000/api/company/companies/${editedCompany._id}`, editedCompany);

//             // Update the company list with the edited data (optional)
//             setCompanies(companies.map((company) =>
//                 company._id === editedCompany._id ? editedCompany : company
//             ));

//             // Close the edit modal
//             closeModal();
//         } catch (error) {
//             console.error('Error editing company:', error);
//         }
//     };

//     const handleDeleteClick = (companyId) => {
//         // Open the delete modal when the "Delete" button is clicked
//         setIsDeleteModalOpen(true);
//         // Set the selected company for deletion
//         setCompanyToDelete(companyId);
//     };

//     const confirmDelete = async (companyId) => {
//         try {
//             // Send a DELETE request to delete the company by ID
//             await axios.delete(`http://localhost:5000/api/company/companies/${companyId}`);

//             // Update the company list after successful deletion (optional)
//             setCompanies(companies.filter((company) => company._id !== companyId));

//             // Close the delete modal
//             closeModal();
//         } catch (error) {
//             console.error('Error deleting company:', error);
//         }
//     };

//     const closeModal = () => {
//         // Close both edit and delete modals when the close button or backdrop is clicked
//         setIsEditModalOpen(false);
//         setIsDeleteModalOpen(false);
//         setCompanyToDelete(null);
//         setEditedCompany(null);
//     };

//     return (
//         <>
//             <SuperSidebar />
//             <SuperNavbar />
//             <div className='m-26 mt-20 pl-28'>
//                 <div className="container mx-auto">
//                     <h2 className="text-2xl font-bold text-center align-middle mb-3 text-orange-700">List of Companies</h2>
//                     <div className="mb-4 flex justify-center">

//                         <input
//                             type="text"
//                             placeholder="Search by company name"
//                             className="w-1/3 border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 rounded-full px-2 py-1 text-center "
//                             value={searchQuery}
//                             onChange={handleSearchInputChange}
//                         />

//                     </div>
//                     <div className="relative mb-20 mr-72">
//                         <button
//                             className="bg-orange-500  text-white font-bold py-2 px-7 rounded-full absolute top-2 right-2"
//                             onClick={() => router.push('/company')}
//                         >
//                             Add Company
//                         </button>
//                     </div>

//                     {/* <div className="flex justify-end mb-4">
//                         <Link href='/company' className="bg-blue-500 hover:bg-blue-800 text-white rounded-md py-2 px-2 font-semibold p-5 cursor-pointer mr-80 -mb-10 text-sm">
//                             Add Company
//                         </Link>
//                     </div> */}

//                     <div className="flex justify-center items-center h-2/3 mb-56">
//                         <table className="table-auto w-3/6">
//                             <thead className='bg-orange-700 text-white'>
//                                 <tr>
//                                     <th className="px-2 py-2 text-center">Sr.No.</th> {/* Add sr.no column */}
//                                     <th className="px-2 py-2 text-center">Company Name</th>
//                                     <th className="px-2 py-2 text-center">Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {companies
//                                     .filter((company) =>
//                                         company.companyName.toLowerCase().includes(searchQuery.toLowerCase())
//                                     )
//                                     .map((company, index) => (
//                                         <tr key={company._id}>
//                                             <td className="border px-2 py-2 text-center">{index + 1}</td>
//                                             <td className="border px-2 py-2 text-center">{company.companyName}</td>
//                                             <td className="border px-2 py-2 text-center">
//                                                 <FontAwesomeIcon icon={faPenToSquare}
//                                                     className="text-orange-500 hover:underline mr-5 pl-5 cursor-pointer"
//                                                     onClick={() => handleEditClick(company._id)} />
//                                                 <FontAwesomeIcon icon={faTrash}
//                                                     className="text-orange-500 hover:underline pl-5 cursor-pointer"
//                                                     onClick={() => handleDeleteClick(company._id)}
//                                                 />
//                                             </td>
//                                         </tr>
//                                     ))}
//                             </tbody>
//                         </table>
//                     </div>
//                     {/* Edit Company Modal */}
//                     {isEditModalOpen && (
//                         <div
//                             className="fixed inset-0 flex items-center justify-center z-50"
//                             style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
//                         >
//                             <div
//                                 className="modal-container bg-white w-96 p-6 rounded shadow-lg"
//                                 onClick={(e) => e.stopPropagation()}
//                             >
//                                 <button
//                                     type="button"
//                                     className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
//                                     onClick={closeModal}
//                                 >
//                                     {/* Close button icon */}
//                                 </button>
//                                 <div className="p-6 text-center">
//                                     <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-gray-400">Edit Company</h3>
//                                     <div className="mb-4">
//                                         <label className="block text-gray-800 dark:text-gray-200 text-sm font-medium mb-2">
//                                             Company Name
//                                         </label>
//                                         <input
//                                             type="text"
//                                             className="w-full border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 rounded-md text-center"
//                                             value={editedCompany.companyName || ''}
//                                             onChange={(e) => setEditedCompany({ ...editedCompany, companyName: e.target.value })}
//                                         />
//                                     </div>
//                                     <button
//                                         type="button"
//                                         className="px-4 py-2 text-white bg-green-500 hover:bg-green-600 rounded-md mr-4 transition duration-300 ease-in-out"
//                                         onClick={editCompany}
//                                     >
//                                         Save
//                                     </button>
//                                     <button
//                                         type="button"
//                                         className="px-4 py-2 text-white bg-green-700 hover:bg-green-600 rounded-md mr-4 transition duration-300 ease-in-out"
//                                         onClick={closeModal}
//                                     >
//                                         Cancel
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     {/* Delete Company Modal */}
//                     {isDeleteModalOpen && (
//                         <div
//                             className="fixed inset-0 flex items-center justify-center z-50"
//                             style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
//                         >
//                             <div
//                                 className="modal-container bg-white w-96 p-6 rounded shadow-lg"
//                                 onClick={closeModal}
//                             >
//                                 <button
//                                     type="button"
//                                     className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
//                                     onClick={closeModal}
//                                 >
//                                     {/* Close button icon */}
//                                 </button>
//                                 <div className="p-6 text-center">
//                                     <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
//                                         <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
//                                     </svg>
//                                     <h3 className="mb-5 text-lg font-normal text-gray-800 dark:text-gray-400">Are you sure you want to delete this Company?</h3>
//                                     <button
//                                         type="button"
//                                         className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
//                                         onClick={() => confirmDelete(companyToDelete)}
//                                     >
//                                         Yes, I&rsquo;m sure
//                                     </button>
//                                     <button
//                                         type="button"
//                                         className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
//                                         onClick={closeModal}
//                                     >
//                                         No, cancel
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     )}



//                 </div>
//             </div >
//         </>
//     );
// };

// export default CompanyList;
