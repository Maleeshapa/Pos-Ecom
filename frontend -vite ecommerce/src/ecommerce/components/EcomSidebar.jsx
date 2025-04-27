import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaClipboardList, FaWpforms, FaShoppingCart, FaUser, FaTags } from 'react-icons/fa';
import { GiReceiveMoney } from "react-icons/gi";
function EcomSidebar() {
  return (
    <div className="sidebar">
      <NavLink to="/" className={({ isActive }) => isActive ? "sidebar-item active" : "sidebar-item"} style={{ textDecoration: 'none' }}>
        <FaHome size={22} />
        <span className="sidebar-text">Home</span>
      </NavLink>
      <NavLink to="/e-order" className={({ isActive }) => isActive ? "sidebar-item active" : "sidebar-item"} style={{ textDecoration: 'none' }}>
        <FaClipboardList size={22} />
        <span className="sidebar-text">Orders</span>
      </NavLink>
      <NavLink to="/e-product" className={({ isActive }) => isActive ? "sidebar-item active" : "sidebar-item"} style={{ textDecoration: 'none' }}>
        <FaWpforms size={22} />
        <span className="sidebar-text">Product</span>
      </NavLink>

      <NavLink to="/e-due" className={({ isActive }) => isActive ? "sidebar-item active" : "sidebar-item"} style={{ textDecoration: 'none' }}>
        <GiReceiveMoney size={22} />
        <span className="sidebar-text">Due</span>
      </NavLink>

      {/* <NavLink to="/e-category" className={({ isActive }) => isActive ? "sidebar-item active" : "sidebar-item"} style={{ textDecoration: 'none' }}>
        <FaTags size={22} />
        <span className="sidebar-text">Category</span>
      </NavLink> */}
      {/* Uncomment the following section if you want the Cart option */}
      {/* <NavLink to="/e-cart" className={({ isActive }) => isActive ? "sidebar-item active" : "sidebar-item"} style={{ textDecoration: 'none' }}>
        <FaShoppingCart size={22} />
        <span className="sidebar-text">Cart</span>
      </NavLink> */}
      <div className="sidebar-user">
        <div className="user-avatar">
          <FaUser size={18} />
        </div>
        <span className="user-name">Golden Aroma</span>
      </div>
    </div>
  );
}

export default EcomSidebar;





//v 2 withot category

// import React from 'react';
// import { NavLink } from 'react-router-dom';
// import { FaHome, FaClipboardList, FaWpforms, FaShoppingCart, FaUser } from 'react-icons/fa';

// function EcomSidebar() {
//   return (
//     <div className="sidebar">
//       <NavLink to="/e-commerce" className={({ isActive }) => isActive ? "sidebar-item active" : "sidebar-item"} style={{ textDecoration: 'none' }}>
//         <FaHome size={22} />
//         <span className="sidebar-text">Home</span>
//       </NavLink>
//       <NavLink to="/e-order" className={({ isActive }) => isActive ? "sidebar-item active" : "sidebar-item"} style={{ textDecoration: 'none' }}>
//         <FaClipboardList size={22} />
//         <span className="sidebar-text">Orders</span>
//       </NavLink>
//       <NavLink to="/e-product" className={({ isActive }) => isActive ? "sidebar-item active" : "sidebar-item"} style={{ textDecoration: 'none' }}>
//         <FaWpforms size={22} />
//         <span className="sidebar-text">Product</span>
//       </NavLink>
//       {/* <NavLink to="/e-cart" className={({ isActive }) => isActive ? "sidebar-item active" : "sidebar-item"} style={{ textDecoration: 'none' }}>
//         <FaShoppingCart size={22} />
//         <span className="sidebar-text">Cart</span>
//       </NavLink> */}
//       <div className="sidebar-user">
//         <div className="user-avatar">
//           <FaUser size={18} />
//         </div>
//         <span className="user-name">gokhan</span>
//       </div>
//     </div>
//   );
// }

// export default EcomSidebar;

