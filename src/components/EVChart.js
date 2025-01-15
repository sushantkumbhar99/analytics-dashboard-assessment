 
// import React, { useContext, useEffect } from "react";
// import { Bar } from "react-chartjs-2";
// import { DataContext } from "../data/DataContext";

// import {
//     CategoryScale,
//     LinearScale,
//     Chart as ChartJS,
//     BarElement,
//     Tooltip,
//     Legend,
// } from "chart.js";

// // Registering required components
// ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// const EVChart = () => {
//     const jsonData = useContext(DataContext);

//     if (!jsonData || jsonData.length === 0) {
//         return <p>Loading data...</p>;
//     }

//     // Aggregate vehicle counts by manufacturer
//     const manufacturerCounts = jsonData.reduce((acc, item) => {
//         acc[item.Make] = (acc[item.Make] || 0) + 1;
//         return acc;
//     }, {});

//     // Sort manufacturers by total vehicle count in descending order
//     const sortedManufacturers = Object.entries(manufacturerCounts)
//         .sort((a, b) => b[1] - a[1]) // Sort by count descending
//         .slice(0, 5); // Get the top 5 manufacturers

//     // Get the names and counts of the top 5 manufacturers
//     const topManufacturers = sortedManufacturers.map(([make]) => make);
//     const topCounts = sortedManufacturers.map(([_, count]) => count);

//     // Prepare dataset
//     const vehicleTypes = [
//         ...new Set(jsonData.map((item) => item["Electric Vehicle Type"])),
//     ];

//     const datasets = vehicleTypes.map((type) => ({
//         label: type,
//         data: topManufacturers.map(
//             (make) =>
//                 jsonData.filter(
//                     (item) => item.Make === make && item["Electric Vehicle Type"] === type
//                 ).length
//         ),
//         backgroundColor:
//             type === "Battery Electric Vehicle (BEV)"
//                 ? "rgba(75, 192, 192, 0.6)"
//                 : "rgba(255, 99, 132, 0.6)",
//     }));

//     const data = {
//         labels: topManufacturers,
//         datasets: datasets,
//     };

//     const options = {
//         responsive: true,
//         plugins: {
//             title: {
//                 display: true,
//                 text: "Top 5 Electric Vehicle Types by Make",
//             },
//             legend: {
//                 position: "top",
//             },
//         },
//         scales: {
//             x: {
//                 title: {
//                     display: true,
//                     text: "Car Manufacturers",
//                 },
//             },
//             y: {
//                 title: {
//                     display: true,
//                     text: "Count of Vehicles",
//                 },
//             },
//         },
//     };

//     return (
//         <div className=" h-[300px] w-full max-w-full  m-auto rounded-lg shadow-lg">
//             <h5 className="text-xl font-bold  text-center">
//                 Electric Vehicle Types by Manufacturer
//             </h5>
//             <Bar    data={data} options={options} />

//         </div>
//     );
// };

// export default EVChart;


import React, { useContext, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { DataContext } from "../data/DataContext";

import {
    CategoryScale,
    LinearScale,
    Chart as ChartJS,
    BarElement,
    Tooltip,
    Legend,
} from "chart.js";

// Registering required components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// Shimmer effect component
const Shimmer = () => {
    return (
        <div className="h-[300px] w-full max-w-full m-auto rounded-lg shadow-lg animate-pulse bg-gray-200">
            <div className="h-[200px] bg-gray-300 rounded-lg"></div>
            <div className="h-6 mt-4 bg-gray-300 rounded-md"></div>
        </div>
    );
};

const EVChart = () => {
    const jsonData = useContext(DataContext);

    // Display shimmer effect while loading data
    if (!jsonData || jsonData.length === 0) {
        return <Shimmer />;
    }

    // Use useMemo to memoize manufacturer counts calculation and datasets creation
    const { topManufacturers, datasets } = useMemo(() => {
        // Aggregate vehicle counts by manufacturer, filter out invalid data
        const manufacturerCounts = jsonData.reduce((acc, item) => {
            if (item.Make && item["Electric Vehicle Type"]) {
                acc[item.Make] = (acc[item.Make] || 0) + 1;
            }
            return acc;
        }, {});

        // Sort manufacturers by total vehicle count in descending order
        const sortedManufacturers = Object.entries(manufacturerCounts)
            .sort((a, b) => b[1] - a[1]) // Sort by count descending
            .slice(0, 5); // Get the top 5 manufacturers

        // Get the names and counts of the top 5 manufacturers
        const topManufacturers = sortedManufacturers.map(([make]) => make);
        const topCounts = sortedManufacturers.map(([_, count]) => count);

        // Prepare dataset with valid vehicle types only
        const vehicleTypes = [
            ...new Set(
                jsonData
                    .filter((item) => item["Electric Vehicle Type"])
                    .map((item) => item["Electric Vehicle Type"])
            ),
        ];

        const datasets = vehicleTypes.map((type) => ({
            label: type,
            data: topManufacturers.map(
                (make) =>
                    jsonData.filter(
                        (item) =>
                            item.Make === make &&
                            item["Electric Vehicle Type"] === type
                    ).length
            ),
            backgroundColor:
                type === "Battery Electric Vehicle (BEV)"
                    ? "rgba(75, 192, 192, 0.6)"
                    : "rgba(255, 99, 132, 0.6)",
        }));

        return { topManufacturers, datasets };
    }, [jsonData]);

    const data = {
        labels: topManufacturers,
        datasets: datasets,
    };

    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: "Top 5 Electric Vehicle Types by Make",
            },
            legend: {
                position: "top",
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Car Manufacturers",
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Count of Vehicles",
                },
            },
        },
    };

    return (
        <div className="h-[300px] w-full max-w-full m-auto rounded-lg shadow-lg">
            <h5 className="text-xl font-bold text-center">
                Electric Vehicle Types by Manufacturer
            </h5>
            <Bar data={data} options={options} />
        </div>
    );
};

export default EVChart;
