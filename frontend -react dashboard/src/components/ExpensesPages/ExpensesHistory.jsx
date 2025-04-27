// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import config from '../../config';

// const ExpensesHistory = () => {
//     const [expenses, setExpenses] = useState([]);

//     useEffect(() => {
//         // Fetch expenses data
//         axios.get(`${config.BASE_URL}/expenses`)
//             .then(response => setExpenses(response.data))
//             .catch(error => console.error('Error fetching expenses:', error));
//     }, []);

//     return (
//         <div className="container mt-5">
//             <h4>Expenses History</h4>
//             <div className="table-responsive">
//                 <table className="table table-bordered table-striped">
//                     <thead className='table-dark'>
//                         <tr>
//                             <th>#</th>
//                             <th>Category</th>
//                             <th>Vechicle</th>
//                             <th>Price</th>
//                             <th>Description</th>
//                             <th>Date</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//     {expenses.map(expense => (
//         <tr key={expense.expensesId}>
//             <td>{expense.expensesId}</td>
//             <td>{expense.expensesCategory.expensesCatName    }</td>
//             <td>{expense.product.productName }</td>
//             <td>{expense.price}</td>
//             <td>{expense.description}</td>
//             <td>{new Date(expense.date).toLocaleDateString()}</td>
//         </tr>
//     ))}
// </tbody>

//                 </table>
//             </div>
//         </div>
//     );
// };

// export default ExpensesHistory;


//---------------------------------------------------------------------------------------------------------


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import config from '../../config';

const ExpensesHistory = () => {
    const [expenses, setExpenses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [filteredExpenses, setFilteredExpenses] = useState([]);

    useEffect(() => {
        axios.get(`${config.BASE_URL}/expenses`)
            .then(response => {
                setExpenses(response.data);
                setFilteredExpenses(response.data);
            })
            .catch(error => console.error('Error fetching expenses:', error));
    }, []);

    useEffect(() => {
        const filterExpenses = () => {
            let filtered = [...expenses];
    
            if (searchTerm) {
                const lowerSearchTerm = searchTerm.toLowerCase();
    
                filtered = filtered.filter(expense => {
                    return (
                        (expense.expensesCategory?.expensesCatName &&
                            expense.expensesCategory.expensesCatName.toLowerCase().includes(lowerSearchTerm)) || // Category
                        (expense.product?.productName &&
                            expense.product.productName.toLowerCase().includes(lowerSearchTerm)) || // Vehicle Name
                        (expense.product?.productCode &&
                            expense.product.productCode.toLowerCase().includes(lowerSearchTerm)) || // Vehicle Number Plate
                        (expense.price &&
                            String(expense.price).toLowerCase().includes(lowerSearchTerm)) || // Price
                        (expense.description &&
                            expense.description.toLowerCase().includes(lowerSearchTerm)) || // Description
                        (expense.date &&
                            new Date(expense.date).toLocaleDateString().toLowerCase().includes(lowerSearchTerm)) // Date
                    );
                });
            }
    
            // Apply date range filter
            if (startDate && endDate) {
                const start = new Date(startDate);
                const end = new Date(endDate);
                end.setHours(23, 59, 59); // Include the full end date
    
                filtered = filtered.filter(expense => {
                    const expenseDate = new Date(expense.date);
                    return expenseDate >= start && expenseDate <= end;
                });
            }
    
            // ✅ Sort by latest expenses first
            filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    
            setFilteredExpenses(filtered);
        };
    
        filterExpenses();
    }, [expenses, searchTerm, startDate, endDate]);
    
    

    const clearFilters = () => {
        setSearchTerm('');
        setStartDate('');
        setEndDate('');
    };

    return (
        <div className="container-fluid mt-4">
            <h4>Expenses History</h4>
            
            {/* Search and Filter Section */}
            
            <div className="row mb-4 d-flex justify-content-between align-items-center">
    {/* Search bar on the left */}
    <div className="col-md-4">
        <input
            type="text"
            className="form-control"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
    </div>

    {/* Filters on the right */}
    <div className="col-md-8 d-flex justify-content-end gap-2">
        <input
            type="date"
            className="form-control w-auto"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Start Date"
        />
        <input
            type="date"
            className="form-control w-auto"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="End Date"
        />
        <button 
            className="btn btn-secondary"
            onClick={clearFilters}
        >
            Clear
        </button>
    </div>
</div>

            {/* Results Summary */}
            <div className="mb-3">
                <small className="text-muted">
                    Showing {filteredExpenses.length} of {expenses.length} expenses
                </small>
            </div>

            {/* Table Section */}
            <div className="table-responsive">
                <table className="table table-bordered table-striped">
                    <thead className='table-dark'>
                        <tr>
                            <th>#</th>
                            <th>Category</th>
                            <th>Product Name</th>
                            {/* <th>Vehicle Number Plate</th> */}
                            <th>Price</th>
                            <th>Description</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
    {filteredExpenses.map(expense => (
        <tr key={expense.expensesId}>
            <td>{expense.expensesId}</td>
            <td>{expense.expensesCategory?.expensesCatName || '-'}</td>
            <td>{expense.product?.productName || '-'}</td>
            {/* <td>{expense.product?.productCode || '-'}</td> */}
            <td>{expense.price}</td>
            <td>{expense.description}</td>
            <td>{new Date(expense.date).toLocaleDateString()}</td>
        </tr>
    ))}
</tbody>

                </table>
            </div>

            {/* No Results Message */}
            {filteredExpenses.length === 0 && (
                <div className="alert alert-info">
                    No expenses found matching your search criteria.
                </div>
            )}
        </div>
    );
};

export default ExpensesHistory;