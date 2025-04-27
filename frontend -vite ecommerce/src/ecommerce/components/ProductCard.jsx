// import React from 'react';
// import { Row, Col, Card, Button } from 'react-bootstrap';
// import { FaTimes, FaClipboardList } from 'react-icons/fa';
// import { products } from '../data/products';

// function ProductCard({ filteredProducts, addToCart }) {
//   return (
//     <>
//       <h5 className="mb-3">All Products</h5>
//       <Row>
//         {filteredProducts.map(product => (
//           <Col key={product.id} xs={12} sm={6} md={4} className="mb-4">
//             <Card className="product-card h-100">
//               <div className="product-img-container">
//                 <Card.Img variant="top" src={product.image} className="product-img" />
//                 <Button 
//                   variant="danger" 
//                   size="sm" 
//                   className="remove-btn"
//                 >
//                   <FaTimes />
//                 </Button>
//                 <Button 
//                   variant="primary" 
//                   size="sm" 
//                   className="edit-btn"
//                 >
//                   <FaClipboardList />
//                 </Button>
//               </div>
//               <Card.Body className="d-flex flex-column">
//                 <Card.Title className="product-name">{product.name}</Card.Title>
//                 <Card.Text className="product-price">${product.price}</Card.Text>
//                 <div className="product-stock mb-3">
//                   {product.stock} stock <span className="text-muted">available</span>
//                 </div>
//                 <Button 
//                   variant="warning" 
//                   className="add-to-cart-btn mt-auto"
//                   onClick={() => addToCart(product)}
//                 >
//                   Add Cart
//                 </Button>
//               </Card.Body>
//             </Card>
//           </Col>
//         ))}
//       </Row>
//     </>
//   );
// }

// export default ProductCard;