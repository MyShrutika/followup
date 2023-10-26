'use client'

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { faTasks } from '@fortawesome/free-solid-svg-icons';
import { faSquareCheck } from '@fortawesome/free-solid-svg-icons';
import { faHourglassStart } from '@fortawesome/free-solid-svg-icons';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faTableCellsLarge } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faLinesLeaning } from '@fortawesome/free-solid-svg-icons';
import { faClipboardList } from '@fortawesome/free-solid-svg-icons';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { faBarsStaggered } from '@fortawesome/free-solid-svg-icons';
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';



const AdminSidebar = () => {
    const [isTasksOpen, setTasksOpen] = useState(false);
    const [isEmployeeOpen, setEmployeeOpen] = useState(false);
    const [isLeadOpen, setLeadOpen] = useState(false); // Add this state

    const toggleLead = () => {
        setLeadOpen(!isLeadOpen);
    };

    const toggleTasks = () => {
        setTasksOpen(!isTasksOpen);
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
                            <Link href="/adminDashboard" className="flex items-center p-2 text-gray-950 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group mr-2">
                                <FontAwesomeIcon icon={faTableCellsLarge} size='xl'
                                    style={{ color: "#3ca8be", marginLeft: '5px' }} />
                                <span className="ml-3">Dashboard</span>
                            </Link>
                        </li>


                        <li>
                            <button onClick={toggleTasks} className="flex items-center w-full p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group mr-2">
                                <FontAwesomeIcon icon={faTasks} size='xl'
                                    style={{ color: "#your_color_here", marginLeft: '5px' }} />

                                <span className="ml-3">Tasks</span>
                                <FontAwesomeIcon
                                    icon={faAngleDown}
                                    className={`w-5 h-5 ml-auto ${isTasksOpen ? 'rotate-0' : 'rotate-180'}`}
                                />

                            </button>
                            {isTasksOpen && (
                                <ul className="ml-6 space-y-2 font-medium">
                                    <li>
                                        <Link href="/taskList" className="flex items-center p-2 text-gray-950 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
                                            <FontAwesomeIcon icon={faTasks} size='xl'
                                                style={{ color: "purple", marginLeft: '15px' }} />
                                            <span className="ml-3 pl-1">All Tasks</span>
                                        </Link>
                                    </li>
                                    <li>
                                    </li>

                                    <li>
                                        <Link href="/completedTask" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
                                            <FontAwesomeIcon icon={faSquareCheck} size='xl'
                                                style={{ color: "#037705", marginLeft: '15px' }} />
                                            <span className="ml-3 pl-1">Completed Tasks</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/pending" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
                                            <FontAwesomeIcon icon={faHourglassStart} size='xl'
                                                style={{ color: "#2a5fbb", marginLeft: '15px' }} />
                                            <span className="ml-3 pl-2">Pending Tasks</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/overdue"
                                            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
                                            <FontAwesomeIcon icon={faExclamationCircle} size='xl'
                                                style={{ color: "#FF5733", marginLeft: '15px' }} />
                                            <span className="ml-3 pl-1">Overdue Tasks</span>

                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/sendTask"
                                            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
                                            <FontAwesomeIcon icon={faPaperPlane} size='xl'
                                                style={{ color: "red", marginLeft: '15px' }} />
                                            <span className="ml-3 pl-1">Send Tasks</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/taskForm"
                                            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
                                            <FontAwesomeIcon icon={faPenToSquare} size='xl' style={{ color: "#de4f35", marginLeft: '15px' }} />
                                            <span className="ml-3 pl-1">Add Task</span>
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>


                        <li>
                            <button onClick={toggleEmployee} className="flex items-center w-full p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group mr-2" >

                                <FontAwesomeIcon icon={faUser} size='xl'
                                    style={{ color: "#2d62be", }} />
                                <span className="ml-3 pl-2">Employee</span>
                                <FontAwesomeIcon
                                    icon={faAngleDown}
                                    className={`w-5 h-5 ml-auto ${isEmployeeOpen ? 'rotate-0' : 'rotate-180'}`}
                                />

                            </button>

                            {isEmployeeOpen && (
                                <ul className="ml-6 space-y-2 font-medium">
                                    <li>
                                        <Link href="/subList" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group pl-3">
                                            <FontAwesomeIcon icon={faClipboardList} size='xl' style={{ color: "#f19513", marginLeft: '15px' }} />
                                            <span className="ml-3 pl-2">Employee List</span>
                                        </Link>

                                    </li>
                                    <li>
                                        <Link href="/subemp" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover-bg-gray-700 group pl-2">
                                            <FontAwesomeIcon icon={faUserPlus} size='xl'
                                                style={{ color: "#493927", marginLeft: '15px' }} />
                                            <span className="ml-3">Add Employee</span>
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>


                        <li>
                            <button
                                onClick={toggleLead}
                                className="flex items-center w-full p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group mr-2"
                            >
                                <FontAwesomeIcon icon={faLinesLeaning} size='xl'
                                    style={{ color: "#f1f524", }} />
                                <span className="ml-3 pl-2">Lead</span>

                                <FontAwesomeIcon
                                    icon={faAngleDown}
                                    className={`w-5 h-5 ml-auto ${isLeadOpen ? 'rotate-0' : 'rotate-180'}`}
                                />
                            </button>
                            {isLeadOpen && (
                                <ul className="ml-6 space-y-2 font-medium">
                                    <li>
                                        <Link href="/leadForm" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
                                            <FontAwesomeIcon icon={faSquarePlus} size='xl'
                                                style={{ color: "#f23a3a", marginLeft: '15px' }} />
                                            <span className="ml-3">Create Lead</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/leadList" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
                                            <FontAwesomeIcon icon={faBarsStaggered} size='xl'
                                                style={{ color: "#f29d3a", marginLeft: '15px' }} />
                                            <span className="ml-3">Lead List</span>
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

export default AdminSidebar;