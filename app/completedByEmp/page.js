'use client'


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye,faSpinner } from '@fortawesome/free-solid-svg-icons';
import EmployeeSidebar from '../components/EmployeeSidebar';

const CompletedTaskList = () => {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewTask, setViewTask] = useState(null); // State to manage the task to be viewed

  useEffect(() => {
    const fetchCompletedTasks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/task/tasks/completedByEmp', {
          headers: {
            Authorization: localStorage.getItem('authToken'), // Include your JWT token here
          },
        });

        const completedTasksWithAssigneeNames = await Promise.all(
          response.data.completedTasks.map(async (task) => {
            const assigneeResponse = await axios.get(`http://localhost:5000/api/subemployee/${task.assignTo}`, {
              headers: {
                Authorization: localStorage.getItem('authToken'),
              },
            });
            const assigneeName = assigneeResponse.data.name;
            return { ...task, assignTo: assigneeName };
          })
        );

        setCompletedTasks(completedTasksWithAssigneeNames);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching completed tasks:', error);
        setLoading(false);
      }
    };

    fetchCompletedTasks();
  }, []);

  // Function to open the view modal for a task
  const openViewModal = (task) => {
    setViewTask(task); // Set the task to be viewed
  };

  // Function to close the view modal
  const closeViewModal = () => {
    setViewTask(null); // Clear the task to close the modal
  };

  // Check if the "subUsername" key exists in localStorage
  const hideActions = typeof window !== 'undefined' ? window.localStorage.getItem('subUsername') : null;

  return (
    <>
      <Navbar />
      {/* <Sidebar /> */}
      <EmployeeSidebar/>
      <div className="container mx-auto mt-20 m-10 pl-64">
        <h1 className="text-2xl font-semibold mb-4 text-orange-500">Completed Task List</h1>
        {loading ? (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 bg-gray-700">
            <FontAwesomeIcon
              icon={faSpinner} // Use your FontAwesome spinner icon
              spin // Add the "spin" prop to make the icon spin
              className="text-white text-4xl" // You can customize the size and color
            />
          </div>
        ) : (
          <div>
            {completedTasks.length === 0 ? (
              <p className="text-gray-600">No completed tasks found.</p>
            ) : (
              <table className="min-w-full table-auto">
                <thead className='bg-green-500 text-white'>
                  <tr>
                    <th className="px-4 py-2">Sr. No.</th>
                    <th className="px-4 py-2">Task</th>
                    <th className="px-4 py-2">Description</th>
                    <th className="px-4 py-2">Assigned To</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {completedTasks.map((task, index) => (
                    <tr key={task._id}>
                      <td className="border border-green-500 px-4 py-2 text-center">{index + 1}</td>
                      <td className="border border-green-500  px-4 py-2">
                        <div>
                          <h2 className="text-base border-green-500  font-medium text-blue-800 text-left">{task.title}</h2>
                        </div>
                      </td>
                      <td className="border px-4 py-2 text-left border-green-500 ">{task.description}</td>
                      <td className="border px-4 py-2 text-center border-green-500 ">{task.assignTo}</td>
                      <td className="border px-4 py-2 text-center border-green-500 ">
                        <span className="px-2 py-1 bg-green-200 text-green-800 rounded-full text-sm">
                          Completed
                        </span>
                      </td>
                      <td className="border px-4 py-2 text-center border-green-500 ">
                        <div className="flex items-center mx-5">
                          <FontAwesomeIcon
                            icon={faEye}
                            className="text-blue-500 hover:underline cursor-pointer text-lg"
                            onClick={() => openViewModal(task)} // Open view modal when clicked
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* View Task Modal */}
      {viewTask && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 bg-gray-700">
          <div className="bg-white p-4 w-1/2 rounded-md">
            <h2 className="text-2xl font-semibold mb-4">Task Details</h2>
            <div className='text-center'>
              <p className="mb-2 text-left justify-center">
                <strong>AssignTo:</strong> {viewTask.assignTo}
              </p>
              <p className="mb-2 text-left justify-center">
                <strong>Title:</strong> {viewTask.title}
              </p>
              <p className="mb-2 text-left justify-center">
                <strong>Description:</strong> {viewTask.description}
              </p>
              <p className="mb-2 text-left justify-center">
                <strong>Status:</strong> {viewTask.status}
              </p>
              <p className="mb-2 text-left justify-center">
                <strong>Date: </strong>{new Date(viewTask.startDate).toLocaleDateString('en-GB')}
              </p>
              <p className="mb-2 text-left justify-center">
                <strong>Start Time:</strong> {viewTask.startTime}
              </p>
              <p className="mb-2 text-left justify-center">
                <strong>DeadLine:</strong> {new Date(viewTask.deadlineDate).toLocaleDateString('en-GB')}
              </p>
              <p className="mb-2 text-left justify-center">
                <strong>End Time:</strong> {viewTask.endTime}
              </p>
              <p className="mb-2 text-left justify-center">
                <strong>Photo:</strong> {viewTask.picture}
              </p>
              <p className="mb-2 text-left justify-center">
                <strong>Audio:</strong> {viewTask.audio}
              </p>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                onClick={closeViewModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CompletedTaskList;


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Navbar from '../components/Navbar';
// import Sidebar from '../components/Sidebar';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEye } from '@fortawesome/free-solid-svg-icons';



// const CompletedTaskList = () => {
//   const [completedTasks, setCompletedTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editingTask, setEditingTask] = useState(null);

//   useEffect(() => {
//     const fetchCompletedTasks = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/api/task/tasks/completedByEmp', {
//           headers: {
//             Authorization: localStorage.getItem('authToken'), // Include your JWT token here
//           },
//         });

//         const completedTasksWithAssigneeNames = await Promise.all(
//           response.data.completedTasks.map(async (task) => {
//             const assigneeResponse = await axios.get(`http://localhost:5000/api/subemployee/${task.assignTo}`, {
//               headers: {
//                 Authorization: localStorage.getItem('authToken'),
//               },
//             });
//             const assigneeName = assigneeResponse.data.name;
//             return { ...task, assignTo: assigneeName };
//           })
//         );

//         setCompletedTasks(completedTasksWithAssigneeNames);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching completed tasks:', error);
//         setLoading(false);
//       }
//     };

//     fetchCompletedTasks();
//   }, []);

//   return (
//     <>
//       <Navbar />
//       <Sidebar />
//       <div className="container mx-auto mt-20 m-10 pl-64">
//         <h1 className="text-2xl font-semibold mb-4">Completed Task List</h1>
//         {loading ? (
//           <p className="text-gray-600">Loading completed tasks...</p>
//         ) : (
//           <div>
//             {completedTasks.length === 0 ? (
//               <p className="text-gray-600">No completed tasks found.</p>
//             ) : (
//               <table className="min-w-full table-auto">
//                 <thead>
//                   <tr>
//                     <th className="px-4 py-2">Sr. No.</th>
//                     <th className="px-4 py-2">Task</th>
//                     <th className="px-4 py-2">Description</th>
//                     <th className="px-4 py-2">Assigned To</th>
//                     <th className="px-4 py-2">Status</th>
//                     <th className="px-4 py-2 text-left">Actions</th>


//                   </tr>
//                 </thead>
//                 <tbody>
//                   {completedTasks.map((task, index) => (
//                     <tr key={task._id}>
//                       <td className="border px-4 py-2 text-center">{index + 1}</td>

//                       <td className="border px-4 py-2">
//                         {editingTask === task ? (
//                           <div>
//                             {/* Edit form */}
//                             <input
//                               type="text"
//                               value={editingTask.title}
//                               onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
//                             />
//                             <button onClick={() => saveEditedTask(editingTask)}>Save</button>
//                             <button onClick={cancelEditingTask}>Cancel</button>
//                           </div>
//                         ) : (
//                           <div>
//                             <h2 className=" text-base font-medium text-blue-800 text-center">{task.title}</h2>
//                           </div>
//                         )}
//                       </td>
//                       <td className="border px-4 py-2 text-center">{task.description}</td>
//                       <td className="border px-4 py-2 text-center">{task.assignTo}</td>
//                       <td className="border px-4 py-2 text-center">
//                         <span className="px-2 py-1 bg-green-200 text-green-800 rounded-full text-sm">
//                           Completed
//                         </span>
//                       </td>
//                       <td className="border px-4 py-2 text-center">

//                         <div className="flex items-center">
//                           <FontAwesomeIcon
//                             icon={faEye}
//                             className="text-blue-500 hover:underline cursor-pointer mx-2"
//                             onClick={() => openViewModal(task)} // Open view modal when clicked
//                           />
//                         </div>

//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         )}
//       </div>
//     </>
//   );
// };




// export default CompletedTaskList;