import React, { useState, useEffect } from 'react';
import './Product.css';
import config from '../../config';
import { useLocation } from 'react-router-dom';

const CreateProduct = () => {
  const location = useLocation();
  const selectedProd = location.state?.selectedProd;
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    productCategory: 'select',
    productName: '',
    productCode: '',
    sellingPrice: '',
    buyingPrice: '',
    warranty: '',
    description: '',
    unit: '',
    image: '',
    productChassi: '',
  });

  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${config.BASE_URL}/categories`);
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          console.error('Failed to fetch categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

 
  const fetchProducts = () => {
    fetch(`${config.BASE_URL}/products`)
      .then(response => response.json())
      .then(data => {
        setProducts(data);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

   
  // useEffect(() => {
  //   if (selectedProd) {
  //     setFormData({
  //       productCategory: selectedProd.category || 'select',
  //       productName: selectedProd.productName || '',
  //       productCode: selectedProd.productCode || '',
  //       sellingPrice: selectedProd.productSellingPrice || '',
  //       warranty: selectedProd.productWarranty || '',
  //       description: selectedProd.productDescription || '',
  //       image: '',
  //       productChassi: selectedProd.productChassi || '',  
  //     });
  //   }
  // }, [selectedProd]);

  useEffect(() => {
    if (selectedProd) {
      setFormData({
        productCategory: selectedProd.category?.categoryId || 'select',
        productName: selectedProd.productName || '',
        productCode: selectedProd.productCode || '',
        sellingPrice: selectedProd.productSellingPrice || '',
        warranty: selectedProd.productWarranty || '',
        description: selectedProd.productDescription || '',
        productChassi: selectedProd.productChassi || '',
        image: selectedProd.productImage || '',
      });
      setPreview(selectedProd.productImage || '');
    }
  }, [selectedProd]);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (formData.productCategory === 'select') {
  //     setError('Please select a valid Vechicle category.');
  //     return;
  //   }

  //   const formDataToSend = new FormData(); 
  //   formDataToSend.append('productName', formData.productName);
  //   formDataToSend.append('productCode', formData.productCode);
  //   formDataToSend.append('productSellingPrice', formData.sellingPrice);
  //   formDataToSend.append('productDescription', formData.description);
  //   formDataToSend.append('productWarranty', formData.warranty);
  //   formDataToSend.append('categoryId', formData.productCategory);
  //   formDataToSend.append('productChassi', formData.productChassi); 
  //   formDataToSend.append('rentOrHire', 'rent');

  //   console.log(formData);

  //   // Append the image file if provided
  //   if (image) {
  //     formDataToSend.append('productImage', image);
  //   }

  //   try {
  //     const url = selectedProd
  //       ? `${config.BASE_URL}/product/${selectedProd.productId}`
  //       : `${config.BASE_URL}/product`;
  //     const method = selectedProd ? 'PUT' : 'POST';

  //     const response = await fetch(url, {
  //       method,
  //       body: formDataToSend,
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       setSuccessMessage(`${selectedProd ? 'Product updated' : 'Product created'} successfully`);
  //       handleReset();
  //       fetchProducts();
  //     } else {
  //       const errorData = await response.json();
  //       setError(errorData.error || `Failed to ${selectedProd ? 'update' : 'create'} product`);
  //     }
  //   } catch (error) {
  //     console.error('Error:', error);
  //     setError('An error occurred while processing the product.');
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.productCategory === 'select') {
      setError('Please select a valid Vehicle category.');
      return;
    }
  
    const formDataToSend = new FormData(); 
    formDataToSend.append('productName', formData.productName);
    formDataToSend.append('productCode', formData.productCode);
    formDataToSend.append('productSellingPrice', formData.sellingPrice);
    formDataToSend.append('productDescription', formData.description);
    formDataToSend.append('productWarranty', formData.warranty);
    formDataToSend.append('categoryId', formData.productCategory);
    formDataToSend.append('productChassi', formData.productChassi); 
    // formDataToSend.append('rentOrHire', 'rent');
  
    // Append the image file if provided
    if (image) {
      formDataToSend.append('productImage', image);
    } else if (formData.image) {
      // If no new image is provided, retain the existing image
      formDataToSend.append('productImage', formData.image);
    }
  
    try {
      const url = selectedProd
        ? `${config.BASE_URL}/product/${selectedProd.productId}`
        : `${config.BASE_URL}/product`;
      const method = selectedProd ? 'PUT' : 'POST';
  
      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });
  
      if (response.ok) {
        const data = await response.json();
        setSuccessMessage(`${selectedProd ? 'Product updated' : 'Product created'} successfully`);
        handleReset();
        fetchProducts();
      } else {
        const errorData = await response.json();
        setError(errorData.error || `Failed to ${selectedProd ? 'update' : 'create'} product`);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while processing the product.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  useEffect(() => {
    if (selectedProd) {
      setPreview(selectedProd.productImage || '');
    }
  }, [selectedProd]);

  const handleReset = () => {
    setFormData({
      productCategory: 'select',
      productName: '',
      productCode: '',
      sellingPrice: '',
      buyingPrice: '',
      warranty: '',
      description: '',
      unit: '',
      image: '',
    });
    setImage(null);
    setPreview('');
  };
  return (
    <div>
      <div className="scrolling-container">
        <h4>{selectedProd ? 'Edit Product - නිශ්පාදනයක් එඩිට් කරන්න' : 'Add New Product - නව නිශ්පාදන හදන්න'}</h4>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}
        <div className="row">
          <form action="" className='col-md-8 product-form' onSubmit={handleSubmit}>
            <div className="row">
              <div className="product-details col-md-4 mb-2">
                <label htmlFor="" className='mb-1'>කාණ්ඩය / වර්ගය </label>
                <select name="productCategory" id="" onChange={handleChange} className="form-control" value={formData.productCategory}>
                  <option value="select">තෝරන්න</option>
                  {categories.map((category) => (
                    <option key={category.categoryId} value={category.categoryId}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="product-details col-md-4 mb-2">
  <label htmlFor="" className='mb-1'>නිශ්පාදනයේ පිංතූරය</label>
  <input type="file" name='image' id='' accept="image/*" onChange={handleImageChange} className='form-control' />
  {preview && (
    <div style={{ margin: '10px auto' }}>
      <img src={preview} alt="Preview" style={{ width: '100px', height: 'auto' }} />
    </div>
  )}
</div></div>

<div className="row">
  <div className="product-details col-md-4 mb-2">
    <label htmlFor="" className='mb-1'>නිශ්පාදනයේ නම</label>
    <input onChange={handleChange} type="text" name='productName' id='' value={formData.productName} className='form-control' required/>
  </div>

  {/* <div className="product-details col-md-4 mb-2">
    <label htmlFor="" className='mb-1'>Vehicle Number Plate</label>
    <input onChange={handleChange} type="text" name='productCode' id='' value={formData.productCode} className='form-control' required/>
  </div> */}
</div>

<div className="row">
  <div className="product-details col-md-4 mb-2">
    <label htmlFor="" className='mb-1'>විකුණුම් මිල</label>
    <input onChange={handleChange} type="number" name='sellingPrice' onWheel={(e) => e.target.blur()} id='' value={formData.sellingPrice} className='form-control' />
  </div>

  {/* <div className="product-details col-md-4 mb-2">
    <label htmlFor="" className='mb-1'>Chassis Number</label>
    <input 
      onChange={handleChange} 
      type="text" 
      name='productChassi' 
      id='' 
      value={formData.productChassi} 
      className='form-control' 
    />
  </div> */}
</div>

<div className="row">
  <div className="product-details col-md-4 mb-2">
    <label htmlFor="" className='mb-1'>විස්තරය</label>
    <textarea onChange={handleChange} name='description' id='' value={formData.description} className='form-control' rows={2}></textarea>
  </div>
</div>

            

            <div className="row">
              {/* <div className="product-details col-md-4 mb-2">
                <label htmlFor="warranty" className="mb-1">Warranty</label>
                <input
                  type="text"
                  name="warranty"
                  id="warranty"
                  value={formData.warranty}
                  className="form-control"
                  onChange={handleChange}
                  placeholder="Enter warranty period (e.g., 12 Months, 1 Year)"
                />
              </div> */}
            </div>
            <div className="sales-add btn d-grid d-md-flex me-md-2 justify-content-end px-5">
            <button type="button" className="btn btn-danger mb-2 text-bold" onClick={handleReset} style={{ fontSize: "13px" }}>
  Clear
</button>

              <button className="btn btn-primary btn-md mb-2" style={{fontSize: "13px"}}>{selectedProd ? 'Update' : 'Create'}</button>
            </div>
          </form>

          <div className="showProduct col-md-4">
            <h4>නිශ්පාදන ලයිස්තුව</h4>
            {products.length > 0 ? (
              products.map(product => (<div className="mb-1">
                <div key={product.productId} className="showProduct-group">
                  <p>{product.productName}</p>
                  <p>{product.category ? product.category.categoryName : 'No Category'}</p>
                </div>
              </div>
              ))
            ) : (
              <p>දත්ත නොමැත</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateProduct;