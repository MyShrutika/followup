'use client'

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faBuilding, faClipboardList, faListUl, faSquarePlus, faTableCellsLarge, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import Image from 'next/image';
import { faUser } from '@fortawesome/free-regular-svg-icons';


const Sidebar = () => {
  const [isEmployeeOpen, setEmployeeOpen] = useState(false);
  const [isAdminOpen, setAdminOpen] = useState(false);


  const toggleAdmin = () => {
    setAdminOpen(!isAdminOpen);
  };

  const toggleEmployee = () => {
    setEmployeeOpen(!isEmployeeOpen);
  };

  return (
    <>

      <aside id="default-sidebar" className="fixed top-0 left-0 h-screen w-64 transition-transform -translate-x-full sm:translate-x-0 mt-16">
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-900 border border-gray-200">
          <ul className="space-y-2 font-medium">
            <li>
              <Link href="/compList" className="flex items-center p-2 text-gray-950 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
                {/* Dashboard */}
                {/* <img src='/images/dashboard.png' alt='list' /> */}
                <FontAwesomeIcon icon={faTableCellsLarge} size='xl'
                  style={{ color: '#3ca8be', marginLeft: '5px' }}
                  onClick={() => handleDeleteClick(company._id)}
                />

                {/* <Image src='/images/dashboard.png' alt='img' width={25} height={25} style={{ margin: "3px" }} /> */}

                <span className="ml-3">Dashboard</span>
              </Link>
            </li>

            <li>
              <button onClick={toggleAdmin} className="flex items-center w-full p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
                {/* <img src='/images/add.png' alt='list' /> */}
                {/* <Image src='/images/add.png' alt='img' width={25} height={25} style={{ margin: "3px" }} /> */}
                <FontAwesomeIcon icon={faBuilding} size='xl'
                  style={{ color: 'red', marginLeft: '8px' }}

                />
                <span className="ml-3 pl-1">Company</span>
                <FontAwesomeIcon icon={faAngleDown} className={`w-5 h-5 ml-auto ${isAdminOpen ? 'rotate-0' : 'rotate-180'}`} />
              </button>



              {isAdminOpen && (
                <ul className="ml-6 space-y-2 font-medium">
                  <li>
                    <Link href='/compList' className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
                      {/* <img src='/images/list_main.png' alt='list' className='mx-3' /> */}
                      {/* <Image src='/images/list_main.png' alt='img' width={25} height={25} style={{ margin: "3px" }} /> */}
                      <FontAwesomeIcon icon={faListUl} size='xl'
                        style={{ color: 'red', marginLeft: '5px' }}
                      />
                      <span className='ml-3'>Companies List</span>

                    </Link>
                  </li>
                  <li>
                    <Link href='/company' className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
                      {/* <img src='/images/add.png' alt='list' className='mx-3' /> */}
                      {/* <Image src='/images/add.png' alt='img' width={25} height={25} style={{ margin: "3px" }} /> */}
                      <FontAwesomeIcon icon={faSquarePlus} size='xl'
                        style={{ color: 'red', marginLeft: '5px' }}
                      />
                      <span className='ml-3 pl-1'>Add Company</span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>


            <li>
              <button onClick={toggleEmployee} className="flex items-center w-full p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
                {/* <img src='/images/user.png' alt='list' /> */}
                {/* <Image src='/images/user.png' alt='img' width={25} height={25} style={{ margin: "3px" }} /> */}
                <FontAwesomeIcon icon={faUser} size='xl'
                  style={{ color: '#3ca8be', marginLeft: '5px' }}
                  onClick={() => handleDeleteClick(company._id)}
                />

                <span className="ml-3 pl-2">Admin</span>
                <FontAwesomeIcon icon={faAngleDown} className={`w-5 h-5 ml-auto ${isEmployeeOpen ? 'rotate-0' : 'rotate-180'}`} />
              </button>
              {isEmployeeOpen && (
                <ul className="ml-6 space-y-2 font-medium">
                  <li>
                    <Link href="/empList" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
                      {/* <img src='/images/list_main.png' alt='list' className='mx-3' /> */}
                      {/* <Image src='/images/list_main.png' alt='img' width={25} height={25} style={{ margin: "3px" }} /> */}
                      <FontAwesomeIcon icon={faClipboardList} size='xl'
                        style={{ color: 'blue', marginLeft: '12px' }}
                        onClick={() => handleDeleteClick(company._id)}
                      />
                      <span className='pl-3 ml-1'>Admin List </span>

                    </Link>
                  </li>
                  <li>
                    <Link href="/employee" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover-bg-gray-700 group">
                      {/* <img src='/images/addEmp.png' alt='list' className='mx-3' /> */}
                      {/* <Image src='/images/addEmp.png' alt='img' width={25} height={25} style={{ margin: "3px" }} /> */}

                      <FontAwesomeIcon icon={faUserPlus} size='xl'
                        style={{ color: 'blue', marginLeft: '8px' }}
                        onClick={() => handleDeleteClick(company._id)}
                      />
                      <span className='pl-1 ml-1'> Add Admin</span>

                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;