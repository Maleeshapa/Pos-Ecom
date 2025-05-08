import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button, Table, Spinner, Modal, Form } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import { IoAdd, IoClose } from 'react-icons/io5';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import EcomSidebar from '../components/EcomSidebar';
import './EcommerceStock.css';

// Base URL for API
import { BASE_URL } from '../../config';

function EcommerceStock() {
    const [loading, setLoading] = useState(true);
    const [stock, setStock] = useState([]);
    const [selectedStock, setSelectedStock] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [formData, setFormData] = useState({
        productId: '',
        qty: '',
        date: new Date().toISOString().split('T')[0],
        price:0,
    });
    const pageSize = 10;

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'productId') {
            const selectedProduct = products.find((p) => p.id === value);
            if (selectedProduct) {
                setFormData((prevData) => ({
                    ...prevData,
                    productId: value,
                    name: selectedProduct.name,
                }));
            } else {
                setFormData((prevData) => ({
                    ...prevData,
                    productId: value,
                    name: '',
                }));
            }
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    // Fetch stock
    useEffect(() => {
        fetchStock();
    }, [currentPage]);

    const fetchStock = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${BASE_URL}/ecomStocks?page=${currentPage}&pageSize=${pageSize}`);

            const stockData = response.data.stock || response.data;
            setStock(stockData);

            if (response.data.totalCount) {
                setTotalPages(Math.ceil(response.data.totalCount / pageSize));
            } else {
                setTotalPages(Math.ceil(stockData.length / pageSize) || 1);
            }

            setLoading(false);
        } catch (err) {
            console.error('Error fetching stock:', err);
            setError('Failed to load stock data. Please try again later.');
            setLoading(false);
            toast.error('Failed to load stock data');
        }
    };

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/products`);
                const formattedProducts = response.data.map(item => ({
                    id: item.productId.toString(),
                    name: item.productName,
                    stock: item.productStatus === 'In stock' ? 10 : 0,
                    imageUrl: item.productImage || 'https://via.placeholder.com/300',
                    price: parseFloat(item.productSellingPrice) || 0,
                    category: item.category?.categoryId.toString() || 'uncategorized',
                    description: item.productDescription || 'No description available',
                }));
                setProducts(formattedProducts);
            } catch (error) {
                toast.error('Failed to fetch products');
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const stockData = {
                stockQTY: formData.qty,
                productId: formData.productId,
                stockDate: new Date().toLocaleString("en-US", { timeZone: "Asia/Colombo" })
            };

            const response = await axios.post(`${BASE_URL}/ecomStock`, stockData);
            if (response.status === 201) {
                toast.success('Stock added successfully!');
                setShowModal(false);
                setFormData({
                    productId: '',
                    name: '',
                    description: '',
                    price: 0,
                    qty: 0,
                    date: new Date().toLocaleString("en-US", { timeZone: "Asia/Colombo" })
                });
                fetchStock();
            } else {
                toast.error('Failed to add stock. Please try again.');
            }
        } catch (error) {
            console.error('Error adding stock:', error);
            toast.error('Failed to add stock. Please try again.');
        }
    };

    const confirmDelete = (id) => {
        setDeleteTarget(id);
        setShowDeleteModal(true);
    };

    const closeDelete = () => setShowDeleteModal(false);

    const handleDelete = async () => {
        try {
            await axios.delete(`${BASE_URL}/ecomStock/${deleteTarget}`);
            toast.success('Deleted successfully');
            closeDelete();
            fetchStock();
        } catch {
            toast.error('Delete failed');
        }
    };


    const handleViewStock = (stock) => {
        setSelectedStock(stock);
    };

    const handlePrint = (stock) => {
        window.print();
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // Filter stock based on search term
    const filteredStock = stock.filter(item =>
        item.productId?.toString().includes(searchTerm) ||
        (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);


    if (loading) {
        return (
            <div className="app-container">
                <EcomSidebar />
                <div className="main-content d-flex justify-content-center align-items-center">
                    <Spinner animation="border" role="status" variant="primary">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            </div>
        );
    }

    return (
        <div className="app-container">
            {/* Sidebar */}
            <EcomSidebar />

            {/* Main Content */}
            <div className="main-content">
                <Container fluid className='product-container'>
                    <div className="product-header">
                        <h2>Stock - තොග කලමනාකරණය</h2>
                        <Button
                            variant="warning"
                            className="btn-creative"
                            onClick={handleShow}
                        >
                            <IoAdd className="me-1" /> Add Stock
                        </Button>
                    </div>

                    {/* Stock Management */}
                    <Row className="mb-4">
                        <Col>
                            <Card className="orders-list-card">
                                <Card.Header className="bg-white d-flex justify-content-between align-items-center">

                                    <div className="d-flex gap-2">
                                        <div className="stock-search d-none d-md-block">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Search stock items..."
                                                value={searchTerm}
                                                onChange={handleSearch}
                                            />
                                        </div>

                                    </div>
                                </Card.Header>
                                <Card.Body className="p-0">
                                    <div className="table-responsive">
                                        <Table hover className="stock-table mb-0">
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>දිනය (Date)</th>
                                                    <th>භාන්ඩය (Product)</th>
                                                    <th>ප්‍රමාණය (Quantity)</th>
                                                    <th>Total Price</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredStock.map((item) => (
                                                    <tr key={item.ecomstockId}>
                                                        <td>#{item.ecomstockId}</td>
                                                        <td>
                                                            <div>{new Date(item.stockDate).toLocaleDateString()}</div>
                                                        </td>
                                                        <td>{item.product?.productName}</td>
                                                        <td>{item.stockQTY}</td>
                                                        <td>{item.product?.productSellingPrice*item.stockQTY}</td>
                                                        <td>
                                                            <div className="d-flex gap-1">
                                                                <Button
                                                                    variant="danger"
                                                                    size="sm"
                                                                    className="view-btn"
                                                                    onClick={() => confirmDelete(item.ecomstockId)}
                                                                >
                                                                    <FaTrash />
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>

                                    {filteredStock.length === 0 && (
                                        <div className="empty-state text-center py-5">
                                            <h5 className="text-muted">No stock items found.</h5>
                                            <p>Add your first stock item to get started!</p>
                                        </div>
                                    )}
                                </Card.Body>
                                <Card.Footer className="bg-white d-flex justify-content-between align-items-center">
                                    <div className="text-muted">Showing {filteredStock.length} items</div>
                                    <div className="pagination-controls">
                                        <Button
                                            variant="outline-secondary"
                                            size="sm"
                                            disabled={currentPage === 1}
                                            onClick={() => handlePageChange(currentPage - 1)}
                                        >
                                            Previous
                                        </Button>
                                        <span className="mx-2">Page {currentPage} of {totalPages}</span>
                                        <Button
                                            variant="outline-secondary"
                                            size="sm"
                                            disabled={currentPage === totalPages}
                                            onClick={() => handlePageChange(currentPage + 1)}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </Card.Footer>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Add Stock Modal */}
            <Modal
                show={showModal}
                onHide={handleClose}
                centered
                size="lg"
                className="stock-modal"
            >
                <Modal.Header className="stock-modal-header d-flex justify-content-between align-items-center">
                    <Modal.Title>
                        <IoAdd size={24} className="me-1" /> Add New Stock - අලුත් ගබඩා අයිතම එක් කරන්න
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
                            <Col md={6}>

                                <Form.Group className="mb-3">
                                    <Form.Label>Product Name - නම</Form.Label>
                                    <Form.Select
                                        name="productId"
                                        value={formData.productId}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">තොරන්න</option>
                                        {products.map((product) => (
                                            <option key={product.id} value={product.id}>
                                                {product.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                            </Col>
                            <Col md={6}>

                                <Form.Group className="mb-3">
                                    <Form.Label>Quantity - ප්‍රමාණය</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Enter quantity"
                                        name="qty"
                                        value={formData.qty}
                                        onChange={handleChange}
                                        min="1"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="d-flex justify-content-end mt-3 gap-2">
                            <Button variant="outline-secondary" onClick={handleClose}>
                                Cancel - අවලංගු
                            </Button>
                            <Button variant="primary" type="submit">
                                Add Stock - එකතු කරන්න
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showDeleteModal} onHide={closeDelete} centered>
                <Modal.Header>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                    <Button variant="close" onClick={closeDelete}></Button>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this stock item?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeDelete}>Cancel</Button>
                    <Button variant="danger" onClick={handleDelete}>Delete</Button>
                </Modal.Footer>
            </Modal>

            {/* Toast notifications container */}
            <ToastContainer />
        </div>
    );
}

export default EcommerceStock;