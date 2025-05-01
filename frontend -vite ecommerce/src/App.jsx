import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EcommercePage from './ecommerce/pages/EcommercePage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import EcommerceOrder from './ecommerce/pages/EcommerceOrder';
import EcommerceProduct from './ecommerce/pages/EcommerceProduct';
import Ecategory from './ecommerce/pages/Ecategory';
import { ToastContainer } from 'react-toastify';
import ScrollToTop from './ecommerce/components/ScrollToTop';
import InternetModal from '../src/ecommerce/components/NoConnection/InternetModal';
import Ecommercedue from './ecommerce/pages/Ecommercedue';
import EcommerceStock from './ecommerce/pages/EcommerceStock';

function App() {
  return (
    <div>
      <InternetModal/> 
      <ScrollToTop />
      <Router>

        <ToastContainer />

        <Routes>
          <Route path="/" element={<EcommercePage />} />
          <Route path="/e-order" element={<EcommerceOrder />} />
          <Route path="/e-product" element={<EcommerceProduct />} />
          <Route path="/e-category" element={<Ecategory />} />
          <Route path="/e-due" element={<Ecommercedue />} />
          <Route path="/e-stock" element={<EcommerceStock />} />
          {/* Add other routes as needed */}
        </Routes>

      </Router>
    </div>
  );
}

export default App;