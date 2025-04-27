import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';
import config from '../../config';

function CardSix() {
  const [todayTotalExpenses, setTodayTotalExpenses] = useState(0);
  const [yesterdayTotalExpenses, setYesterdayTotalExpenses] = useState(0);
  const [thisMonthTotalExpenses, setThisMonthTotalExpenses] = useState(0);
  const [lastMonthTotalExpenses, setLastMonthTotalExpenses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${config.BASE_URL}/expenses`)
      .then((response) => {
        const expenses = response.data;

        // Calculate totals
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

        const todayTotal = expenses
          .filter((expense) => {
            const expenseDate = new Date(expense.date);
            return expenseDate.toDateString() === today.toDateString();
          })
          .reduce((sum, expense) => sum + expense.price, 0);

        const yesterdayTotal = expenses
          .filter((expense) => {
            const expenseDate = new Date(expense.date);
            return expenseDate.toDateString() === yesterday.toDateString();
          })
          .reduce((sum, expense) => sum + expense.price, 0);

        const thisMonthTotal = expenses
          .filter((expense) => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= thisMonthStart && expenseDate <= today;
          })
          .reduce((sum, expense) => sum + expense.price, 0);

        const lastMonthTotal = expenses
          .filter((expense) => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= lastMonthStart && expenseDate <= lastMonthEnd;
          })
          .reduce((sum, expense) => sum + expense.price, 0);

        // Update state
        setTodayTotalExpenses(todayTotal);
        setYesterdayTotalExpenses(yesterdayTotal);
        setThisMonthTotalExpenses(thisMonthTotal);
        setLastMonthTotalExpenses(lastMonthTotal);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching expenses:', error);
        setError('No Expenses right now.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="card h-100">
      <div className="card-header">මුලු වියදම්</div>
      <div className="card-body">
        <div className="row">
          <div className="col-6">
            <h5 className="card-title">අද</h5>
            <p className="card-text">{todayTotalExpenses}</p>
          </div>
          <div className="col-6">
            <h5 className="card-title">මෙම මාසයේ</h5>
            <p className="card-text">{thisMonthTotalExpenses}</p>
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-6">
            <h5 className="card-title">ඊයේ</h5>
            <p className="card-text">{yesterdayTotalExpenses}</p>
          </div>
          <div className="col-6">
            <h5 className="card-title">ගිය මාසයේ</h5>
            <p className="card-text">{lastMonthTotalExpenses}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardSix;