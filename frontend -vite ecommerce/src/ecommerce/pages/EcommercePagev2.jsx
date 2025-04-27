import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Table, Form, InputGroup, Toast, ToastContainer } from 'react-bootstrap';
import { FaHome, FaClipboardList, FaWpforms, FaShoppingCart, FaUser, FaTimes, FaPlus, FaMinus, FaSearch, FaPercent, FaTag, FaTrash } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './EcommercePage.css';
import EcomSidebar from '../components/ecomSidebar';
import StatsCards from '../components/StatsCards';
import axios from 'axios';
import { toast } from 'react-toastify';

// Base URL for API
import { BASE_URL } from '../../config';

// Function to generate random color for placeholder images
const getRandomColor = () => {
  const colors = [
    '#ff6b6b', '#ffd700', '#ff6347', '#32cd32', '#a0522d', 
    '#f5deb3', '#6f4e37', '#ffc0cb', '#808000', '#ffa500',
    '#add8e6', '#9370db', '#3cb371', '#20b2aa', '#dda0dd'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Function to create placeholder image URL with product name and random color
const createPlaceholderImage = (productName) => {
  const color = getRandomColor();
  return `https://placehold.co/300x200/${color.replace('#', '')}/${color === '#f5deb3' || color === '#ffc0cb' || color === '#add8e6' ? '000' : 'fff'}?text=${encodeURIComponent(productName)}`;
};

function EcommercePage2() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [discountValue, setDiscountValue] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Show toast notification function
  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    toast[type](message);
    
    // Auto remove toast after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  };

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/categories`);
        // Transform API response to match our component format
        const formattedCategories = response.data.map(category => ({
          id: category.categoryId,
          name: category.categoryName,
          icon: getCategoryIcon(category.categoryName.toLowerCase()) // Add appropriate icon
        }));
        
        setCategories(formattedCategories);
      } catch (error) {
        showToast('Failed to fetch categories', 'error');
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Function to assign icons to categories based on name
  const getCategoryIcon = (categoryName) => {
    const icons = {
      vegetable: '🥦',
      vegetables: '🥦',
      fruit: '🍎',
      fruits: '🍎',
      drink: '🥤',
      drinks: '🥤',
      dessert: '🍰',
      desserts: '🍰',
      electronic: '💻',
      electronics: '💻',
      breakfast: '🍳',
      default: '📦'
    };
    
    // Try to find a match, or use default
    for (const key in icons) {
      if (categoryName.includes(key)) {
        return icons[key];
      }
    }
    return icons.default;
  };

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/products`);
        // Transform API response to match our component format
        const formattedProducts = response.data.map(item => {
          // Generate placeholder image if none exists
          const imageUrl = item.productImage || createPlaceholderImage(item.productName);
          
          return {
            id: item.productId,
            name: item.productName,
            price: parseFloat(item.productSellingPrice) || 0,
            stock: Math.floor(Math.random() * 100) + 10, // Random stock between 10-110
            category: item.category?.categoryName.toLowerCase() || 'uncategorized',
            image: imageUrl,
            description: item.productDescription || 'No description available'
          };
        });
        
        setProducts(formattedProducts);
      } catch (error) {
        showToast('Failed to fetch products', 'error');
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Filter products by category and search query
  const filteredProducts = products.filter(product => {
    // First filter by category
    const categoryMatch = activeCategory === 'all' || product.category === activeCategory;
    
    // Then filter by search query
    if (!searchQuery) return categoryMatch;
    
    const query = searchQuery.toLowerCase();
    return categoryMatch && (
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.price.toString().includes(query)
    );
  });

  // Add to cart function
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
      showToast(`Added another ${product.name} to cart`, 'success');
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
      showToast(`${product.name} added to cart`, 'success');
    }
    
    // If a discount was applied, remove it when adding new items
    if (discountApplied) {
      setDiscountApplied(false);
      setDiscountAmount(0);
      showToast('Discount removed due to cart changes', 'info');
    }
  };

  // Remove from cart function
  const removeFromCart = (id) => {
    const itemToRemove = cart.find(item => item.id === id);
    if (itemToRemove) {
      showToast(`${itemToRemove.name} removed from cart`, 'info');
    }
    
    setCart(cart.filter(item => item.id !== id));
    
    // If a discount was applied, remove it when removing items
    if (discountApplied) {
      setDiscountApplied(false);
      setDiscountAmount(0);
      showToast('Discount removed due to cart changes', 'info');
    }
  };

  // Update quantity function
  const updateQuantity = (id, change) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + change;
        if (newQuantity > 0) {
          if (change > 0) {
            showToast(`Added one more ${item.name}`, 'success');
          } else {
            showToast(`Reduced ${item.name} quantity`, 'info');
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      }
      return item;
    }));
    
    // If a discount was applied, remove it when updating quantities
    if (discountApplied) {
      setDiscountApplied(false);
      setDiscountAmount(0);
      showToast('Discount removed due to cart changes', 'info');
    }
  };

  // Apply discount value
  const applyDiscount = () => {
    const discountVal = parseFloat(discountValue);
    
    if (isNaN(discountVal) || discountVal <= 0) {
      showToast('Please enter a valid discount amount', 'error');
      return;
    }
    
    if (discountVal > subtotal) {
      showToast('Discount cannot exceed subtotal', 'error');
      return;
    }
    
    setDiscountAmount(discountVal);
    setDiscountApplied(true);
    showToast(`Discount of Rs ${discountVal.toFixed(2)} applied`, 'success');
  };

  // Clear discount
  const clearDiscount = () => {
    setDiscountValue('');
    setDiscountAmount(0);
    setDiscountApplied(false);
    showToast('Discount removed', 'info');
  };

  // Clear search function
  const clearSearch = () => {
    setSearchQuery('');
    showToast('Search cleared', 'info');
  };

  // Clear cart function
  const clearCart = () => {
    if (cart.length > 0) {
      setCart([]);
      setDiscountValue('');
      setDiscountAmount(0);
      setDiscountApplied(false);
      showToast('Cart cleared', 'info');
    }
  };

  // Checkout function
  const handleCheckout = () => {
    showToast('Processing your order...', 'success');
    // Here would be the actual checkout logic
    setTimeout(() => {
      setCart([]);
      setDiscountValue('');
      setDiscountAmount(0);
      setDiscountApplied(false);
      showToast('Order placed successfully!', 'success');
    }, 1500);
  };

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountedSubtotal = subtotal - discountAmount;
  const tax = discountedSubtotal * 0.08;
  const total = discountedSubtotal + tax;

  return (
    <div className="app-container">
      {/* Sidebar */}
      <EcomSidebar/>

      {/* Main Content */}
      <div className="main-content">
        <Container fluid>
          {/* Stats Cards */}
          <Row>
            <StatsCards/>
          </Row>

          {/* Toast Container */}
          {/* <ToastContainer position="bottom-end" className="p-3 mt-5">
            {toasts.map(toast => (
              <Toast 
                key={toast.id} 
                bg={toast.type === 'success' ? 'success' : toast.type === 'error' ? 'danger' : 'info'}
                delay={3000} 
                autohide
              >
                <Toast.Header closeButton={false}>
                  <strong className="me-auto">Notification</strong>
                </Toast.Header>
                <Toast.Body className={toast.type === 'success' ? 'text-white' : ''}>
                  {toast.message}
                </Toast.Body>
              </Toast>
            ))}
          </ToastContainer> */}

          {/* Main Content */}
          <Row>
          <Col lg={8} className="order-1 order-lg-1">
              <Card className="cart-card sticky-top" style={{top: '15px'}}>
                <Card.Header className="bg-primary text-white">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Shopping Cart</h5>
                    <Badge bg="light" text="dark" pill>{cart.length}</Badge>
                  </div>
                </Card.Header>
                <Card.Body>
                  {cart.length > 0 ? (
                    <>
                      <div className="cart-items-container">
                        {cart.map(item => (
                          <div key={item.id} className="cart-item">
                            <div className="d-flex align-items-center mb-2">
                              <img src={item.image} alt={item.name} className="cart-item-img me-3" />
                              <div>
                                <h6 className="mb-0">{item.name}</h6>
                                <small className="text-muted">{getCategoryIcon(item.category)} {item.category}</small>
                                <div className="item-price">Rs {item.price.toFixed(2)}</div>
                              </div>
                              <Button 
                                variant="light" 
                                size="sm" 
                                className="ms-auto remove-cart-btn"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <FaTimes />
                              </Button>
                            </div>
                            <div className="quantity-control">
                              <Button 
                                variant="light" 
                                size="sm"
                                onClick={() => updateQuantity(item.id, -1)}
                                disabled={item.quantity <= 1}
                              >
                                <FaMinus />
                              </Button>
                              <span className="quantity-display">{item.quantity}</span>
                              <Button 
                                variant="light" 
                                size="sm"
                                onClick={() => updateQuantity(item.id, 1)}
                              >
                                <FaPlus />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Discount Input Section */}
                      <div className="discount-section mt-4 mb-3">
                        <h6 className="mb-2">
                          <FaPercent className="me-2" /> Discount
                        </h6>
                        <InputGroup>
                          <InputGroup.Text>Rs</InputGroup.Text>
                          <Form.Control
                            type="number"
                            placeholder="Enter discount amount"
                            value={discountValue}
                            onChange={(e) => setDiscountValue(e.target.value)}
                            disabled={discountApplied}
                            min="0"
                            step="0.01"
                          />
                          {discountApplied ? (
                            <Button 
                              variant="danger" 
                              onClick={clearDiscount}
                            >
                              <FaTimes className="me-1" /> Clear
                            </Button>
                          ) : (
                            <Button 
                              variant="success" 
                              onClick={applyDiscount}
                              disabled={!discountValue}
                            >
                              Apply
                            </Button>
                          )}
                        </InputGroup>
                        {discountApplied && (
                          <div className="discount-badge mt-2">
                            <Badge bg="success" className="p-2">
                              <FaPercent className="me-1" /> Discount: Rs {discountAmount.toFixed(2)}
                            </Badge>
                          </div>
                        )}
                      </div>

                      <div className="cart-summary mt-4">
                        <Table borderless>
                          <tbody>
                            <tr>
                              <td>Subtotal</td>
                              <td className="text-end fw-bold">Rs {subtotal.toFixed(2)}</td>
                            </tr>
                            {discountApplied && (
                              <tr className="discount-row">
                                <td>Discount</td>
                                <td className="text-end fw-bold text-success">- Rs {discountAmount.toFixed(2)}</td>
                              </tr>
                            )}
                            <tr>
                              <td>Tax (8%)</td>
                              <td className="text-end fw-bold">Rs {tax.toFixed(2)}</td>
                            </tr>
                            <tr className="total-row">
                              <td>Total</td>
                              <td className="text-end fw-bold">Rs {total.toFixed(2)}</td>
                            </tr>
                          </tbody>
                        </Table>

                        <div className="d-flex gap-2">
                          <Button 
                            variant="outline-danger" 
                            className="w-25"
                            onClick={clearCart}
                          >
                            <FaTrash />
                          </Button>
                          <Button 
                            variant="warning" 
                            className="checkout-btn w-75"
                            disabled={cart.length === 0}
                            onClick={handleCheckout}
                          >
                            Checkout
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <div className="empty-cart-icon mb-3">
                        <FaShoppingCart size={40} className="text-muted" />
                      </div>
                      <p className="text-muted">Your cart is empty</p>
                      <small className="text-muted">Add some products to your cart</small>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
            {/* Products Section */}
            <Col lg={4} className="mb-4 order-2 order-lg-1">
              <Card>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">Categories</h5>
                    
                    {/* Modern Search Bar */}
                    <div className="modern-search-container">
                      <InputGroup className="modern-search-bar">
                        <InputGroup.Text className="search-icon">
                          <FaSearch size={14} />
                        </InputGroup.Text>
                        <Form.Control
                          placeholder="Search by name, category, price..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                          <Button 
                            variant="link" 
                            className="search-clear-btn"
                            onClick={clearSearch}
                          >
                            <FaTimes size={14} />
                          </Button>
                        )}
                      </InputGroup>
                    </div>
                  </div>

                  <div className="categories-container mb-4">
                    <Button 
                      variant={activeCategory === 'all' ? 'primary' : 'light'} 
                      className="category-btn me-2 mb-2"
                      onClick={() => setActiveCategory('all')}
                    >
                      All
                    </Button>
                    {categories.map(category => (
                      <Button 
                        key={category.id}
                        variant={activeCategory === category.name.toLowerCase() ? 'primary' : 'light'} 
                        className="category-btn me-2 mb-2"
                        onClick={() => setActiveCategory(category.name.toLowerCase())}
                      >
                        <span className="me-1">{category.icon}</span>
                        {category.name}
                      </Button>
                    ))}
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">Products</h5>
                    <Badge bg="primary" pill className="products-count">
                      {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                    </Badge>
                  </div>

                  <Row>
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map(product => (
                        <Col key={product.id} xs={12} sm={6} md={4} className="mb-4">
                          <Card className="product-card h-100">
                            <div className="product-img-container">
                              <Card.Img variant="top" src={product.image} className="product-img" />
                              <Badge 
                                bg={product.stock > 50 ? "success" : product.stock > 20 ? "warning" : "danger"} 
                                className="stock-indicator"
                              >
                                {product.stock} left
                              </Badge>
                            </div>
                            <Card.Body className="d-flex flex-column">
                              <Card.Title className="product-name">{product.name}</Card.Title>
                              <Card.Text className="product-category">
                                {getCategoryIcon(product.category)} {product.category}
                              </Card.Text>
                              <Card.Text className="product-price">Rs {product.price.toFixed(2)}</Card.Text>
                              <div className="product-description small text-muted mb-3 text-truncate">
                                {product.description}
                              </div>
                              <Button 
                                variant="primary" 
                                className="add-to-cart-btn mt-auto"
                                onClick={() => addToCart(product)}
                              >
                                <FaShoppingCart className="me-2" /> Add to Cart
                              </Button>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))
                    ) : (
                      <Col xs={12}>
                        <div className="text-center py-5">
                          <p className="text-muted">No products found with your search criteria</p>
                          {searchQuery && (
                            <Button 
                              variant="outline-secondary" 
                              size="sm" 
                              onClick={clearSearch}
                            >
                              Clear Search
                            </Button>
                          )}
                        </div>
                      </Col>
                    )}
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            {/* Cart Section */}
            
          </Row>
        </Container>
      </div>

      {/* CSS for the modern search and better UI */}
      <style jsx>{`
        .modern-search-container {
          max-width: 400px;
          width: 100%;
        }
        
        .modern-search-bar {
          border-radius: 50px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .modern-search-bar .form-control {
          border-left: none;
          padding-left: 0;
        }
        
        .search-icon {
          background-color: white;
          border-right: none;
        }
        
        .search-clear-btn {
          border: none;
          background: transparent;
          color: #6c757d;
          padding: 0 15px;
        }
        
        .category-btn {
          border-radius: 20px;
          padding: 6px 15px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.05);
          transition: all 0.2s;
        }
        
        .category-btn:hover {
          transform: translateY(-2px);
        }
        
        .product-card {
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 3px 10px rgba(0,0,0,0.1);
          transition: all 0.3s;
        }
        
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.15);
        }
        
        .product-img-container {
          position: relative;
          height: 140px;
          overflow: hidden;
        }
        
        .product-img {
          object-fit: cover;
          height: 100%;
          width: 100%;
        }
        
        .stock-indicator {
          position: absolute;
          top: 10px;
          right: 10px;
          border-radius: 20px;
          padding: 5px 10px;
          font-size: 0.7rem;
        }
        
        .cart-item {
          padding: 10px;
          margin-bottom: 10px;
          border-bottom: 1px solid #eee;
        }
        
        .cart-item-img {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 5px;
        }
        
        .quantity-control {
          display: flex;
          align-items: center;
          margin-top: 8px;
        }
        
        .quantity-display {
          margin: 0 10px;
          min-width: 30px;
          text-align: center;
        }
        
        .discount-section {
          background-color: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
        }
        
        .cart-summary {
          background-color: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
        }
        
        .total-row {
          font-size: 1.2rem;
          border-top: 2px dashed #dee2e6;
          padding-top: 8px;
        }
        
        .discount-row {
          color: #28a745;
        }
        
        .checkout-btn {
          font-weight: bold;
        }
        
        .products-count {
          font-size: 0.9rem;
          padding: 5px 12px;
        }
        
        .empty-cart-icon {
          opacity: 0.3;
        }
        
        /* Make sure cart is scrollable on smaller screens */
        .cart-items-container {
          max-height: 300px;
          overflow-y: auto;
        }
        
        /* Responsive adjustments */
        @media (max-width: 991px) {
          .sticky-top {
            position: relative;
            top: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}

export default EcommercePage2;
