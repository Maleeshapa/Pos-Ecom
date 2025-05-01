import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Table, Form, InputGroup } from 'react-bootstrap';
import { FaHome, FaClipboardList, FaWpforms, FaShoppingCart, FaUser, FaTimes, FaPlus, FaMinus, FaSearch, FaPercent, FaTag, FaTrash } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './EcommercePage.css';
import EcomSidebar from '../components/EcomSidebar';
import StatsCards from '../components/StatsCards';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

function EcommercePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 575.98);
  const [note, setNote] = useState('');

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 575.98);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/categories`);
        const formattedCategories = response.data.map(category => ({
          id: category.categoryId,
          name: category.categoryName,
          icon: getCategoryIcon(category.categoryName.toLowerCase())
        }));
        setCategories(formattedCategories);
      } catch (error) {
        toast.error('Failed to fetch categories', { position: "bottom-right" });
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
        const formattedProducts = response.data.map(item => {
          const imageUrl = item.productImage || createPlaceholderImage(item.productName);
          return {
            id: item.productId,
            name: item.productName,
            price: parseFloat(item.productSellingPrice) || 0,
            stock: Math.floor(Math.random() * 100) + 10,
            category: item.category?.categoryName.toLowerCase() || 'uncategorized',
            image: imageUrl,
            description: item.productDescription || 'No description available'
          };
        });
        setProducts(formattedProducts);
      } catch (error) {
        toast.error('Failed to fetch products', { position: "bottom-right" });
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  // Improved filtering logic
  const filteredProducts = products.filter(product => {
    const categoryMatch = activeCategory === 'all' || product.category.toLowerCase() === activeCategory.toLowerCase();
    if (!searchQuery) return categoryMatch;
    const query = searchQuery.toLowerCase().trim();
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
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    toast.success(`${product.name} added to cart`, { position: "bottom-right" });
    resetDiscount();
  };

  // Remove from cart function
  const removeFromCart = (id, name) => {
    setCart(cart.filter(item => item.id !== id));
    toast.info(`${name} removed from cart`, { position: "bottom-right" });
    resetDiscount();
  };

  // Update quantity function
  const updateQuantity = (id, change) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }));
    resetDiscount();
  };

  // Clear cart function
  const clearCart = () => {
    setCart([]);
    resetDiscount();
    setNote('');
    toast.info('Cart cleared', { position: "bottom-right" });
  };

  // Apply discount value
  const applyDiscount = (value) => {
    const discount = parseFloat(value);
    if (isNaN(discount) || discount < 0) {
      toast.error('Please enter a valid discount amount', { position: "bottom-right" });
      return;
    }
    if (discount > subtotal) {
      toast.error('Discount cannot exceed subtotal', { position: "bottom-right" });
      return;
    }
    setDiscountAmount(discount);
    setDiscountApplied(true);
    toast.success(`Discount of Rs ${discount.toFixed(2)} applied`, { position: "bottom-right" });
  };

  // Clear discount
  const resetDiscount = () => {
    if (discountApplied) {
      setDiscountAmount(0);
      setDiscountApplied(false);
      setPaidAmount(0); // Reset paid amount
      toast.info('Discount removed due to cart changes', { position: "bottom-right" });
    }
  };

  // Checkout function
  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error('Cart is empty', { position: "bottom-right" });
      return;
    }
  
    const loadingToast = toast.loading('Processing checkout...', { position: "bottom-right" });
  
    try {
      const checkoutData = {
        cartItems: cart.map(item => ({
          productId: item.id,
          productName: item.name,
          price: item.price,
          quantity: item.quantity,
          category: item.category
        })),
        discount: discountAmount || 0,
        paidAmount: paidAmount || 0,
        due: dueAmount,
        balance: paidAmount > total ? (paidAmount - total) : 0, // Add balance amount
        note: note || '',
        paymentType: 'cash',
        totalAmount: total
      };
  
      const response = await axios.post(`${BASE_URL}/ecommerce/checkout`, checkoutData);
  
      if (response.data.success) {
        toast.update(loadingToast, {
          render: `Checkout successful! Transaction ID: ${response.data.transactionId}`,
          type: "success",
          isLoading: false,
          autoClose: 5000,
          position: "bottom-right"
        });
  
        // Create a transaction object for printing
        const transactionForPrint = {
          transactionId: response.data.transactionId,
          createdAt: new Date().toISOString(),
          price: subtotal,
          discount: discountAmount,
          totalAmount: total,
          paidAmount: paidAmount,
          due: dueAmount,
          balance: paidAmount > total ? (paidAmount - total) : 0, // Include balance
          paymentType: 'cash'
        };
  
        // Print the receipt
        await handlePrint(transactionForPrint);
  
        // Clear the cart and reset values
        setCart([]);
        setDiscountAmount(0);
        setDiscountApplied(false);
        setPaidAmount(0);
        setNote('');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.update(loadingToast, {
        render: `Checkout failed: ${error.response?.data?.message || error.message}`,
        type: "error",
        isLoading: false,
        autoClose: 5000,
        position: "bottom-right"
      });
    }
  };

  const handlePrint = async (transaction) => {
    // Use current cart items for printing
    const itemsForPrint = cart.map(item => ({
      productName: item.name,
      price: item.price,
      quantity: item.quantity,
      category: item.category
    }));
  
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
              width: 80mm;
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
          ${transaction.due > 0 ? `
            <div class="summary-row">
              <span>Due Amount:</span>
              <span>Rs ${transaction.due.toFixed(2)}</span>
            </div>
          ` : ''}
          ${transaction.balance > 0 ? `
            <div class="summary-row">
              <span>Balance:</span>
              <span class="text-success">Rs ${transaction.balance.toFixed(2)}</span>
            </div>
          ` : ''}
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

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountedSubtotal = subtotal - discountAmount;
  // const tax = discountedSubtotal * 0.08;
  // const total = discountedSubtotal + tax;
  const total = discountedSubtotal ;

  let dueAmount = 0;
let balanceAmount = 0;

if (paidAmount < total) {
  dueAmount = total - paidAmount;
} else if (paidAmount > total) {
  balanceAmount = paidAmount - total;
}
  
  // const dueAmount = total - paidAmount;

  return (
    <div className="app-container">
      {/* Sidebar */}
      <EcomSidebar />

      {/* Main Content */}
      <div className="main-content">
        <Container fluid>
          {/* Stats Cards */}
          <Row>
            {/* <StatsCards /> */}
            {/* <h2 className='text-center mb-4'>The Golden Aroma</h2> */}
          </Row>

          {/* Main Content */}
          <Row>
            {/* Cart Section */}
            

            {/* Products Section */}
            <Col lg={5} className="mb-4">
              <Card>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">Categories</h5>
                    <div className="search-bar-container">
                      <InputGroup className="search-bar">
                        <InputGroup.Text>
                          <FaSearch size={14} />
                        </InputGroup.Text>
                        <Form.Control
                          placeholder="Search..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          size="sm"
                        />
                        {searchQuery && (
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            className="btn-clear"
                            onClick={() => setSearchQuery('')}
                          >
                            <FaTimes size={12} />
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
                    <h5 className="mb-0">                      
                      Products
                      </h5>
                    <Badge bg="secondary">{filteredProducts.length}</Badge>
                  </div>

                  {isMobile ? (
                    <div className="product-table-container">
                      <Table className="product-table">
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredProducts.length > 0 ? (
                            filteredProducts.map(product => (
                              <tr key={product.id}>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <img
                                      src={product.image}
                                      alt={product.name}
                                      className="product-table-img me-2"
                                    />
                                    <span className="product-table-name">{product.name}</span>
                                  </div>
                                </td>
                                <td>
                                  <span className="product-table-price">Rs {product.price}</span>
                                </td>
                                <td>
                                  <Button
                                    variant="primary"
                                    className="add-to-cart-btn"
                                    onClick={() => addToCart(product)}
                                  >
                                    Add
                                  </Button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="3" className="text-center">
                                No products found
                                {searchQuery && (
                                  <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    className="ms-2"
                                    onClick={() => setSearchQuery('')}
                                  >
                                    Clear Search
                                  </Button>
                                )}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>
                  ) : (
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
                                <Card.Text className="product-price">Rs {product.price}</Card.Text>
                                <div className="product-stock mb-3">
                                  {product.stock} stock <span className="text-muted">available</span>
                                </div>
                                <Button
                                  variant="primary"
                                  className="add-to-cart-btn mt-auto"
                                  onClick={() => addToCart(product)}
                                >
                                  Add Cart
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
                                onClick={() => setSearchQuery('')}
                              >
                                Clear Search
                              </Button>
                            )}
                          </div>
                        </Col>
                      )}
                    </Row>
                  )}
                </Card.Body>
              </Card>
            </Col>



            <Col lg={7} className="cart-section">
              <Card className="cart-card">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="mb-0">Cart Items</h5>
                    <Badge bg="secondary">{cart.length}</Badge>
                  </div>

                  {cart.length > 0 ? (
                    <>
                      {cart.map(item => (
                        <div key={item.id} className="cart-item">
                          <div className="d-flex align-items-center mb-2">
                            <img src={item.image} alt={item.name} className="cart-item-img me-3" />
                            <div>
                              <h6 className="mb-0">{item.name}</h6>
                              <small className="text-muted">Category: {item.category}</small>
                              <div className="item-price">Rs {item.price.toFixed(2)}</div>
                            </div>
                            <Button
                              variant="light"
                              size="sm"
                              className="ms-auto remove-cart-btn"
                              onClick={() => removeFromCart(item.id, item.name)}
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
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted">Your cart is empty</p>
                    </div>
                  )}

                {/* Discount Section */}
                <div className="discount-section mt-4 mb-3">
                  {/* <h6 className="mb-2">
                    <FaTag className="me-2" /> Enter Discount Amount
                  </h6> */}

                  <InputGroup className="discount-input-group mb-2">
                    <InputGroup.Text>
                    {/* Discount  */}
                    වට්ටම් මුදල
                    </InputGroup.Text>
                    <Form.Control
                      type="number"
                      placeholder="ටයිප් කරන්න"
                      value={discountAmount || ''}
                      onChange={(e) => setDiscountAmount(e.target.value)}
                      disabled={discountApplied || cart.length === 0}
                      min="0"
                    />
                    {discountApplied ? (
                      <Button
                        variant="danger"
                        onClick={() => {
                          setDiscountAmount(0);
                          setDiscountApplied(false);
                          toast.info('Discount removed', { position: 'bottom-right' });
                        }}
                      >
                        Clear
                      </Button>
                    ) : (
                      <Button
                        variant="success"
                        onClick={() => applyDiscount(discountAmount)}
                        disabled={cart.length === 0 || !discountAmount || discountAmount <= 0}
                      >
                        Apply
                      </Button>
                    )}
                  </InputGroup>

                  {discountApplied && (
                    <div className="discount-badge mt-2">
                      <Badge bg="success" className="p-2">
                        <FaPercent className="me-1" /> Discount Applied: Rs {discountAmount.toFixed(2)}
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="paid-amount-section mt-2 mb-4">
                  <InputGroup className="mb-2">
                    <InputGroup.Text>
                    {/* Paid Amount */}
                    ගෙවූ මුදල
                    </InputGroup.Text>
                    <Form.Control
                      type="number"
                      value={paidAmount || ''}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        if (value >= 0) setPaidAmount(value);
                      }}
                      placeholder="ටයිප් කරන්න"
                      min="0"
                      required
                    />
                  </InputGroup>
                  
                </div>

                <div className="cart-summary mt-4">
  <Table borderless className="mb-3 w-100">
    <tbody>
      {dueAmount > 0 && (
        <tr>
          <td className="text-end">
            <span className="me-2">හිග මුදල :</span>
            <span className="text-danger fw-bold">
              Rs. {dueAmount.toFixed(2)}
            </span>
          </td>
        </tr>
      )}
      {balanceAmount > 0 && (
        <tr>
          <td className="text-end">
            <span className="me-2">ඉතුරු මුදල :</span>
            <span className="text-success fw-bold">
              Rs. {balanceAmount.toFixed(2)}
            </span>
          </td>
        </tr>
      )}
      <tr>
        <td className="text-end">
          <span className="me-2">එකතුව :</span>
          <span className="fw-bold">
            Rs. {subtotal.toFixed(2)}
          </span>
        </td>
      </tr>
      {discountApplied && (
        <tr>
          <td className="text-end">
            <span className="me-2">වට්ටම :</span>
            <span className="fw-bold text-success">
              - Rs. {discountAmount.toFixed(2)}
            </span>
          </td>
        </tr>
      )}
      <tr>
        <td className="text-end">
          <h4 className="d-inline me-2">මුලු එකතුව :</h4>
          <h4 className="d-inline fw-bold">Rs. {total.toFixed(2)}</h4>
        </td>
      </tr>
    </tbody>
  </Table>
  

                  <hr />
                  
                  

                  <div className='d-flex justify-content-between align-items-center'>
                    <Button
                      variant="danger"
                      className="clear-cart-btn w-20"
                      onClick={clearCart}
                    >
                      <FaTrash className="me-2" /> Clear Cart
                    </Button>

                    <Button
                      variant="warning"
                      className="checkout-btn flex-grow-1 ms-3"
                      disabled={cart.length === 0}
                      onClick={handleCheckout}
                    >
                      {/* Checkout */}
                      ගණුදෙනුව අවසන්
                    </Button>
                  </div>
                </div>
                </Card.Body>
              </Card>
            </Col>


          </Row>
        </Container>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}

export default EcommercePage;




