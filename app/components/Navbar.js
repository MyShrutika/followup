'use client'


import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt, faBell, faEnvelope, faBars, faTasks, faSquareCheck, faHourglassStart, faExclamationCircle, faPenToSquare, faTableCellsLarge, faLinesLeaning, faClipboardList, faUserPlus, faBarsStaggered, faSquarePlus, faPaperPlane, faAngleDown }from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [profilePictureURL, setProfilePictureURL] = useState(null);
  const [role, setRole] = useState('Admin');
  const [newTasks, setNewTasks] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0); // State variable for notification count
  const [envelopeNotifications, setEnvelopeNotifications] = useState([]); // State variable for envelope (lead) notifications
  const [envelopeNotificationCount, setEnvelopeNotificationCount] = useState(0); // Count of envelope notifications
  const [isLeadDropdownOpen, setLeadDropdownOpen] = useState(false); // State variable for lead dropdown
  const [isLeadModalOpen, setLeadModalOpen] = useState(false);
  const [selectedLeadNotification, setSelectedLeadNotification] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false); // Add state for sidebar
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

  const router = useRouter();

  const toggleLeadDropdown = () => {
    setLeadDropdownOpen(!isLeadDropdownOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };
  const toggleSidebar = () => { // Function to toggle the sidebar
    setSidebarOpen(!isSidebarOpen);
  };

  const openLeadModal = (notification) => {
    setSelectedLeadNotification(notification);
    setLeadModalOpen(true);
  };

  const closeLeadModal = () => {
    setSelectedLeadNotification(null);
    setLeadModalOpen(false);
  };


  const handleLeadNotificationClick = async (notification) => {
    try {
      if (!notification.clicked) {
        // Mark the notification as clicked in the local state
        const updatedEnvelopeNotifications = envelopeNotifications.map((envelopeNotification) => {
          if (envelopeNotification._id === notification._id) {
            return { ...envelopeNotification, clicked: true };
          }
          return envelopeNotification;
        });

        // Filter out the viewed notification from the list
        const filteredNotifications = updatedEnvelopeNotifications.filter(
          (envelopeNotification) => envelopeNotification._id !== notification._id
        );

        setEnvelopeNotifications(filteredNotifications);

        // Update the envelope notification count
        const updatedCount = envelopeNotificationCount - 1;
        setEnvelopeNotificationCount(updatedCount);

        setSelectedLeadNotification(notification);
        setLeadModalOpen(true);

        // Call the provided API endpoint to mark the notification as read on the server
        await axios.put(`http://localhost:5000/api/lead/notifications/${notification._id}`, null, {
          headers: {
            Authorization: localStorage.getItem('authToken'),
          },
        });

        setLeadDropdownOpen(false);
      }
    } catch (error) {
      console.error('Error handling lead notification click:', error);
    }
  };

  const handleTaskClick = async (task) => {
    setSelectedTask(task);
    setShowNotifications(false);
    openModal();

    // Update the task's status as clicked and decrement the notification count
    const updatedNewTasks = newTasks.map((newTask) => {
      if (newTask._id === task._id) {
        return { ...newTask, clicked: true };
      }
      return newTask;
    });
    setNewTasks(updatedNewTasks);
    localStorage.setItem('newTasks', JSON.stringify(updatedNewTasks));

    // Update the notification count
    setNotificationCount((prevCount) => prevCount - 1);

    // Mark the notification as read on the server
    try {
      await axios.put(`http://localhost:5000/api/notification/${task._id}/read`, null, {
        headers: {
          Authorization: localStorage.getItem('authToken'),
        },
      });
    } catch (error) {
      console.error('Error marking notification as read on the server:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('empUsername');
    localStorage.removeItem('subUsername');
    router.push('/login');
  };

  const fetchAssignedByName = async (taskId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/employee/${taskId}`, {
        headers: {
          Authorization: localStorage.getItem('authToken'),
        },
      });

      if (response.status === 200) {
        return response.data.name;
      }
    } catch (error) {
      console.error('Error fetching assigned by name:', error);
    }
  };

  const fetchNotifications = useCallback(async () => {
    try {

      const empUsername = localStorage.getItem('empUsername');
      if (!empUsername && typeof window !== 'undefined') {

        const response = await axios.get('http://localhost:5000/api/notification/notifications', {
          headers: {
            Authorization: localStorage.getItem('authToken'),
          },
        });

        if (response.status === 200) {
          const notifications = response.data;

          // Map the notifications to add 'assignedByName' property
          const updatedNotifications = await Promise.all(
            notifications.map(async (task) => {
              // Fetch assignedByName for each task
              task.assignedByName = await fetchAssignedByName(task.userId);
              return task;
            })
          );

          setNewTasks(updatedNotifications);

          // Calculate the initial notification count
          const initialNotificationCount = updatedNotifications.filter((task) => !task.clicked).length;
          setNotificationCount(initialNotificationCount);
        }
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }, [fetchAssignedByName]);

  const fetchEnvelopeNotifications = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/lead/notifications');

      if (response.status === 200) {
        const notifications = response.data;
        console.log(notifications)
        // Filter out envelope notifications (lead notifications)
        const envelopeNotifications = notifications.filter((notification) => {
          return notification; // Adjust this condition based on your API response
        });

        setEnvelopeNotifications(envelopeNotifications);

        // Calculate the initial envelope notification count
        const initialEnvelopeNotificationCount = envelopeNotifications.filter((notification) => !notification.clicked).length;
        setEnvelopeNotificationCount(initialEnvelopeNotificationCount);
      }
    } catch (error) {
      console.error('Error fetching envelope notifications:', error);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const subUsername = localStorage.getItem('subUsername');
      const newRole = subUsername ? 'Employee' : 'Admin';
      setRole(newRole);
    }
  }, []);

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

  useEffect(() => {
    fetchNotifications();
    fetchEnvelopeNotifications();
  }, []);

  useEffect(() => {
    const storedProfilePictureURL = localStorage.getItem('profilePictureURL');

    if (storedProfilePictureURL) {
      setProfilePictureURL(storedProfilePictureURL);
    }
  }, []);

  const handleProfilePictureUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);
      const response = await axios.post('http://localhost:5000/api/task/upload-profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const newProfilePictureURL = response.data.profilePictureURL;

      localStorage.setItem('profilePictureURL', newProfilePictureURL);

      setProfilePictureURL(newProfilePictureURL);
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

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  function formatDateTime(dateTimeString) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const date = new Date(dateTimeString);
    const formattedDate = date.toLocaleDateString('en-GB', options);

    const timeOptions = { hour: '2-digit', minute: '2-digit' };
    const formattedTime = date.toLocaleTimeString(undefined, timeOptions);
    return `${formattedDate} ${formattedTime}`;
  }

  return (

    <>
      <nav className="fixed top-0 left-0 right-0 bg-cyan-500 text-white body-font">
        <div className="container mx-auto flex flex-wrap p-4 flex-col md:flex-row items-center justify-between">
          <div className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
            <span className="ml-3 text-xl text-black">{role}</span>
          </div>
          <button className="md:hidden" onClick={toggleSidebar}> {/* Hamburger icon for mobile */}
            <FontAwesomeIcon icon={faBars} className="text-black text-xl cursor-pointer" />
          </button>

          <div className="relative inline-block text-left dropdown mr-3">
            <button
              onClick={handleNotificationClick}
              className="dropdown-toggle text-white flex items-center focus:outline-none"
              style={{ marginLeft: '1000px' }}
            >
              <FontAwesomeIcon icon={faBell} className="text-2xl fa-lg justify-between" />
              {notificationCount > 0 && (
                <span className="bg-red-500 text-white rounded-full w-4 h-4 text-xs text-center absolute top-0 right-0 -mt-1 -mr-1">
                  {notificationCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="origin-top-right absolute right-0 mt-3 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div
                  className="py-1"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="notifications-menu"
                >
                  {newTasks.length > 0 ? (
                    newTasks.map((task, index) => (
                      <div
                        key={index}
                        className={`px-4 py-2 text-sm text-gray-700 hover:bg-gray-300 cursor-pointer ${task.clicked ? 'bg-red-500' : ''
                          }`}
                        role="menuitem"
                        onClick={() => handleTaskClick(task)}
                      >
                        <div className='mx-2'>
                          <div className='my-2'><strong>{task.assignedByName}</strong> <span className='mx-7'>{formatDateTime(task.createdAt)}
                          </span></div>
                          <div className='my-1'><strong>{task.message}</strong></div>
                          <div className='my-1'><strong>Title :</strong> {task.title}</div>
                          <div className='mb-3'><strong>Task ID :</strong> {task._id.slice(17, 23)}</div>
                          <hr />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-700">
                      No new notifications.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={toggleLeadDropdown}
            className="dropdown-toggle text-white flex items-center focus:outline-none mr-3"
          >
            <FontAwesomeIcon icon={faEnvelope} className="text-2xl fa-lg justify-between" />
            {envelopeNotificationCount > 0 && (
              <span className="bg-red-500 text-white rounded-full w-4 h-4 text-xs text-center absolute m-4 mt-0 -mr-2">
                {envelopeNotificationCount}
              </span>
            )}
          </button>

          {isLeadDropdownOpen && (
            <div
              className="origin-top-right absolute right-0 mt-3 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
              style={{ top: '3rem', right: 0 }} // Adjust the top value to control the vertical position
            >              <div
              className="py-1"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="lead-notifications-menu"
            >
                {envelopeNotifications.length > 0 ? (
                  envelopeNotifications.map((notification, index) => (
                    <div
                      key={index}
                      className={`px-4 py-2 text-sm text-gray-700 hover:bg-gray-300 cursor-pointer ${notification.clicked ? 'bg-red-500' : ''
                        }`}
                      role="menuitem"
                      onClick={() => handleLeadNotificationClick(notification)}
                    >

                      <div className="mb-2"><strong>{notification.message}</strong></div>
                      <div className="mb-2"><strong>Title:</strong> {notification.description}</div>
                      <div className="mb-2"><strong>Created By:</strong> {notification.assignedByName}</div>
                      {/* Render lead notification content here */}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-700">No new lead notifications.</div>
                )}
              </div>
            </div>
          )}


          <div className="relative inline-block text-left dropdown">
            <button
              onClick={toggleDropdown}
              className="dropdown-toggle text-black flex items-center focus:outline-none"
            >
              {profilePictureURL ? (
                <div className="profile-picture-container">
                  <Image
                    src={profilePictureURL}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="profile-picture"
                  />
                </div>
              ) : (
                <Image
                  src="/images/man.png"
                  alt="User"
                  width={28}
                  height={28}
                  className="profile-picture"
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
                    className="px-4 py-1 text-sm text-gray-700 hover:bg-gray-300 hover:text-gray-900 flex items-center font-normal"
                  >
                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                    User Profile Picture
                  </Link>
                  <button
                    onClick={logout}
                    className="px-4 py-1 w-full text-left text-sm text-gray-900 hover:bg-gray-300 hover-text-gray-900 flex items-center font-semibold"
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

      {isModalOpen && (
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
              className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover-bg-gray-200 hover-text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark-hover-bg-gray-600 dark-hover-text-white"
              onClick={() => closeModal()}
            >
              {/* Close button icon */}
            </button>
            <div className="p-1 text-center">
              <h3 className="mb-5 text-lg font-semibold text-gray-800 dark-text-gray-400">
                Task Details
              </h3>
              <div>
                <p className="mb-2 text-left justify-center">
                  <strong>Title:</strong> {selectedTask.title}
                </p>
                <p className="mb-2 text-left justify-center">
                  <strong>Description:</strong> {selectedTask.description}
                </p>
                <p className="mb-2 text-left justify-center">
                  <strong>Status:</strong> {selectedTask.status}
                </p>
                <p className="mb-2 text-left justify-center">
                  <strong>Start Date:</strong> {formatDateTime(selectedTask.startDate)}
                </p>
                <p className="mb-2 text-left justify-center">
                  <strong>Start Time:</strong> {selectedTask.startTime}
                </p>
                <p className="mb-2 text-left justify-center">
                  <strong>Deadline Date:</strong> {formatDateTime(selectedTask.deadlineDate)}
                </p>
                <p className="mb-2 text-left justify-center">
                  <strong>End Time:</strong> {selectedTask.endTime}
                </p>
                <p className="mb-2 text-left justify-center">
                  <strong>Assigned By:</strong> {selectedTask.assignedByName}
                </p>
              </div>
              <button
                type="button"
                className="bg-blue-500 hover-bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                onClick={() => closeModal()}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isLeadModalOpen && selectedLeadNotification && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-container bg-white w-96 p-6 rounded shadow-lg" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover-bg-gray-200 hover-text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark-hover-bg-gray-600 dark-hover-text-white"
              onClick={closeLeadModal}
            >
              {/* Close button icon */}
            </button>
            <div className="p-1 text-center">
              <h3 className="mb-5 text-lg font-semibold text-gray-800 dark-text-gray-400">
                Lead Details
              </h3>
              <div>
                <p className="mb-2 text-left justify-center">
                  <strong>Created By : </strong><strong>{selectedLeadNotification.assignedByName}</strong>
                </p>
                <p className="mb-2 text-left justify-center">
                  <strong>Title:</strong> {selectedLeadNotification.description}
                </p>

                <p className="mb-2 text-left justify-center">
                  <strong>Customer Name:</strong> {selectedLeadNotification.customerName}
                </p>
                <p className="mb-2 text-left justify-center">
                  <strong>Company Name:</strong> {selectedLeadNotification.companyName}
                </p>
                <p className="mb-2 text-left justify-center">
                  <strong>Contact No:</strong> {selectedLeadNotification.contactNo}
                </p>
                <p className="mb-2 text-left justify-center">
                  <strong>Email Id:</strong> {selectedLeadNotification.email}
                </p>
                <p className="mb-2 text-left justify-center">
                  <strong>Owner Name:</strong> {selectedLeadNotification.ownerName}
                </p>
                <p className="mb-2 text-left justify-center">
                  <strong>Website:</strong> {selectedLeadNotification.website}
                </p>
                {/* Add more lead notification details here */}
              </div>
              <button
                type="button"
                className="bg-blue-500 hover-bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                onClick={closeLeadModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {isSidebarOpen && (
        <div className="fixed top-0 left-0 h-screen w-64 text-white p-4 md:w-1/5 lg:w-1/6 xl:w-1/6 mt-48">
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
                          style={{ color: "purple" }} />
                        <span className="ml-1">All Tasks</span>
                      </Link>
                    </li>
                    <li>
                    </li>

                    <li>
                      <Link href="/completedTask" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
                        <FontAwesomeIcon icon={faSquareCheck} size='xl'
                          style={{ color: "#037705" }} />
                        <span className="ml-1">Completed Tasks</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/pending" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
                        <FontAwesomeIcon icon={faHourglassStart} size='xl'
                          style={{ color: "#2a5fbb" }} />
                        <span className="ml-1">Pending Tasks</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/overdue"
                        className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
                        <FontAwesomeIcon icon={faExclamationCircle} size='xl'
                          style={{ color: "#FF5733" }} />
                        <span className="ml-1">Overdue Tasks</span>

                      </Link>
                    </li>
                    <li>
                      <Link href="/sendTask"
                        className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
                        <FontAwesomeIcon icon={faPaperPlane} size='xl'
                          style={{ color: "red" }} />
                        <span className="ml-1">Send Tasks</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/taskForm"
                        className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
                        <FontAwesomeIcon icon={faPenToSquare} size='xl' style={{ color: "#de4f35" }} />
                        <span className="ml-1">Add Task</span>
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
                        <FontAwesomeIcon icon={faClipboardList} size='xl' style={{ color: "#f19513" }} />
                        <span className="ml-1">Employee List</span>
                      </Link>

                    </li>
                    <li>
                      <Link href="/subemp" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover-bg-gray-700 group pl-2">
                        <FontAwesomeIcon icon={faUserPlus} size='xl'
                          style={{ color: "#493927" }} />
                        <span className="ml-1">Add Employee</span>
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
                          style={{ color: "#f23a3a" }} />
                        <span className="ml-1">Create Lead</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/leadList" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
                        <FontAwesomeIcon icon={faBarsStaggered} size='xl'
                          style={{ color: "#f29d3a"}} />
                        <span className="ml-1">Lead List</span>
                      </Link>

                    </li>
                  </ul>
                )}
              </li>
            </ul>
          </div>        </div>
      )}
    </>
  );
};

export default Navbar;