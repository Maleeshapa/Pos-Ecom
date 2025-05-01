// import React, { useState, useEffect } from 'react';
// import { Container, Card, Row, Col, Button, Badge, Table } from 'react-bootstrap';
// import { FaHome, FaClipboardList, FaWpforms, FaShoppingCart, FaUser, FaPrint, FaCheck } from 'react-icons/fa';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import EcomSidebar from '../components/ecomSidebar';
// import { Link } from 'react-router-dom';
// import './EcommerceOrder.css';
// import StatsCards from '../components/StatsCards';

// function EcommerceOrder() {
//   const [order, setOrder] = useState({
//     id: '67ed57e58ec4ed62ca90e5a6',
//     customer: 'test',
//     totalAmount: 216.00,
//     items: [],
//     status: 'created',
//     sold: 2
//   });

//   const [cart, setCart] = useState([]);

//   useEffect(() => {
//     // Show toast notification when component mounts
//     toast.success("Order created", {
//       position: "bottom-right",
//       autoClose: 5000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//     });
//   }, []);

//   const calculateTotals = () => {
//     const itemsTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//     const tax = itemsTotal * 0.08;
//     return {
//       itemsTotal: itemsTotal.toFixed(2),
//       tax: tax.toFixed(2),
//       total: (itemsTotal + tax).toFixed(2)
//     };
//   };

//   const totals = calculateTotals();

//   return (
//     <div className="app-container">
//       {/* Sidebar */}
//       <EcomSidebar />

//       {/* Main Content */}
//       <div className="main-content">
//         <Container fluid>
//         <Row>

//             <StatsCards/>

//           </Row>
//           <Row className="mb-4">
//             <Col>
//               <Card className="order-details-card">
//                 <Card.Body>
//                   <div className="d-flex justify-content-between align-items-center mb-3">
//                     <div>
//                       <h5 className="mb-0">Order Id: # {order.id}</h5>
//                       <div className="mt-2">
//                         <Badge bg="secondary">Sold: {order.sold}</Badge>
//                       </div>
//                     </div>
//                     <div className="text-end">
//                       <div>Customer: {order.customer}</div>
//                       <h4 className="mb-0 mt-2">Rs {order.totalAmount.toFixed(2)}</h4>
//                       <Button variant="success" size="sm" className="mt-2 print-btn">
//                         <FaPrint className="me-1" /> Print
//                       </Button>
//                     </div>
//                   </div>
//                 </Card.Body>
//               </Card>
//             </Col>
//           </Row>

//           {/* <Row className="mb-4">
//             <Col lg={8}>
//               <div className="order-items-container">

//                 <div className="empty-state text-center py-5">
//                   <h5 className="text-muted">There are no products in the cart.</h5>
//                 </div>
//               </div>
//             </Col>

//             <Col lg={4}>
//               <Card className="cart-summary-card">
//                 <Card.Body>
//                   <h5 className="mb-4">Order Summary</h5>
//                   <Table borderless className="cart-summary-table">
//                     <tbody>
//                       <tr>
//                         <td>Items (0)</td>
//                         <td className="text-end fw-bold">$ {totals.itemsTotal}</td>
//                       </tr>
//                       <tr>
//                         <td>Tax (%8)</td>
//                         <td className="text-end fw-bold">$ {totals.tax}</td>
//                       </tr>
//                       <tr className="total-row">
//                         <td>Total</td>
//                         <td className="text-end fw-bold">$ {totals.total}</td>
//                       </tr>
//                     </tbody>
//                   </Table>
//                   <Button 
//                     variant="warning" 
//                     className="checkout-btn w-100 mt-3"
//                     disabled={cart.length === 0}
//                   >
//                     Checkout
//                   </Button>
//                 </Card.Body>
//               </Card>
//             </Col>
//           </Row> */}


//         </Container>
//       </div>

//       {/* Toast notifications container */}
//       <ToastContainer />
//     </div>
//   );
// }

// export default EcommerceOrder;

// import React, { useState, useEffect } from 'react';
// import { Container, Card, Row, Col, Button, Badge, Table, Spinner } from 'react-bootstrap';
// import { FaHome, FaClipboardList, FaWpforms, FaShoppingCart, FaUser, FaPrint, FaCheck, FaReceipt, FaFileInvoice } from 'react-icons/fa';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import axios from 'axios';
// import EcomSidebar from '../components/ecomSidebar';
// import { Link, useParams } from 'react-router-dom';
// import './EcommerceOrder.css';
// import StatsCards from '../components/StatsCards';

// // Base URL for API
// import { BASE_URL } from '../../config';

// function EcommerceOrder() {
//   const { transactionId } = useParams(); // Get transaction ID from URL if available
//   const [loading, setLoading] = useState(true);
//   const [transaction, setTransaction] = useState(null);
//   const [salesItems, setSalesItems] = useState([]);
//   const [error, setError] = useState(null);

//   // Fetch transaction and sales data
//   useEffect(() => {
//     const fetchOrderData = async () => {
//       try {
//         setLoading(true);
//         // If we have a transaction ID from params, use it, otherwise use a default
//         const targetId = transactionId || '1';

//         // Fetch transaction details
//         const transactionRes = await axios.get(`${BASE_URL}/transactions/${targetId}`);
//         setTransaction(transactionRes.data);

//         // Fetch associated sales items
//         const salesRes = await axios.get(`${BASE_URL}/sales/bytransaction/${targetId}`);
//         setSalesItems(salesRes.data);

//         setLoading(false);
//         toast.success("Order details loaded", {
//           position: "bottom-right",
//           autoClose: 3000,
//         });
//       } catch (err) {
//         console.error('Error fetching order data:', err);
//         setError('Failed to load order details. Please try again.');
//         setLoading(false);
//         toast.error("Could not load order details", {
//           position: "bottom-right",
//         });

//         // Set fallback data for demo purposes
//         setTransaction({
//           transactionId: transactionId || '1',
//           totalAmount: 7500,
//           discount: 6000,
//           paidAmount: 6000,
//           due: 1500,
//           note: "abcdefgh",
//           paymentType: "cash",
//           createdAt: new Date().toISOString()
//         });

//         setSalesItems([
//           {
//             salesId: 1,
//             productId: 1,
//             price: 5000,
//             quantity: 1,
//             productName: "testProduct",
//             category: "someCategory"
//           },
//           {
//             salesId: 2,
//             productId: 2,
//             price: 6000,
//             quantity: 1,
//             productName: "newProduct",
//             category: "someCategory"
//           },
//           {
//             salesId: 3,
//             productId: 3,
//             price: 500,
//             quantity: 3,
//             productName: "newlatest",
//             category: "someCategory"
//           }
//         ]);
//       }
//     };

//     fetchOrderData();
//   }, [transactionId]);

//   const handlePrint = () => {
//     toast.info("Preparing invoice for printing...", {
//       position: "bottom-right",
//     });
//     // In a real app, this would trigger the print functionality
//     setTimeout(() => {
//       window.print();
//     }, 1000);
//   };

//   // Calculate total items sold
//   const totalItemsSold = salesItems.reduce((total, item) => total + item.quantity, 0);

//   // Calculate subtotal before discount
//   const subtotal = salesItems.reduce((total, item) => total + (item.price * item.quantity), 0);

//   if (loading) {
//     return (
//       <div className="app-container">
//         <EcomSidebar />
//         <div className="main-content d-flex justify-content-center align-items-center">
//           <Spinner animation="border" role="status" variant="primary">
//             <span className="visually-hidden">Loading...</span>
//           </Spinner>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="app-container">
//       {/* Sidebar */}
//       <EcomSidebar />

//       {/* Main Content */}
//       <div className="main-content">
//         <Container fluid>
//           <Row>
//             <StatsCards />
//           </Row>

//           {/* Order Header */}
//           <Row className="mb-4">
//             <Col lg={8}>
//               <Card className="order-details-card">
//                 <Card.Body>
//                   <div className="d-flex justify-content-between align-items-center mb-3">
//                     <div>
//                       <h5 className="mb-0">Order Id: #{transaction?.transactionId}</h5>
//                       <div className="mt-2">
//                         <Badge bg="primary" className="me-2">Items: {totalItemsSold}</Badge>
//                         <Badge bg={transaction?.due > 0 ? "warning" : "success"}>
//                           {transaction?.due > 0 ? "Partially Paid" : "Fully Paid"}
//                         </Badge>
//                       </div>
//                       <small className="text-muted d-block mt-2">
//                         {new Date(transaction?.createdAt).toLocaleString()}
//                       </small>
//                     </div>
//                     <div className="text-end">
//                       <div>Customer: <span className="fw-bold">Walk-in Customer</span></div>
//                       <h4 className="mb-0 mt-2">Rs {transaction?.totalAmount?.toFixed(2)}</h4>
//                       <Button variant="success" size="sm" className="mt-2 print-btn" onClick={handlePrint}>
//                         <FaPrint className="me-1" /> Print Invoice
//                       </Button>
//                     </div>
//                   </div>
//                 </Card.Body>
//               </Card>
//             </Col>

//             <Col lg={4}>
//               <Card className="cart-summary-card">
//                 <Card.Header className="bg-white">
//                   <h5 className="mb-0">Order Summary</h5>
//                 </Card.Header>
//                 <Card.Body>
//                   <Table borderless className="cart-summary-table">
//                     <tbody>
//                       <tr>
//                         <td>Subtotal</td>
//                         <td className="text-end fw-bold">Rs {subtotal.toFixed(2)}</td>
//                       </tr>
//                       {transaction?.discount > 0 && (
//                         <tr className="discount-row">
//                           <td>Discount</td>
//                           <td className="text-end fw-bold text-success">- Rs {transaction.discount.toFixed(2)}</td>
//                         </tr>
//                       )}
//                       <tr className="total-row">
//                         <td>Total</td>
//                         <td className="text-end fw-bold">Rs {transaction?.totalAmount.toFixed(2)}</td>
//                       </tr>
//                     </tbody>
//                   </Table>

//                   <div className="payment-details mt-4">
//                     <h6 className="mb-3">Payment Details</h6>
//                     <div className="d-flex justify-content-between mb-2">
//                       <span>Payment Method</span>
//                       <span className="fw-bold text-capitalize">{transaction?.paymentType || 'Cash'}</span>
//                     </div>
//                     <div className="d-flex justify-content-between mb-2">
//                       <span>Paid Amount</span>
//                       <span className="fw-bold">Rs {transaction?.paidAmount.toFixed(2)}</span>
//                     </div>
//                     <div className="d-flex justify-content-between">
//                       <span>Due Amount</span>
//                       <span className={`fw-bold ${transaction?.due > 0 ? 'text-danger' : 'text-success'}`}>
//                         Rs {transaction?.due.toFixed(2)}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="actions-section mt-4">
//                     <Button variant="outline-primary" className="w-100 mb-2">
//                       <FaFileInvoice className="me-2" /> Download Invoice
//                     </Button>
//                     {transaction?.due > 0 && (
//                       <Button variant="warning" className="w-100">
//                         <FaReceipt className="me-2" /> Record Payment
//                       </Button>
//                     )}
//                   </div>
//                 </Card.Body>
//               </Card>
//             </Col>
//           </Row>

//           {/* Order Details */}
//           <Row className="mb-4">
//             <Col lg={8}>
//               <Card className="order-items-card">
//                 <Card.Header className="bg-white">
//                   <h5 className="mb-0">Order Items</h5>
//                 </Card.Header>
//                 <Card.Body>
//                   {salesItems.length > 0 ? (
//                     <Table responsive hover className="order-items-table">
//                       <thead>
//                         <tr>
//                           <th>Item</th>
//                           <th>Price</th>
//                           <th>Quantity</th>
//                           <th className="text-end">Total</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {salesItems.map((item) => (
//                           <tr key={item.salesId}>
//                             <td>
//                               <div className="d-flex align-items-center">
//                                 <div className="product-color-indicator me-2" 
//                                      style={{ backgroundColor: getColorForProduct(item.productName) }}></div>
//                                 <div>
//                                   <div className="item-name">{item.productName}</div>
//                                   <small className="text-muted">{item.category}</small>
//                                 </div>
//                               </div>
//                             </td>
//                             <td>Rs {item.price.toFixed(2)}</td>
//                             <td>{item.quantity}</td>
//                             <td className="text-end">Rs {(item.price * item.quantity).toFixed(2)}</td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </Table>
//                   ) : (
//                     <div className="empty-state text-center py-5">
//                       <h5 className="text-muted">No items found for this order.</h5>
//                     </div>
//                   )}
//                 </Card.Body>
//               </Card>

//               {transaction?.note && (
//                 <Card className="mt-3">
//                   <Card.Header className="bg-white">
//                     <h5 className="mb-0">Order Note</h5>
//                   </Card.Header>
//                   <Card.Body>
//                     <p className="mb-0">{transaction.note}</p>
//                   </Card.Body>
//                 </Card>
//               )}
//             </Col>


//           </Row>
//         </Container>
//       </div>

//       {/* Toast notifications container */}
//       <ToastContainer />
//     </div>
//   );
// }

// // Helper function to generate consistent colors for products
// function getColorForProduct(productName) {
//   const colors = [
//     '#FF6B6B', '#FFD166', '#06D6A0', '#118AB2', '#073B4C',
//     '#8338EC', '#3A86FF', '#FB5607', '#FFBE0B', '#FF006E'
//   ];

//   // Simple hash function to get consistent colors
//   let hash = 0;
//   for (let i = 0; i < productName.length; i++) {
//     hash = productName.charCodeAt(i) + ((hash << 5) - hash);
//   }

//   const index = Math.abs(hash) % colors.length;
//   return colors[index];
// }

// export default EcommerceOrder;










// import React, { useState, useEffect } from 'react';
// import { Container, Card, Row, Col, Button, Badge, Table, Spinner, Modal } from 'react-bootstrap';
// import { FaHome, FaClipboardList, FaEye, FaShoppingCart, FaPrint, FaCheck, FaReceipt, FaFileInvoice } from 'react-icons/fa';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import axios from 'axios';
// import EcomSidebar from '../components/ecomSidebar';
// import { Link } from 'react-router-dom';
// import './EcommerceOrder.css';
// import StatsCards from '../components/StatsCards';

// // Base URL for API
// import { BASE_URL } from '../../config';

// function EcommerceOrderList() {
//   const [loading, setLoading] = useState(true);
//   const [transactions, setTransactions] = useState([]);
//   const [selectedTransaction, setSelectedTransaction] = useState(null);
//   const [salesItems, setSalesItems] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [error, setError] = useState(null);

//   // Fetch all transactions
//   useEffect(() => {
//     const fetchTransactions = async () => {
//       try {
//         setLoading(true);
//         const transactionsRes = await axios.get(`${BASE_URL}/transactions`);
//         setTransactions(transactionsRes.data);
//         setLoading(false);
//         toast.success("Orders loaded successfully", {
//           position: "bottom-right",
//           autoClose: 3000,
//         });
//       } catch (err) {
//         console.error('Error fetching transactions:', err);
//         setError('Failed to load orders. Please try again.');
//         setLoading(false);
//         toast.error("Could not load orders", {
//           position: "bottom-right",
//         });

//         // Set fallback data for demo purposes
//         setTransactions([
//           {
//             transactionId: '1',
//             totalAmount: 7500,
//             discount: 1500,
//             paidAmount: 6000,
//             due: 1500,
//             note: "Customer will pay remaining amount next week",
//             paymentType: "cash",
//             createdAt: "2025-04-12T10:30:00.000Z"
//           },
//           {
//             transactionId: '2',
//             totalAmount: 12000,
//             discount: 0,
//             paidAmount: 12000,
//             due: 0,
//             note: "",
//             paymentType: "card",
//             createdAt: "2025-04-13T09:15:00.000Z"
//           },
//           {
//             transactionId: '3',
//             totalAmount: 5200,
//             discount: 200,
//             paidAmount: 5000,
//             due: 200,
//             note: "Regular customer discount applied",
//             paymentType: "cash",
//             createdAt: "2025-04-13T14:45:00.000Z"
//           },
//           {
//             transactionId: '4',
//             totalAmount: 8750,
//             discount: 250,
//             paidAmount: 8750,
//             due: 0,
//             note: "Bulk purchase discount",
//             paymentType: "online",
//             createdAt: "2025-04-11T16:20:00.000Z"
//           }
//         ]);
//       }
//     };

//     fetchTransactions();
//   }, []);

//   // Fetch sales items for a specific transaction
//   const fetchSalesItems = async (transactionId) => {
//     try {
//       const salesRes = await axios.get(`${BASE_URL}/sales/bytransaction/${transactionId}`);
//       return salesRes.data;
//     } catch (err) {
//       console.error('Error fetching sales items:', err);

//       // Fallback data based on transaction ID
//       const fallbackItems = [
//         {
//           salesId: 1,
//           productId: 1,
//           price: 5000,
//           quantity: 1,
//           productName: "Premium Headphones",
//           category: "Electronics"
//         },
//         {
//           salesId: 2,
//           productId: 2,
//           price: 2000,
//           quantity: 1,
//           productName: "Wireless Mouse",
//           category: "Computer Accessories"
//         },
//         {
//           salesId: 3,
//           productId: 3,
//           price: 500,
//           quantity: 1,
//           productName: "USB Cable",
//           category: "Accessories"
//         }
//       ];

//       if (transactionId === '2') {
//         return [
//           {
//             salesId: 4,
//             productId: 4,
//             price: 8000,
//             quantity: 1,
//             productName: "Smart Watch",
//             category: "Wearables"
//           },
//           {
//             salesId: 5,
//             productId: 5,
//             price: 4000,
//             quantity: 1,
//             productName: "Bluetooth Speaker",
//             category: "Audio"
//           }
//         ];
//       } else if (transactionId === '3') {
//         return [
//           {
//             salesId: 6,
//             productId: 6,
//             price: 5200,
//             quantity: 1,
//             productName: "Wireless Earbuds",
//             category: "Audio"
//           }
//         ];
//       } else if (transactionId === '4') {
//         return [
//           {
//             salesId: 7,
//             productId: 7,
//             price: 3500,
//             quantity: 2,
//             productName: "External Hard Drive",
//             category: "Storage"
//           },
//           {
//             salesId: 8,
//             productId: 8,
//             price: 1750,
//             quantity: 1,
//             productName: "Keyboard",
//             category: "Computer Accessories"
//           }
//         ];
//       }

//       return fallbackItems;
//     }
//   };

//   const handleViewOrder = async (transaction) => {
//     setSelectedTransaction(transaction);
//     const items = await fetchSalesItems(transaction.transactionId);
//     setSalesItems(items);
//     setShowModal(true);
//   };

//   const handlePrint = () => {
//     toast.info("Preparing receipt for printing...", {
//       position: "bottom-right",
//     });

//     // Create a new window for the POS receipt
//     const printWindow = window.open('', '_blank');

//     // Calculate values for the receipt
//     const totalItemsSold = salesItems.reduce((total, item) => total + item.quantity, 0);
//     const subtotal = salesItems.reduce((total, item) => total + (item.price * item.quantity), 0);

//     // Generate the receipt HTML
//     printWindow.document.write(`
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>POS Receipt - Order #${selectedTransaction.transactionId}</title>
//         <style>
//           body {
//             font-family: 'Courier New', monospace;
//             width: 300px;
//             margin: 0 auto;
//             padding: 10px;
//           }
//           .receipt-header {
//             text-align: center;
//             margin-bottom: 10px;
//             border-bottom: 1px dashed #000;
//             padding-bottom: 10px;
//           }
//           .store-name {
//             font-size: 20px;
//             font-weight: bold;
//           }
//           .store-info {
//             font-size: 12px;
//             margin: 5px 0;
//           }
//           .receipt-title {
//             text-align: center;
//             font-weight: bold;
//             margin: 10px 0;
//             font-size: 16px;
//           }
//           .order-info {
//             margin: 10px 0;
//             font-size: 12px;
//           }
//           .items-table {
//             width: 100%;
//             border-collapse: collapse;
//             margin: 10px 0;
//           }
//           .items-table th, .items-table td {
//             text-align: left;
//             font-size: 12px;
//             padding: 3px 0;
//           }
//           .items-table .right {
//             text-align: right;
//           }
//           .summary {
//             margin-top: 10px;
//             border-top: 1px dashed #000;
//             padding-top: 10px;
//           }
//           .summary-row {
//             display: flex;
//             justify-content: space-between;
//             font-size: 12px;
//             margin: 5px 0;
//           }
//           .total-row {
//             font-weight: bold;
//             font-size: 14px;
//           }
//           .footer {
//             margin-top: 20px;
//             text-align: center;
//             font-size: 12px;
//             border-top: 1px dashed #000;
//             padding-top: 10px;
//           }
//           .note {
//             font-style: italic;
//             font-size: 12px;
//             margin: 10px 0;
//             padding: 5px;
//             border: 1px solid #ddd;
//           }
//           @media print {
//             body {
//               width: 80mm; /* Standard thermal receipt width */
//             }
//           }
//         </style>
//       </head>
//       <body>
//         <div class="receipt-header">
//           <div class="store-name">MY STORE</div>
//           <div class="store-info">123 Main Street, City</div>
//           <div class="store-info">Tel: 123-456-7890</div>
//           <div class="store-info">Email: store@example.com</div>
//         </div>

//         <div class="receipt-title">SALES RECEIPT</div>

//         <div class="order-info">
//           <div>Order #: ${selectedTransaction.transactionId}</div>
//           <div>Date: ${new Date(selectedTransaction.createdAt).toLocaleDateString()}</div>
//           <div>Time: ${new Date(selectedTransaction.createdAt).toLocaleTimeString()}</div>
//           <div>Customer: Walk-in Customer</div>
//           <div>Payment: ${selectedTransaction.paymentType.toUpperCase()}</div>
//         </div>

//         <table class="items-table">
//           <thead>
//             <tr>
//               <th>Item</th>
//               <th>Qty</th>
//               <th>Price</th>
//               <th class="right">Total</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${salesItems.map(item => `
//               <tr>
//                 <td>${item.productName}</td>
//                 <td>${item.quantity}</td>
//                 <td>${item.price.toFixed(2)}</td>
//                 <td class="right">${(item.price * item.quantity).toFixed(2)}</td>
//               </tr>
//             `).join('')}
//           </tbody>
//         </table>

//         <div class="summary">
//           <div class="summary-row">
//             <span>Subtotal:</span>
//             <span>Rs ${subtotal.toFixed(2)}</span>
//           </div>
//           ${selectedTransaction.discount > 0 ? `
//             <div class="summary-row">
//               <span>Discount:</span>
//               <span>Rs ${selectedTransaction.discount.toFixed(2)}</span>
//             </div>
//           ` : ''}
//           <div class="summary-row total-row">
//             <span>TOTAL:</span>
//             <span>Rs ${selectedTransaction.totalAmount.toFixed(2)}</span>
//           </div>
//           <div class="summary-row">
//             <span>Paid Amount:</span>
//             <span>Rs ${selectedTransaction.paidAmount.toFixed(2)}</span>
//           </div>
//           <div class="summary-row">
//             <span>Due Amount:</span>
//             <span>Rs ${selectedTransaction.due.toFixed(2)}</span>
//           </div>
//         </div>

//         ${selectedTransaction.note ? `
//           <div class="note">
//             Note: ${selectedTransaction.note}
//           </div>
//         ` : ''}

//         <div class="footer">
//           <div>Total Items: ${totalItemsSold}</div>
//           <div>Thank you for shopping with us!</div>
//           <div>Please come again</div>
//           <div>www.mystore.com</div>
//         </div>
//       </body>
//       </html>
//     `);

//     printWindow.document.close();

//     // Wait for resources to load then print
//     setTimeout(() => {
//       printWindow.print();
//       // Close the window after print (optional)
//       // printWindow.close();
//     }, 500);
//   };

//   if (loading) {
//     return (
//       <div className="app-container">
//         <EcomSidebar />
//         <div className="main-content d-flex justify-content-center align-items-center">
//           <Spinner animation="border" role="status" variant="primary">
//             <span className="visually-hidden">Loading...</span>
//           </Spinner>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="app-container">
//       {/* Sidebar */}
//       <EcomSidebar />

//       {/* Main Content */}
//       <div className="main-content">
//         <Container fluid>
//           <Row>
//             <StatsCards />
//           </Row>

//           {/* Orders List */}
//           <Row className="mb-4">
//             <Col>
//               <Card className="orders-list-card">
//                 <Card.Header className="bg-white d-flex justify-content-between align-items-center">
//                   <h5 className="mb-0">Recent Orders</h5>
//                   <div className="d-flex gap-2">
//                     <div className="order-search d-none d-md-block">
//                       <input type="text" className="form-control" placeholder="Search orders..." />
//                     </div>
//                     <Button variant="outline-secondary" size="sm">Filter</Button>
//                   </div>
//                 </Card.Header>
//                 <Card.Body className="p-0">
//                   <div className="table-responsive">
//                     <Table hover className="orders-table mb-0">
//                       <thead>
//                         <tr>
//                           <th>Order ID</th>
//                           <th>Date</th>
//                           <th className="d-none d-md-table-cell">Payment</th>
//                           <th className="d-none d-md-table-cell">Status</th>
//                           <th>Amount</th>
//                           <th>Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {transactions.map((transaction) => (
//                           <tr key={transaction.transactionId}>
//                             <td>#{transaction.transactionId}</td>
//                             <td>
//                               <div>{new Date(transaction.createdAt).toLocaleDateString()}</div>
//                               <small className="text-muted">{new Date(transaction.createdAt).toLocaleTimeString()}</small>
//                             </td>
//                             <td className="d-none d-md-table-cell text-capitalize">{transaction.paymentType}</td>
//                             <td className="d-none d-md-table-cell">
//                               <Badge bg={transaction.due > 0 ? "warning" : "success"}>
//                                 {transaction.due > 0 ? "Partially Paid" : "Paid"}
//                               </Badge>
//                             </td>
//                             <td>
//                               <span className="fw-bold">Rs {transaction.totalAmount.toFixed(2)}</span>
//                             </td>
//                             <td>
//                               <Button 
//                                 variant="light" 
//                                 size="sm" 
//                                 className="view-btn"
//                                 onClick={() => handleViewOrder(transaction)}
//                               >
//                                 <FaEye /> <span className="d-none d-md-inline">View</span>
//                               </Button>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </Table>
//                   </div>

//                   {transactions.length === 0 && (
//                     <div className="empty-state text-center py-5">
//                       <h5 className="text-muted">No orders found.</h5>
//                       <p>Place your first order to get started!</p>
//                     </div>
//                   )}
//                 </Card.Body>
//                 <Card.Footer className="bg-white d-flex justify-content-between align-items-center">
//                   <div className="text-muted">Showing {transactions.length} orders</div>
//                   <div className="pagination-controls">
//                     <Button variant="outline-secondary" size="sm" disabled>Previous</Button>
//                     <span className="mx-2">Page 1 of 1</span>
//                     <Button variant="outline-secondary" size="sm" disabled>Next</Button>
//                   </div>
//                 </Card.Footer>
//               </Card>
//             </Col>
//           </Row>
//         </Container>
//       </div>

//       {/* Order Details Modal */}
//       <Modal 
//         show={showModal} 
//         onHide={() => setShowModal(false)}
//         size="lg"
//         centered
//         className="order-details-modal"
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Order #{selectedTransaction?.transactionId}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedTransaction && (
//             <>
//               <div className="order-header d-flex flex-wrap justify-content-between mb-4">
//                 <div className="order-info">
//                   <p className="mb-1">
//                     <strong>Date:</strong> {new Date(selectedTransaction.createdAt).toLocaleString()}
//                   </p>
//                   <p className="mb-1">
//                     <strong>Payment Method:</strong> {selectedTransaction.paymentType}
//                   </p>
//                   <p className="mb-0">
//                     <strong>Status:</strong>{' '}
//                     <Badge bg={selectedTransaction.due > 0 ? "warning" : "success"}>
//                       {selectedTransaction.due > 0 ? "Partially Paid" : "Fully Paid"}
//                     </Badge>
//                   </p>
//                 </div>

//                 <div className="payment-summary text-end">
//                   <h5 className="mb-1">Total: Rs {selectedTransaction.totalAmount.toFixed(2)}</h5>
//                   <p className="mb-1">Paid: Rs {selectedTransaction.paidAmount.toFixed(2)}</p>
//                   <p className="mb-0">
//                     Due: <span className={selectedTransaction.due > 0 ? "text-danger" : "text-success"}>
//                       Rs {selectedTransaction.due.toFixed(2)}
//                     </span>
//                   </p>
//                 </div>
//               </div>

//               <h6 className="border-bottom pb-2 mb-3">Order Items</h6>

//               <div className="table-responsive">
//                 <Table hover className="items-table">
//                   <thead>
//                     <tr>
//                       <th>Item</th>
//                       <th>Price</th>
//                       <th>Quantity</th>
//                       <th className="text-end">Total</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {salesItems.map((item) => (
//                       <tr key={item.salesId}>
//                         <td>
//                           <div className="d-flex align-items-center">
//                             <div className="product-color-indicator me-2" 
//                                 style={{ backgroundColor: getColorForProduct(item.productName) }}></div>
//                             <div>
//                               <div className="item-name">{item.productName}</div>
//                               <small className="text-muted">{item.category}</small>
//                             </div>
//                           </div>
//                         </td>
//                         <td>Rs {item.price.toFixed(2)}</td>
//                         <td>{item.quantity}</td>
//                         <td className="text-end">Rs {(item.price * item.quantity).toFixed(2)}</td>
//                       </tr>
//                     ))}
//                     <tr className="summary-row">
//                       <td colSpan="3" className="text-end"><strong>Subtotal:</strong></td>
//                       <td className="text-end">
//                         Rs {salesItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}
//                       </td>
//                     </tr>
//                     {selectedTransaction.discount > 0 && (
//                       <tr className="summary-row discount-row">
//                         <td colSpan="3" className="text-end"><strong>Discount:</strong></td>
//                         <td className="text-end text-success">- Rs {selectedTransaction.discount.toFixed(2)}</td>
//                       </tr>
//                     )}
//                     <tr className="summary-row total-row">
//                       <td colSpan="3" className="text-end"><strong>Total:</strong></td>
//                       <td className="text-end fw-bold">Rs {selectedTransaction.totalAmount.toFixed(2)}</td>
//                     </tr>
//                   </tbody>
//                 </Table>
//               </div>

//               {selectedTransaction.note && (
//                 <div className="order-note mt-4">
//                   <h6 className="border-bottom pb-2 mb-3">Order Note</h6>
//                   <p className="mb-0 p-3 bg-light rounded">{selectedTransaction.note}</p>
//                 </div>
//               )}
//             </>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="outline-secondary" onClick={() => setShowModal(false)}>Close</Button>
//           <Button variant="success" onClick={handlePrint}>
//             <FaPrint className="me-1" /> Print Receipt
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Toast notifications container */}
//       <ToastContainer />
//     </div>
//   );
// }

// // Helper function to generate consistent colors for products
// function getColorForProduct(productName) {
//   const colors = [
//     '#FF6B6B', '#FFD166', '#06D6A0', '#118AB2', '#073B4C',
//     '#8338EC', '#3A86FF', '#FB5607', '#FFBE0B', '#FF006E'
//   ];

//   // Simple hash function to get consistent colors
//   let hash = 0;
//   for (let i = 0; i < productName.length; i++) {
//     hash = productName.charCodeAt(i) + ((hash << 5) - hash);
//   }

//   const index = Math.abs(hash) % colors.length;
//   return colors[index];
// }

// export default EcommerceOrderList;




// import React, { useState, useEffect } from 'react';
// import { Container, Card, Row, Col, Button, Badge, Table, Spinner, Modal } from 'react-bootstrap';
// import { FaHome, FaEye, FaPrint } from 'react-icons/fa';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import axios from 'axios';
// import EcomSidebar from '../components/ecomSidebar';
// import StatsCards from '../components/StatsCards';
// import './EcommerceOrder.css';

// // Base URL for API
// import { BASE_URL } from '../../config';

// function EcommerceOrderList() {
//   const [loading, setLoading] = useState(true);
//   const [transactions, setTransactions] = useState([]);
//   const [selectedTransaction, setSelectedTransaction] = useState(null);
//   const [salesItems, setSalesItems] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const pageSize = 10;

//   // Fetch transactions
//   useEffect(() => {
//     const fetchTransactions = async () => {
//       try {
//         setLoading(true);
//         const transactionsRes = await axios.get(`${BASE_URL}/api/transactions/all?page=${currentPage}&pageSize=${pageSize}`);
//         setTransactions(transactionsRes.data);
//         // Set total pages based on total count (this assumes your API returns pagination info)
//         // You might need to adjust this according to your actual API response
//         setTotalPages(Math.ceil(transactionsRes.data.length / pageSize) || 1);
//         setLoading(false);

//       } catch (err) {
//         console.error('Error fetching transactions:', err);
//         setError('Failed to load orders. Please try again.');
//         setLoading(false);


//         // Set fallback data for demo purposes
//         setTransactions([
//           {
//             transactionId: '1',
//             price: 7500,
//             discount: 1500,
//             totalAmount: 6000,
//             paidAmount: 6000,
//             due: 0,
//             note: "Customer will pay remaining amount next week",
//             paymentType: "cash",
//             createdAt: "2025-04-12T10:30:00.000Z"
//           },
//           {
//             transactionId: '2',
//             price: 12000,
//             discount: 0,
//             totalAmount: 12000,
//             paidAmount: 12000,
//             due: 0,
//             note: "",
//             paymentType: "card",
//             createdAt: "2025-04-13T09:15:00.000Z"
//           },
//           {
//             transactionId: '3',
//             price: 5200,
//             discount: 200,
//             totalAmount: 5000,
//             paidAmount: 5000,
//             due: 0,
//             note: "Regular customer discount applied",
//             paymentType: "cash",
//             createdAt: "2025-04-13T14:45:00.000Z"
//           },
//           {
//             transactionId: '4',
//             price: 8750,
//             discount: 250,
//             totalAmount: 8500,
//             paidAmount: 8500,
//             due: 0,
//             note: "Bulk purchase discount",
//             paymentType: "online",
//             createdAt: "2025-04-11T16:20:00.000Z"
//           }
//         ]);
//       }
//     };

//     fetchTransactions();
//   }, [currentPage]);

//   // Fetch sales items for a specific transaction
//   const fetchSalesItems = async (transactionId) => {
//     try {
//       const salesRes = await axios.get(`${BASE_URL}/sales/bytransaction/${transactionId}`);
//       return salesRes.data;
//     } catch (err) {
//       console.error('Error fetching sales items:', err);

//       // Fetch product details for items
//       try {
//         // This would be a real call to get product details in a production environment
//         // const productRes = await axios.get(`${BASE_URL}/product/${salesItem.productId}`);
//         // return productRes.data;
//       } catch (productErr) {
//         console.error('Error fetching product details:', productErr);
//       }

//       // Fallback data based on transaction ID
//       if (transactionId === '1') {
//         return [
//           {
//             salesId: 1,
//             productId: 1,
//             price: 5000,
//             quantity: 1,
//             productName: "Premium Arabica Coffee",
//             category: "Coffee Beans"
//           },
//           {
//             salesId: 2,
//             productId: 2,
//             price: 2000,
//             quantity: 1,
//             productName: "Coffee Filter",
//             category: "Accessories"
//           },
//           {
//             salesId: 3,
//             productId: 3,
//             price: 500,
//             quantity: 1,
//             productName: "Tea Strainer",
//             category: "Accessories"
//           }
//         ];
//       } else if (transactionId === '2') {
//         return [
//           {
//             salesId: 4,
//             productId: 4,
//             price: 8000,
//             quantity: 1,
//             productName: "Coffee Machine",
//             category: "Equipment"
//           },
//           {
//             salesId: 5,
//             productId: 5,
//             price: 4000,
//             quantity: 1,
//             productName: "Ceylon Tea Collection",
//             category: "Tea"
//           }
//         ];
//       } else if (transactionId === '3') {
//         return [
//           {
//             salesId: 6,
//             productId: 6,
//             price: 5200,
//             quantity: 1,
//             productName: "Specialty Tea Bundle",
//             category: "Tea"
//           }
//         ];
//       } else if (transactionId === '4') {
//         return [
//           {
//             salesId: 7,
//             productId: 7,
//             price: 3500,
//             quantity: 2,
//             productName: "Coffee Grinder",
//             category: "Equipment"
//           },
//           {
//             salesId: 8,
//             productId: 8,
//             price: 1750,
//             quantity: 1,
//             productName: "Tea Infuser",
//             category: "Accessories"
//           }
//         ];
//       }

//       return [];
//     }
//   };

//   const handleViewOrder = async (transaction) => {
//     setSelectedTransaction(transaction);
//     const items = await fetchSalesItems(transaction.transactionId);
//     setSalesItems(items);
//     setShowModal(true);
//   };

//   const handlePrint = (transaction) => {
//     if (!transaction) {
//       if (selectedTransaction) {
//         transaction = selectedTransaction;
//       } else {
//         toast.error("No transaction selected for printing");
//         return;
//       }
//     }

//     toast.info("Preparing receipt for printing...", {
//       position: "bottom-right",
//     });

//     // Create a new window for the POS receipt
//     const printWindow = window.open('', '_blank');

//     // Calculate values for the receipt
//     const itemsForPrint = transaction === selectedTransaction ? salesItems : [];
//     const totalItemsSold = itemsForPrint.reduce((total, item) => total + item.quantity, 0);
//     const subtotal = transaction.price || 0;

//     // Generate the receipt HTML
//     printWindow.document.write(`
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>POS Receipt - Order #${transaction.transactionId}</title>
//         <style>
//           body {
//             font-family: 'Courier New', monospace;
//             width: 300px;
//             margin: 0 auto;
//             padding: 10px;
//           }
//           .receipt-header {
//             text-align: center;
//             margin-bottom: 10px;
//             border-bottom: 1px dashed #000;
//             padding-bottom: 10px;
//           }
//           .store-name {
//             font-size: 20px;
//             font-weight: bold;
//           }
//           .store-info {
//             font-size: 12px;
//             margin: 5px 0;
//           }
//           .receipt-title {
//             text-align: center;
//             font-weight: bold;
//             margin: 10px 0;
//             font-size: 16px;
//           }
//           .order-info {
//             margin: 10px 0;
//             font-size: 12px;
//           }
//           .items-table {
//             width: 100%;
//             border-collapse: collapse;
//             margin: 10px 0;
//           }
//           .items-table th, .items-table td {
//             text-align: left;
//             font-size: 12px;
//             padding: 3px 0;
//           }
//           .items-table .right {
//             text-align: right;
//           }
//           .summary {
//             margin-top: 10px;
//             border-top: 1px dashed #000;
//             padding-top: 10px;
//           }
//           .summary-row {
//             display: flex;
//             justify-content: space-between;
//             font-size: 12px;
//             margin: 5px 0;
//           }
//           .total-row {
//             font-weight: bold;
//             font-size: 14px;
//           }
//           .footer {
//             margin-top: 20px;
//             text-align: center;
//             font-size: 12px;
//             border-top: 1px dashed #000;
//             padding-top: 10px;
//           }
//           @media print {
//             body {
//               width: 80mm; /* Standard thermal receipt width */
//             }
//           }
//         </style>
//       </head>
//       <body>
//         <div class="receipt-header">
//           <div class="store-name">THE GOLDEN AROMA</div>
//           <div class="store-info">Katugastota, Kandy</div>
//           <div class="store-info">Tel: +94776369969 | +94763315419</div>
//           <div class="store-info">Email: goldenaroma01@gmail.com</div>
//         </div>

//         <div class="receipt-title">SALES RECEIPT</div>

//         <div class="order-info">
//           <div>Order #: ${transaction.transactionId}</div>
//           <div>Date: ${new Date(transaction.createdAt).toLocaleDateString()}</div>
//           <div>Time: ${new Date(transaction.createdAt).toLocaleTimeString()}</div>
//           <div>Customer: Walk-in Customer</div>
//           <div>Payment: ${transaction.paymentType ? transaction.paymentType.toUpperCase() : 'CASH'}</div>
//         </div>

//         <table class="items-table">
//           <thead>
//             <tr>
//               <th>Item</th>
//               <th>Qty</th>
//               <th>Price</th>
//               <th class="right">Total</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${itemsForPrint.map(item => `
//               <tr>
//                 <td>${item.productName}</td>
//                 <td>${item.quantity}</td>
//                 <td>${item.price.toFixed(2)}</td>
//                 <td class="right">${(item.price * item.quantity).toFixed(2)}</td>
//               </tr>
//             `).join('')}
//           </tbody>
//         </table>

//         <div class="summary">
//           <div class="summary-row">
//             <span>Subtotal:</span>
//             <span>Rs ${subtotal.toFixed(2)}</span>
//           </div>
//           ${transaction.discount > 0 ? `
//             <div class="summary-row">
//               <span>Discount:</span>
//               <span>Rs ${transaction.discount.toFixed(2)}</span>
//             </div>
//           ` : ''}
//           <div class="summary-row total-row">
//             <span>TOTAL:</span>
//             <span>Rs ${transaction.totalAmount.toFixed(2)}</span>
//           </div>
//           <div class="summary-row">
//             <span>Paid Amount:</span>
//             <span>Rs ${transaction.paidAmount.toFixed(2)}</span>
//           </div>
//           <div class="summary-row">
//             <span>Due Amount:</span>
//             <span>Rs ${transaction.due.toFixed(2)}</span>
//           </div>
//         </div>

//         <div class="footer">
//           <div>Total Items: ${totalItemsSold}</div>
//           <div>Thank you for being with us!</div>
//           <div>Www.thegoldenaroma.com</div>
//         </div>
//       </body>
//       </html>
//     `);

//     printWindow.document.close();

//     // Wait for resources to load then print
//     setTimeout(() => {
//       printWindow.print();
//     }, 500);
//   };

//   const handlePageChange = (page) => {
//     if (page > 0 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="app-container">
//         <EcomSidebar />
//         <div className="main-content d-flex justify-content-center align-items-center">
//           <Spinner animation="border" role="status" variant="primary">
//             <span className="visually-hidden">Loading...</span>
//           </Spinner>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="app-container">
//       {/* Sidebar */}
//       <EcomSidebar />

//       {/* Main Content */}
//       <div className="main-content">
//         <Container fluid>
//           <Row>
//             <StatsCards />
//           </Row>

//           {/* Orders List */}
//           <Row className="mb-4">
//             <Col>
//               <Card className="orders-list-card">
//                 <Card.Header className="bg-white d-flex justify-content-between align-items-center">
//                   <h5 className="mb-0">Recent Orders</h5>
//                   <div className="d-flex gap-2">
//                     <div className="order-search d-none d-md-block">
//                       <input type="text" className="form-control" placeholder="Search orders..." />
//                     </div>
//                     <Button variant="outline-secondary" size="sm">Filter</Button>
//                   </div>
//                 </Card.Header>
//                 <Card.Body className="p-0">
//                   <div className="table-responsive">
//                     <Table hover className="orders-table mb-0">
//                       <thead>
//                         <tr>
//                           <th>Order Number</th>
//                           <th>Date</th>
//                           <th className="d-none d-md-table-cell">Price Before Discount</th>
//                           <th className="d-none d-md-table-cell">Discount</th>
//                           <th>Total Price</th>
//                           <th className="d-none d-md-table-cell">Paid</th>
//                           <th className="d-none d-md-table-cell">Due</th>
//                           <th>Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {transactions.map((transaction) => (
//                           <tr key={transaction.transactionId}>
//                             <td>#{transaction.transactionId}</td>
//                             <td>
//                               <div>{new Date(transaction.createdAt).toLocaleDateString()}</div>
//                               <small className="text-muted">{new Date(transaction.createdAt).toLocaleTimeString()}</small>
//                             </td>
//                             <td className="d-none d-md-table-cell">Rs {transaction.price.toFixed(2)}</td>
//                             <td className="d-none d-md-table-cell">Rs {transaction.discount.toFixed(2)}</td>
//                             <td>
//                               <span className="fw-bold">Rs {transaction.totalAmount.toFixed(2)}</span>
//                             </td>
//                             <td className="d-none d-md-table-cell">Rs {transaction.paidAmount.toFixed(2)}</td>
//                             <td className="d-none d-md-table-cell">
//                               <span className={transaction.due > 0 ? "text-danger" : "text-success"}>
//                                 Rs {transaction.due.toFixed(2)}
//                               </span>
//                             </td>
//                             <td>
//                               <div className="d-flex gap-1">
//                                 <Button 
//                                   variant="warning" 
//                                   size="sm" 
//                                   className="view-btn"
//                                   onClick={() => handleViewOrder(transaction)}
//                                 >
//                                   <FaEye />
//                                 </Button>
//                                 <Button 
//                                   variant="success" 
//                                   size="sm" 
//                                   className="print-btn"
//                                   onClick={() => handlePrint(transaction)}
//                                 >
//                                   <FaPrint />
//                                 </Button>
//                               </div>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </Table>
//                   </div>

//                   {transactions.length === 0 && (
//                     <div className="empty-state text-center py-5">
//                       <h5 className="text-muted">No orders found.</h5>
//                       <p>Place your first order to get started!</p>
//                     </div>
//                   )}
//                 </Card.Body>
//                 <Card.Footer className="bg-white d-flex justify-content-between align-items-center">
//                   <div className="text-muted">Showing {transactions.length} orders</div>
//                   <div className="pagination-controls">
//                     <Button 
//                       variant="outline-secondary" 
//                       size="sm" 
//                       disabled={currentPage === 1}
//                       onClick={() => handlePageChange(currentPage - 1)}
//                     >
//                       Previous
//                     </Button>
//                     <span className="mx-2">Page {currentPage} of {totalPages}</span>
//                     <Button 
//                       variant="outline-secondary" 
//                       size="sm" 
//                       disabled={currentPage === totalPages}
//                       onClick={() => handlePageChange(currentPage + 1)}
//                     >
//                       Next
//                     </Button>
//                   </div>
//                 </Card.Footer>
//               </Card>
//             </Col>
//           </Row>
//         </Container>
//       </div>

//       {/* Order Details Modal */}
//       <Modal 
//         show={showModal} 
//         onHide={() => setShowModal(false)}
//         size="lg"
//         centered
//         className="order-details-modal"
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Order #{selectedTransaction?.transactionId}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedTransaction && (
//             <>
//               <div className="order-header d-flex flex-wrap justify-content-between mb-4">
//                 <div className="order-info">
//                   <p className="mb-1">
//                     <strong>Date:</strong> {new Date(selectedTransaction.createdAt).toLocaleString()}
//                   </p>
//                   <p className="mb-1">
//                     <strong>Payment Method:</strong> {selectedTransaction.paymentType}
//                   </p>
//                   <p className="mb-0">
//                     <strong>Status:</strong>{' '}
//                     <Badge bg={selectedTransaction.due > 0 ? "warning" : "success"}>
//                       {selectedTransaction.due > 0 ? "Partially Paid" : "Fully Paid"}
//                     </Badge>
//                   </p>
//                 </div>

//                 <div className="payment-summary text-end">
//                   <h5 className="mb-1">Total: Rs {selectedTransaction.totalAmount.toFixed(2)}</h5>
//                   <p className="mb-1">Paid: Rs {selectedTransaction.paidAmount.toFixed(2)}</p>
//                   <p className="mb-0">
//                     Due: <span className={selectedTransaction.due > 0 ? "text-danger" : "text-success"}>
//                       Rs {selectedTransaction.due.toFixed(2)}
//                     </span>
//                   </p>
//                 </div>
//               </div>

//               <h6 className="border-bottom pb-2 mb-3">Order Items</h6>

//               <div className="table-responsive">
//                 <Table hover className="items-table">
//                   <thead>
//                     <tr>
//                       <th>Item</th>
//                       <th>Price</th>
//                       <th>Quantity</th>
//                       <th className="text-end">Total</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {salesItems.map((item) => (
//                       <tr key={item.salesId}>
//                         <td>
//                           <div className="d-flex align-items-center">
//                             <div className="product-color-indicator me-2" 
//                                 style={{ backgroundColor: getColorForProduct(item.productName) }}></div>
//                             <div>
//                               <div className="item-name">{item.productName}</div>
//                               <small className="text-muted">{item.category}</small>
//                             </div>
//                           </div>
//                         </td>
//                         <td>Rs {item.price.toFixed(2)}</td>
//                         <td>{item.quantity}</td>
//                         <td className="text-end">Rs {(item.price * item.quantity).toFixed(2)}</td>
//                       </tr>
//                     ))}
//                     <tr className="summary-row">
//                       <td colSpan="3" className="text-end"><strong>Subtotal:</strong></td>
//                       <td className="text-end">
//                         Rs {selectedTransaction.price.toFixed(2)}
//                       </td>
//                     </tr>
//                     {selectedTransaction.discount > 0 && (
//                       <tr className="summary-row discount-row">
//                         <td colSpan="3" className="text-end"><strong>Discount:</strong></td>
//                         <td className="text-end text-success">- Rs {selectedTransaction.discount.toFixed(2)}</td>
//                       </tr>
//                     )}
//                     <tr className="summary-row total-row">
//                       <td colSpan="3" className="text-end"><strong>Total:</strong></td>
//                       <td className="text-end fw-bold">Rs {selectedTransaction.totalAmount.toFixed(2)}</td>
//                     </tr>
//                   </tbody>
//                 </Table>
//               </div>

//               {selectedTransaction.note && (
//                 <div className="order-note mt-4">
//                   <h6 className="border-bottom pb-2 mb-3">Order Note</h6>
//                   <p className="mb-0 p-3 bg-light rounded">{selectedTransaction.note}</p>
//                 </div>
//               )}
//             </>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="outline-secondary" onClick={() => setShowModal(false)}>Close</Button>
//           <Button variant="success" onClick={() => handlePrint(selectedTransaction)}>
//             <FaPrint className="me-1" /> Print Receipt
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Toast notifications container */}
//       <ToastContainer />
//     </div>
//   );
// }

// // Helper function to generate consistent colors for products
// function getColorForProduct(productName) {
//   const colors = [
//     '#FF6B6B', '#FFD166', '#06D6A0', '#118AB2', '#073B4C',
//     '#8338EC', '#3A86FF', '#FB5607', '#FFBE0B', '#FF006E'
//   ];

//   // Simple hash function to get consistent colors
//   let hash = 0;
//   for (let i = 0; i < productName.length; i++) {
//     hash = productName.charCodeAt(i) + ((hash << 5) - hash);
//   }

//   const index = Math.abs(hash) % colors.length;
//   return colors[index];
// }

// export default EcommerceOrderList;



import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button, Badge, Table, Spinner, Modal } from 'react-bootstrap';
import { FaHome, FaEye, FaPrint } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import EcomSidebar from '../components/ecomSidebar';
import StatsCards from '../components/StatsCards';
import './EcommerceOrder.css';

// Base URL for API
// import { BASE_URL } from '../../config';
import { BASE_URL } from '../../config';

function EcommerceOrderList() {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  // Fetch transactions
  useEffect(() => {
    fetchTransactions();
  }, [currentPage]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/transactions/all?page=${currentPage}&pageSize=${pageSize}`);

      // Set transactions from API response
      setTransactions(response.data.transactions || response.data);

      // Calculate total pages if the API provides count information
      if (response.data.totalCount) {
        setTotalPages(Math.ceil(response.data.totalCount / pageSize));
      } else {
        // Fallback pagination calculation
        setTotalPages(Math.ceil(response.data.length / pageSize) || 1);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to load orders. Please try again later.');
      setLoading(false);
    }
  };

  // Fetch order items for a specific transaction
  const fetchOrderDetails = async (transaction) => {
    try {
      // Get sales items associated with this transaction
      const response = await axios.get(`${BASE_URL}/salesGet?transactionId=${transaction.transactionId}`);
      let salesItems = response.data;

      // Filter sales items for this transaction if not already filtered by the API
      if (Array.isArray(salesItems)) {
        salesItems = salesItems.filter(item => item.transactionId === transaction.transactionId);
      }

      // For each sale item, fetch the product details
      const itemsWithDetails = await Promise.all(
        salesItems.map(async (item) => {
          if (item.productId) {
            try {
              const productResponse = await axios.get(`${BASE_URL}/product/${item.productId}`);
              return {
                ...item,
                productName: productResponse.data.productName || 'Unknown Product',
                category: productResponse.data.category?.categoryName || 'Uncategorized',
                productCode: productResponse.data.productCode || 'N/A'
              };
            } catch (err) {
              console.error(`Error fetching product details for ID ${item.productId}:`, err);
              return {
                ...item,
                productName: 'Product Not Found',
                category: 'Unknown',
                productCode: 'N/A'
              };
            }
          }
          return item;
        })
      );

      setOrderItems(itemsWithDetails);
    } catch (err) {
      console.error('Error fetching order details:', err);
      setOrderItems([]);
      toast.error("Failed to load order details");
    }
  };

  const handleViewOrder = async (transaction) => {
    setSelectedTransaction(transaction);
    await fetchOrderDetails(transaction);
    setShowModal(true);
  };

  const handlePrint = async (transaction) => {
    if (!transaction) {
      if (selectedTransaction) {
        transaction = selectedTransaction;
      } else {
        toast.error("No transaction selected for printing");
        return;
      }
    }
  
    // Fetch order details if not already available
    let itemsForPrint = [];
    if (transaction === selectedTransaction) {
      itemsForPrint = orderItems;
    } else {
      try {
        // Get sales items associated with this transaction
        const response = await axios.get(`${BASE_URL}/salesGet?transactionId=${transaction.transactionId}`);
        let salesItems = response.data;
  
        // Filter sales items for this transaction if not already filtered by the API
        if (Array.isArray(salesItems)) {
          salesItems = salesItems.filter(item => item.transactionId === transaction.transactionId);
        }
  
        // For each sale item, fetch the product details
        itemsForPrint = await Promise.all(
          salesItems.map(async (item) => {
            if (item.productId) {
              try {
                const productResponse = await axios.get(`${BASE_URL}/product/${item.productId}`);
                return {
                  ...item,
                  productName: productResponse.data.productName || 'Unknown Product',
                  category: productResponse.data.category?.categoryName || 'Uncategorized',
                  productCode: productResponse.data.productCode || 'N/A'
                };
              } catch (err) {
                console.error(`Error fetching product details for ID ${item.productId}:`, err);
                return {
                  ...item,
                  productName: 'Product Not Found',
                  category: 'Unknown',
                  productCode: 'N/A'
                };
              }
            }
            return item;
          })
        );
      } catch (err) {
        console.error('Error fetching order details for printing:', err);
        toast.error("Failed to load order details for printing");
        return;
      }
    }
  
    toast.info("Preparing receipt for printing...", {
      position: "bottom-right",
    });
  
    // Create a new window for the POS receipt
    const printWindow = window.open('', '_blank');
  
    // Calculate values for the receipt
    const totalItemsSold = itemsForPrint.reduce((total, item) => total + (item.quantity || 0), 0);
    const subtotal = transaction.price || 0;
  
    // Generate the receipt HTML
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>POS Receipt - Order #${transaction.transactionId}</title>
        <style>
          body {
            font-family: 'Courier New', monospace;
            width: 300px;
            margin: 0 auto;
            padding: 10px;
          }
          .receipt-header {
            text-align: center;
            margin-bottom: 10px;
            border-bottom: 1px dashed #000;
            padding-bottom: 10px;
          }
          .store-name {
            font-size: 20px;
            font-weight: bold;
          }
          .store-info {
            font-size: 12px;
            margin: 5px 0;
          }
          .receipt-title {
            text-align: center;
            font-weight: bold;
            margin: 10px 0;
            font-size: 16px;
          }
          .order-info {
            margin: 10px 0;
            font-size: 12px;
          }
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
          }
          .items-table th, .items-table td {
            text-align: left;
            font-size: 12px;
            padding: 3px 0;
          }
          .items-table .right {
            text-align: right;
          }
          .summary {
            margin-top: 10px;
            border-top: 1px dashed #000;
            padding-top: 10px;
          }
          .summary-row {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            margin: 5px 0;
          }
          .total-row {
            font-weight: bold;
            font-size: 14px;
          }
          .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 12px;
            border-top: 1px dashed #000;
            padding-top: 10px;
          }
          @media print {
            body {
              width: 80mm; /* Standard thermal receipt width */
            }
          }
        </style>
      </head>
      <body>
        <div class="receipt-header">
          <div class="store-name">Liyanage Gas Store</div>
          <div class="store-info">Heerassagala Rd, Kandy 20000</div>
          <div class="store-info">Tel: 0812 225 884 | 071 453 4148</div>
        </div>
        
        <div class="receipt-title"> බිල් පත </div>
        
        <div class="order-info">
          <div>Order #: ${transaction.transactionId}</div>
          <div>දිනය: ${new Date(transaction.createdAt).toLocaleDateString()}</div>
          <div>වේලාව: ${new Date(transaction.createdAt).toLocaleTimeString()}</div>
          <div>Customer: Walk-in Customer</div>
          <div>Payment: ${transaction.paymentType ? transaction.paymentType.toUpperCase() : 'CASH'}</div>
        </div>
        
        <table class="items-table">
          <thead>
            <tr>
              <th>නිශ්පාදනය</th>
              <th>ප්‍රමාණය</th>
              <th>මිල</th>
              <th class="right">එකතුව</th>
            </tr>
          </thead>
          <tbody>
            ${itemsForPrint.map(item => `
              <tr>
                <td>${item.productName || 'Unknown Product'}</td>
                <td>${item.quantity || 1}</td>
                <td>${(item.price || 0).toFixed(2)}</td>
                <td class="right">${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="summary">
          <div class="summary-row">
            <span>Subtotal:</span>
            <span>Rs ${subtotal.toFixed(2)}</span>
          </div>
          ${transaction.discount > 0 ? `
            <div class="summary-row">
              <span>Discount:</span>
              <span>Rs ${transaction.discount.toFixed(2)}</span>
            </div>
          ` : ''}
          <div class="summary-row total-row">
            <span>TOTAL:</span>
            <span>Rs ${transaction.totalAmount.toFixed(2)}</span>
          </div>
          <div class="summary-row">
            <span>Paid Amount:</span>
            <span>Rs ${transaction.paidAmount.toFixed(2)}</span>
          </div>
          <div class="summary-row">
            <span>Due Amount:</span>
            <span>Rs ${transaction.due.toFixed(2)}</span>
          </div>
        </div>
        
        <div class="footer">
          <div>Total Items: ${totalItemsSold}</div>
          <div>Thank you for being with us!</div>
          <div>ස්තූතියි නැවත එන්න!</div>
        </div>
      </body>
      </html>
    `);
  
    printWindow.document.close();
  
    // Wait for resources to load then print
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className="app-container">
        <EcomSidebar />
        <div className="main-content d-flex justify-content-center align-items-center">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Sidebar */}
      <EcomSidebar />

      {/* Main Content */}
      <div className="main-content">
        <Container fluid>
          <Row>
            <StatsCards />
          </Row>

          {/* Orders List */}
          <Row className="mb-4">
            <Col>
              <Card className="orders-list-card">
                <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    Recent Orders - නව විකුණුම්
                  </h5>
                  <div className="d-flex gap-2">
                    <div className="order-search d-none d-md-block">
                      <input type="text" className="form-control" placeholder="Search orders..." />
                    </div>
                    <Button variant="outline-secondary" size="sm">Filter</Button>
                  </div>
                </Card.Header>
                <Card.Body className="p-0">
                  <div className="table-responsive">
                    <Table hover className="orders-table mb-0">
                      <thead>
                        <tr>
                          <th>Order Number</th>
                          <th>Date</th>
                          <th className="d-none d-md-table-cell">Price Before Discount</th>
                          <th className="d-none d-md-table-cell">Discount</th>
                          <th>Total Price</th>
                          <th className="d-none d-md-table-cell">Paid</th>
                          <th className="d-none d-md-table-cell">Due</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((transaction) => (
                          <tr key={transaction.transactionId}>
                            <td>#{transaction.transactionId}</td>
                            <td>
                              <div>{new Date(transaction.createdAt).toLocaleDateString()}</div>
                              <small className="text-muted">{new Date(transaction.createdAt).toLocaleTimeString()}</small>
                            </td>
                            <td className="d-none d-md-table-cell">Rs {transaction.price.toFixed(2)}</td>
                            <td className="d-none d-md-table-cell">Rs {transaction.discount.toFixed(2)}</td>
                            <td>
                              <span className="fw-bold">Rs {transaction.totalAmount.toFixed(2)}</span>
                            </td>
                            <td className="d-none d-md-table-cell">Rs {transaction.paidAmount.toFixed(2)}</td>
                            <td className="d-none d-md-table-cell">
                              <span className={transaction.due > 0 ? "text-danger" : "text-success"}>
                                Rs {transaction.due.toFixed(2)}
                              </span>
                            </td>
                            <td>
                              <div className="d-flex gap-1">
                                <Button
                                  variant="warning"
                                  size="sm"
                                  className="view-btn"
                                  onClick={() => handleViewOrder(transaction)}
                                >
                                  <FaEye />
                                </Button>
                                <Button
                                  variant="success"
                                  size="sm"
                                  className="print-btn"
                                  onClick={() => handlePrint(transaction)}
                                >
                                  <FaPrint />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>

                  {transactions.length === 0 && (
                    <div className="empty-state text-center py-5">
                      <h5 className="text-muted">No orders found.</h5>
                      <p>Place your first order to get started!</p>
                    </div>
                  )}
                </Card.Body>
                <Card.Footer className="bg-white d-flex justify-content-between align-items-center">
                  <div className="text-muted">Showing {transactions.length} orders</div>
                  <div className="pagination-controls">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      Previous
                    </Button>
                    <span className="mx-2">Page {currentPage} of {totalPages}</span>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Order Details Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
        className="order-details-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Order #{selectedTransaction?.transactionId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTransaction && (
            <>
              <div className="order-header d-flex flex-wrap justify-content-between mb-4">
                <div className="order-info">
                  <p className="mb-1">
                    <strong>
                      {/* Date: */}
                      විකිණූ දිනය හා වේලාව :
                      </strong> {new Date(selectedTransaction.createdAt).toLocaleString()}
                  </p>




                </div>

                <div className="payment-summary text-end">
                  <h5 className="mb-1">
                    {/* Total: */}
                    මුලු එකතුව : 
                     Rs {selectedTransaction.totalAmount.toFixed(2)}</h5>
                  <p className="mb-1">
                    {/* Paid: */}
                    ගෙවූ මුදල : 
                     Rs {selectedTransaction.paidAmount.toFixed(2)}</p>
                  <p className="mb-0">
                    {/* Due:  */}
                    හිග මුදල : 
                    <span className={selectedTransaction.due > 0 ? "text-danger" : "text-success"}>
                      Rs {selectedTransaction.due.toFixed(2)}
                    </span>
                  </p>
                </div>
              </div>
              <br />
              <h6 className="border-bottom pb-2 mb-3">Order Items</h6>

              <div className="table-responsive">
                <Table hover className="items-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th className="text-end">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderItems.map((item) => (
                      <tr key={item.salesId}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="product-color-indicator me-2"
                              style={{ backgroundColor: getColorForProduct(item.productName) }}></div>
                            <div>
                              <div className="item-name">{item.productName}</div>
                              <small className="text-muted">{item.category}</small>
                            </div>
                          </div>
                        </td>
                        <td>Rs {item.price.toFixed(2)}</td>
                        <td>{item.quantity}</td>
                        <td className="text-end">Rs {(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}

                    <br /><br />
                    {/* Summary rows - right aligned as requested */}

                  </tbody>
                </Table>
              </div>

              <div className="d-flex justify-content-end">
                <table>
                  <tbody>
                    <tr className="summary-row">
                      <td colSpan="3" className="text-end"><strong>Subtotal:</strong></td>
                      <td className="text-end">Rs {selectedTransaction.price.toFixed(2)}</td>
                    </tr>
                    {selectedTransaction.discount > 0 && (
                      <tr className="summary-row discount-row">
                        <td colSpan="3" className="text-end"><strong>Discount:</strong></td>
                        <td className="text-end text-success">- Rs {selectedTransaction.discount.toFixed(2)}</td>
                      </tr>
                    )}
                    <tr className="summary-row total-row">
                      <td colSpan="3" className="text-end"><strong>Total:</strong></td>
                      <td className="text-end fw-bold">Rs {selectedTransaction.totalAmount.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>


              {selectedTransaction.note && (
                <div className="order-note mt-4">
                  <h6 className="border-bottom pb-2 mb-3">Order Note</h6>
                  <p className="mb-0 p-3 bg-light rounded">{selectedTransaction.note}</p>
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="success" onClick={() => handlePrint(selectedTransaction)}>
            <FaPrint className="me-1" /> Print Receipt
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast notifications container */}
      <ToastContainer />
    </div>
  );
}

// Helper function to generate consistent colors for products
function getColorForProduct(productName) {
  const colors = [
    '#FF6B6B', '#FFD166', '#06D6A0', '#118AB2', '#073B4C',
    '#8338EC', '#3A86FF', '#FB5607', '#FFBE0B', '#FF006E'
  ];

  // Simple hash function to get consistent colors
  let hash = 0;
  for (let i = 0; i < (productName || '').length; i++) {
    hash = productName.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

export default EcommerceOrderList;
