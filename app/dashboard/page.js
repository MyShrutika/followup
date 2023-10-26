'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import EmployeeSidebar from '../components/EmployeeSidebar';
import Image from 'next/image';



const Dashboard = () => {
  const [taskCounts, setTaskCounts] = useState({
    totalEmployeeTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    todayAddedTasks: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTaskCounts = async () => {
      try {
        const token = localStorage.getItem('authToken');
        
        const response = await axios.get('http://localhost:5000/api/task/taskCounts', {
          headers: {
            Authorization: token,
          },
        });

        if (response.data) {
          setTaskCounts(response.data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching task counts:', error);
        setLoading(false);
      }
    };

    fetchTaskCounts();
  }, []);

  return (
    <>
    <Navbar/>
    {/* <Sidebar/> */}
    <EmployeeSidebar/>
      <h1 className="text-2xl font-semibold text-center mt-20 mb-2 pl-56">Dashboard</h1>

      <div className="flex flex-wrap justify-center mt-2 ml-64">
        <div className="w-full sm:w-1/3 md:w-1/3 lg:w-1/3 xl:w-1/3 p-7">
          <div className="bg-gray-100 p-4 rounded-2xl border border-gray-200">
            <div className="text-center mb-4">
              <i className="fa-solid fa-user-group fa-2xl my-3 text-white"></i>
            </div>
            <div className="mx-auto w-20 h-20">
              {/* <img src='/images/group.png' alt='img' className="w-full h-full p-3" /> */}
              <Image src='/images/group.png' alt='img' width={70} height={70} />

            </div>
            <div className="rounded-full bg-orange-500 text-white w-14 h-14 mx-auto flex items-center justify-center text-2xl">
              {taskCounts.totalEmployeeTasks}
            </div>

            <div className="bg-orange-500 rounded-b-2xl p-4 -m-4 mt-2 max-h-10 flex items-center justify-center">
              <h3 className="text-white text-center font-bold">Total Tasks</h3>
            </div>
          </div>
        </div>

        <div className="w-full sm:w-1/3 md:w-1/3 lg:w-1/3 xl:w-1/3 p-7">
          <div className="bg-gray-100 p-4 rounded-2xl border border-gray-200">
            <div className="text-center mb-4">
              <i className="fa-solid fa-user-group fa-2xl my-3 text-white"></i>
            </div>
            <div className="mx-auto w-20 h-20">
              {/* <img src='/images/smile.png' alt='img' className="w-full h-full p-3" /> */}
              <Image src='/images/smile.png' alt='img' width={70} height={70} />

            </div>
            <div className="rounded-full bg-green-500 text-white w-14 h-14 mx-auto flex items-center justify-center text-2xl">
              {taskCounts.completedTasks}
            </div>
            <div className="bg-green-500 rounded-b-2xl p-4 -m-4 mt-2 max-h-10 flex items-center justify-center">
              <h3 className="text-white text-center font-bold">Completed Tasks</h3>
            </div>
          </div>
        </div>

        <div className="w-full sm:w-1/3 md:w-1/3 lg:w-1/3 xl:w-1/3 p-7">
          <div className="bg-gray-100 p-4 rounded-2xl border border-gray-200">
            <div className="text-center mb-4">
              <i className="fa-solid fa-user-group fa-2xl my-3 text-white"></i>
            </div>
            <div className="mx-auto w-20 h-20">
              {/* <img src='/images/angry.png' alt='img' className="w-full h-full p-3" /> */}
              <Image src='/images/angry.png' alt='img' width={70} height={70} />

            </div>
            <div className="rounded-full bg-blue-500 text-white w-14 h-14 mx-auto flex items-center justify-center text-2xl">
              {taskCounts.pendingTasks}
            </div>
            <div className="bg-blue-500 rounded-b-2xl p-4 -m-4 mt-2 max-h-10 flex items-center justify-center">
              <h3 className="text-white text-center font-bold">Pending Tasks</h3>
            </div>
          </div>
        </div>

        <div className="w-full sm:w-1/3 md:w-1/3 lg:w-1/3 xl:w-1/3 p-7">
          <div className="bg-gray-100 p-4 rounded-2xl border border-gray-200">
            <div className="text-center mb-4">
              <i className="fa-solid fa-user-group fa-2xl my-3 text-white"></i>
            </div>
            <div className="mx-auto w-20 h-20">
              {/* <img src='/images/overangry.png' alt='img' className="w-full h-full p-3" /> */}
              <Image src='/images/overangry.png' alt='img' width={70} height={70} />

            </div>
            <div className="rounded-full bg-red-600 text-white w-16 h-16 mx-auto flex items-center justify-center text-2xl">
              {taskCounts.overdueTasks}
            </div>
            <div className="bg-red-600 rounded-b-2xl p-4 -m-4 mt-2 max-h-10 flex items-center justify-center">
              <h3 className="text-white text-center font-bold">Overdue Tasks</h3>
            </div>
          </div>
        </div>

        <div className="w-full sm:w-1/3 md:w-1/3 lg:w-1/3 xl:w-1/3 p-7">
          <div className="bg-gray-100 p-4 rounded-2xl border border-gray-200">
            <div className="text-center mb-4">
              <i className="fa-solid fa-user-group fa-2xl my-3 text-white"></i>
            </div>
            <div className="mx-auto w-20 h-20">
              {/* <img src='/images/today.png' alt='img' className="w-full h-full p-3" /> */}
              <Image src='/images/today.png' alt='img' width={70} height={70} />

            </div>
            <div className="rounded-full bg-orange-500 text-white w-16 h-16 mx-auto flex items-center justify-center text-2xl">
              {taskCounts.todayAddedTasks}
            </div>
            <div className="bg-orange-600 rounded-b-2xl p-4 -m-4 mt-2 max-h-10 flex items-center justify-center">
              <h3 className="text-white text-center font-bold">Today Added Tasks</h3>
            </div>
          </div>
        </div>

        {/* Add more similar cards here */}
      </div>
    </>
  );
};

export default Dashboard;

