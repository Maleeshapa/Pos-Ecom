// import React, { useEffect, useRef } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css'; // Use Bootstrap for layout

// //generate random color
// const getRandomColor = () => {
//     const r = Math.floor(Math.random() * 100);
//     const g = Math.floor(Math.random() * 100);
//     const b = Math.floor(Math.random() * 100);
//     const a = Math.random().toFixed(2);
//     return `rgba(${r}, ${g}, ${b}, ${a})`;
// };

// const CardThree = ({ stockSize, labels }) => {
//     const chartRef = useRef(null);

//     useEffect(() => {
//         //random color for each bar
//         const backgroundColors = stockSize.map(() => getRandomColor());
//         const borderColors = stockSize.map(() => getRandomColor());

//         const data = {
//             labels: labels,
//             datasets: [
//                 {
//                     label: 'Stock',
//                     data: stockSize,
//                     backgroundColor: backgroundColors,
//                     borderColor: borderColors,
//                     borderWidth: 1,
//                 },
//             ],
//         };

//         const config = {
//             type: 'bar',
//             data: data,
//             options: {
//                 responsive: true,
//                 maintainAspectRatio: false,
//                 scales: {
//                     y: {
//                         beginAtZero: true,
//                     },
//                 },
//                 plugins: {
//                     legend: {
//                         position: 'top',
//                     },
//                     title: {
//                         display: true,
//                         color: getRandomColor(),
//                     },
//                 },
//             },
//         };

//         const myBarChart = new window.Chart(chartRef.current, config);

//         return () => {
//             myBarChart.destroy();
//         };
//     }, [stockSize, labels]);

//     return (
//         <div className="bg-white mb-3" style={{ height: '400px' }}>
//             <div className="card-header">Current Stock Bar Chart</div>
//             <div className="card-body">
//                 <div style={{ position: 'relative', height: '400px', width: '100%' }}>
//                     <canvas ref={chartRef}></canvas>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default CardThree;

import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import config from "../../config";

// Generate random colors for chart bars
const getRandomColor = () => {
    const r = Math.floor(Math.random() * 100);
    const g = Math.floor(Math.random() * 100);
    const b = Math.floor(Math.random() * 100);
    const a = Math.random().toFixed(2);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
};

// Function to truncate long labels
const truncateLabel = (label, maxLength = 15) => {
    return label.length > maxLength ? label.substring(0, maxLength) + "..." : label;
};

const CardThree = () => {
    const chartRef = useRef(null);
    const [incomeData, setIncomeData] = useState([]);

    useEffect(() => {
        const fetchTransactionsData = async () => {
            try {
                const transactionsResponse = await fetch(`${config.BASE_URL}/api/transactions/month`);
                const transactions = await transactionsResponse.json();
                console.log("Fetched Transactions Data:", transactions); // Debugging

                const currentMonth = new Date().getMonth() + 1;
                const currentYear = new Date().getFullYear();

                const filteredTransactions = transactions.filter(transaction => {
                    if (!transaction.createdAt) return false;
                    const transactionDate = new Date(transaction.createdAt);
                    return transactionDate.getMonth() + 1 === currentMonth && transactionDate.getFullYear() === currentYear;
                });

                console.log("Filtered Transactions (Current Month):", filteredTransactions); // Debugging

                const incomeMap = {};
                filteredTransactions.forEach(transaction => {
                    const productId = transaction.pId;
                    if (!incomeMap[productId]) {
                        incomeMap[productId] = 0;
                    }
                    incomeMap[productId] += transaction.paidAmount || 0;
                });

                const productResponse = await fetch(`${config.BASE_URL}/products`);
                const products = await productResponse.json();
                console.log("Fetched Products Data:", products); // Debugging

                const productMap = {};
                products.forEach(product => {
                    productMap[product.productId] = product.productName;
                });

                const chartData = Object.keys(incomeMap).map(productId => ({
                    productName: productMap[productId] || "Nothing To Show",
                    totalIncome: incomeMap[productId]
                }));

                console.log("Final Chart Data:", chartData); // Debugging
                setIncomeData(chartData);
            } catch (error) {
                console.error("Error fetching transactions data:", error);
            }
        };

        fetchTransactionsData();
    }, []);

    useEffect(() => {
        if (incomeData.length === 0) {
            console.log("No data available for chart.");  // Debugging
            return;
        }

        console.log("Rendering Chart with Data:", incomeData);  // Debugging

        const labels = incomeData.map(item => item.productName);
        const incomeValues = incomeData.map(item => item.totalIncome);
        const backgroundColors = incomeValues.map(() => getRandomColor());
        const borderColors = incomeValues.map(() => getRandomColor());

        const data = {
            labels,
            datasets: [
                {
                    label: "Income",
                    data: incomeValues,
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
                    borderWidth: 1,
                },
            ],
        };

        const config = {
            type: "bar",
            data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true },
                    x: { ticks: { autoSkip: false, maxRotation: 90, minRotation: 45 } },
                },
                plugins: {
                    legend: { position: "top" },
                    title: { display: true, text: "නිශ්පාදන වලින් මෙම මස ලද ආදායම්", color: getRandomColor() },
                },
            },
        };

        const myBarChart = new window.Chart(chartRef.current, config);

        return () => {
            console.log("Destroying Chart Instance");
            myBarChart.destroy();
        };
    }, [incomeData]);

    return (
        <div className="bg-white mb-3" style={{ height: "400px" }}>
            <div className="card-header">නිශ්පාදන වලින් මෙම මස ලද ආදායම්</div>
            <div className="card-body">
                {incomeData.length === 0 ? (
                    <p className="text-center text-danger">පෙන්වීමට දත්ත නොමැත</p>
                ) : (
                    <div style={{ position: "relative", height: "400px", width: "100%" }}>
                        <canvas ref={chartRef}></canvas>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CardThree;