import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Table, Form, InputGroup } from 'react-bootstrap';
import { FaHome, FaClipboardList, FaWpforms, FaShoppingCart, FaUser, FaTimes, FaPlus, FaMinus, FaSearch, FaPercent, FaTag, FaTrash } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './EcommercePage.css';
import EcomSidebar from '../components/ecomSidebar';
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
          productId: item.id,  // Changed from 'id' to 'productId'
          productName: item.name,
          price: item.price,
          quantity: item.quantity,
          category: item.category
        })),
        discount: discountAmount || 0,
        paidAmount: paidAmount || 0,
        due: dueAmount,
        note: note || '',
        paymentType: 'cash'  // Added paymentType
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
            <h2 className='text-center mb-4'>The Golden Aroma</h2>
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
                  <div className="d-flex justify-content-between align-items-center mb-3">
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
                  <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="textAreaExample">
                      {/* Note */}
                      විස්තරය
                      </label>
                    <textarea
                      className="form-control"
                      id="textAreaExample1"
                      rows="4"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    ></textarea>
                  </div>

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






// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Card, Button, Badge, Table, Form, InputGroup } from 'react-bootstrap';
// import { FaHome, FaClipboardList, FaWpforms, FaShoppingCart, FaUser, FaTimes, FaPlus, FaMinus, FaSearch, FaPercent, FaTag, FaTrash } from 'react-icons/fa';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './EcommercePage.css';
// import EcomSidebar from '../components/ecomSidebar';
// import StatsCards from '../components/StatsCards';
// import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// // Base URL for API
// import { BASE_URL } from '../../config';

// // Function to generate random color for placeholder images
// const getRandomColor = () => {
//   const colors = [
//     '#ff6b6b', '#ffd700', '#ff6347', '#32cd32', '#a0522d',
//     '#f5deb3', '#6f4e37', '#ffc0cb', '#808000', '#ffa500',
//     '#add8e6', '#9370db', '#3cb371', '#20b2aa', '#dda0dd'
//   ];
//   return colors[Math.floor(Math.random() * colors.length)];
// };

// // Function to create placeholder image URL with product name and random color
// const createPlaceholderImage = (productName) => {
//   const color = getRandomColor();
//   return `https://placehold.co/300x200/${color.replace('#', '')}/${color === '#f5deb3' || color === '#ffc0cb' || color === '#add8e6' ? '000' : 'fff'}?text=${encodeURIComponent(productName)}`;
// };

// function EcommercePage() {
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [cart, setCart] = useState([]);
//   const [activeCategory, setActiveCategory] = useState('all');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [discountAmount, setDiscountAmount] = useState(0);
//   const [paidAmount, setPaidAmount] = useState(0);
//   const [discountApplied, setDiscountApplied] = useState(false);
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 575.98);

//   // Handle window resize for mobile detection
//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth <= 575.98);
//     };
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   // Fetch categories from API
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await axios.get(`${BASE_URL}/categories`);
//         const formattedCategories = response.data.map(category => ({
//           id: category.categoryId,
//           name: category.categoryName,
//           icon: getCategoryIcon(category.categoryName.toLowerCase())
//         }));
//         setCategories(formattedCategories);
//       } catch (error) {
//         toast.error('Failed to fetch categories', { position: "bottom-right" });
//         console.error('Error fetching categories:', error);
//       }
//     };
//     fetchCategories();
//   }, []);

//   // Function to assign icons to categories based on name
//   const getCategoryIcon = (categoryName) => {
//     const icons = {
//       vegetable: '🥦',
//       vegetables: '🥦',
//       fruit: '🍎',
//       fruits: '🍎',
//       drink: '🥤',
//       drinks: '🥤',
//       dessert: '🍰',
//       desserts: '🍰',
//       electronic: '💻',
//       electronics: '💻',
//       breakfast: '🍳',
//       default: '📦'
//     };
//     for (const key in icons) {
//       if (categoryName.includes(key)) {
//         return icons[key];
//       }
//     }
//     return icons.default;
//   };

//   // Fetch products from API
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await axios.get(`${BASE_URL}/products`);
//         const formattedProducts = response.data.map(item => {
//           const imageUrl = item.productImage || createPlaceholderImage(item.productName);
//           return {
//             id: item.productId,
//             name: item.productName,
//             price: parseFloat(item.productSellingPrice) || 0,
//             stock: Math.floor(Math.random() * 100) + 10,
//             category: item.category?.categoryName.toLowerCase() || 'uncategorized',
//             image: imageUrl,
//             description: item.productDescription || 'No description available'
//           };
//         });
//         setProducts(formattedProducts);
//       } catch (error) {
//         toast.error('Failed to fetch products', { position: "bottom-right" });
//         console.error('Error fetching products:', error);
//       }
//     };
//     fetchProducts();
//   }, []);

//   // Improved filtering logic
//   const filteredProducts = products.filter(product => {
//     const categoryMatch = activeCategory === 'all' || product.category.toLowerCase() === activeCategory.toLowerCase();
//     if (!searchQuery) return categoryMatch;
//     const query = searchQuery.toLowerCase().trim();
//     return categoryMatch && (
//       product.name.toLowerCase().includes(query) ||
//       product.category.toLowerCase().includes(query) ||
//       product.description.toLowerCase().includes(query) ||
//       product.price.toString().includes(query)
//     );
//   });

//   // Add to cart function
//   const addToCart = (product) => {
//     const existingItem = cart.find(item => item.id === product.id);
//     if (existingItem) {
//       setCart(cart.map(item =>
//         item.id === product.id
//           ? { ...item, quantity: item.quantity + 1 }
//           : item
//       ));
//     } else {
//       setCart([...cart, { ...product, quantity: 1 }]);
//     }
//     toast.success(`${product.name} added to cart`, { position: "bottom-right" });
//     resetDiscount();
//   };

//   // Remove from cart function
//   const removeFromCart = (id, name) => {
//     setCart(cart.filter(item => item.id !== id));
//     toast.info(`${name} removed from cart`, { position: "bottom-right" });
//     resetDiscount();
//   };

//   // Update quantity function
//   const updateQuantity = (id, change) => {
//     setCart(cart.map(item => {
//       if (item.id === id) {
//         const newQuantity = item.quantity + change;
//         return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
//       }
//       return item;
//     }));
//     resetDiscount();
//   };

//   // Clear cart function
//   const clearCart = () => {
//     setCart([]);
//     resetDiscount();
//     toast.info('Cart cleared', { position: "bottom-right" });
//   };

//   // Apply discount value
//   const applyDiscount = (value) => {
//     const discount = parseFloat(value);
//     if (isNaN(discount) || discount < 0) {
//       toast.error('Please enter a valid discount amount', { position: "bottom-right" });
//       return;
//     }
//     if (discount > subtotal) {
//       toast.error('Discount cannot exceed subtotal', { position: "bottom-right" });
//       return;
//     }
//     setDiscountAmount(discount);
//     setDiscountApplied(true);
//     toast.success(`Discount of Rs ${discount.toFixed(2)} applied`, { position: "bottom-right" });
//   };

//   // Clear discount
//   const resetDiscount = () => {
//     if (discountApplied) {
//       setDiscountAmount(0);
//       setDiscountApplied(false);
//       setPaidAmount(0); // Reset paid amount
//       toast.info('Discount removed due to cart changes', { position: "bottom-right" });
//     }
//   };
//   // Calculate totals
//   const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//   const discountedSubtotal = subtotal - discountAmount;
//   // const tax = discountedSubtotal * 0.08;
//   // const total = discountedSubtotal + tax;
//   const total = discountedSubtotal ;
//   const dueAmount = total - paidAmount;

  

//   return (
//     <div className="app-container">
//       {/* Sidebar */}
//       <EcomSidebar />

//       {/* Main Content */}
//       <div className="main-content">
//         <Container fluid>
//           {/* Stats Cards */}
//           <Row>
//             <StatsCards />
//           </Row>

//           {/* Main Content */}
//           <Row>
//             {/* Cart Section */}
//             <Col lg={8} className="cart-section">
//               <Card className="cart-card">
//                 <Card.Body>
//                   <div className="d-flex justify-content-between align-items-center mb-3">
//                     <h5 className="mb-0">Cart Items</h5>
//                     <Badge bg="secondary">{cart.length}</Badge>
//                   </div>

//                   {cart.length > 0 ? (
//                     <>
//                       {cart.map(item => (
//                         <div key={item.id} className="cart-item">
//                           <div className="d-flex align-items-center mb-2">
//                             <img src={item.image} alt={item.name} className="cart-item-img me-3" />
//                             <div>
//                               <h6 className="mb-0">{item.name}</h6>
//                               <small className="text-muted">Category: {item.category}</small>
//                               <div className="item-price">Rs {item.price.toFixed(2)}</div>
//                             </div>
//                             <Button
//                               variant="light"
//                               size="sm"
//                               className="ms-auto remove-cart-btn"
//                               onClick={() => removeFromCart(item.id, item.name)}
//                             >
//                               <FaTimes />
//                             </Button>
//                           </div>
//                           <div className="quantity-control">
//                             <Button
//                               variant="light"
//                               size="sm"
//                               onClick={() => updateQuantity(item.id, -1)}
//                               disabled={item.quantity <= 1}
//                             >
//                               <FaMinus />
//                             </Button>
//                             <span className="quantity-display">{item.quantity}</span>
//                             <Button
//                               variant="light"
//                               size="sm"
//                               onClick={() => updateQuantity(item.id, 1)}
//                             >
//                               <FaPlus />
//                             </Button>
//                           </div>
//                         </div>
//                       ))}
                      
//                     </>
//                   ) : (
//                     <div className="text-center py-4">
//                       <p className="text-muted">Your cart is empty</p>
//                     </div>
//                   )}

                
//                  {/* Discount Section */}
//                  <div className="discount-section mt-4 mb-3">
//   <h6 className="mb-2">
//     <FaTag className="me-2" /> Enter Discount Amount
//   </h6>

//   <InputGroup className="discount-input-group mb-2">
//     <InputGroup.Text>Discount Amount</InputGroup.Text>
//     <Form.Control
//       type="number"
//       placeholder="Enter amount"
//       value={discountAmount || ''} // Value is set to an empty string if `discountAmount` is undefined or null
//       onChange={(e) => setDiscountAmount(e.target.value)} // Updates the discount amount state
//       disabled={discountApplied || cart.length === 0} // Disables input when discount is applied or cart is empty
//       min="0" // Prevents negative values
//     />
//     {discountApplied ? (
//       <Button
//         variant="danger"
//         onClick={() => {
//           setDiscountAmount(0); // Resets discount amount
//           setDiscountApplied(false); // Removes discount application
//           toast.info('Discount removed', { position: 'bottom-right' }); // Displays a notification
//         }}
//       >
//         Clear
//       </Button>
//     ) : (
//       <Button
//         variant="success"
//         onClick={() => applyDiscount(discountAmount)} // Applies the discount
//         disabled={cart.length === 0 || !discountAmount || discountAmount <= 0} // Disables the button if conditions aren't met
//       >
//         Apply
//       </Button>
//     )}
//   </InputGroup>

//   {discountApplied && (
//     <div className="discount-badge mt-2">
//       <Badge bg="success" className="p-2">
//         <FaPercent className="me-1" /> Discount Applied: Rs {discountAmount.toFixed(2)}
//       </Badge>
//     </div>
//   )}
// </div>


// <div className="paid-amount-section mt-2 mb-4">
//     <InputGroup className="mb-2">
//       <InputGroup.Text>Paid Amount</InputGroup.Text>
//       <Form.Control
//         type="number"
//         value={paidAmount || ''}
//         onChange={(e) => {
//           const value = parseFloat(e.target.value) || 0;
//           if (value >= 0) setPaidAmount(value);
//         }}
//         placeholder="Enter paid amount"
//         min="0"
//       />
//     </InputGroup>
//     <div className="d-flex justify-content-between mt-3 mb-3">
//       <span>Due Amount</span>
//       <span className={dueAmount < 0 ? 'text-danger' : 'fw-bold'}>
//         Rs {dueAmount.toFixed(2)}
//       </span>
//     </div>
  
// </div>

  


// <div className="cart-summary mt-4">
//   <Table borderless className='mb-3'>
//     <tbody>
//       <tr>
//         <td>Items ({cart.length})</td>
//         <td className="text-end fw-bold">Rs {subtotal.toFixed(2)}</td>
//       </tr>
//       {discountApplied && (
//         <tr className="discount-row">
//           <td>Discount</td>
//           <td className="text-end fw-bold text-success">- Rs {discountAmount.toFixed(2)}</td>
//         </tr>
//       )}
//       {/* <tr>
//         <td>Tax (8%)</td>
//         <td className="text-end fw-bold">Rs {tax.toFixed(2)}</td>
//       </tr> */}
//       <tr className="total-row">
//         <td>Total</td>
//         <td className="text-end fw-bold">Rs {total.toFixed(2)}</td>
//       </tr>
//     </tbody>
//   </Table>

//   {/* Paid Amount Section */}
//   <hr />
//   <div className="paid-amount-section mt-2 mb-4">
//     {/* <InputGroup className="mb-2">
//       <InputGroup.Text>Paid Amount</InputGroup.Text>
//       <Form.Control
//         type="number"
//         value={paidAmount || ''}
//         onChange={(e) => {
//           const value = parseFloat(e.target.value) || 0;
//           if (value >= 0) setPaidAmount(value);
//         }}
//         placeholder="Enter paid amount"
//         min="0"
//       />
//     </InputGroup> */}
//     {/* <div className="d-flex justify-content-between mt-3 mb-3">
//       <span>Due Amount</span>
//       <span className={dueAmount < 0 ? 'text-danger' : 'fw-bold'}>
//         Rs {dueAmount.toFixed(2)}
//       </span>
//     </div> */}
    
//     <div data-mdb-input-init class="form-outline">
//     <label class="form-label" for="textAreaExample">Note</label>
//   <textarea class="form-control" id="textAreaExample1" rows="4"></textarea>
  
// </div>

//   </div>

//   <div className='d-flex justify-content-between align-items-center'>
//     <Button
//       variant="danger"
//       className="clear-cart-btn w-20"
//       onClick={clearCart}
//     >
//       <FaTrash className="me-2" /> Clear Cart
//     </Button>

//     <Button
//       variant="warning"
//       className="checkout-btn flex-grow-1 ms-3"
//       disabled={cart.length === 0}
//     >
//       Checkout
//     </Button>

     
//   </div>
// </div>
//                 </Card.Body>
//               </Card>
//             </Col>

//             {/* Products Section */}
//             <Col lg={4} className="mb-4">
//               <Card>
//                 <Card.Body>
//                   <div className="d-flex justify-content-between align-items-center mb-3">
//                     <h5 className="mb-0">Categories</h5>
//                     <div className="search-bar-container">
//                       <InputGroup className="search-bar">
//                         <InputGroup.Text>
//                           <FaSearch size={14} />
//                         </InputGroup.Text>
//                         <Form.Control
//                           placeholder="Search..."
//                           value={searchQuery}
//                           onChange={(e) => setSearchQuery(e.target.value)}
//                           size="sm"
//                         />
//                         {searchQuery && (
//                           <Button
//                             variant="outline-secondary"
//                             size="sm"
//                             className="btn-clear"
//                             onClick={() => setSearchQuery('')}
//                           >
//                             <FaTimes size={12} />
//                           </Button>
//                         )}
//                       </InputGroup>
//                     </div>
//                   </div>

//                   <div className="categories-container mb-4">
//                     <Button
//                       variant={activeCategory === 'all' ? 'primary' : 'light'}
//                       className="category-btn me-2 mb-2"
//                       onClick={() => setActiveCategory('all')}
//                     >
//                       All
//                     </Button>
//                     {categories.map(category => (
//                       <Button
//                         key={category.id}
//                         variant={activeCategory === category.name.toLowerCase() ? 'primary' : 'light'}
//                         className="category-btn me-2 mb-2"
//                         onClick={() => setActiveCategory(category.name.toLowerCase())}
//                       >
//                         <span className="me-1">{category.icon}</span>
//                         {category.name}
//                       </Button>
//                     ))}
//                   </div>

//                   <div className="d-flex justify-content-between align-items-center mb-3">
//                     <h5 className="mb-0">Products</h5>
//                     <Badge bg="secondary">{filteredProducts.length}</Badge>
//                   </div>

//                   {isMobile ? (
//                     <div className="product-table-container">
//                       <Table className="product-table">
//                         <thead>
//                           <tr>
//                             <th>Product</th>
//                             <th>Price</th>
//                             <th>Action</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {filteredProducts.length > 0 ? (
//                             filteredProducts.map(product => (
//                               <tr key={product.id}>
//                                 <td>
//                                   <div className="d-flex align-items-center">
//                                     <img
//                                       src={product.image}
//                                       alt={product.name}
//                                       className="product-table-img me-2"
//                                     />
//                                     <span className="product-table-name">{product.name}</span>
//                                   </div>
//                                 </td>
//                                 <td>
//                                   <span className="product-table-price">Rs {product.price}</span>
//                                 </td>
//                                 <td>
//                                   <Button
//                                     variant="primary"
//                                     className="add-to-cart-btn"
//                                     onClick={() => addToCart(product)}
//                                   >
//                                     Add
//                                   </Button>
//                                 </td>
//                               </tr>
//                             ))
//                           ) : (
//                             <tr>
//                               <td colSpan="3" className="text-center">
//                                 No products found
//                                 {searchQuery && (
//                                   <Button
//                                     variant="outline-secondary"
//                                     size="sm"
//                                     className="ms-2"
//                                     onClick={() => setSearchQuery('')}
//                                   >
//                                     Clear Search
//                                   </Button>
//                                 )}
//                               </td>
//                             </tr>
//                           )}
//                         </tbody>
//                       </Table>
//                     </div>
//                   ) : (
//                     <Row>
//                       {filteredProducts.length > 0 ? (
//                         filteredProducts.map(product => (
//                           <Col key={product.id} xs={12} sm={6} md={4} className="mb-4">
//                             <Card className="product-card h-100">
//                               <div className="product-img-container">
//                                 <Card.Img variant="top" src={product.image} className="product-img" />
//                                 <Badge
//                                   bg={product.stock > 50 ? "success" : product.stock > 20 ? "warning" : "danger"}
//                                   className="stock-indicator"
//                                 >
//                                   {product.stock} left
//                                 </Badge>
//                               </div>
//                               <Card.Body className="d-flex flex-column">
//                                 <Card.Title className="product-name">{product.name}</Card.Title>
//                                 <Card.Text className="product-price">Rs {product.price}</Card.Text>
//                                 <div className="product-stock mb-3">
//                                   {product.stock} stock <span className="text-muted">available</span>
//                                 </div>
//                                 <Button
//                                   variant="primary"
//                                   className="add-to-cart-btn mt-auto"
//                                   onClick={() => addToCart(product)}
//                                 >
//                                   Add Cart
//                                 </Button>
//                               </Card.Body>
//                             </Card>
//                           </Col>
//                         ))
//                       ) : (
//                         <Col xs={12}>
//                           <div className="text-center py-5">
//                             <p className="text-muted">No products found with your search criteria</p>
//                             {searchQuery && (
//                               <Button
//                                 variant="outline-secondary"
//                                 size="sm"
//                                 onClick={() => setSearchQuery('')}
//                               >
//                                 Clear Search
//                               </Button>
//                             )}
//                           </div>
//                         </Col>
//                       )}
//                     </Row>
//                   )}
//                 </Card.Body>
//               </Card>
//             </Col>
//           </Row>
//         </Container>
//       </div>

//       {/* Toast Container */}
//       <ToastContainer />
//     </div>
//   );
// }

// export default EcommercePage;








//v cart old


// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Card, Button, Badge, Table, Form, InputGroup } from 'react-bootstrap';
// import { FaHome, FaClipboardList, FaWpforms, FaShoppingCart, FaUser, FaTimes, FaPlus, FaMinus, FaSearch, FaPercent, FaTag, FaTrash } from 'react-icons/fa';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './EcommercePage.css';
// import EcomSidebar from '../components/ecomSidebar';
// import StatsCards from '../components/StatsCards';
// import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// // Base URL for API
// import { BASE_URL } from '../../config';

// // Function to generate random color for placeholder images
// const getRandomColor = () => {
//   const colors = [
//     '#ff6b6b', '#ffd700', '#ff6347', '#32cd32', '#a0522d',
//     '#f5deb3', '#6f4e37', '#ffc0cb', '#808000', '#ffa500',
//     '#add8e6', '#9370db', '#3cb371', '#20b2aa', '#dda0dd'
//   ];
//   return colors[Math.floor(Math.random() * colors.length)];
// };

// // Function to create placeholder image URL with product name and random color
// const createPlaceholderImage = (productName) => {
//   const color = getRandomColor();
//   return `https://placehold.co/300x200/${color.replace('#', '')}/${color === '#f5deb3' || color === '#ffc0cb' || color === '#add8e6' ? '000' : 'fff'}?text=${encodeURIComponent(productName)}`;
// };

// function EcommercePage() {
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [cart, setCart] = useState([]);
//   const [activeCategory, setActiveCategory] = useState('all');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [discountAmount, setDiscountAmount] = useState(0);
//   const [paidAmount, setPaidAmount] = useState(0);
//   const [discountApplied, setDiscountApplied] = useState(false);
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 575.98);

//   // Handle window resize for mobile detection
//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth <= 575.98);
//     };
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   // Fetch categories from API
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await axios.get(`${BASE_URL}/categories`);
//         const formattedCategories = response.data.map(category => ({
//           id: category.categoryId,
//           name: category.categoryName,
//           icon: getCategoryIcon(category.categoryName.toLowerCase())
//         }));
//         setCategories(formattedCategories);
//       } catch (error) {
//         toast.error('Failed to fetch categories', { position: "bottom-right" });
//         console.error('Error fetching categories:', error);
//       }
//     };
//     fetchCategories();
//   }, []);

//   // Function to assign icons to categories based on name
//   const getCategoryIcon = (categoryName) => {
//     const icons = {
//       vegetable: '🥦',
//       vegetables: '🥦',
//       fruit: '🍎',
//       fruits: '🍎',
//       drink: '🥤',
//       drinks: '🥤',
//       dessert: '🍰',
//       desserts: '🍰',
//       electronic: '💻',
//       electronics: '💻',
//       breakfast: '🍳',
//       default: '📦'
//     };
//     for (const key in icons) {
//       if (categoryName.includes(key)) {
//         return icons[key];
//       }
//     }
//     return icons.default;
//   };

//   // Fetch products from API
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await axios.get(`${BASE_URL}/products`);
//         const formattedProducts = response.data.map(item => {
//           const imageUrl = item.productImage || createPlaceholderImage(item.productName);
//           return {
//             id: item.productId,
//             name: item.productName,
//             price: parseFloat(item.productSellingPrice) || 0,
//             stock: Math.floor(Math.random() * 100) + 10,
//             category: item.category?.categoryName.toLowerCase() || 'uncategorized',
//             image: imageUrl,
//             description: item.productDescription || 'No description available'
//           };
//         });
//         setProducts(formattedProducts);
//       } catch (error) {
//         toast.error('Failed to fetch products', { position: "bottom-right" });
//         console.error('Error fetching products:', error);
//       }
//     };
//     fetchProducts();
//   }, []);

//   // Improved filtering logic
//   const filteredProducts = products.filter(product => {
//     const categoryMatch = activeCategory === 'all' || product.category.toLowerCase() === activeCategory.toLowerCase();
//     if (!searchQuery) return categoryMatch;
//     const query = searchQuery.toLowerCase().trim();
//     return categoryMatch && (
//       product.name.toLowerCase().includes(query) ||
//       product.category.toLowerCase().includes(query) ||
//       product.description.toLowerCase().includes(query) ||
//       product.price.toString().includes(query)
//     );
//   });

//   // Add to cart function
//   const addToCart = (product) => {
//     const existingItem = cart.find(item => item.id === product.id);
//     if (existingItem) {
//       setCart(cart.map(item =>
//         item.id === product.id
//           ? { ...item, quantity: item.quantity + 1 }
//           : item
//       ));
//     } else {
//       setCart([...cart, { ...product, quantity: 1 }]);
//     }
//     toast.success(`${product.name} added to cart`, { position: "bottom-right" });
//     resetDiscount();
//   };

//   // Remove from cart function
//   const removeFromCart = (id, name) => {
//     setCart(cart.filter(item => item.id !== id));
//     toast.info(`${name} removed from cart`, { position: "bottom-right" });
//     resetDiscount();
//   };

//   // Update quantity function
//   const updateQuantity = (id, change) => {
//     setCart(cart.map(item => {
//       if (item.id === id) {
//         const newQuantity = item.quantity + change;
//         return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
//       }
//       return item;
//     }));
//     resetDiscount();
//   };

//   // Clear cart function
//   const clearCart = () => {
//     setCart([]);
//     resetDiscount();
//     toast.info('Cart cleared', { position: "bottom-right" });
//   };

//   // Apply discount value
//   const applyDiscount = (value) => {
//     const discount = parseFloat(value);
//     if (isNaN(discount) || discount < 0) {
//       toast.error('Please enter a valid discount amount', { position: "bottom-right" });
//       return;
//     }
//     if (discount > subtotal) {
//       toast.error('Discount cannot exceed subtotal', { position: "bottom-right" });
//       return;
//     }
//     setDiscountAmount(discount);
//     setDiscountApplied(true);
//     toast.success(`Discount of Rs ${discount.toFixed(2)} applied`, { position: "bottom-right" });
//   };

//   // Clear discount
//   const resetDiscount = () => {
//     if (discountApplied) {
//       setDiscountAmount(0);
//       setDiscountApplied(false);
//       setPaidAmount(0); // Reset paid amount
//       toast.info('Discount removed due to cart changes', { position: "bottom-right" });
//     }
//   };
//   // Calculate totals
//   const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//   const discountedSubtotal = subtotal - discountAmount;
//   const tax = discountedSubtotal * 0.08;
//   const total = discountedSubtotal + tax;
  
//   const dueAmount = total - paidAmount;

//   return (
//     <div className="app-container">
//       {/* Sidebar */}
//       <EcomSidebar />

//       {/* Main Content */}
//       <div className="main-content">
//         <Container fluid>
//           {/* Stats Cards */}
//           <Row>
//             <StatsCards />
//           </Row>

//           {/* Main Content */}
//           <Row>
//             {/* Cart Section */}
//             <Col lg={8} className="cart-section">
//               <Card className="cart-card">
//                 <Card.Body>
//                   <div className="d-flex justify-content-between align-items-center mb-3">
//                     <h5 className="mb-0">Cart Items</h5>
//                     <Badge bg="secondary">{cart.length}</Badge>
//                   </div>

//                   {cart.length > 0 ? (
//                     <>
//                       {cart.map(item => (
//                         <div key={item.id} className="cart-item">
//                           <div className="d-flex align-items-center mb-2">
//                             <img src={item.image} alt={item.name} className="cart-item-img me-3" />
//                             <div>
//                               <h6 className="mb-0">{item.name}</h6>
//                               <small className="text-muted">Category: {item.category}</small>
//                               <div className="item-price">Rs {item.price.toFixed(2)}</div>
//                             </div>
//                             <Button
//                               variant="light"
//                               size="sm"
//                               className="ms-auto remove-cart-btn"
//                               onClick={() => removeFromCart(item.id, item.name)}
//                             >
//                               <FaTimes />
//                             </Button>
//                           </div>
//                           <div className="quantity-control">
//                             <Button
//                               variant="light"
//                               size="sm"
//                               onClick={() => updateQuantity(item.id, -1)}
//                               disabled={item.quantity <= 1}
//                             >
//                               <FaMinus />
//                             </Button>
//                             <span className="quantity-display">{item.quantity}</span>
//                             <Button
//                               variant="light"
//                               size="sm"
//                               onClick={() => updateQuantity(item.id, 1)}
//                             >
//                               <FaPlus />
//                             </Button>
//                           </div>
//                         </div>
//                       ))}
                      
//                     </>
//                   ) : (
//                     <div className="text-center py-4">
//                       <p className="text-muted">Your cart is empty</p>
//                     </div>
//                   )}

                
//                  {/* Discount Section */}
// <div className="discount-section mt-4 mb-3">
//   <h6 className="mb-2">
//     <FaTag className="me-2" /> Enter Discount Amount
//   </h6>
//   <InputGroup className="discount-input-group">
//     <Form.Control
//       type="number"
//       placeholder="Enter amount"
//       value={discountAmount || ''} // Simplified value logic
//       onChange={(e) => setDiscountAmount(e.target.value)}
//       disabled={discountApplied || cart.length === 0} // Keep disabled logic
//       min="0" // Prevent negative input
//     />
//     {discountApplied ? (
//       <Button
//         variant="danger"
//         onClick={() => {
//           setDiscountAmount(0);
//           setDiscountApplied(false);
//           toast.info('Discount removed', { position: "bottom-right" });
//         }}
//       >
//         Clear
//       </Button>
//     ) : (
//       <Button
//         variant="success"
//         onClick={() => applyDiscount(discountAmount)}
//         disabled={cart.length === 0 || !discountAmount || discountAmount <= 0}
//       >
//         Apply
//       </Button>
//     )}
//   </InputGroup>
//   {discountApplied && (
//     <div className="discount-badge mt-2">
//       <Badge bg="success" className="p-2">
//         <FaPercent className="me-1" /> Discount Applied: Rs {discountAmount.toFixed(2)}
//       </Badge>
//     </div>
//   )}
// </div>

// <div className="cart-summary mt-4">
//   <Table borderless className='mb-3'>
//     <tbody>
//       <tr>
//         <td>Items ({cart.length})</td>
//         <td className="text-end fw-bold">Rs {subtotal.toFixed(2)}</td>
//       </tr>
//       {discountApplied && (
//         <tr className="discount-row">
//           <td>Discount</td>
//           <td className="text-end fw-bold text-success">- Rs {discountAmount.toFixed(2)}</td>
//         </tr>
//       )}
//       <tr>
//         <td>Tax (8%)</td>
//         <td className="text-end fw-bold">Rs {tax.toFixed(2)}</td>
//       </tr>
//       <tr className="total-row">
//         <td>Total</td>
//         <td className="text-end fw-bold">Rs {total.toFixed(2)}</td>
//       </tr>
//     </tbody>
//   </Table>

//   {/* Paid Amount Section */}
//   <hr />
//   <div className="paid-amount-section mt-2 mb-4">
//     <InputGroup className="mb-2">
//       <InputGroup.Text>Paid Amount</InputGroup.Text>
//       <Form.Control
//         type="number"
//         value={paidAmount || ''}
//         onChange={(e) => {
//           const value = parseFloat(e.target.value) || 0;
//           if (value >= 0) setPaidAmount(value);
//         }}
//         placeholder="Enter paid amount"
//         min="0"
//       />
//     </InputGroup>
//     <div className="d-flex justify-content-between mt-3 mb-3">
//       <span>Due Amount</span>
//       <span className={dueAmount < 0 ? 'text-danger' : 'fw-bold'}>
//         Rs {dueAmount.toFixed(2)}
//       </span>
//     </div>
    
//     <div data-mdb-input-init class="form-outline">
//     <label class="form-label" for="textAreaExample">Note</label>
//   <textarea class="form-control" id="textAreaExample1" rows="4"></textarea>
  
// </div>

//   </div>

//   <div className='d-flex justify-content-between align-items-center'>
//     <Button
//       variant="danger"
//       className="clear-cart-btn w-20"
//       onClick={clearCart}
//     >
//       <FaTrash className="me-2" /> Clear Cart
//     </Button>

//     <Button
//       variant="warning"
//       className="checkout-btn flex-grow-1 ms-3"
//       disabled={cart.length === 0}
//     >
//       Checkout
//     </Button>

     
//   </div>
// </div>
//                 </Card.Body>
//               </Card>
//             </Col>

//             {/* Products Section */}
//             <Col lg={4} className="mb-4">
//               <Card>
//                 <Card.Body>
//                   <div className="d-flex justify-content-between align-items-center mb-3">
//                     <h5 className="mb-0">Categories</h5>
//                     <div className="search-bar-container">
//                       <InputGroup className="search-bar">
//                         <InputGroup.Text>
//                           <FaSearch size={14} />
//                         </InputGroup.Text>
//                         <Form.Control
//                           placeholder="Search..."
//                           value={searchQuery}
//                           onChange={(e) => setSearchQuery(e.target.value)}
//                           size="sm"
//                         />
//                         {searchQuery && (
//                           <Button
//                             variant="outline-secondary"
//                             size="sm"
//                             className="btn-clear"
//                             onClick={() => setSearchQuery('')}
//                           >
//                             <FaTimes size={12} />
//                           </Button>
//                         )}
//                       </InputGroup>
//                     </div>
//                   </div>

//                   <div className="categories-container mb-4">
//                     <Button
//                       variant={activeCategory === 'all' ? 'primary' : 'light'}
//                       className="category-btn me-2 mb-2"
//                       onClick={() => setActiveCategory('all')}
//                     >
//                       All
//                     </Button>
//                     {categories.map(category => (
//                       <Button
//                         key={category.id}
//                         variant={activeCategory === category.name.toLowerCase() ? 'primary' : 'light'}
//                         className="category-btn me-2 mb-2"
//                         onClick={() => setActiveCategory(category.name.toLowerCase())}
//                       >
//                         <span className="me-1">{category.icon}</span>
//                         {category.name}
//                       </Button>
//                     ))}
//                   </div>

//                   <div className="d-flex justify-content-between align-items-center mb-3">
//                     <h5 className="mb-0">Products</h5>
//                     <Badge bg="secondary">{filteredProducts.length}</Badge>
//                   </div>

//                   {isMobile ? (
//                     <div className="product-table-container">
//                       <Table className="product-table">
//                         <thead>
//                           <tr>
//                             <th>Product</th>
//                             <th>Price</th>
//                             <th>Action</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {filteredProducts.length > 0 ? (
//                             filteredProducts.map(product => (
//                               <tr key={product.id}>
//                                 <td>
//                                   <div className="d-flex align-items-center">
//                                     <img
//                                       src={product.image}
//                                       alt={product.name}
//                                       className="product-table-img me-2"
//                                     />
//                                     <span className="product-table-name">{product.name}</span>
//                                   </div>
//                                 </td>
//                                 <td>
//                                   <span className="product-table-price">Rs {product.price}</span>
//                                 </td>
//                                 <td>
//                                   <Button
//                                     variant="primary"
//                                     className="add-to-cart-btn"
//                                     onClick={() => addToCart(product)}
//                                   >
//                                     Add
//                                   </Button>
//                                 </td>
//                               </tr>
//                             ))
//                           ) : (
//                             <tr>
//                               <td colSpan="3" className="text-center">
//                                 No products found
//                                 {searchQuery && (
//                                   <Button
//                                     variant="outline-secondary"
//                                     size="sm"
//                                     className="ms-2"
//                                     onClick={() => setSearchQuery('')}
//                                   >
//                                     Clear Search
//                                   </Button>
//                                 )}
//                               </td>
//                             </tr>
//                           )}
//                         </tbody>
//                       </Table>
//                     </div>
//                   ) : (
//                     <Row>
//                       {filteredProducts.length > 0 ? (
//                         filteredProducts.map(product => (
//                           <Col key={product.id} xs={12} sm={6} md={4} className="mb-4">
//                             <Card className="product-card h-100">
//                               <div className="product-img-container">
//                                 <Card.Img variant="top" src={product.image} className="product-img" />
//                                 <Badge
//                                   bg={product.stock > 50 ? "success" : product.stock > 20 ? "warning" : "danger"}
//                                   className="stock-indicator"
//                                 >
//                                   {product.stock} left
//                                 </Badge>
//                               </div>
//                               <Card.Body className="d-flex flex-column">
//                                 <Card.Title className="product-name">{product.name}</Card.Title>
//                                 <Card.Text className="product-price">Rs {product.price}</Card.Text>
//                                 <div className="product-stock mb-3">
//                                   {product.stock} stock <span className="text-muted">available</span>
//                                 </div>
//                                 <Button
//                                   variant="primary"
//                                   className="add-to-cart-btn mt-auto"
//                                   onClick={() => addToCart(product)}
//                                 >
//                                   Add Cart
//                                 </Button>
//                               </Card.Body>
//                             </Card>
//                           </Col>
//                         ))
//                       ) : (
//                         <Col xs={12}>
//                           <div className="text-center py-5">
//                             <p className="text-muted">No products found with your search criteria</p>
//                             {searchQuery && (
//                               <Button
//                                 variant="outline-secondary"
//                                 size="sm"
//                                 onClick={() => setSearchQuery('')}
//                               >
//                                 Clear Search
//                               </Button>
//                             )}
//                           </div>
//                         </Col>
//                       )}
//                     </Row>
//                   )}
//                 </Card.Body>
//               </Card>
//             </Col>
//           </Row>
//         </Container>
//       </div>

//       {/* Toast Container */}
//       <ToastContainer />
//     </div>
//   );
// }

// export default EcommercePage;

















// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Card, Button, Badge, Table, Form, InputGroup } from 'react-bootstrap';
// import { FaHome, FaClipboardList, FaWpforms, FaShoppingCart, FaUser, FaTimes, FaPlus, FaMinus, FaSearch, FaPercent, FaTag } from 'react-icons/fa';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './EcommercePage.css';
// import EcomSidebar from '../components/ecomSidebar';
// import StatsCards from '../components/StatsCards';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// // Base URL for API
// import { BASE_URL } from '../../config';

// // Function to generate random color for placeholder images
// const getRandomColor = () => {
//   const colors = [
//     '#ff6b6b', '#ffd700', '#ff6347', '#32cd32', '#a0522d', 
//     '#f5deb3', '#6f4e37', '#ffc0cb', '#808000', '#ffa500',
//     '#add8e6', '#9370db', '#3cb371', '#20b2aa', '#dda0dd'
//   ];
//   return colors[Math.floor(Math.random() * colors.length)];
// };

// // Function to create placeholder image URL with product name and random color
// const createPlaceholderImage = (productName) => {
//   const color = getRandomColor();
//   return `https://placehold.co/300x200/${color.replace('#', '')}/${color === '#f5deb3' || color === '#ffc0cb' || color === '#add8e6' ? '000' : 'fff'}?text=${encodeURIComponent(productName)}`;
// };

// function EcommercePage() {
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [cart, setCart] = useState([]);
//   const [activeCategory, setActiveCategory] = useState('all');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [discountCode, setDiscountCode] = useState('');
//   const [discountAmount, setDiscountAmount] = useState(0);
//   const [discountApplied, setDiscountApplied] = useState(false);

//   // Fetch categories from API
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await axios.get(`${BASE_URL}/categories`);
//         // Transform API response to match our component format
//         const formattedCategories = response.data.map(category => ({
//           id: category.categoryId,
//           name: category.categoryName,
//           icon: getCategoryIcon(category.categoryName.toLowerCase()) // Add appropriate icon
//         }));
        
//         setCategories(formattedCategories);
//       } catch (error) {
//         toast.error('Failed to fetch categories');
//         console.error('Error fetching categories:', error);
//       }
//     };

//     fetchCategories();
//   }, []);

//   // Function to assign icons to categories based on name
//   const getCategoryIcon = (categoryName) => {
//     const icons = {
//       vegetable: '🥦',
//       vegetables: '🥦',
//       fruit: '🍎',
//       fruits: '🍎',
//       drink: '🥤',
//       drinks: '🥤',
//       dessert: '🍰',
//       desserts: '🍰',
//       electronic: '💻',
//       electronics: '💻',
//       breakfast: '🍳',
//       default: '📦'
//     };
    
//     // Try to find a match, or use default
//     for (const key in icons) {
//       if (categoryName.includes(key)) {
//         return icons[key];
//       }
//     }
//     return icons.default;
//   };

//   // Fetch products from API
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await axios.get(`${BASE_URL}/products`);
//         // Transform API response to match our component format
//         const formattedProducts = response.data.map(item => {
//           // Generate placeholder image if none exists
//           const imageUrl = item.productImage || createPlaceholderImage(item.productName);
          
//           return {
//             id: item.productId,
//             name: item.productName,
//             price: parseFloat(item.productSellingPrice) || 0,
//             stock: Math.floor(Math.random() * 100) + 10, // Random stock between 10-110
//             category: item.category?.categoryName.toLowerCase() || 'uncategorized',
//             image: imageUrl,
//             description: item.productDescription || 'No description available'
//           };
//         });
        
//         setProducts(formattedProducts);
//       } catch (error) {
//         toast.error('Failed to fetch products');
//         console.error('Error fetching products:', error);
//       }
//     };

//     fetchProducts();
//   }, []);

//   // Filter products by category and search query
//   const filteredProducts = products.filter(product => {
//     // First filter by category
//     const categoryMatch = activeCategory === 'all' || product.category === activeCategory;
    
//     // Then filter by search query
//     if (!searchQuery) return categoryMatch;
    
//     const query = searchQuery.toLowerCase();
//     return categoryMatch && (
//       product.name.toLowerCase().includes(query) ||
//       product.category.toLowerCase().includes(query) ||
//       product.description.toLowerCase().includes(query) ||
//       product.price.toString().includes(query)
//     );
//   });

//   // Add to cart function
//   const addToCart = (product) => {
//     const existingItem = cart.find(item => item.id === product.id);
    
//     if (existingItem) {
//       setCart(cart.map(item => 
//         item.id === product.id 
//           ? { ...item, quantity: item.quantity + 1 } 
//           : item
//       ));
//     } else {
//       setCart([...cart, { ...product, quantity: 1 }]);
//     }
    
//     // If a discount was applied, remove it when adding new items
//     if (discountApplied) {
//       setDiscountApplied(false);
//       setDiscountAmount(0);
//       toast.info('Discount removed due to cart changes');
//     }
//   };

//   // Remove from cart function
//   const removeFromCart = (id) => {
//     setCart(cart.filter(item => item.id !== id));
    
//     // If a discount was applied, remove it when removing items
//     if (discountApplied) {
//       setDiscountApplied(false);
//       setDiscountAmount(0);
//       toast.info('Discount removed due to cart changes');
//     }
//   };

//   // Update quantity function
//   const updateQuantity = (id, change) => {
//     setCart(cart.map(item => {
//       if (item.id === id) {
//         const newQuantity = item.quantity + change;
//         return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
//       }
//       return item;
//     }));
    
//     // If a discount was applied, remove it when updating quantities
//     if (discountApplied) {
//       setDiscountApplied(false);
//       setDiscountAmount(0);
//       toast.info('Discount removed due to cart changes');
//     }
//   };

//   // Apply discount code
//   const applyDiscount = () => {
//     // Simple discount logic - in real app, this would validate against a database
//     if (discountCode.toLowerCase() === 'save10') {
//       const discount = subtotal * 0.1; // 10% discount
//       setDiscountAmount(discount);
//       setDiscountApplied(true);
//       toast.success('Discount applied: 10% off');
//     } else if (discountCode.toLowerCase() === 'save20') {
//       const discount = subtotal * 0.2; // 20% discount
//       setDiscountAmount(discount);
//       setDiscountApplied(true);
//       toast.success('Discount applied: 20% off');
//     } else if (discountCode.toLowerCase() === 'free') {
//       const discount = subtotal; // 100% discount (free)
//       setDiscountAmount(discount);
//       setDiscountApplied(true);
//       toast.success('Wow! 100% discount applied');
//     } else {
//       toast.error('Invalid discount code');
//       setDiscountAmount(0);
//       setDiscountApplied(false);
//     }
//   };

//   // Clear discount
//   const clearDiscount = () => {
//     setDiscountCode('');
//     setDiscountAmount(0);
//     setDiscountApplied(false);
//   };

//   // Calculate totals
//   const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//   const discountedSubtotal = subtotal - discountAmount;
//   const tax = discountedSubtotal * 0.08;
//   const total = discountedSubtotal + tax;

//   return (
//     <div className="app-container">
//       {/* Sidebar */}
//       <EcomSidebar/>

//       {/* Main Content */}
//       <div className="main-content">
//         <Container fluid>
//           {/* Stats Cards */}
//           <Row>
//             <StatsCards/>
//           </Row>

//           {/* Main Content */}
//           <Row>
//             {/* Cart Section */}
//             <Col lg={8}>
//               <Card className="cart-card">
//                 <Card.Body>
//                   <div className="d-flex justify-content-between align-items-center mb-3">
//                     <h5 className="mb-0">Cart Items</h5>
//                     <Badge bg="secondary">{cart.length}</Badge>
//                   </div>

//                   {cart.length > 0 ? (
//                     cart.map(item => (
//                       <div key={item.id} className="cart-item">
//                         <div className="d-flex align-items-center mb-2">
//                           <img src={item.image} alt={item.name} className="cart-item-img me-3" />
//                           <div>
//                             <h6 className="mb-0">{item.name}</h6>
//                             <small className="text-muted">Category: {item.category}</small>
//                             <div className="item-price">Rs {item.price.toFixed(2)}</div>
//                           </div>
//                           <Button 
//                             variant="light" 
//                             size="sm" 
//                             className="ms-auto remove-cart-btn"
//                             onClick={() => removeFromCart(item.id)}
//                           >
//                             <FaTimes />
//                           </Button>
//                         </div>
//                         <div className="quantity-control">
//                           <Button 
//                             variant="light" 
//                             size="sm"
//                             onClick={() => updateQuantity(item.id, -1)}
//                             disabled={item.quantity <= 1}
//                           >
//                             <FaMinus />
//                           </Button>
//                           <span className="quantity-display">{item.quantity}</span>
//                           <Button 
//                             variant="light" 
//                             size="sm"
//                             onClick={() => updateQuantity(item.id, 1)}
//                           >
//                             <FaPlus />
//                           </Button>
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     <div className="text-center py-4">
//                       <p className="text-muted">Your cart is empty</p>
//                     </div>
//                   )}

//                   {/* Discount Code Section */}
//                   <div className="discount-section mt-4 mb-3">
//                     <h6 className="mb-2">
//                       <FaTag className="me-2" /> Apply Discount Code
//                     </h6>
//                     <InputGroup>
//                       <Form.Control
//                         placeholder="Enter discount code"
//                         value={discountCode}
//                         onChange={(e) => setDiscountCode(e.target.value)}
//                         disabled={discountApplied || cart.length === 0}
//                       />
//                       {discountApplied ? (
//                         <Button 
//                           variant="danger" 
//                           onClick={clearDiscount}
//                         >
//                           Clear
//                         </Button>
//                       ) : (
//                         <Button 
//                           variant="success" 
//                           onClick={applyDiscount}
//                           disabled={!discountCode || cart.length === 0}
//                         >
//                           Apply
//                         </Button>
//                       )}
//                     </InputGroup>
//                     {discountApplied && (
//                       <div className="discount-badge mt-2">
//                         <Badge bg="success" className="p-2">
//                           <FaPercent className="me-1" /> Discount Applied: Rs {discountAmount.toFixed(2)}
//                         </Badge>
//                       </div>
//                     )}
//                   </div>

//                   <div className="cart-summary mt-4">
//                     <Table borderless>
//                       <tbody>
//                         <tr>
//                           <td>Items ({cart.length})</td>
//                           <td className="text-end fw-bold">Rs {subtotal.toFixed(2)}</td>
//                         </tr>
//                         {discountApplied && (
//                           <tr className="discount-row">
//                             <td>Discount</td>
//                             <td className="text-end fw-bold text-success">- Rs {discountAmount.toFixed(2)}</td>
//                           </tr>
//                         )}
//                         <tr>
//                           <td>Tax (8%)</td>
//                           <td className="text-end fw-bold">Rs {tax.toFixed(2)}</td>
//                         </tr>
//                         <tr className="total-row">
//                           <td>Total</td>
//                           <td className="text-end fw-bold">Rs {total.toFixed(2)}</td>
//                         </tr>
//                       </tbody>
//                     </Table>
//                     <Button variant="warning" className="checkout-btn w-100" disabled={cart.length === 0}>
//                       Checkout
//                     </Button>
//                   </div>
//                 </Card.Body>
//               </Card>
//             </Col>

//             {/* Products Section */}
//             <Col lg={4} className="mb-4">
//               <Card>
//                 <Card.Body>
//                   <div className="d-flex justify-content-between align-items-center mb-3">
//                     <h5 className="mb-0">Categories</h5>
                    
//                     {/* Search Bar */}
//                     <InputGroup className="search-bar" style={{ maxWidth: '180px' }}>
//                       <InputGroup.Text>
//                         <FaSearch size={14} />
//                       </InputGroup.Text>
//                       <Form.Control
//                         placeholder="Search..."
//                         value={searchQuery}
//                         onChange={(e) => setSearchQuery(e.target.value)}
//                         size="sm"
//                       />
//                       {searchQuery && (
//                         <Button 
//                           variant="outline-secondary" 
//                           size="sm"
//                           onClick={() => setSearchQuery('')}
//                         >
//                           <FaTimes size={12} />
//                         </Button>
//                       )}
//                     </InputGroup>
//                   </div>

//                   <div className="categories-container mb-4">
//                     <Button 
//                       variant={activeCategory === 'all' ? 'primary' : 'light'} 
//                       className="category-btn me-2 mb-2"
//                       onClick={() => setActiveCategory('all')}
//                     >
//                       All
//                     </Button>
//                     {categories.map(category => (
//                       <Button 
//                         key={category.id}
//                         variant={activeCategory === category.name.toLowerCase() ? 'primary' : 'light'} 
//                         className="category-btn me-2 mb-2"
//                         onClick={() => setActiveCategory(category.name.toLowerCase())}
//                       >
//                         <span className="me-1">{category.icon}</span>
//                         {category.name}
//                       </Button>
//                     ))}
//                   </div>

//                   <div className="d-flex justify-content-between align-items-center mb-3">
//                     <h5 className="mb-0">Products</h5>
//                     <Badge bg="secondary">{filteredProducts.length}</Badge>
//                   </div>

//                   <Row>
//                     {filteredProducts.length > 0 ? (
//                       filteredProducts.map(product => (
//                         <Col key={product.id} xs={12} sm={6} md={4} className="mb-4">
//                           <Card className="product-card h-100">
//                             <div className="product-img-container">
//                               <Card.Img variant="top" src={product.image} className="product-img" />
//                               <Badge 
//                                 bg={product.stock > 50 ? "success" : product.stock > 20 ? "warning" : "danger"} 
//                                 className="stock-indicator"
//                               >
//                                 {product.stock} left
//                               </Badge>
//                             </div>
//                             <Card.Body className="d-flex flex-column">
//                               <Card.Title className="product-name">{product.name}</Card.Title>
//                               <Card.Text className="product-price">Rs {product.price.toFixed(2)}</Card.Text>
//                               <div className="product-stock mb-3">
//                                 {product.stock} stock <span className="text-muted">available</span>
//                               </div>
//                               <Button 
//                                 variant="primary" 
//                                 className="add-to-cart-btn mt-auto"
//                                 onClick={() => addToCart(product)}
//                               >
//                                 Add Cart
//                               </Button>
//                             </Card.Body>
//                           </Card>
//                         </Col>
//                       ))
//                     ) : (
//                       <Col xs={12}>
//                         <div className="text-center py-5">
//                           <p className="text-muted">No products found with your search criteria</p>
//                           {searchQuery && (
//                             <Button 
//                               variant="outline-secondary" 
//                               size="sm" 
//                               onClick={() => setSearchQuery('')}
//                             >
//                               Clear Search
//                             </Button>
//                           )}
//                         </div>
//                       </Col>
//                     )}
//                   </Row>
//                 </Card.Body>
//               </Card>
//             </Col>
//           </Row>
//         </Container>
//       </div>
//     </div>
//   );
// }

// export default EcommercePage;







//v0 sample without fetching

// // App.jsx
// import React, { useState } from 'react';
// import { Container, Row, Col, Card, Button, Badge, Table } from 'react-bootstrap';
// import { FaHome, FaClipboardList, FaWpforms, FaShoppingCart, FaUser, FaTimes, FaPlus, FaMinus } from 'react-icons/fa';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './EcommercePage.css';
// import EcomSidebar from '../components/ecomSidebar';
// import StatsCards from '../components/StatsCards';

// // import strawberryImg from './assets/strawberry.jpg';
// // import bananaImg from './assets/banana.jpg';
// // import tomatoImg from './assets/tomato.jpg';
// // import pepperImg from './assets/pepper.jpg';
// // import caramelImg from './assets/caramel.jpg';
// // import cheeseImg from './assets/cheese.jpg';
// // import coffeeImg from './assets/coffee.jpg';
// // import milkshakeImg from './assets/milkshake.jpg';
// // import oliveImg from './assets/olive.jpg';
// // import honeyImg from './assets/honey.jpg';
// // import icecreamImg from './assets/icecream.jpg';

// // function App() {
// //   // Product data
// //   const products = [
// //     { id: 1, name: 'Strawberry', price: 5, stock: 26, category: 'fruit', image: strawberryImg },
// //     { id: 2, name: 'Banana', price: 3, stock: 50, category: 'fruit', image: bananaImg },
// //     { id: 3, name: 'Domatos', price: 4, stock: 40, category: 'vegetable', image: tomatoImg },
// //     { id: 4, name: 'Pepper', price: 3, stock: 65, category: 'vegetable', image: pepperImg },
// //     { id: 5, name: 'Caramel Dessert', price: 15, stock: 45, category: 'desserts', image: caramelImg },
// //     { id: 6, name: 'Cheese', price: 15, stock: 150, category: 'breakfast', image: cheeseImg },
// //     { id: 7, name: 'Coffee', price: 7, stock: 110, category: 'drink', image: coffeeImg },
// //     { id: 8, name: 'Milk Shake', price: 12, stock: 65, category: 'drink', image: milkshakeImg },
// //     { id: 9, name: 'Olive', price: 8, stock: 95, category: 'vegetable', image: oliveImg },
// //     { id: 10, name: 'Honey', price: 35, stock: 65, category: 'breakfast', image: honeyImg },
// //     { id: 11, name: 'Ice Cream', price: 8, stock: 85, category: 'desserts', image: icecreamImg },
// //   ];

// const placeholderImages = {
//   strawberry: 'https://placehold.co/300x200/ff6b6b/fff?text=Strawberry',
//   banana: 'https://placehold.co/300x200/ffd700/fff?text=Banana',
//   tomato: 'https://placehold.co/300x200/ff6347/fff?text=Tomato',
//   pepper: 'https://placehold.co/300x200/32cd32/fff?text=Pepper',
//   caramel: 'https://placehold.co/300x200/a0522d/fff?text=Caramel+Dessert',
//   cheese: 'https://placehold.co/300x200/f5deb3/000?text=Cheese',
//   coffee: 'https://placehold.co/300x200/6f4e37/fff?text=Coffee',
//   milkshake: 'https://placehold.co/300x200/ffc0cb/000?text=Milk+Shake',
//   olive: 'https://placehold.co/300x200/808000/fff?text=Olive',
//   honey: 'https://placehold.co/300x200/ffa500/fff?text=Honey',
//   icecream: 'https://placehold.co/300x200/add8e6/000?text=Ice+Cream'
// };

// function EcommercePage() {
//   // Product data
//   const products = [
//     { id: 1, name: 'Strawberry', price: 5, stock: 26, category: 'fruit', image: placeholderImages.strawberry },
//     { id: 2, name: 'Banana', price: 3, stock: 50, category: 'fruit', image: placeholderImages.banana },
//     { id: 3, name: 'Domatos', price: 4, stock: 40, category: 'vegetable', image: placeholderImages.tomato },
//     { id: 4, name: 'Pepper', price: 3, stock: 65, category: 'vegetable', image: placeholderImages.pepper },
//     { id: 5, name: 'Caramel Dessert', price: 15, stock: 45, category: 'desserts', image: placeholderImages.caramel },
//     { id: 6, name: 'Cheese', price: 15, stock: 150, category: 'breakfast', image: placeholderImages.cheese },
//     { id: 7, name: 'Coffee', price: 7, stock: 110, category: 'drink', image: placeholderImages.coffee },
//     { id: 8, name: 'Milk Shake', price: 12, stock: 65, category: 'drink', image: placeholderImages.milkshake },
//     { id: 9, name: 'Olive', price: 8, stock: 95, category: 'vegetable', image: placeholderImages.olive },
//     { id: 10, name: 'Honey', price: 35, stock: 65, category: 'breakfast', image: placeholderImages.honey },
//     { id: 11, name: 'Ice Cream', price: 8, stock: 85, category: 'desserts', image: placeholderImages.icecream },
//   ];

//   // Categories data
//   const categories = [
//     { id: 1, name: 'vegetable', icon: '🥦' },
//     { id: 2, name: 'fruit', icon: '🍎' },
//     { id: 3, name: 'drink', icon: '🥤' },
//     { id: 4, name: 'desserts', icon: '🍰' },
//     { id: 5, name: 'electronic', icon: '💻' },
//     { id: 6, name: 'breakfast', icon: '🍳' },
//   ];

//   const [cart, setCart] = useState([
//     { id: 3, name: 'Domatos', price: 4, quantity: 1, category: 'vegetable', image: placeholderImages.tomato },
//     { id: 6, name: 'Cheese', price: 15, quantity: 1, category: 'breakfast', image: placeholderImages.cheese }
//   ]);
  
//   // State for active category filter
//   const [activeCategory, setActiveCategory] = useState('all');

//   // Filter products by category
//   const filteredProducts = activeCategory === 'all' 
//     ? products 
//     : products.filter(product => product.category === activeCategory);


//   // Add to cart function
//   const addToCart = (product) => {
//     const existingItem = cart.find(item => item.id === product.id);
    
//     if (existingItem) {
//       setCart(cart.map(item => 
//         item.id === product.id 
//           ? { ...item, quantity: item.quantity + 1 } 
//           : item
//       ));
//     } else {
//       setCart([...cart, { ...product, quantity: 1 }]);
//     }
//   };

//   // Remove from cart function
//   const removeFromCart = (id) => {
//     setCart(cart.filter(item => item.id !== id));
//   };

//   // Update quantity function
//   const updateQuantity = (id, change) => {
//     setCart(cart.map(item => {
//       if (item.id === id) {
//         const newQuantity = item.quantity + change;
//         return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
//       }
//       return item;
//     }));
//   };

//   // Calculate totals
//   const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//   const tax = subtotal * 0.08;
//   const total = subtotal + tax;

//   return (
//     <div className="app-container">
//       {/* Sidebar */}
//       <EcomSidebar/>

//       {/* Main Content */}
//       <div className="main-content">
//         <Container fluid>
//           {/* Stats Cards */}
//           <Row>
            
//             <StatsCards/>

//           </Row>

//           {/* Main Content */}
//           <Row>

// {/* Cart Section */}
// <Col lg={8}>
//               <Card className="cart-card">
//                 <Card.Body>
//                   <div className="d-flex justify-content-between align-items-center mb-3">
//                     <h5 className="mb-0">Cart Items</h5>
//                     <Badge bg="secondary">{cart.length}</Badge>
//                   </div>
//                   {/* <div className="d-flex justify-content-between align-items-center mb-3">
//                     <h6 className="mb-0">Cart Table</h6>
//                     <Badge bg="secondary">T1</Badge>
//                   </div> */}

//                   {cart.map(item => (
//                     <div key={item.id} className="cart-item">
//                       <div className="d-flex align-items-center mb-2">
//                         <img src={item.image} alt={item.name} className="cart-item-img me-3" />
//                         <div>
//                           <h6 className="mb-0">{item.name}</h6>
//                           <small className="text-muted">Category: {item.category}</small>
//                           <div className="item-price">Rs {item.price}</div>
//                         </div>
//                         <Button 
//                           variant="light" 
//                           size="sm" 
//                           className="ms-auto remove-cart-btn"
//                           onClick={() => removeFromCart(item.id)}
//                         >
//                           <FaTimes />
//                         </Button>
//                       </div>
//                       <div className="quantity-control">
//                         <Button 
//                           variant="light" 
//                           size="sm"
//                           onClick={() => updateQuantity(item.id, -1)}
//                           disabled={item.quantity <= 1}
//                         >
//                           <FaMinus />
//                         </Button>
//                         <span className="quantity-display">{item.quantity}</span>
//                         <Button 
//                           variant="light" 
//                           size="sm"
//                           onClick={() => updateQuantity(item.id, 1)}
//                         >
//                           <FaPlus />
//                         </Button>
//                       </div>
//                     </div>
//                   ))}

//                   <div className="cart-summary mt-4">
//                     <Table borderless>
//                       <tbody>
//                         <tr>
//                           <td>Items ({cart.length})</td>
//                           <td className="text-end fw-bold">Rs {subtotal.toFixed(2)}</td>
//                         </tr>
//                         <tr>
//                           <td>Tax (8%)</td>
//                           <td className="text-end fw-bold">Rs {tax.toFixed(2)}</td>
//                         </tr>
//                         <tr className="total-row">
//                           <td>Total</td>
//                           <td className="text-end fw-bold">Rs {total.toFixed(2)}</td>
//                         </tr>
//                       </tbody>
//                     </Table>
//                     <Button variant="warning" className="checkout-btn w-100">
//                       Checkout
//                     </Button>
//                   </div>
//                 </Card.Body>
//               </Card>
//             </Col>

//             {/* Products Section */}
//             <Col lg={4} className="mb-4">
//               <Card>
//                 <Card.Body>
//                   <h5 className="mb-3">Categories</h5>
//                   <div className="categories-container mb-4">
//                   <Button 
//   variant={activeCategory === 'all' ? 'primary' : 'light'} 
//   className="category-btn me-2 mb-2"
//   onClick={() => setActiveCategory('all')}
// >
//   All
// </Button>
// {categories.map(category => (
//   <Button 
//     key={category.id}
//     variant={activeCategory === category.name ? 'primary' : 'light'} 
//     className="category-btn me-2 mb-2"
//     onClick={() => setActiveCategory(category.name)}
//   >
//     <span className="me-1">{category.icon}</span>
//     {category.name}
//   </Button>
// ))}
//                   </div>

//                   <h5 className="mb-3">All Products</h5>
//                   <Row>
//                     {filteredProducts.map(product => (
//                       <Col key={product.id} xs={12} sm={6} md={4} className="mb-4">
//                         <Card className="product-card h-100">
//                           <div className="product-img-container">
//                             <Card.Img variant="top" src={product.image} className="product-img" />
//                             {/* <Button 
//                               variant="danger" 
//                               size="sm" 
//                               className="remove-btn"
//                             >
//                               <FaTimes />
//                             </Button> */}
//                             {/* <Button 
//                               variant="primary" 
//                               size="sm" 
//                               className="edit-btn"
//                             >
//                               <FaClipboardList />
//                             </Button> */}
//                           </div>
//                           <Card.Body className="d-flex flex-column">
//                             <Card.Title className="product-name">{product.name}</Card.Title>
//                             <Card.Text className="product-price">${product.price}</Card.Text>
//                             <div className="product-stock mb-3">
//                               {product.stock} stock <span className="text-muted">available</span>
//                             </div>
//                             <Button 
//                               variant="primary" 
//                               className="add-to-cart-btn mt-auto"
//                               onClick={() => addToCart(product)}
//                             >
//                               Add Cart
//                             </Button>
//                           </Card.Body>
//                         </Card>
//                       </Col>
//                     ))}
//                   </Row>
//                 </Card.Body>
//               </Card>
//             </Col>

            
//           </Row>
//         </Container>
//       </div>
//     </div>
//   );
// }

// export default EcommercePage;








// import React, { useState } from 'react';
// import { Container, Row, Col } from 'react-bootstrap';
// import EcomSidebar from '../components/EcomSidebar';
// import StatsCards from '../components/StatsCards';
// import CategoryFilter from '../components/CategoryFilter';
// import ProductCard from '../components/ProductCard';
// import CartSection from '../components/CartSection';
// import products from '../data/products';

// function EcommercePage() {
//   const [cart, setCart] = useState([
//     { id: 3, name: 'Domatos', price: 4, quantity: 1, category: 'vegetable', image: products[2].image },
//     { id: 6, name: 'Cheese', price: 15, quantity: 1, category: 'breakfast', image: products[5].image }
//   ]);
  
//   const [activeCategory, setActiveCategory] = useState('all');

//   const filteredProducts = activeCategory === 'all' 
//     ? products 
//     : products.filter(product => product.category === activeCategory);

//   const addToCart = (product) => {
//     const existingItem = cart.find(item => item.id === product.id);
    
//     if (existingItem) {
//       setCart(cart.map(item => 
//         item.id === product.id 
//           ? { ...item, quantity: item.quantity + 1 } 
//           : item
//       ));
//     } else {
//       setCart([...cart, { ...product, quantity: 1 }]);
//     }
//   };

//   const removeFromCart = (id) => {
//     setCart(cart.filter(item => item.id !== id));
//   };

//   const updateQuantity = (id, change) => {
//     setCart(cart.map(item => {
//       if (item.id === id) {
//         const newQuantity = item.quantity + change;
//         return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
//       }
//       return item;
//     }));
//   };

//   const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//   const tax = subtotal * 0.08;
//   const total = subtotal + tax;

//   return (
//     <div className="app-container">
//       <EcomSidebar />
      
//       <div className="main-content">
//         <Container fluid>
//           <StatsCards />
          
//           <Row>
//             <Col lg={8} className="mb-4">
//               <CategoryFilter 
//                 activeCategory={activeCategory} 
//                 setActiveCategory={setActiveCategory} 
//               />
//               <ProductCard 
//                 filteredProducts={filteredProducts} 
//                 addToCart={addToCart} 
//               />
//             </Col>

//             <Col lg={4}>
//               <CartSection 
//                 cart={cart}
//                 removeFromCart={removeFromCart}
//                 updateQuantity={updateQuantity}
//                 subtotal={subtotal}
//                 tax={tax}
//                 total={total}
//               />
//             </Col>
//           </Row>
//         </Container>
//       </div>
//     </div>
//   );
// }

// export default EcommercePage;

