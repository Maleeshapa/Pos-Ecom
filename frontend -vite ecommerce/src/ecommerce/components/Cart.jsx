// import { Card, Button, ListGroup } from "react-bootstrap";

// const Cart = ({ cartItems, removeFromCart }) => {
//   const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
//   const tax = subtotal * 0.08;
//   const total = subtotal + tax;

//   return (
//     <Card className="shadow-sm">
//       <Card.Body>
//         <Card.Title>Cart Items ({cartItems.length})</Card.Title>
//         <ListGroup variant="flush">
//           {cartItems.map((item) => (
//             <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-center">
//               <div>
//                 <img src={item.image} alt={item.name} style={{ width: "40px", marginRight: "10px" }} />
//                 {item.name} - ${item.price} x {item.quantity}
//               </div>
//               <Button variant="danger" size="sm" onClick={() => removeFromCart(item.id)}>
//                 Remove
//               </Button>
//             </ListGroup.Item>
//           ))}
//         </ListGroup>
//         <hr />
//         <div className="d-flex justify-content-between">
//           <span>Subtotal</span>
//           <span>${subtotal.toFixed(2)}</span>
//         </div>
//         <div className="d-flex justify-content-between">
//           <span>Tax (8%)</span>
//           <span>${tax.toFixed(2)}</span>
//         </div>
//         <div className="d-flex justify-content-between fw-bold">
//           <span>Total</span>
//           <span>${total.toFixed(2)}</span>
//         </div>
//         <Button variant="warning" className="w-100 mt-3">
//           Checkout
//         </Button>
//       </Card.Body>
//     </Card>
//   );
// };

// export default Cart;

