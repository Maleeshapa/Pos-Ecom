import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart,  Users,  FileText, Menu,  User,  SquarePen, CircleDollarSign, HandCoins, Car, CirclePlus, History, Leaf } from 'lucide-react';
import './SideBar.css';


const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState(null);
    const navigate = useNavigate();

    const handleLogout = () => {

        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('token');
        localStorage.removeItem('userStatus');

        navigate('/login');
    };

    const checkTokenExpiration = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            handleLogout();
            return;
        }

        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Date.now() / 1000;

        if (payload.exp < now) {
            handleLogout();
        }
    };

    useEffect(() => {
        checkTokenExpiration();

        const intervalId = setInterval(checkTokenExpiration, 60 * 1000);

        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setIsCollapsed(true);
            } else {
                setIsCollapsed(false);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener('resize', handleResize);
        };
    });

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleSubmenuToggle = (index) => {
        if (activeSubmenu === index) {
            setActiveSubmenu(null);
        } else {
            setActiveSubmenu(index);
        }
    };

    const menuItems = [

        // {
        //     title: 'Draft',
        //     icon: <SquarePen size={20} />,
        //     path: '/sales',
        //     submenus: [
        //         { title: 'Draft', path: '/sales/draft' },
        //         { title: 'Invoice', path: '/sales/draftInvoice' },
        //         { title: 'Delivery', path: '/sales/draftDelivery' },
        //         { title: 'Proforma', path: '/sales/draftPerforma' },
        //     ]
        // },
        {
            title: 'නව ගණුදෙනු',
            icon: < CirclePlus  size={20} />,
            path: '/sales',
            submenus: [
                { title: 'New Sale', path: '/sales/new' },
                // { title: 'New Hire', path: '/sales/hire' },

                // { title: 'Rental History', path: '/sales/history' },
                // { title: 'Invoice', path: '/sales/invoice' },
                // { title: 'Proforma Invoice', path: '/sales/credit' },
                // { title: 'Delivery Note', path: '/sales/delivery' },
                // { title: 'Credit Note', path: '/return/list' },
                // { title: 'Quotation', path: '/qutation' },
                //{ title: 'Draft', path: '/sales/draft' },
            ]
        },

        {
            title: 'විකුණුම් ඉතිහාසය',
            icon: < History  size={20} />,
            path: '/sales',
            submenus: [
               
                { title: 'All History', path: 'sales/History' },
                // { title: 'Sale History', path: 'sales/rentHistory' },
                // { title: 'Hire History', path: 'sales/hireHistory' },
                // { title: 'Invoice', path: '/sales/invoice' },
                // { title: 'Proforma Invoice', path: '/sales/credit' },
                // { title: 'Delivery Note', path: '/sales/delivery' },
                // { title: 'Credit Note', path: '/return/list' },
                // { title: 'Quotation', path: '/qutation' },
                //{ title: 'Draft', path: '/sales/draft' },
            ]
        },
        
 
        
        // {
        //     title: 'Draft',
        //     icon: <SquarePen size={20} />,
        //     path: '/sales',
        //     submenus: [
        //         { title: 'Draft', path: '/sales/draft' },
        //     ]
        // },

      
        {
            title: 'නිශ්පාදන',
            icon: <Leaf size={20} />,
            path: '/product',
            submenus: [

                { title: 'වර්ග / කාණ්ඩ', path: '/product/category' },
                { title: 'අලුත් නිශ්පාදන', path: '/product/create' },
                // { title: 'Rent Vechicles summary', path: '/product/product-summary' },
                // { title: 'Add New Hire Vechicle', path: '/product/createHire' },
                
                { title: 'නිශ්පාදන ලයිස්තුව', path: '/product/product-list' },
                // { title: 'Hire Vechicles List', path: '/product/hire-vechicle-list' },
            ]
        },

        
        {
            title: 'Customer',
            icon: <Users size={20} />,
            path: '/customer',
            submenus: [
                { title: 'Customer List', path: '/customer/customer-list' },
                // { title: 'Due Customers', path: '/due-customer/due-customer-list' },
                // { title: 'Due Customers', path: '/customer/dueCustomer' },
                // { title: 'Sale Due Payment', path: '/customer/sale-due-payment' },
                { title: 'Customers Due', path: '/due-customer/view-cus-due-history' },

                // { title: 'Current Due List', path: '/due-customer/all-due-customer-list' },

                // { title: 'All Due History', path: '/due-customer/all-due-history' },
            ]
        },

        

        {
            title: 'ආයතනයේ රියදුරන්',
            icon: <i className="bi bi-person-raised-hand" style={{ fontSize: '20px' }}></i>,
            path: '/driver',
            submenus: [
                { title: 'Driver List', path: '/driver' }
            ]
        }
        ,

        // {
        //     title: 'Incomes',
        //     icon: <CircleDollarSign size={20} />,
        //     path: '/income',
        //     submenus: [
        //         { title: 'Enter Incomes', path: '/income/category' },
        //         { title: 'Create Category', path: '/income/enter' },
        //         { title: 'Create Incomes', path: '/income/create' },
        //         { title: 'Income List ', path: '/income/incomeslist' },
        //     ]
        // },

        {
            title: 'වියදම්',
            icon: <HandCoins size={20} />,
            path: '/expenses',
            submenus: [
                { title: 'වියදම් ඇතුළත් කරන්න', path: '/expenses/enter' },
                // { title: 'Create Category', path: '/expenses/create' },
                { title: 'වියදම් ඉතිහාසය ', path: '/expenses/history'},
            ]
        },


        // {
        //     title: 'Sales Reports',
        //     icon: <FileText size={20} />,
        //     path: '/sales-reports',
        //     submenus: [
        //         { title: 'Daily Summary', path: '/sales-reports/daily-summary' },
        //         { title: 'Sales History', path: '/sales-reports/sales-history' },
        //         { title: 'Profit and Loss Account', path: '/sales-reports' },
        //     ]
        // },

        
        {
            title: 'Staff',
            icon: <User size={20} />,
            path: '/staff',
            submenus: [
                { title: 'Create Staff', path: '/staff/create-staff' },
                { title: 'Branch ', path: '/staff/create-store' },
            ]
        },
    ];

    return (
        <>

            <button
                className="toggle-btn d-md-none rounded bg-warning mr-4"
                onClick={toggleSidebar}
                style={{
                    position: 'fixed',
                    top: '10px',
                    left: '10px',
                    zIndex: 1030,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                }}
            >
                <Menu size={24} />
            </button>
            <div className="scrolling-sidebar">
                <nav className={`col-md-3 col-lg-2 d-md-block bg-color sidebar ${isCollapsed ? 'collapsed' : ''}`}
                    style={{
                        transform: isCollapsed ? 'translateX(-100%)' : 'translateX(0)',
                        transition: 'transform 0.3s ease-in-out'
                    }}
                >
                    <div className="text-center mt-2 p-2">
                        <h5>The Golden Aroma</h5>
                    </div>
                    <div className="position-sticky pt-3">
                        <ul className="nav flex-column">
                            <li className="nav-item">
                                <div onClick={() => handleSubmenuToggle()} style={{ cursor: 'pointer' }}>
                                    <Link to={'/'} className="nav-link d-flex align-items-center">
                                        <span className="me-2"><LayoutDashboard size={20} /></span>
                                        <span className="fs-8 p-2 menu-link d-md-inline">Dashboard</span>
                                    </Link>
                                </div>
                            </li>
                            {menuItems.map((item, index) => (
                                <li key={index} className="nav-item">
                                    <div className="nav-link d-flex align-items-center" onClick={() => handleSubmenuToggle(index)} style={{ cursor: 'pointer' }} >
                                        <span className="me-2">{item.icon}</span>
                                        <span className="fs-8 p-2 menu-link d-md-inline">{item.title}</span>
                                    </div>
                                    <div className={`submenu ${activeSubmenu === index ? 'expanded' : 'collapsed'}`}>
                                        <ul className="nav flex-column ms-3">
                                            {item.submenus.map((submenu, subIndex) => (
                                                <li key={subIndex} className="nav-item nav-sub">
                                                    <Link to={submenu.path} className="nav-link">{submenu.title}</Link>
                                                </li>

                                            ))}

                                        </ul>

                                    </div>

                                </li>

                            ))}

                        </ul>

                    </div>
                    <div className="d-flex justify-content-center mt-auto p-5">
                        <button onClick={handleLogout} className="btn btn-danger">Logout</button>
                    </div>
                </nav>

            </div>
        </>
    );
};

export default Sidebar;