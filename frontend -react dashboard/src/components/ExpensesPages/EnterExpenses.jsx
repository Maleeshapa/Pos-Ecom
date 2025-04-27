import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import config from '../../config';
import { Link } from 'react-router-dom';

const EnterExpenses = () => {
    const [expensesCats, setExpensesCats] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedExpensesCat, setSelectedExpensesCat] = useState('');
    const [selectedProduct, setSelectedProduct] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        // Fetch expenses categories
        axios.get(`${config.BASE_URL}/expensesCats`)
            .then(response => setExpensesCats(response.data))
            .catch(error => console.error('Error fetching expenses categories:', error));

        // Fetch products
        axios.get(`${config.BASE_URL}/products`)
            .then(response => setProducts(response.data))
            .catch(error => console.error('Error fetching products:', error));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const expenseData = {
            expensesCatId: selectedExpensesCat,
            price: parseFloat(price),
            description,
            date: date.toISOString().split('T')[0] // Format date as YYYY-MM-DD
        };

        if (selectedProduct) {
            expenseData.productId = selectedProduct;
        }

        try {
            const response = await axios.post(`${config.BASE_URL}/expense`, expenseData);
            alert('Expense added successfully!');
            // Reset form fields
            setSelectedExpensesCat('');
            setSelectedProduct('');
            setPrice('');
            setDescription('');
            setDate(new Date());
        } catch (error) {
            console.error('Error adding expense:', error);
            alert('Failed to add expense.');
        }
    };

    return (
        <div className="container mt-3 col-lg-10 ">
            <div className="row d-flex justify-content-between align-items-center mb-3">
                <h4 className="col-auto">Enter Expenses</h4>
                <div className="col-auto">
                    <Link to="/expenses/history" className="btn btn-warning">Expenses History</Link>
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label> වියදම අයත් කාණ්ඩය </label>
                    <select className="form-control" value={selectedExpensesCat} onChange={e => setSelectedExpensesCat(e.target.value)} required>
                        <option value="">Select Category</option>
                        {expensesCats.map(cat => (
                            <option key={cat.expensesCatId} value={cat.expensesCatId}>{cat.expensesCatName}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label> වියදම අයිති නිශ්පාදනය </label>
                    <select className="form-control" value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)}  >
                        <option value="">Select </option>
                        {products.map(product => (
                            <option key={product.productId} value={product.productId}>{product.productName} | {product.productCode} </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label> මිල </label>
                    <input type="number" className="form-control" value={price} onChange={e => setPrice(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>විස්තරය</label>
                    <input type="text" className="form-control" value={description} onChange={e => setDescription(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>දිනය</label>
                    <DatePicker selected={date} onChange={date => setDate(date)} className="form-control" required/>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
};

export default EnterExpenses;