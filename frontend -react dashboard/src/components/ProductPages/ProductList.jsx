import React, { useEffect, useState } from 'react';
import Table from '../Table/Table';
import ConfirmModal from '../../Models/ConfirmModal';
import config from '../../config';
import { useNavigate } from 'react-router-dom';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [data, setData] = useState([]); // Added data state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductIndex, setSelectedProductIndex] = useState(null);

  const columns = ['#', 'නිශ්පාදනයේ නම', 'විකුණුම් මිල', 'විස්තරය', 'CategoryId', 'කාණ්ඩය / වර්ගය', 'Status'];
  const btnName = ['අලුත් නිශ්පාදනයක් +'];

  useEffect(() => {
    fetchProductList();
  }, []); // Added dependency array to prevent infinite loop

  const fetchProductList = async () => {
    try {
      const response = await fetch(`${config.BASE_URL}/products`);
      if (!response.ok) {
        throw new Error(`Failed to fetch product list: ${response.status} ${response.statusText}`);
      }
      const fetchedProducts = await response.json();
      setProducts(fetchedProducts);
      
      const formattedData = fetchedProducts.map(prod => [
        prod.productId,
        prod.productName,
        prod.productSellingPrice,
        prod.productDescription,
        prod.category?.categoryId,
        prod.category?.categoryName,
        <select
          className="form-control"
          value={prod.productStatus}
          onChange={(e) => handleStatusChange(prod.productId, e.target.value)}
        >
          <option value="In stock">Available</option>
          <option value="Out of Stock">unavailable</option>
        </select>
      ]);
      setData(formattedData);
      setIsLoading(false);
    } catch (err) {
      setError(`Error fetching product list: ${err.message}`);
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (productId, newStatus) => {
    try {
      const response = await fetch(`${config.BASE_URL}/product/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productStatus: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to update product status: ${response.status} ${response.statusText}. ${errorData.message || ''}`);
      }
      await fetchProductList();
    } catch (error) {
      setError(`Error updating product status: ${error.message}`);
    }
  };

  const handleDelete = (rowIndex) => {
    setSelectedProductIndex(rowIndex);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const productId = products[selectedProductIndex].productId;
      const response = await fetch(`${config.BASE_URL}/product/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to delete Product: ${response.status} ${response.statusText}. ${errorData.message || ''}`);
      }

      await fetchProductList();
    } catch (err) {
      setError(`Error deleting product: ${err.message}`);
      alert('This product is used for creating invoices.');
    } finally {
      setIsModalOpen(false);
      setSelectedProductIndex(null);
    }
  };

  const cancelDelete = () => {
    setIsModalOpen(false);
    setSelectedProductIndex(null);
  };

  const handleEdit = (rowIndex) => {
    const selectedProduct = products[rowIndex];
    // Only pass serializable data
    const editData = {
      productId: selectedProduct.productId,
      category: selectedProduct.category,
      productName: selectedProduct.productName,
      productCode: selectedProduct.productCode,
      productChassi: selectedProduct.productChassi,
      productSellingPrice: selectedProduct.productSellingPrice,
      productDescription: selectedProduct.productDescription,
      productStatus: selectedProduct.productStatus
    };

    navigate('/product/create', { state: { selectedProd: editData } });
  };

  const navigate = useNavigate();

  const handleAddProduct = () => {
    navigate('/product/create');
  };

  const title = 'Rent Vehicles List';
  const invoice = 'Vehicles.pdf';

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className="scrolling-container">
        <h4>නිශ්පාදන ලයිස්තුව - Product List</h4>
        <Table
          data={data}
          columns={columns}
          btnName={btnName}
          onAdd={handleAddProduct}
          onDelete={handleDelete}
          onEdit={handleEdit}
          showDate={false}
          title={title}
          invoice={invoice}
        />
        {isModalOpen && (
          <ConfirmModal
            onConfirm={confirmDelete}
            onClose={cancelDelete}
          />
        )}
      </div>
    </div>
  );
};

export default ProductList;