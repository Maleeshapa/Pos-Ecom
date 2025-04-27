// import './Dashboard.css'

// function CardOne({ TodayTotal, YesterdayTotal, ThisMonthTotal, LastMonthTotal, todayTotalSales, monthTotalSales, totalCheques }) {


//   return (
//     <div className="card h-100">
//       <div className="card-header">Total Sales Earnings</div>
//       <div className="card-body">
//         <div className="row">
//           <div className="col-6">
//             <h5 className="card-title">Today</h5>
//             <p className="card-text">{TodayTotal}</p>
//             <span>{todayTotalSales} Sales </span>
//           </div>
//           <div className="col-6">
//             <h5 className="card-title">This Month</h5>
//             <p className="card-text">{ThisMonthTotal}</p>
//             <span>{monthTotalSales} Sales </span>
//           </div>
//         </div>
//         <br />
//         <div className="row">
//           <div className="col-6">
//             <h5 className="card-title">Yesterday</h5>
//             <p className="card-text">{YesterdayTotal}</p>
//           </div>
//           <div className="col-6">
//             <h5 className="card-title">Last Month</h5>
//             <p className="card-text">{LastMonthTotal}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CardOne;


//---------------------------------------------------------------------------------------------------------

// import React, { useEffect, useState } from 'react';
// import './Dashboard.css';
// import config from '../../config';

// function CardOne() {
//   const [todayTotal, setTodayTotal] = useState(0);
//   const [yesterdayTotal, setYesterdayTotal] = useState(0);
//   const [thisMonthTotal, setThisMonthTotal] = useState(0);
//   const [lastMonthTotal, setLastMonthTotal] = useState(0);
//   const [todayTotalSales, setTodayTotalSales] = useState(0);
//   const [monthTotalSales, setMonthTotalSales] = useState(0);

//   useEffect(() => {
//     const fetchSalesData = async () => {
//       try {
//         // const response = await fetch(`${config.BASE_URL}/salesGet`);
//         const response = await fetch(`${config.BASE_URL}/salesGet`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch sales data');
//         }
//         const sales = await response.json();

//         const today = new Date();
//         const yesterday = new Date(today);
//         yesterday.setDate(yesterday.getDate() - 1);
//         const firstDayOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
//         const firstDayOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
//         const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

//         let todaySales = 0;
//         let yesterdaySales = 0;
//         let thisMonthSales = 0;
//         let lastMonthSales = 0;
//         let todayCount = 0;
//         let monthCount = 0;

//         sales.forEach(sale => {
//           const saleDate = new Date(sale.createdAt);
//           if (saleDate.toDateString() === today.toDateString()) {
//             todaySales += sale.Transaction.paidAmount;
//             todayCount++;
//           }
//           if (saleDate.toDateString() === yesterday.toDateString()) {
//             yesterdaySales += sale.Transaction.paidAmount;
//           }
//           if (saleDate >= firstDayOfThisMonth && saleDate <= today) {
//             thisMonthSales += sale.Transaction.paidAmount;
//             monthCount++;
//           }
//           if (saleDate >= firstDayOfLastMonth && saleDate <= lastDayOfLastMonth) {
//             lastMonthSales += sale.Transaction.paidAmount;
//           }
//         });

//         setTodayTotal(todaySales);
//         setYesterdayTotal(yesterdaySales);
//         setThisMonthTotal(thisMonthSales);
//         setLastMonthTotal(lastMonthSales);
//         setTodayTotalSales(todayCount);
//         setMonthTotalSales(monthCount);
//       } catch (error) {
//         console.error('Error fetching sales data:', error);
//       }
//     };

//     fetchSalesData();
//   }, []);

//   return (
//     <div className="card h-100">
//       <div className="card-header">විකුණුම් ආදායම්</div>
//       <div className="card-body">
//         <div className="row">
//           <div className="col-6">
//             <h5 className="card-title">අද</h5>
//             <p className="card-text">{todayTotal}</p>
//             <span>{todayTotalSales} Sales </span>
//           </div>
//           <div className="col-6">
//             <h5 className="card-title">මෙම මාසයේ</h5>
//             <p className="card-text">{thisMonthTotal}</p>
//             <span>{monthTotalSales} Sales </span>
//           </div>
//         </div>
//         <br />
//         <div className="row">
//           <div className="col-6">
//             <h5 className="card-title">ඊයේ</h5>
//             <p className="card-text">{yesterdayTotal}</p>
//           </div>
//           <div className="col-6">
//             <h5 className="card-title">ගිය මාසයේ</h5>
//             <p className="card-text">{lastMonthTotal}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CardOne;

import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import config from '../../config';

function CardOne() {
  const [todayTotal, setTodayTotal] = useState(0);
  const [yesterdayTotal, setYesterdayTotal] = useState(0);
  const [thisMonthTotal, setThisMonthTotal] = useState(0);
  const [lastMonthTotal, setLastMonthTotal] = useState(0);
  const [todayTotalSales, setTodayTotalSales] = useState(0);
  const [monthTotalSales, setMonthTotalSales] = useState(0);

  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        // Fetch transactions instead of sales
        const response = await fetch(`${config.BASE_URL}/api/transactions/all`);
        if (!response.ok) {
          throw new Error('Failed to fetch transaction data');
        }
        const transactions = await response.json();

        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const firstDayOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const firstDayOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

        let todaySales = 0;
        let yesterdaySales = 0;
        let thisMonthSales = 0;
        let lastMonthSales = 0;
        let todayCount = 0;
        let monthCount = 0;

        transactions.forEach(transaction => {
          const transactionDate = new Date(transaction.createdAt);
          if (transactionDate.toDateString() === today.toDateString()) {
            todaySales += transaction.totalAmount;
            todayCount++;
          }
          if (transactionDate.toDateString() === yesterday.toDateString()) {
            yesterdaySales += transaction.totalAmount;
          }
          if (transactionDate >= firstDayOfThisMonth && transactionDate <= today) {
            thisMonthSales += transaction.totalAmount;
            monthCount++;
          }
          if (transactionDate >= firstDayOfLastMonth && transactionDate <= lastDayOfLastMonth) {
            lastMonthSales += transaction.totalAmount;
          }
        });

        setTodayTotal(todaySales);
        setYesterdayTotal(yesterdaySales);
        setThisMonthTotal(thisMonthSales);
        setLastMonthTotal(lastMonthSales);
        setTodayTotalSales(todayCount);
        setMonthTotalSales(monthCount);
      } catch (error) {
        console.error('Error fetching transaction data:', error);
      }
    };

    fetchTransactionData();
  }, []);

  return (
    <div className="card h-100">
      <div className="card-header">විකුණුම් ආදායම්</div>
      <div className="card-body">
        <div className="row">
          <div className="col-6">
            <h5 className="card-title">අද</h5>
            <p className="card-text">{todayTotal}</p>
            <span>{todayTotalSales} Sales </span>
          </div>
          <div className="col-6">
            <h5 className="card-title">මෙම මාසයේ</h5>
            <p className="card-text">{thisMonthTotal}</p>
            <span>{monthTotalSales} Sales </span>
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-6">
            <h5 className="card-title">ඊයේ</h5>
            <p className="card-text">{yesterdayTotal}</p>
          </div>
          <div className="col-6">
            <h5 className="card-title">ගිය මාසයේ</h5>
            <p className="card-text">{lastMonthTotal}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardOne;