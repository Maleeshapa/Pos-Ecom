import React from 'react'
import { Route, Routes } from 'react-router-dom';
import Header from '../../components/SideBar/Header'
import EnterExpenses from '../../components/ExpensesPages/EnterExpenses';
import CreateExpenses from '../../components/ExpensesPages/CreateExpenses';
import ExpensesHistory from '../../components/ExpensesPages/ExpensesHistory';

const Expenses = () => {
  return (
    <div>
      <div className='show-Header'><Header /></div>
      <Routes>
       <Route path="enter" element={<EnterExpenses />} />
       <Route path="create" element={<CreateExpenses />} />
       <Route path="history" element={<ExpensesHistory />} />
      </Routes>
    </div>
  )
}

export default Expenses