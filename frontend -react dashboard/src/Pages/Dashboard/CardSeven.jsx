
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../../Models/ConfirmModal';
import config from '../../config';
import 'bootstrap/dist/css/bootstrap.min.css';

const CardSeven = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

//   const navigate = useNavigate();

  const checkImage = async (url) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  const getImageUrl = async (imageUrl) => {
    if (!imageUrl) return 'https://via.placeholder.com/300';
    
    // If the URL is already absolute (starts with http:// or https://)
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      const isValid = await checkImage(imageUrl);
      return isValid ? imageUrl : 'https://via.placeholder.com/300';
    }
    
    // If it's a relative URL, prepend the BASE_URL
    const fullUrl = `${config.BASE_URL}${imageUrl}`;
    const isValid = await checkImage(fullUrl);
    return isValid ? fullUrl : 'https://via.placeholder.com/300';
  };

  const fetchProductList = async () => {
    try {
      const response = await fetch(`${config.BASE_URL}/products`);
      if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);

      const data = await response.json();
      
      // Process each product to get valid image URLs
      const processedProducts = await Promise.all(
        data.map(async (product) => ({
          ...product,
          imageUrl: await getImageUrl(product.productImage)
        }))
      );
      
      setProducts(processedProducts);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductList();
  }, []);

//   useEffect(() => {
//     // Add/remove modal classes to body
//     if (showImageModal) {
//       document.body.classList.add('modal-open');
//     } else {
//       document.body.classList.remove('modal-open');
//     }

//     return () => {
//       document.body.classList.remove('modal-open');
//     };
//   }, [showImageModal]);

//   const handleDelete = (product) => {
//     setSelectedProduct(product);
//     setIsModalOpen(true);
//   };

//   const confirmDelete = async () => {
//     try {
//       await fetch(`${config.BASE_URL}/product/${selectedProduct.productId}`, {
//         method: 'DELETE',
//       });

//       setProducts(prev => prev.filter(prod => prod.productId !== selectedProduct.productId));
//     } catch (err) {
//       alert('This product is used for creating invoices.');
//     } finally {
//       setIsModalOpen(false);
//       setSelectedProduct(null);
//     }
//   };

//   const handleEdit = (product) => {
//     navigate('/product/create', { state: { selectedProd: product } });
//   };

  const handleStatusChange = async (product, newStatus) => {
    try {
      await fetch(`${config.BASE_URL}/product/${product.productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productStatus: newStatus }),
      });

      setProducts(prev =>
        prev.map(prod =>
          prod.productId === product.productId ? { ...prod, productStatus: newStatus } : prod
        )
      );
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

//   const handleAddProduct = () => {
//     navigate('/product/create');
//   };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  if (isLoading) return <p>Loading products...</p>;
  if (error) return <p className="text-danger">Error: {error}</p>;

  return (
    <div className="container mt-4 position-relative">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className='d-flex justify-content-center'>නිශ්පාදන එකතුව</h4>
        
      </div>

    
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 row-cols-lg-6 g-4">
        {products.map((product) => (
          <div key={product.productId} className="col">
            <div className="card h-100 shadow-sm border-0 d-flex flex-column">
              <img
                src={product.imageUrl}
                className="card-img-top"
                alt={product.productName}
                style={{ height: '150px', objectFit: 'cover', cursor: 'pointer' }}
                onClick={() => openImageModal(product.imageUrl)}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{product.productName}</h5>
                {/* <p className="card-text"><strong>Number Plate:</strong> {product.productCode}</p> */}
                <p className="card-text"><strong>විකුණුම් මිල:</strong> <br />Rs. {product.productSellingPrice}</p>
                {/* <p className="card-text"><strong>Chassis:</strong> {product.productChassi}</p>
                <p className="card-text"><strong>Rent Price:</strong> Rs. {product.productSellingPrice}</p>
                <p className="card-text flex-grow-1"><small>{product.productDescription}</small></p> */}

                <select
                  className="form-control mb-2"
                  value={product.productStatus}
                  onChange={(e) => handleStatusChange(product, e.target.value)}
                >
                  <option value="In stock">Available</option>
                  <option value="Out of Stock">Unavailable</option>
                </select>

                <div className="d-flex justify-content-between mt-auto">

                  {/* <button className="btn btn-warning btn-sm" onClick={() => handleEdit(product)}>✏️ Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(product)}>🗑 Delete</button> */}
              
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* {isModalOpen && (
        <ConfirmModal onConfirm={confirmDelete} onClose={() => setIsModalOpen(false)} />
      )} */}

      {showImageModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100" style={{ zIndex: 1050 }}>
          <div 
            className="position-relative w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
          >
            <div className="bg-white p-3 rounded position-relative" style={{ maxWidth: '90%', maxHeight: '90vh' }}>
              {/* Close Button */}
              <button 
                type="button" 
                className="btn-close position-absolute top-0 end-0 m-3"
                onClick={() => setShowImageModal(false)}
                style={{ zIndex: 1060 }}
              ></button>
              
              {/* Modal Content */}
              <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '50vh' }}>
                <img
                  src={selectedImage}
                  alt="Vehicle"
                  className="img-fluid"
                  style={{ 
                    maxHeight: '80vh',
                    maxWidth: '100%',
                    objectFit: 'contain'
                  }}
                />
              </div>

              {/* Additional Close Button at the Bottom */}
              <div className="d-flex justify-content-center mt-3">
                <button 
                  type="button" 
                  className="btn btn-danger"
                  onClick={() => setShowImageModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardSeven;