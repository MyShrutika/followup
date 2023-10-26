'use client'

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp, faTableCellsLarge, faTasks, faSquareCheck, faHourglassStart, faExclamationCircle, faPenToSquare, faLinesLeaning, faSquarePlus, faBarsStaggered } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import Image from 'next/image';


const EmployeeSidebar = () => {
    const [isTasksOpen, setTasksOpen] = useState(false);
    const [isLeadOpen, setLeadOpen] = useState(false); // Add this state

    const toggleLead = () => {
        setLeadOpen(!isLeadOpen);
    };

    const toggleTasks = () => {
        setTasksOpen(!isTasksOpen);
    };


    return (
        <>

            <aside id="default-sidebar" className="fixed top-0 left-0 h-screen w-64 transition-transform -translate-x-full sm:translate-x-0 mt-16">
                <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-900 border border-gray-200">
                    <ul className="space-y-2 font-medium">
                        <li>
                            <Link href="/dashboard" className="flex items-center p-2 text-gray-950 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
                                <FontAwesomeIcon icon={faTableCellsLarge} size='xl'
                                    style={{ color: "#3ca8be", marginLeft: '5px' }} />
                                <span className="ml-3">Dashboard</span>
                            </Link>
                        </li>

                        <li>
                            <button onClick={toggleTasks} className="flex items-center w-full p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
                                <FontAwesomeIcon icon={faTasks} size='xl'
                                    style={{ color: "#your_color_here", marginLeft: '5px' }} />

                                <span className="ml-3">Tasks</span>
                                <FontAwesomeIcon icon={faAngleUp} className={`w-5 h-5 ml-auto ${isTasksOpen ? 'rotate-0' : 'rotate-180'}`} />

                            </button>

                            {isTasksOpen && (
                                <ul className="ml-6 space-y-2 font-medium">
                                    <li>
                                        <Link href="/receivedTask" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
                                            <FontAwesomeIcon icon={faTasks} size='xl'
                                                style={{ color: "purple", marginLeft: '15px' }} />
                                            <span className="ml-3 pl-1">All Tasks</span>
                                        </Link>
                                    </li>


                                    <li>
                                        <Link href="/completedByEmp" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
                                            <FontAwesomeIcon icon={faSquareCheck} size='xl'
                                                style={{ color: "#037705", marginLeft: '15px' }} />
                                            <span className="ml-3 pl-1">Completed Tasks</span>

                                        </Link>
                                    </li>

                                    <li>
                                        <Link href="/pendingEmp" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
                                            <FontAwesomeIcon icon={faHourglassStart} size='xl'
                                                style={{ color: "#2a5fbb", marginLeft: '15px' }} />
                                            <span className="ml-3 pl-2">Pending Tasks</span>

                                        </Link>
                                    </li>

                                    <li>
                                        <Link href="/overdueByEmployee"
                                            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
                                            <FontAwesomeIcon icon={faExclamationCircle} size='xl'
                                                style={{ color: "#FF5733", marginLeft: '15px' }} />
                                            <span className="ml-3 pl-1">Overdue Tasks</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/taskFormInternal" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
                                            <FontAwesomeIcon icon={faPenToSquare} size='xl' style={{ color: "#de4f35", marginLeft: '15px' }} />
                                            <span className="ml-3 pl-1">Add Task</span>

                                        </Link>
                                    </li>

                                </ul>
                            )}
                        </li>
                        <li>
                            <button
                                onClick={toggleLead}
                                className="flex items-center w-full p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group"
                            >
                                <FontAwesomeIcon icon={faLinesLeaning} size='xl'
                                    style={{ color: "#f1f524", }} />
                                <span className="ml-3 pl-2">Lead</span>

                                <FontAwesomeIcon
                                    icon={faAngleUp}
                                    className={`w-5 h-5 ml-auto ${isLeadOpen ? 'rotate-0' : 'rotate-180'}`}
                                />
                            </button>
                            {/* Lead Submenu */}
                            {isLeadOpen && (
                                <ul className="ml-6 space-y-2 font-medium">
                                    <li>
                                        <Link href="/leadFormEmp" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
                                            <FontAwesomeIcon icon={faSquarePlus} size='xl'
                                                style={{ color: "#f23a3a", marginLeft: '15px' }} />
                                            <span className="ml-3">Create Lead</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/leadListEmp" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
                                            <FontAwesomeIcon icon={faBarsStaggered} size='xl'
                                                style={{ color: "#f29d3a", marginLeft: '15px' }} />
                                            <span className="ml-3">Lead List</span>
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

export default EmployeeSidebar;






















// 'use client'

// import React, { useState } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faAngleUp, faTableCellsLarge, faTasks } from '@fortawesome/free-solid-svg-icons';
// import Link from 'next/link';
// import Image from 'next/image';


// const EmployeeSidebar = () => {
//     const [isTasksOpen, setTasksOpen] = useState(false);
//     const [isLeadOpen, setLeadOpen] = useState(false); // Add this state

//     const toggleLead = () => {
//         setLeadOpen(!isLeadOpen);
//     };

//     const toggleTasks = () => {
//         setTasksOpen(!isTasksOpen);
//     };


//     return (
//         <>

//             <aside id="default-sidebar" className="fixed top-0 left-0 h-screen w-64 transition-transform -translate-x-full sm:translate-x-0 mt-16">
//                 <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-900 border border-gray-200">
//                     <ul className="space-y-2 font-medium">
//                         <li>
//                             <Link href="/dashboard" className="flex items-center p-2 text-gray-950 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
//                                 <FontAwesomeIcon icon={faTableCellsLarge} size='xl'
//                                     style={{ color: "#3ca8be", marginLeft: '5px' }} />
//                                 <span className="ml-3">Dashboard</span>
//                             </Link>
//                         </li>

//                         <li>
//                             <button onClick={toggleTasks} className="flex items-center w-full p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
//                                 <FontAwesomeIcon icon={faTasks} size='xl'
//                                     style={{ color: "#your_color_here", marginLeft: '5px' }} />

//                                 <span className="ml-3">Tasks</span>

//                                 <FontAwesomeIcon icon={faAngleUp} className={`w-5 h-5 ml-auto ${isTasksOpen ? 'rotate-0' : 'rotate-180'}`} />
//                             </button>

//                             {isTasksOpen && (
//                                 <ul className="ml-6 space-y-2 font-medium">
//                                     <li>
//                                         <FontAwesomeIcon icon={faTasks} size='xl'
//                                             style={{ color: "#your_color_here", marginLeft: '5px' }} />

//                                         <Link href="/receivedTask" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
//                                             <Image src='/images/List.png' alt='img' width={30} height={30} />
//                                             All Task List
//                                         </Link>
//                                     </li>


//                                     <li>
//                                         <Link href="/completedByEmp" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
//                                             <Image src='/images/completed.png' alt='img' width={25} height={25} style={{ margin: "3px" }} />
//                                             All Task Completed
//                                         </Link>
//                                     </li>

//                                     <li>
//                                         <Link href="/pendingEmp" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
                                           
//                                             <Image src='/images/list.png' alt='img' width={25} height={25} style={{ margin: "3px" }} />

//                                             Tasks Pending
//                                         </Link>
//                                     </li>

//                                     <li>
//                                         <Link href="/overdueByEmployee"
//                                             className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
                                           
//                                             <Image src='/images/completed.png' alt='img' width={25} height={25} style={{ margin: "3px" }} />

//                                             Overdue Tasks

//                                         </Link>
//                                     </li>
//                                     <li>
//                                         <Link href="/taskFormInternal" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
                                           
//                                             <Image src='/images/add.png' alt='img' width={25} height={25} style={{ margin: "3px" }} />

//                                             Add Task
//                                         </Link>
//                                     </li>

//                                 </ul>
//                             )}
//                         </li>
//                         <li>
//                             <button
//                                 onClick={toggleLead}
//                                 className="flex items-center w-full p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group"
//                             >
//                                 {/* <img src="/images/add.png" alt="list" /> */}
//                                 <Image src='/images/add.png' alt='img' width={25} height={25} style={{ margin: "3px" }} />

//                                 <span className="ml-3">Lead</span>
//                                 <FontAwesomeIcon
//                                     icon={faAngleUp}
//                                     className={`w-5 h-5 ml-auto ${isLeadOpen ? 'rotate-0' : 'rotate-180'}`}
//                                 />
//                             </button>
//                             {/* Lead Submenu */}
//                             {isLeadOpen && (
//                                 <ul className="ml-6 space-y-2 font-medium">
//                                     <li>
//                                         <Link href="/leadFormEmp" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
//                                             {/* <img src="/images/add.png" alt="list" className="mx-3" /> */}
//                                             <Image src='/images/add.png' alt='img' width={25} height={25} style={{ margin: "3px" }} />

//                                             Create Lead
//                                         </Link>
//                                     </li>
//                                     <li>
//                                         <Link href="/leadListEmp" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
//                                             {/* <img src="/images/list_main.png" alt="list" className="mx-3" /> */}
//                                             <Image src='/images/list_main.png' alt='img' width={25} height={25} style={{ margin: "3px" }} />

//                                             Lead List
//                                         </Link>
//                                     </li>
//                                     {/* Add more lead-related options here */}
//                                 </ul>
//                             )}
//                         </li>
//                         {/* Add similar dropdown structures for User and Company */}
//                     </ul>
//                 </div>
//             </aside>
//         </>
//     );
// };

// export default EmployeeSidebar;