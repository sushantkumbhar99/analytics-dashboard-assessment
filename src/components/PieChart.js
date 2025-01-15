 

import React, { useContext } from "react";
import { Pie } from "react-chartjs-2";
import { DataContext } from "../data/DataContext";
import { Chart as ChartJS, Tooltip, Legend, ArcElement } from "chart.js";

// Register required components for Chart.js
ChartJS.register(Tooltip, Legend, ArcElement);

// Shimmer effect component
const Shimmer = () => {
  return (
      <div className="h-[300px] w-full max-w-full m-auto rounded-lg shadow-lg animate-pulse bg-gray-200">
          <div className="h-[200px] bg-gray-300 rounded-lg"></div>
          <div className="h-6 mt-4 bg-gray-300 rounded-md"></div>
      </div>
  );
};


const PieChart = () => {
  const jsonData = useContext(DataContext);

  if (!jsonData || jsonData.length === 0) {
    return  <Shimmer/>
  }

  // Calculate eligible and not eligible counts
  const totalVehicles = jsonData.length;
  const eligibleVehicles = jsonData.filter(
    (item) =>
      item["Clean Alternative Fuel Vehicle (CAFV) Eligibility"] ===
      "Clean Alternative Fuel Vehicle Eligible"
  ).length;

  // Calculate percentages
  const eligiblePercentage = ((eligibleVehicles / totalVehicles) * 100).toFixed(
    2
  );
  const notEligiblePercentage = (100 - eligiblePercentage).toFixed(2);

  // Chart data
  const data = {
    labels: ["Eligible", "Not Eligible"],
    datasets: [
      {
        data: [eligiblePercentage, notEligiblePercentage],
        backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"],
        hoverBackgroundColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "CAFV Eligibility Breakdown",
      },
    },
  };

  return (
    <div className="flex flex-wrap md:flex-nowrap md:h-[100%] h-auto mx-auto shadow-lg p-4 rounded-lg items-stretch gap-4 overflow-hidden">
      {/* Chart Section */}
      <div className="w-full md:w-1/2">
        <Pie data={data} options={options} />
      </div>

      {/* Text Section */}
      <div className="w-full md:w-1/2 flex flex-col items-center  justify-center   space-y-4">
 
  <p className="  font-semibold text-stone-800 ">
    Breakdown of electric vehicles eligible for the CAFV program.
  </p>
 
</div>
    </div>
  );
};

export default PieChart;
