import React from 'react'
import { Route, Routes } from 'react-router-dom';
import StockAdjustment from '../../components/StockPages/StockAdjustment';
import StockAdjustmentHistory from '../../components/StockPages/StockAdjustmentHistory';
import NewStock from '../../components/StockPages/NewStock';
import Header from '../../components/SideBar/Header'

const Stock = () => {
  return (
    <div>
      <div className='show-Header'><Header /></div>
      <Routes>
        <Route path='new-stock' element={<NewStock />} />
        <Route path="adjustment" element={<StockAdjustment />} />
        <Route path="adjustment_history" element={<StockAdjustmentHistory />} />
      </Routes>
    </div>
  )
}

export default Stock