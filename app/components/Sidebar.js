'use client'

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';


const Sidebar = () => {
  const [isTasksOpen, setTasksOpen] = useState(false);
  const [isEmployeeOpen, setEmployeeOpen] = useState(false);
  const [isAdminOpen, setAdminOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [isLeadOpen, setLeadOpen] = useState(false); // Add this state

  const toggleLead = () => {
    setLeadOpen(!isLeadOpen);
  };


  const router = useRouter()
  useEffect(() => {
    // Access localStorage only on the client side
    if (typeof window !== 'undefined') {
      const storedUsername = window.localStorage.getItem('username');
      setUsername(storedUsername);
    }
  }, [router]);

  const shouldHideCompanyDropdown = username !== 'javed.absoft@gmail.com';
  const shouldHideTasksDropdown = username === 'javed.absoft@gmail.com';

  const subUsername = typeof window !== 'undefined' ? window.localStorage.getItem('subUsername') : null;
  const empUsername = typeof window !== 'undefined' ? window.localStorage.getItem('empUsername') : null;

  const shouldHideUserField = typeof window !== 'undefined' && !!window.localStorage.getItem('subUsername');



  const toggleAdmin = () => {
    setAdminOpen(!isAdminOpen);
  };

  const toggleTasks = () => {
    setTasksOpen(!isTasksOpen);
  };

  const toggleEmployee = () => {
    setEmployeeOpen(!isEmployeeOpen);
  };

  return (
    <>
      {/* Your sidebar button and other code here */}

      <aside id="default-sidebar" className="fixed top-0 left-0 h-screen w-64 transition-transform -translate-x-full sm:translate-x-0 mt-16">
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-900 border border-gray-200">
          <ul className="space-y-2 font-medium">
            <li>
              <Link href="/" className="flex items-center p-2 text-gray-950 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
                {/* Dashboard */}
                {/* <img src='/images/dashboard.png' alt='list' /> */}
                <Image src='/images/dashboard.png' alt='img' width={25} height={25} style={{margin:"3px"}} />

                <span className="ml-3">Dashboard</span>
              </Link>
            </li>



            <li>
              {/* Company Dropdown */}
              {!shouldHideCompanyDropdown && (
                <button onClick={toggleAdmin} className="flex items-center w-full p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
                  {/* <img src='/images/add.png' alt='list' /> */}
                  <Image src='/images/add.png' alt='img' width={25} height={25} style={{margin:"3px"}} />

                  <span className="ml-3">Company</span>
                  <FontAwesomeIcon icon={faAngleDown} className={`w-5 h-5 ml-auto ${isAdminOpen ? 'rotate-0' : 'rotate-180'}`} />
                </button>
              )}


              {/* Admin Submenu */}
              {isAdminOpen && (
                <ul className="ml-6 space-y-2 font-medium">
                  <li>
                    <Link href='/compList' className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
                      {/* <img src='/images/list_main.png' alt='list' className='mx-3' /> */}
                      <Image src='/images/list_main.png' alt='img' width={25} height={25} style={{margin:"3px"}} />

                      Companies List
                    </Link>
                  </li>
                  <li>
                    {/* Add Employee button */}
                    <Link href='/company' className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
                      {/* <img src='/images/add.png' alt='list' className='mx-3' /> */}
                      <Image src='/images/add.png' alt='img' width={25} height={25} style={{margin:"3px"}} />

                      Add Company
                    </Link>
                  </li>
                  {/* Add more admin options here */}
                </ul>
              )}
            </li>




            {!shouldHideTasksDropdown && (
              <li>
                {/* Tasks Dropdown */}
                <button onClick={toggleTasks} className="flex items-center w-full p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
                  {/* <img src='/images/task.png' alt='list' /> */}
                  <Image src='/images/task.png' alt='img' width={25} height={25} style={{margin:"3px"}} />

                  <span className="ml-3">Tasks</span>
                  <FontAwesomeIcon icon={faAngleDown} className={`w-5 h-5 ml-auto ${isTasksOpen ? 'rotate-0' : 'rotate-180'}`} />
                </button>
                {/* Tasks Submenu */}
                {isTasksOpen && (
                  <ul className="ml-6 space-y-2 font-medium">
                    <li>
                      <Link href={subUsername ? "/receivedTask" : "/taskList"} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
                        {/* <img src='/images/list.png' alt='list' className='mx-3' /> */}
                        <Image src='/images/list.png' alt='img' width={25} height={25} style={{margin:"3px"}} />

                        {subUsername ? 'All Task List' : 'All Task List'}
                      </Link>
                    </li>


                    <li>
                      <Link href={subUsername ? "/completedByEmp" : "/completedTask"} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
                        {/* <img src='/images/completed.png' alt='list' className='mx-3' /> */}
                        <Image src='/images/completed.png' alt='img' width={25} height={25} style={{margin:"3px"}} />

                        {subUsername ? 'Completed Task' : 'All Task Completed'}
                      </Link>
                    </li>

                    {/* <li>
                      <Link href="completedTask" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
                        <img src='/images/completed.png' alt='list' className='mx-3' />
                        Task Completed
                      </Link>
                    </li> */}

                    <li>
                      <Link href={subUsername ? "/pendingEmp" : "/pending"} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
                        {/* <img src='/images/list.png' alt='list' className='mx-3' /> */}
                        <Image src='/images/list.png' alt='img' width={25} height={25} style={{margin:"3px"}} />

                        {subUsername ? 'Pending Tasks' : 'Tasks Pending'}
                      </Link>
                    </li>
                    {/* <li>
                      <Link href="pending" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
                        <img src='/images/completed.png' alt='list' className='mx-3' />
                        Task Pending
                      </Link>
                    </li> */}


                    <li>
                      {/* Conditional rendering of Overdue Tasks link */}
                      {subUsername ? (
                        <Link href="/overdueByEmployee"
                          className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
                          {/* <img src='/images/completed.png' alt='list' className='mx-3' /> */}
                          <Image src='/images/completed.png' alt='img' width={25} height={25} style={{margin:"3px"}} />

                          Overdue Tasks

                        </Link>
                      ) : (
                        <Link href="/overdue"
                          className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
                          {/* <img src='/images/completed.png' alt='list' className='mx-3' /> */}
                          <Image src='/images/completed.png' alt='img' width={25} height={25} style={{margin:"3px"}} />

                          Tasks Overdue

                        </Link>
                      )}
                    </li>
                    <li>
                      {subUsername ? (
                        <Link href="/taskFormInternal" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
                          {/* <img src='/images/add.png' alt='list' className='mx-3' /> */}
                          <Image src='/images/add.png' alt='img' width={25} height={25} style={{margin:"3px"}} />

                          Add Task
                        </Link>
                      ) : (
                        <Link href="/taskForm" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
                          {/* <img src='/images/add.png' alt='list' className='mx-3' /> */}
                          <Image src='/images/add.png' alt='img' width={25} height={25} style={{margin:"3px"}} />

                          Add Task
                        </Link>
                      )}
                      {/* <Link href="/taskForm" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
                        <img src='/images/add.png' alt='list' className='mx-3' />
                        Add Task
                      </Link> */}
                    </li>
                    {/* Add more tasks here */}
                  </ul>
                )}
              </li>
            )}


            {!shouldHideUserField && (
              <li>
                {/* Employee Dropdown */}
                <button onClick={toggleEmployee} className="flex items-center w-full p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
                  {/* <img src='/images/user.png' alt='list' /> */}
                  <Image src='/images/user.png' alt='img' width={25} height={25} style={{margin:"3px"}} />

                  <span className="ml-3">{username === 'javed.absoft@gmail.com' ? 'Admin' : 'User'}</span>
                  <FontAwesomeIcon icon={faAngleDown} className={`w-5 h-5 ml-auto ${isEmployeeOpen ? 'rotate-0' : 'rotate-180'}`} />
                </button>
                {/* Employee Submenu */}
                {isEmployeeOpen && (
                  <ul className="ml-6 space-y-2 font-medium">
                    <li>
                      {/* Check the username and conditionally render the appropriate link */}
                      {username === 'javed.absoft@gmail.com' ? (
                        <Link href="/empList" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
                          {/* <img src='/images/list_main.png' alt='list' className='mx-3' /> */}
                          <Image src='/images/list_main.png' alt='img' width={25} height={25} style={{margin:"3px"}} />

                          Admin List
                        </Link>
                      ) : (
                        <Link href="/subList" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
                          {/* <img src='/images/list_main.png' alt='list' className='mx-3' /> */}
                          <Image src='/images/list_main.png' alt='img' width={25} height={25} style={{margin:"3px"}} />

                          {empUsername ? 'User List' : 'Received Task'}
                        </Link>
                      )}
                    </li>
                    <li>
                      {/* Check the username and conditionally render the appropriate link */}
                      {username === 'javed.absoft@gmail.com' ? (
                        <Link href="/employee" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover-bg-gray-700 group">
                          {/* <img src='/images/addEmp.png' alt='list' className='mx-3' /> */}
                          <Image src='/images/addEmp.png' alt='img' width={25} height={25} style={{margin:"3px"}} />

                          Add Admin
                        </Link>
                      ) : (
                        <Link href="/subemp" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover-bg-gray-700 group">
                          {/* <img src='/images/addEmp.png' alt='list' className='mx-3' /> */}
                          <Image src='/images/addEmp.png' alt='img' width={25} height={25} style={{margin:"3px"}} />

                          Add User
                        </Link>
                      )}
                    </li>
                    {/* Add more employees here */}
                  </ul>
                )}
              </li>
            )}
            <li>
              {/* Lead Dropdown */}
              <button
                onClick={toggleLead}
                className="flex items-center w-full p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group"
              >
                {/* <img src="/images/add.png" alt="list" /> */}
                <Image src='/images/addEmp.png' alt='img' width={25} height={25} style={{margin:"3px"}} />

                <span className="ml-3">Lead</span>
                <FontAwesomeIcon
                  icon={faAngleDown}
                  className={`w-5 h-5 ml-auto ${isLeadOpen ? 'rotate-0' : 'rotate-180'}`}
                />
              </button>
              {/* Lead Submenu */}
              {isLeadOpen && (
                <ul className="ml-6 space-y-2 font-medium">
                  <li>
                    <Link href="/leadForm" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
                      {/* <img src="/images/add.png" alt="list" className="mx-3" /> */}
                      <Image src='/images/add.png' alt='img' width={25} height={25} style={{margin:"3px"}} />

                      Create Lead
                    </Link>
                  </li>
                  <li>
                    <Link href="/leadList" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
                      {/* <img src="/images/list_main.png" alt="list" className="mx-3" /> */}
                      <Image src='/images/main.png' alt='img' width={25} height={25} style={{margin:"3px"}} />

                      Lead List
                    </Link>
                  </li>
                  {/* Add more lead-related options here */}
                </ul>
              )}
            </li>
            {/* Add similar dropdown structures for User and Company */}
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;