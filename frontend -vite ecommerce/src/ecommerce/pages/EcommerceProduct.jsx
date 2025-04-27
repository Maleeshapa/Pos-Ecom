// // Modern EcommerceProduct.jsx Component with Sidebar
// import React, { useState, useEffect } from 'react';
// import { Modal, Form, Button, Container, Row, Col, Card, Badge } from 'react-bootstrap';
// import {
//   IoAdd,
//   IoClose,
//   IoCart,
//   IoTrash,
//   IoImage,
//   IoPricetag,
//   IoBarcode,
//   IoGrid,
//   IoChevronUp,
//   IoChevronDown
// } from 'react-icons/io5';
// import { toast } from 'react-toastify';
// import axios from 'axios';
// import './EcommerceProduct.css';
// import EcomSidebar from '../components/ecomSidebar';
// // Add this at the top of your EcommerceProduct.jsx
// // import { BASE_URL } from '../../config'; // or your actual backend URL

// const EcommerceProduct = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [cart, setCart] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const [isImageUploading, setIsImageUploading] = useState(false);
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const [product, setProduct] = useState({
//     id: '',
//     name: '',
//     stock: '',
//     imageUrl: '',
//     price: '',
//     category: '',
//     description: '',
//     imageFile: null // Add this line
//   });

//   // Fetch categories from API
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await axios.get(`${BASE_URL}/categories`);
//         setCategories(response.data);
//       } catch (error) {
//         toast.error('Failed to fetch categories');
//         console.error('Error fetching categories:', error);
//       }
//     };

//     fetchCategories();
//   }, []);

//   // Fetch products from API
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await axios.get(`${BASE_URL}/products`);
//         // Map the API response to match our frontend structure
//         const formattedProducts = response.data.map(item => ({
//           id: item.productId.toString(),
//           name: item.productName,
//           stock: item.productStatus === 'In stock' ? 10 : 0, // You might need to adjust this based on your actual stock logic
//           imageUrl: item.productImage || 'https://via.placeholder.com/300',
//           price: parseFloat(item.productSellingPrice) || 0, // Convert to number
//           category: item.category?.categoryId.toString() || 'uncategorized',
//           description: item.productDescription || 'No description available',
//           categoryName: item.category?.categoryName || 'Uncategorized'
//         }));
//         setProducts(formattedProducts);
//       } catch (error) {
//         toast.error('Failed to fetch products');
//         console.error('Error fetching products:', error);
//       }
//     };

//     fetchProducts();
//   }, []);

//   const handleClose = () => setShowModal(false);
//   const handleShow = () => setShowModal(true);
//   const toggleCart = () => setIsCartOpen(!isCartOpen);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setProduct({
//       ...product,
//       [name]: value
//     });
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       // Create a preview URL for the image
//       const previewUrl = URL.createObjectURL(file);
//       setProduct({
//         ...product,
//         imageUrl: previewUrl,
//         imageFile: file
//       });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     try {
//       const formData = new FormData();
//       formData.append('productName', product.name);
//       formData.append('productSellingPrice', product.price);
//       formData.append('categoryId', product.category);
//       formData.append('productDescription', product.description || '');
      
//       if (product.imageFile) {
//         formData.append('productImage', product.imageFile);
//       }
  
//       const response = await axios.post(`${BASE_URL}/product`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });
  
//       // Add the new product to local state
//       const newProduct = {
//         id: response.data.productId.toString(),
//         name: response.data.productName,
//         stock: 10, // Default stock
//         imageUrl: response.data.productImage || 'https://via.placeholder.com/300',
//         price: parseFloat(response.data.productSellingPrice), // Convert to number
//         category: response.data.category_categoryId.toString(),
//         description: response.data.productDescription,
//         categoryName: categories.find(cat => cat.categoryId.toString() === response.data.category_categoryId.toString())?.categoryName || 'Uncategorized'
//       };
  
//       setProducts(prevProducts => [...prevProducts, newProduct]);
      
//       // Show success toast with custom message
//       toast.success('New Product Created Successfully!', {
//         position: "bottom-right",
//         autoClose: 6000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//       });
      
//       handleClose();
  
//       // Reset form
//       setProduct({
//         id: '',
//         name: '',
//         stock: '',
//         imageUrl: '',
//         price: '',
//         category: '',
//         description: '',
//         imageFile: null
//       });
//     } catch (error) {
//       toast.error('Failed to add product');
//       console.error('Error adding product:', error);
//     }
//   };



//   // Filter products by category
//   const filteredProducts = selectedCategory === 'all'
//     ? products
//     : products.filter(product => product.category === selectedCategory);

//   // Get stock badge class based on stock level
//   const getStockBadgeClass = (stock) => {
//     if (stock === 0) return 'stock-out';
//     if (stock <= 10) return 'stock-low';
//     return 'stock-high';
//   };

//   // Function to safely format prices
//   const formatPrice = (price) => {
//     // Make sure price is a number before calling toFixed
//     const numPrice = typeof price === 'number' ? price : parseFloat(price);
//     return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
//   };

//   return (
//     <div className="app-container">
//       <EcomSidebar />

//       <div className="main-content">
//         <Container fluid className="product-container">
//           <div className="product-header">
//             <h2>Our Products</h2>
//             <Button
//               variant="warning"
//               className="btn-creative"
//               onClick={handleShow}
//             >
//               <IoAdd size={20} className="me-1" /> Add Product
//             </Button>
//           </div>

//           <div className="category-filters">
//             <Button
//               variant={selectedCategory === 'all' ? 'primary' : 'outline'}
//               className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
//               onClick={() => setSelectedCategory('all')}
//             >
//               All Products
//             </Button>
//             {categories.map(category => (
//               <Button
//                 key={category.categoryId}
//                 variant={selectedCategory === category.categoryId.toString() ? 'primary' : 'outline'}
//                 className={`category-btn ${selectedCategory === category.categoryId.toString() ? 'active' : ''}`}
//                 onClick={() => setSelectedCategory(category.categoryId.toString())}
//               >
//                 {category.categoryName}
//               </Button>
//             ))}
//           </div>

//           <div className="products-grid">
//             {filteredProducts.length > 0 ? (
//               filteredProducts.map(product => (
//                 <Card key={product.id} className="product-card">
//                   <div className="product-image-container">
//                     <Card.Img variant="top" src={product.imageUrl} className="product-image" />
//                     <Badge className={`stock-badge ${getStockBadgeClass(product.stock)}`}>
//                       {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
//                     </Badge>
//                   </div>
//                   <div className="product-content">
//                     <h5 className="product-title">{product.name}</h5>
//                     <div className="product-category">
//                       {product.categoryName}
//                     </div>
//                     <p className="product-description">
//                       {product.description}
//                     </p>
//                     <div className="product-footer">
//                       <div className="product-price">Rs. {formatPrice(product.price)}</div>
                      
//                     </div>
//                   </div>
//                 </Card>
//               ))
//             ) : (
//               <div className="text-center w-100 py-5">
//                 <h4>No products found in this category</h4>
//                 <Button variant="primary" onClick={handleShow} className="mt-3">
//                   Add New Product
//                 </Button>
//               </div>
//             )}
//           </div>

          

//           <Modal
//             show={showModal}
//             onHide={handleClose}
//             centered
//             size="lg"
//             className="product-modal"
//           >
//             <Modal.Header className="product-modal-header d-flex justify-content-between align-items-center">
//               <Modal.Title>
//                 <IoAdd size={24} className="me-1" /> Add New Product
//               </Modal.Title>
//               <Button
//                 variant="danger"
//                 className="d-flex align-items-center justify-content-center close-btn rounded-circle"
//                 onClick={handleClose}
//                 style={{ width: '36px', height: '36px' }}
//               >
//                 <IoClose size={20} />
//               </Button>
//             </Modal.Header>

//             <Modal.Body>
//               <Form onSubmit={handleSubmit}>
//                 <Row>
//                   <Col md={8}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>
//                         <IoBarcode className="me-2" /> Product Name
//                       </Form.Label>
//                       <Form.Control
//                         type="text"
//                         placeholder="Enter product name"
//                         name="name"
//                         value={product.name}
//                         onChange={handleChange}
//                         required
//                       />
//                     </Form.Group>

//                     <Row>
//                       <Col md={6}>
//                         <Form.Group className="mb-3">
//                           <Form.Label>
//                             <IoPricetag className="me-2" /> Price (Rs)
//                           </Form.Label>
//                           <Form.Control
//                             type="number"
//                             placeholder="0.00"
//                             name="price"
//                             value={product.price}
//                             onChange={handleChange}
//                             min="0"
//                             step="0.01"
//                             required
//                           />
//                         </Form.Group>
//                       </Col>
//                       <Col md={6}>
//                         <Form.Group className="mb-3">
//                           <Form.Label>
//                             <IoGrid className="me-2" /> Category
//                           </Form.Label>
//                           <Form.Select
//                             name="category"
//                             value={product.category}
//                             onChange={handleChange}
//                             required
//                           >
//                             <option value="">Select a category</option>
//                             {categories.map(category => (
//                               <option key={category.categoryId} value={category.categoryId}>
//                                 {category.categoryName}
//                               </option>
//                             ))}
//                           </Form.Select>
//                         </Form.Group>
//                       </Col>
//                     </Row>

//                     <Form.Group className="mb-3">
//                       <Form.Label>Product Description</Form.Label>
//                       <Form.Control
//                         as="textarea"
//                         rows={3}
//                         placeholder="Enter product description"
//                         name="description"
//                         value={product.description}
//                         onChange={handleChange}
//                       />
//                     </Form.Group>
                    
//                   </Col>

//                   <Col md={4}>
//                     <Form.Group className="mb-3 image-upload-container">
//                       <Form.Label>
//                         <IoImage className="me-2" /> Product Image
//                       </Form.Label>

//                       <div className="image-preview">
//                         {product.imageUrl ? (
//                           <img
//                             src={product.imageUrl}
//                             alt="Product preview"
//                             className="product-image-preview"
//                           />
//                         ) : (
//                           <div className="image-placeholder">
//                             <IoImage size={48} />
//                             <p>No image selected</p>
//                           </div>
//                         )}
//                       </div>

//                       <div className="image-upload-controls">
//                         <Form.Control
//                           type="file"
//                           accept="image/*"
//                           onChange={handleFileChange}
//                           className="mb-2"
//                         />
//                       </div>
//                     </Form.Group>
//                   </Col>
//                 </Row>

//                 <div className="modal-footer-buttons">
//                   <Button variant="outline-secondary" onClick={handleClose}>
//                     Cancel
//                   </Button>
//                   <Button variant="warning" type="submit">
//                     Add Product
//                   </Button>
//                 </div>
//               </Form>
//             </Modal.Body>
//           </Modal>
//         </Container>
//       </div>
//     </div>
//   );
// };

// export default EcommerceProduct;



// Modern EcommerceProduct.jsx Component with Sidebar
import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Container, Row, Col, Card, Badge } from 'react-bootstrap';
import {
  IoAdd,
  IoClose,
  IoCart,
  IoTrash,
  IoImage,
  IoPricetag,
  IoBarcode,
  IoGrid,
  IoChevronUp,
  IoChevronDown
} from 'react-icons/io5';
import { toast } from 'react-toastify';
import axios from 'axios';
import './EcommerceProduct.css';
import EcomSidebar from '../components/ecomSidebar';

import { BASE_URL } from '../../config'; // or your actual backend URL

const EcommerceProduct = () => {
  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [product, setProduct] = useState({
    id: '',
    name: '',
    stock: '',
    imageUrl: '',
    price: '',
    category: '',
    description: '',
    imageFile: null
  });

  // Image compression function
  const compressImage = (file, maxWidth = 1024, maxQuality = 0.7) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
          // Create canvas
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions maintaining aspect ratio
          if (width > maxWidth) {
            height = Math.round(height * maxWidth / width);
            width = maxWidth;
          }

          // Set canvas dimensions
          canvas.width = width;
          canvas.height = height;

          // Draw image on canvas
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Convert canvas to Blob
          canvas.toBlob((blob) => {
            if (!blob) {
              console.error("Canvas to Blob conversion failed");
              resolve(file); // Return original file if compression fails
              return;
            }

            // Create File object from Blob
            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
              type: 'image/jpeg',
              lastModified: Date.now()
            });

            console.log(`Compressed image size: ${compressedFile.size} bytes (${Math.round(compressedFile.size / 1024)} KB)`);
            console.log(`Original image size: ${file.size} bytes (${Math.round(file.size / 1024)} KB)`);
            console.log(`Compression ratio: ${Math.round((file.size - compressedFile.size) / file.size * 100)}%`);

            resolve(compressedFile);
          }, 'image/jpeg', maxQuality);
        };
      };
      reader.onerror = () => {
        console.error('Error reading file');
        resolve(file); // Return original file if reading fails
      };
    });
  };

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/categories`);
        setCategories(response.data);
      } catch (error) {
        toast.error('Failed to fetch categories');
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/products`);
        // Map the API response to match our frontend structure
        const formattedProducts = response.data.map(item => ({
          id: item.productId.toString(),
          name: item.productName,
          stock: item.productStatus === 'In stock' ? 10 : 0, // You might need to adjust this based on your actual stock logic
          imageUrl: item.productImage || 'https://via.placeholder.com/300',
          price: parseFloat(item.productSellingPrice) || 0, // Convert to number
          category: item.category?.categoryId.toString() || 'uncategorized',
          description: item.productDescription || 'No description available',
          categoryName: item.category?.categoryName || 'Uncategorized'
        }));
        setProducts(formattedProducts);
      } catch (error) {
        toast.error('Failed to fetch products');
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setIsImageUploading(true);
        
        // Compress the image before setting it
        const compressedFile = await compressImage(file);
        
        // Create a preview URL for the compressed image
        const previewUrl = URL.createObjectURL(compressedFile);
        
        setProduct({
          ...product,
          imageUrl: previewUrl,
          imageFile: compressedFile
        });
      } catch (error) {
        console.error('Error compressing image:', error);
        // Fallback to original file if compression fails
        const previewUrl = URL.createObjectURL(file);
        setProduct({
          ...product,
          imageUrl: previewUrl,
          imageFile: file
        });
      } finally {
        setIsImageUploading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      formData.append('productName', product.name);
      formData.append('productSellingPrice', product.price);
      formData.append('categoryId', product.category);
      formData.append('productDescription', product.description || '');
      
      if (product.imageFile) {
        formData.append('productImage', product.imageFile);
      }
  
      const response = await axios.post(`${BASE_URL}/product`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      // Add the new product to local state
      const newProduct = {
        id: response.data.productId.toString(),
        name: response.data.productName,
        stock: 10, // Default stock
        imageUrl: response.data.productImage || 'https://via.placeholder.com/300',
        price: parseFloat(response.data.productSellingPrice), // Convert to number
        category: response.data.category_categoryId.toString(),
        description: response.data.productDescription,
        categoryName: categories.find(cat => cat.categoryId.toString() === response.data.category_categoryId.toString())?.categoryName || 'Uncategorized'
      };
  
      setProducts(prevProducts => [...prevProducts, newProduct]);
      
      // Show success toast with custom message
      toast.success('New Product Created Successfully!', {
        position: "bottom-right",
        autoClose: 6000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      
      handleClose();
  
      // Reset form
      setProduct({
        id: '',
        name: '',
        stock: '',
        imageUrl: '',
        price: '',
        category: '',
        description: '',
        imageFile: null
      });
    } catch (error) {
      toast.error('Failed to add product');
      console.error('Error adding product:', error);
    }
  };

  // Filter products by category
  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(product => product.category === selectedCategory);

  // Get stock badge class based on stock level
  const getStockBadgeClass = (stock) => {
    if (stock === 0) return 'stock-out';
    if (stock <= 10) return 'stock-low';
    return 'stock-high';
  };

  // Function to safely format prices
  const formatPrice = (price) => {
    // Make sure price is a number before calling toFixed
    const numPrice = typeof price === 'number' ? price : parseFloat(price);
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
  };

  return (
    <div className="app-container">
      <EcomSidebar />

      <div className="main-content">
        <Container fluid className="product-container">
          <div className="product-header">
            <h2>Our Products - අපගේ නිශ්පාදන</h2>
            <Button
              variant="warning"
              className="btn-creative"
              onClick={handleShow}
            >
              <IoAdd size={20} className="me-1" /> Add Product
            </Button>
          </div>

          <div className="category-filters">
            <Button
              variant={selectedCategory === 'all' ? 'primary' : 'outline'}
              className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              All Products
            </Button>
            {categories.map(category => (
              <Button
                key={category.categoryId}
                variant={selectedCategory === category.categoryId.toString() ? 'primary' : 'outline'}
                className={`category-btn ${selectedCategory === category.categoryId.toString() ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.categoryId.toString())}
              >
                {category.categoryName}
              </Button>
            ))}
          </div>

          <div className="products-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <Card key={product.id} className="product-card">
                  <div className="product-image-container">
                    <Card.Img variant="top" src={product.imageUrl} className="product-image" />
                    <Badge className={`stock-badge ${getStockBadgeClass(product.stock)}`}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </Badge>
                  </div>
                  <div className="product-content">
                    <h5 className="product-title">{product.name}</h5>
                    <div className="product-category">
                      {product.categoryName}
                    </div>
                    <p className="product-description">
                      {product.description}
                    </p>
                    <div className="product-footer">
                      <div className="product-price">Rs. {formatPrice(product.price)}</div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center w-100 py-5">
                <h4>No products found in this category</h4>
                <Button variant="primary" onClick={handleShow} className="mt-3">
                  Add New Product
                </Button>
              </div>
            )}
          </div>

          <Modal
            show={showModal}
            onHide={handleClose}
            centered
            size="lg"
            className="product-modal"
          >
            <Modal.Header className="product-modal-header d-flex justify-content-between align-items-center">
              <Modal.Title>
                <IoAdd size={24} className="me-1" /> Add New Product - අලුත් නිෂ්පාදන එක් කරන්න
              </Modal.Title>
              <Button
                variant="danger"
                className="d-flex align-items-center justify-content-center close-btn rounded-circle"
                onClick={handleClose}
                style={{ width: '36px', height: '36px' }}
              >
                <IoClose size={20} />
              </Button>
            </Modal.Header>

            <Modal.Body>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={8}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <IoBarcode className="me-2" /> Product Name - නම
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter product name"
                        name="name"
                        value={product.name}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            <IoPricetag className="me-2" /> Price (Rs) - විකුණුම් මිල
                          </Form.Label>
                          <Form.Control
                            type="number"
                            placeholder="0.00"
                            name="price"
                            value={product.price}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            <IoGrid className="me-2" /> Category - කාණ්ඩ
                          </Form.Label>
                          <Form.Select
                            name="category"
                            value={product.category}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select a category</option>
                            {categories.map(category => (
                              <option key={category.categoryId} value={category.categoryId}>
                                {category.categoryName}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>Product Description - විස්තරය </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Enter product description"
                        name="description"
                        value={product.description}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    
                  </Col>

                  <Col md={4}>
                    <Form.Group className="mb-3 image-upload-container">
                      <Form.Label>
                        <IoImage className="me-2" /> Product Image - පිංතූරය
                      </Form.Label>

                      <div className="image-preview">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt="Product preview"
                            className="product-image-preview"
                          />
                        ) : (
                          <div className="image-placeholder">
                            <IoImage size={48} />
                            <p>No image selected</p>
                          </div>
                        )}
                      </div>

                      <div className="image-upload-controls">
                        <Form.Control
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="mb-2"
                          disabled={isImageUploading}
                        />
                        {isImageUploading && (
                          <div className="uploading-text">Compressing image...</div>
                        )}
                      </div>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="modal-footer-buttons">
                  <Button variant="outline-secondary" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button variant="warning" type="submit" disabled={isImageUploading}>
                    Add Product
                  </Button>
                </div>
              </Form>
            </Modal.Body>
          </Modal>
        </Container>
      </div>
    </div>
  );
};

export default EcommerceProduct;