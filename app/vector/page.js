'use client'

import React, { useEffect, useState } from "react";
import { Chart } from "chart.js";
import axios from "axios";
import Navbar from "../components/Navbar";
import AdminSidebar from "../components/AdminSidebar";
import NavSide from "../components/NavSide";

const Vector = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get("http://localhost:5000/api/task/adminTaskCounts", {
          headers: {
            Authorization: token,
          },
        });
        console.log(response.data)
        if (response.data) {
          // Extract the data you want to display in the chart
          const taskCounts = response.data;
          const chartData = [taskCounts.totalEmployeeTasks, taskCounts.completedTasks, taskCounts.pendingTasks, taskCounts.overdueTasks, taskCounts.todayAddedTasks,taskCounts.sendTasks];

          setChartData(chartData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let ctx = document.getElementById("myChart").getContext("2d");
    let myChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: chartData,
            borderColor: ["rgb(128, 0, 128)", "rgb(0, 71, 171)", "rgb(210, 4, 45)", "rgb(34, 139, 34)", "rgb(205, 127, 50)", "rgb(255, 215, 0)"],
            backgroundColor: ["rgb(128, 0, 128)", "rgb(0, 71, 171)", "rgb(210, 4, 45)", "rgb(34, 139, 34)", "rgb(205, 127, 50)", "rgb(255, 215, 0)" ],
            borderWidth: 2,
          },
        ],
        labels: ["Total Tasks", "Pending Tasks", "Overdue Tasks", "Completed Tasks", "Today Added Tasks", "Send Tasks"],
      },
      options: {
        legend: {
          display: true,
          position: 'right', // Display the legend on the right side
          align: 'center', // Center align the legend
          labels: {
            usePointStyle: true, // Use point-style labels (optional)
          },
        },
        hover: false, // Disable hover effect
        scales: {
          xAxes: [
            {
              display: false,
            },
          ],
          yAxes: [
            {
              display: false,
            },
          ],
        },
      },
    });
  }, [chartData]);

  return (
    <>
      {/* <Navbar />
      <AdminSidebar /> */}
      <NavSide/>
      <h1 className="w-[150px] mx-auto text-2xl font-semibold capitalize mt-20 text-center text-blue-700">Dashboard</h1>
      <div className="w-[1100px] h-screen flex mx-auto my-auto pl-28">
        <div className="pt-0 rounded-xl w-full h-fit my-auto mt-4 text-center">
          <canvas id="myChart"></canvas>
        </div>
      </div>
    </>
  );
};

export default Vector;










// 'use client'

// import React, { useEffect, useState } from "react";
// import { Chart } from "chart.js";
// import axios from "axios";
// import Navbar from "../components/Navbar";
// import AdminSidebar from "../components/AdminSidebar";

// const Vector = () => {
//   const [chartData, setChartData] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = localStorage.getItem("authToken");
//         const response = await axios.get("http://localhost:5000/api/task/adminTaskCounts", {
//           headers: {
//             Authorization: token,
//           },
//         });

//         if (response.data) {
//           // Extract the data you want to display in the chart
//           const taskCounts = response.data;
//           const chartData = [taskCounts.totalEmployeeTasks, taskCounts.completedTasks, taskCounts.pendingTasks, taskCounts.overdueTasks, taskCounts.todayAddedTasks];

//           setChartData(chartData);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, []);


//   // ... (previous code)

// useEffect(() => {
//   let ctx = document.getElementById("myChart").getContext("2d");
//   let myChart = new Chart(ctx, {
//     type: "doughnut",
//     data: {
//       datasets: [
//         {
//           data: chartData,
//           borderColor: ["rgb(75, 192, 192)", "rgb(255, 205, 86)", "rgb(255, 99, 132)", "rgb(150, 91, 129)", "rgb(80, 79, 100)"],
//           backgroundColor: ["rgb(75, 192, 192)", "rgb(255, 205, 86)", "rgb(255, 99, 132)", "rgb(150, 91, 129)", "rgb(80, 79, 100)"],
//           borderWidth: 2,
//         },
//       ],
//       labels: ["Total Employee Tasks", "Completed Tasks", "Pending Tasks", "Overdue Tasks", "Today Added Tasks"],
//     },
//     options: {
//       legend: {
//         display: true,
//         position: 'right', // Display the legend on the right side
//         align: 'center', // Center align the legend
//         labels: {
//           usePointStyle: true, // Use point-style labels (optional)
//         },
//       },
//       hover: false, // Disable hover effect
//       scales: {
//         xAxes: [
//           {
//             display: false,
//           },
//         ],
//         yAxes: [
//           {
//             display: false,
//           },
//         ],
//       },
//     },
//   });
// }, [chartData]);

// ... (remaining code)


//   useEffect(() => {
//     let ctx = document.getElementById("myChart").getContext("2d");
//     let myChart = new Chart(ctx, {
//       type: "doughnut",
//       data: {
//         datasets: [
//           {
//             data: chartData,
//             borderColor: ["rgb(75, 192, 192)", "rgb(255, 205, 86)", "rgb(255, 99, 132)", "rgb(150, 91, 129)", "rgb(80, 79, 100)"],
//             backgroundColor: ["rgb(75, 192, 192)", "rgb(255, 205, 86)", "rgb(255, 99, 132)", "rgb(150, 91, 129)", "rgb(80, 79, 100)"],
//             borderWidth: 2,
//           },
//         ],
//         labels: ["Total Employee Tasks", "Completed Tasks", "Pending Tasks", "Overdue Tasks", "Today Added Tasks"],
//       },
//       options: {
//         legend: {
//           position: 'bottom', // Display the legend at the bottom
//         },
//         scales: {
//           xAxes: [
//             {
//               display: false,
//             },
//           ],
//           yAxes: [
//             {
//               display: false,
//             },
//           ],
//         },
//       },
//     });
//   }, [chartData]);
  

//   return (
//     <>
//       <Navbar />
//       <AdminSidebar />
//       <h1 className="w-[150px] mx-auto text-xl font-semibold capitalize mt-28 "></h1>
//       <div className="w-[1100px] h-screen flex mx-auto my-auto pl-28">
//         <div className="pt-0 rounded-xl w-full h-fit my-auto pb-2">
//           <canvas id="myChart"></canvas>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Vector;
