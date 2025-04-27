// import React, { useEffect, useState } from 'react';
// import { Row, Col, Card } from 'react-bootstrap';
// import { FaClipboardList, FaUser } from 'react-icons/fa';
// import axios from 'axios';

// function StatsCards() {
//     const [todayIncome, setTodayIncome] = useState(0);
//     const [todayOrders, setTodayOrders] = useState(0);
//     const [productsCount, setProductsCount] = useState(0);

//     useEffect(() => {
//         // Fetch today's income
//         axios.get('/stats/today-income')
//             .then(response => {
//                 setTodayIncome(response.data.totalIncome || 0);
//             })
//             .catch(error => {
//                 console.error('Error fetching today income:', error);
//             });

//         // Fetch today's orders
//         axios.get('/stats/today-orders')
//             .then(response => {
//                 setTodayOrders(response.data.orderCount || 0);
//             })
//             .catch(error => {
//                 console.error('Error fetching today orders:', error);
//             });

//         // Fetch products count (you'll need to implement this endpoint if not exists)
//         axios.get('/products/count') // Adjust this to your actual products endpoint
//             .then(response => {
//                 setProductsCount(response.data.count || 0);
//             })
//             .catch(error => {
//                 console.error('Error fetching products count:', error);
//             });
//     }, []);

//     return (
//         <Row className="mb-4">
//             <Col xs={6} sm={6} md={6}>
//                 <Card className="stats-card">
//                     <Card.Body className="d-flex align-items-center">
//                         <div className="stats-icon orange">
//                             <span className="stats-icon-text">📊</span>
//                         </div>
//                         <div className="ms-3">
//                             <h4 className="mb-0">
//                               {/* Today Income */}
//                               අද ආදායම
                              
//                               </h4>
//                             <h2 className="mb-0">Rs. {todayIncome.toLocaleString()}</h2>
//                         </div>
//                     </Card.Body>
//                 </Card>
//             </Col>

//             <Col xs={6} sm={6} md={6}>
//                 <Card className="stats-card">
//                     <Card.Body className="d-flex align-items-center">
//                         <div className="stats-icon green">
//                             <FaClipboardList size={20} color="white" />
//                         </div>
//                         <div className="ms-3">
//                             <h4 className="mb-0">
//                               {/* Today Orders */}
//                               අද විකුණු ඇණවුම් ගණන
//                               </h4>
//                             <h2 className="mb-0">{todayOrders}</h2>
//                         </div>
//                     </Card.Body>
//                 </Card>
//             </Col>
            
//             {/* <Col xs={4} sm={4} md={4}>
//                 <Card className="stats-card">
//                     <Card.Body className="d-flex align-items-center">
//                         <div className="stats-icon purple">
//                             <span className="stats-icon-text">🛒</span>
//                         </div>
//                         <div className="ms-3">
//                             <h6 className="mb-0">Products</h6>
//                             <h2 className="mb-0">{productsCount}</h2>
//                         </div>
//                     </Card.Body>
//                 </Card>
//             </Col> */}
//         </Row>
//     );
// }

// export default StatsCards;

// import React, { useEffect, useState } from 'react';
// import { Row, Col, Card } from 'react-bootstrap';
// import { FaClipboardList, FaMoneyBillWave } from 'react-icons/fa';
// import axios from 'axios';
// import './StatsCards.css'; // Create this CSS file for custom styles
// import { BASE_URL } from '../../config';

// function StatsCards() {
//     const [todayIncome, setTodayIncome] = useState(0);
//     const [todayOrders, setTodayOrders] = useState(0);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 setLoading(true);
//                 // Fetch both data in parallel
//                 const [incomeRes, ordersRes] = await Promise.all([
//                     axios.get(`${BASE_URL}/stats/today-income`),
//                     axios.get(`${BASE_URL}/stats/today-orders`)
//                 ]);
                
//                 setTodayIncome(incomeRes.data.totalIncome || 0);
//                 setTodayOrders(ordersRes.data.orderCount || 0);
//             } catch (error) {
//                 console.error('Error fetching stats:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, []);

//     return (
//         <Row className="g-3 mb-4"> {/* Added gutter spacing */}
//             <Col xs={6} sm={6} md={6}>
//                 <Card className="stats-card h-100"> {/* Added h-100 for equal height */}
//                     <Card.Body className="d-flex align-items-center p-3"> {/* Reduced padding on mobile */}
//                         <div className="stats-icon orange me-3"> {/* Changed ms to me for RTL support */}
//                             <FaMoneyBillWave size={24} color="white" /> {/* More appropriate icon */}
//                         </div>
//                         <div>
//                             <h5 className="mb-1 stats-label">අද ආදායම</h5> {/* Reduced heading size */}
//                             <h2 className="mb-0 stats-value">
//                                 {loading ? (
//                                     <div className="spinner-border spinner-border-sm text-primary" role="status">
//                                         <span className="visually-hidden">Loading...</span>
//                                     </div>
//                                 ) : (
//                                     `Rs. ${todayIncome.toLocaleString()}`
//                                 )}
//                             </h2>
//                         </div>
//                     </Card.Body>
//                 </Card>
//             </Col>

//             <Col xs={6} sm={6} md={6}>
//                 <Card className="stats-card h-100">
//                     <Card.Body className="d-flex align-items-center p-3">
//                         <div className="stats-icon green me-3">
//                             <FaClipboardList size={24} color="white" />
//                         </div>
//                         <div>
//                             <h5 className="mb-1 stats-label">අද විකුණු ඇණවුම් ගණන</h5>
//                             <h2 className="mb-0 stats-value">
//                                 {loading ? (
//                                     <div className="spinner-border spinner-border-sm text-primary" role="status">
//                                         <span className="visually-hidden">Loading...</span>
//                                     </div>
//                                 ) : (
//                                     todayOrders
//                                 )}
//                             </h2>
//                         </div>
//                     </Card.Body>
//                 </Card>
//             </Col>
//         </Row>
//     );
// }

// export default StatsCards;


import React, { useEffect, useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FaClipboardList, FaMoneyBillWave, FaCashRegister } from 'react-icons/fa';
import axios from 'axios';
import './StatsCards.css';
import { BASE_URL } from '../../config';

function StatsCards() {
    const [todayIncome, setTodayIncome] = useState(0);
    const [todayReceived, setTodayReceived] = useState(0);
    const [todayOrders, setTodayOrders] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch all data in parallel
                const [incomeRes, receivedRes, ordersRes] = await Promise.all([
                    axios.get(`${BASE_URL}/stats/today-income`),
                    axios.get(`${BASE_URL}/stats/today-received`),
                    axios.get(`${BASE_URL}/stats/today-orders`)
                ]);
                
                if (incomeRes.data.success) setTodayIncome(incomeRes.data.totalIncome);
                if (receivedRes.data.success) setTodayReceived(receivedRes.data.totalReceived);
                if (ordersRes.data.success) setTodayOrders(ordersRes.data.orderCount);
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <Row className="g-3 mb-4">
            <Col xs={12} sm={6} md={4}>
                <Card className="stats-card h-100">
                    <Card.Body className="d-flex align-items-center p-3">
                        <div className="stats-icon blue me-3">
                            <FaMoneyBillWave size={20} color="white" />
                        </div>
                        <div>
                            <h5 className="mb-1 stats-label">අද ආදායම (එකතුව)</h5>
                            <h2 className="mb-0 stats-value">
                                {loading ? (
                                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                ) : (
                                    `Rs. ${todayIncome.toLocaleString()}`
                                )}
                            </h2>
                        </div>
                    </Card.Body>
                </Card>
            </Col>

            <Col xs={12} sm={6} md={4}>
                <Card className="stats-card h-100">
                    <Card.Body className="d-flex align-items-center p-3">
                        <div className="stats-icon green me-3">
                            <FaCashRegister size={20} color="white" />
                        </div>
                        <div>
                            <h5 className="mb-1 stats-label">අද ලැබුණු මුදල්</h5>
                            <h2 className="mb-0 stats-value">
                                {loading ? (
                                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                ) : (
                                    `Rs. ${todayReceived.toLocaleString()}`
                                )}
                            </h2>
                        </div>
                    </Card.Body>
                </Card>
            </Col>

            <Col xs={12} sm={6} md={4}>
                <Card className="stats-card h-100">
                    <Card.Body className="d-flex align-items-center p-3">
                        <div className="stats-icon orange me-3">
                            <FaClipboardList size={20} color="white" />
                        </div>
                        <div>
                            <h5 className="mb-1 stats-label">අද විකුණු ඇණවුම් ගණන</h5>
                            <h2 className="mb-0 stats-value">
                                {loading ? (
                                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                ) : (
                                    todayOrders
                                )}
                            </h2>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
}

export default StatsCards;