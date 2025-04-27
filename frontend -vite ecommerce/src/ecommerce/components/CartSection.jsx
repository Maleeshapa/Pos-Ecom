// import React from 'react';
// import { Card, Badge, Table, Button } from 'react-bootstrap';
// import { FaTimes, FaPlus, FaMinus } from 'react-icons/fa';

// function CartSection({ cart, removeFromCart, updateQuantity, subtotal, tax, total }) {
//   return (
//     <Card className="cart-card">
//       <Card.Body>
//         <div className="d-flex justify-content-between align-items-center mb-3">
//           <h5 className="mb-0">Cart Items</h5>
//           <Badge bg="secondary">{cart.length}</Badge>
//         </div>
//         <div className="d-flex justify-content-between align-items-center mb-3">
//           <h6 className="mb-0">Cart Table</h6>
//           <Badge bg="secondary">T1</Badge>
//         </div>

//         {cart.map(item => (
//           <div key={item.id} className="cart-item">
//             <div className="d-flex align-items-center mb-2">
//               <img src={item.image} alt={item.name} className="cart-item-img me-3" />
//               <div>
//                 <h6 className="mb-0">{item.name}</h6>
//                 <small className="text-muted">Category: {item.category}</small>
//                 <div className="item-price">${item.price}</div>
//               </div>
//               <Button 
//                 variant="light" 
//                 size="sm" 
//                 className="ms-auto remove-cart-btn"
//                 onClick={() => removeFromCart(item.id)}
//               >
//                 <FaTimes />
//               </Button>
//             </div>
//             <div className="quantity-control">
//               <Button 
//                 variant="light" 
//                 size="sm"
//                 onClick={() => updateQuantity(item.id, -1)}
//                 disabled={item.quantity <= 1}
//               >
//                 <FaMinus />
//               </Button>
//               <span className="quantity-display">{item.quantity}</span>
//               <Button 
//                 variant="light" 
//                 size="sm"
//                 onClick={() => updateQuantity(item.id, 1)}
//               >
//                 <FaPlus />
//               </Button>
//             </div>
//           </div>
//         ))}

//         <div className="cart-summary mt-4">
//           <Table borderless>
//             <tbody>
//               <tr>
//                 <td>Items ({cart.length})</td>
//                 <td className="text-end fw-bold">${subtotal.toFixed(2)}</td>
//               </tr>
//               <tr>
//                 <td>Tax (8%)</td>
//                 <td className="text-end fw-bold">${tax.toFixed(2)}</td>
//               </tr>
//               <tr className="total-row">
//                 <td>Total</td>
//                 <td className="text-end fw-bold">${total.toFixed(2)}</td>
//               </tr>
//             </tbody>
//           </Table>
//           <Button variant="warning" className="checkout-btn w-100">
//             Checkout
//           </Button>
//         </div>
//       </Card.Body>
//     </Card>
//   );
// }

// export default CartSection;