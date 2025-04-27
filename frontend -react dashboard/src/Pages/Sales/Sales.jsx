import React from 'react';
import { Route, Routes } from 'react-router-dom';
// import NewSales from '../../components/SalesPages/NewSales';
// import SalesHistory from '../../components/SalesPages/SalesHistory';
import Header from '../../components/SideBar/Header'
import Draft from '../../components/SalesPages/Draft';
import Credit from '../../components/SalesPages/Creadit';
import Delivery from '../../components/SalesPages/Delivery';
import Invoice from '../../components/SalesPages/Invoice';
import DraftInvoice from '../../components/SalesPages/DraftPages/DraftInvoice';
import DraftDelivery from '../../components/SalesPages/DraftPages/DraftDelivery';
import DraftCredit from '../../components/SalesPages/DraftPages/DraftPerforma';
import Hire from '../../components/SalesPages/Hire';
import HireHistory from '../../components/SalesPages/HireHistory';
import RentHistory from '../../components/SalesPages/RentHistory';
import Rent from '../../components/SalesPages/Rent';
import History from '../../components/SalesPages/History';

const Sales = () => {
  return (
    <div>
      <div className='show-Header'><Header /></div>
      <Routes>
        <Route path="new" element={<Rent />} />
        <Route path="hire" element={<Hire />} />

        <Route path="History" element={<History />} />
        <Route path="rentHistory" element={<RentHistory />} />
        <Route path="hireHistory" element={<HireHistory />} />



        <Route path="invoice" element={<Invoice />} />
        <Route path="delivery" element={<Delivery />} />
        <Route path="draft" element={<Draft />} />
        <Route path="draftInvoice" element={<DraftInvoice />} />
        <Route path="draftDelivery" element={<DraftDelivery />} />
        <Route path="draftPerforma" element={<DraftCredit />} />
        <Route path="credit" element={<Credit />} />
      </Routes>
    </div>
  );
};

export default Sales;