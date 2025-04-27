import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import config from '../../config';

function CardTwo() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        // Calculate date range for January to December of current year
        const currentYear = new Date().getFullYear();
        const startDate = new Date(currentYear, 0, 1); // January 1st
        const endDate = new Date(currentYear, 11, 31); // December 31st

        const response = await fetch(`${config.BASE_URL}/revenue-analytics?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&groupBy=month`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch revenue data');
        }

        const data = await response.json();
        
        // Ensure we have data for all months
        const completeData = generateCompleteYearData(data.revenueData);
        renderChart(completeData);
      } catch (error) {
        console.error('Error fetching revenue data:', error);
      }
    };

    fetchRevenueData();

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  // Function to ensure we have all months represented
  const generateCompleteYearData = (revenueData) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const currentYear = new Date().getFullYear();
    const completeData = months.map(month => {
      const existingData = revenueData.find(item => {
        const date = new Date(item.timePeriod);
        return date.getMonth() === months.indexOf(month);
      });

      if (existingData) {
        return existingData;
      }

      // Return placeholder data for months with no transactions
      return {
        timePeriod: new Date(currentYear, months.indexOf(month)).toISOString(),
        totalRevenue: 0,
        receivedRevenue: 0,
        transactionCount: 0
      };
    });

    return completeData;
  };

  const renderChart = (revenueData) => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');

    // Process the data for visualization
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const totalRevenueValues = revenueData.map(item => item.totalRevenue);
    const receivedRevenueValues = revenueData.map(item => item.receivedRevenue);
    const transactionCounts = revenueData.map(item => item.transactionCount);

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'මාසික විකුණුම් ආදායම',
            data: totalRevenueValues,
            fill: false,
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            tension: 0.1,
            yAxisID: 'y-revenue',
          },
          {
            label: 'මාසික ලද ආදායම',
            data: receivedRevenueValues,
            fill: false,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.1,
            yAxisID: 'y-revenue',
          },
          {
            label: 'ගණුදෙනු ගණන',
            data: transactionCounts,
            fill: false,
            borderColor: 'rgba(153, 102, 255, 1)',
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            tension: 0.1,
            yAxisID: 'y-transactions',
            hidden: true, 
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        plugins: {
          title: {
            display: true,
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                if (context.datasetIndex === 0) {
                  return `Total Revenue: Rs. ${context.parsed.y.toLocaleString()}`;
                } else if (context.datasetIndex === 1) {
                  return `Received Revenue: Rs. ${context.parsed.y.toLocaleString()}`;
                }
                return `Transactions: ${context.parsed.y}`;
              }
            }
          }
        },
        scales: {
          'y-revenue': {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Revenue (Rs.)'
            },
            ticks: {
              callback: (value) => `Rs. ${value.toLocaleString()}`
            }
          },
          'y-transactions': {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Transactions'
            },
            grid: {
              display: false
            }
          }
        }
      }
    });
  };

  return (
    <div className="card h-100 me-3">
      <div className="card-header">මාසික ආදායම් වාර්තාව</div>
      <div className="card-body" style={{ height: '300px' }}>
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
}

export default CardTwo;