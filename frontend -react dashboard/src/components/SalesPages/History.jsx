// // import React, { useEffect, useState } from 'react';
// // import config from '../../config';
// // import 'bootstrap/dist/css/bootstrap.min.css';
// // import { ChevronDown, ChevronUp } from 'lucide-react';

// // const History = () => {
// //   const [transactions, setTransactions] = useState([]);
// //   const [expandedTransactions, setExpandedTransactions] = useState({});
// //   const [salesData, setSalesData] = useState({});
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   // Define columns for transactions table
// //   const columns = [
// //     '#',
// //     'Sale Date',
// //     'Customer/Shop',
// //     'Sub Total',
// //     'Extra Charges',
// //     'Discount',
// //     'Total Amount',
// //     'Paid',
// //     'Due',
// //     'Note',
// //     'Action'
// //   ];

// //   useEffect(() => {
// //     fetchTransactionsHistory();
// //   }, []);

// //   const fetchTransactionsHistory = async () => {
// //     try {
// //       setIsLoading(true);
// //       // Fix: Using the correct endpoint from your existing code
// //       const response = await fetch(`${config.BASE_URL}/api/transactions/all`);

// //       if (!response.ok) {
// //         console.error('Response status:', response.status);
// //         console.error('Response text:', await response.text());
// //         throw new Error(`Failed to fetch transactions history: ${response.status}`);
// //       }

// //       const transactionsData = await response.json();
// //       console.log('Transactions loaded:', transactionsData.length);

// //       // Sort transactions by transactionId in descending order
// //       transactionsData.sort((a, b) => b.transactionId - a.transactionId);

// //       setTransactions(transactionsData);
// //       setIsLoading(false);
// //     } catch (err) {
// //       console.error('Fetch error:', err);
// //       setError(err.message);
// //       setIsLoading(false);
// //     }
// //   };

// //   const fetchSalesForTransaction = async (transactionId) => {
// //     try {
// //       // Check if we already have this transaction's sales data
// //       if (salesData[transactionId]) {
// //         return;
// //       }

// //       // This endpoint will need to be created
// //       const response = await fetch(`${config.BASE_URL}/salesByTransactionId/${transactionId}`);
// //       if (!response.ok) {
// //         throw new Error(`Failed to fetch sales for transaction ${transactionId}`);
// //       }

// //       const sales = await response.json();

// //       // Fetch product details for each sale
// //       const salesWithProducts = await Promise.all(sales.map(async (sale) => {
// //         const productResponse = await fetch(`${config.BASE_URL}/product/${sale.productId}`);
// //         const productData = await productResponse.json();

// //         return {
// //           ...sale,
// //           productName: productData.productName
// //         };
// //       }));

// //       // Add the sales data to the state
// //       setSalesData(prev => ({
// //         ...prev,
// //         [transactionId]: salesWithProducts
// //       }));
// //     } catch (err) {
// //       console.error(`Error fetching sales for transaction ${transactionId}:`, err);
// //       // Add empty array to prevent repeated fetch attempts
// //       setSalesData(prev => ({
// //         ...prev,
// //         [transactionId]: []
// //       }));
// //     }
// //   };

// //   const toggleExpand = async (transactionId) => {
// //     // If not already expanded, fetch the related sales
// //     if (!expandedTransactions[transactionId]) {
// //       await fetchSalesForTransaction(transactionId);
// //     }

// //     // Toggle expansion state
// //     setExpandedTransactions(prev => ({
// //       ...prev,
// //       [transactionId]: !prev[transactionId]
// //     }));
// //   };

// //   const handleDelete = async (transactionId) => {
// //     if (!window.confirm('Are you sure you want to delete this transaction? This will also delete all related sales records.')) {
// //       return;
// //     }

// //     try {
// //       const response = await fetch(`${config.BASE_URL}/transactionDelete/${transactionId}`, {
// //         method: 'DELETE',
// //       });

// //       if (!response.ok) {
// //         throw new Error('Failed to delete transaction');
// //       }

// //       // Remove deleted transaction from state
// //       setTransactions(prevTransactions =>
// //         prevTransactions.filter(transaction => transaction.transactionId !== transactionId)
// //       );

// //       // Also remove any expanded data
// //       if (expandedTransactions[transactionId]) {
// //         const { [transactionId]: _, ...rest } = expandedTransactions;
// //         setExpandedTransactions(rest);
// //       }

// //       if (salesData[transactionId]) {
// //         const { [transactionId]: _, ...rest } = salesData;
// //         setSalesData(rest);
// //       }

// //       alert('Transaction deleted successfully');
// //     } catch (err) {
// //       console.error('Error deleting transaction:', err);
// //       alert('Failed to delete transaction: ' + err.message);
// //     }
// //   };

// //   const formatDate = (dateString) => {
// //     return new Date(dateString).toLocaleDateString();
// //   };

// //   const formatCurrency = (amount) => {
// //     return parseFloat(amount || 0).toLocaleString();
// //   };

// //   if (isLoading) {
// //     return (
// //       <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
// //         <div className="spinner-border text-primary" role="status">
// //           <span className="visually-hidden">Loading...</span>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div className="alert alert-danger" role="alert">
// //         Error: {error}
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="container-fluid py-4">
// //       <div className="d-flex justify-content-between align-items-center mb-4">
// //         <h4 className="mb-0">Transaction History</h4>
// //       </div>

// //       <div className="card">
// //         <div className="card-body">
// //           <div className="table-responsive">
// //             <table className="table table-hover">
// //               <thead className='table-dark'>
// //                 <tr>
// //                   {columns.map((column, index) => (
// //                     <th key={index}>{column}</th>
// //                   ))}
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {transactions.map((transaction) => (
// //                   <React.Fragment key={transaction.transactionId}>
// //                     <tr>
// //                       <td>{transaction.transactionId}</td>
// //                       <td>{formatDate(transaction.createdAt)}</td>
// //                       <td>{formatCurrency(transaction.price)}</td>
// //                       <td>{formatCurrency(transaction.extraCharges)}</td>
// //                       <td>{formatCurrency(transaction.discount)}</td>
// //                       <td>{formatCurrency(transaction.totalAmount)}</td>
// //                       <td>{formatCurrency(transaction.paidAmount)}</td>
// //                       <td>{formatCurrency(transaction.due)}</td>
// //                       <td>{transaction.note || '-'}</td>
// //                       <td>
// //                         <div className="d-flex gap-2">

// //                           <button
// //                             className="btn btn-success btn-sm d-flex align-items-center gap-1"
// //                             onClick={() => toggleExpand(transaction.transactionId)}
// //                           >
// //                             {expandedTransactions[transaction.transactionId] ? (
// //                               <>
// //                                 <ChevronUp size={20} />
                                
// //                               </>
// //                             ) : (
// //                               <>
// //                                 <ChevronDown size={20} />
// //                               </>
// //                             )}
// //                           </button>
// //                           <button
// //                             className="btn btn-danger btn-sm"
// //                             onClick={() => handleDelete(transaction.transactionId)}
// //                           >
// //                             Delete
// //                           </button>
// //                         </div>
// //                       </td>
// //                     </tr>
// //                     {expandedTransactions[transaction.transactionId] && (
// //                       <tr>
// //                         <td colSpan={columns.length} className="bg-light p-0">
// //                           <div className="p-3">
// //                             <h6 className="mb-3">Sold Items</h6>
// //                             {salesData[transaction.transactionId]?.length > 0 ? (
// //                               <table className="table table-sm mb-0 table-striped">
// //                                 <thead className='table-primary'>
// //                                   <tr>
// //                                     <th>Sale ID</th>
// //                                     <th>Product Name</th>
// //                                     <th>Quantity</th>
// //                                     <th>Price</th>
// //                                     {/* <th>Status</th> */}
// //                                   </tr>
// //                                 </thead>
// //                                 <tbody>
// //                                   {salesData[transaction.transactionId].map((sale) => (
// //                                     <tr key={sale.salesId}>
// //                                       <td>{sale.salesId}</td>
// //                                       <td>{sale.productName}</td>
// //                                       <td>{sale.quantity || 1}</td>
// //                                       <td>{formatCurrency(sale.price)}</td>
// //                                       {/* <td>
// //                                         <span className={`badge bg-${sale.status === 'sold' ? 'primary' : sale.status === 'rent' ? 'warning' : 'info'}`}>
// //                                           {sale.status}
// //                                         </span>
// //                                       </td> */}
// //                                     </tr>
// //                                   ))}
// //                                 </tbody>
// //                               </table>
// //                             ) : (
// //                               <p className="text-muted mb-0">No sales data available for this transaction.</p>
// //                             )}
// //                           </div>
// //                         </td>
// //                       </tr>
// //                     )}
// //                   </React.Fragment>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>

// //           {transactions.length === 0 && (
// //             <div className="text-center p-4">
// //               <p className="text-muted">No transaction history found.</p>
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default History;





// import React, { useEffect, useState } from 'react';
// import config from '../../config';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import PaginatedTable from '../Table/PaginatedTable';

// const History = () => {
//   const [rawData, setRawData] = useState([]); // Store the complete raw data
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [showColumns, setShowColumns] = useState({
//     saleDate: true,
//     customerName: true,
//     customerNic: false,
//     guarantorName: true,
//     guarantorNic: false,
//     vehicle: true,
//     paymentStatus: true,
//     rentHirePrice: false,
//     extraCharges: true,
//     totalAmount: true,
//     paidAmount: true,
//     dueAmount: true,
//     rentOrHire: true
//   });

//   const columns = [
//     '#',
//     'Sale Date',
//     'Customer Name',
//     'Customer NIC',
//     'Guarantor Name',
//     'Guarantor NIC',
//     'Vehicle',
//     'Payment Status',
//     'Rent/Hire Price',
//     'Extra Charges',
//     'Total Amount',
//     'Paid Amount',
//     'Due Amount',
//     'Rent or Hire'
//   ];

//   const handleDelete = async (rowIndex) => {
//     try {
//       // Get the actual sale object from rawData
//       const saleToDelete = rawData[rowIndex];
  
//       if (!saleToDelete || !saleToDelete.salesId) {
//         console.error('Sale data not found for index:', rowIndex);
//         console.error('Raw data:', rawData);
//         throw new Error('Sale data not found');
//       }
  
//       const response = await fetch(`${config.BASE_URL}/salesDelete/${saleToDelete.salesId}`, {
//         method: 'DELETE',
//       });
  
//       if (!response.ok) {
//         throw new Error('Failed to delete sale');
//       }
  
//       // Remove the deleted row from rawData
//       setRawData(prevData => prevData.filter((_, index) => index !== rowIndex));
//       alert('Sale deleted successfully');
//     } catch (err) {
//       console.error('Error deleting sale:', err);
//       alert('Failed to delete sale: ' + err.message);
//     }
//   };

//   useEffect(() => {
//     fetchSalesHistory();
//   }, []);



//   const fetchSalesHistory = async () => {
//     try {
//       const response = await fetch(`${config.BASE_URL}/salesGet`);
//       if (!response.ok) {
//         throw new Error('Failed to fetch history');
//       }
//       const salesData = await response.json();

//       // Sort salesData by salesId in descending order before processing
//       salesData.sort((a, b) => b.salesId - a.salesId);

//       const formattedData = await Promise.all(salesData.map(async (sale) => {
//         // Fetch customer data
//         const customerResponse = await fetch(`${config.BASE_URL}/customer/${sale.customerId}`);
//         const customerData = await customerResponse.json();

//         // Fetch guarantor data
//         const guarantorsResponse = await fetch(`${config.BASE_URL}/guarantor/${sale.guarantorId}`);
//         const guarantorsData = await guarantorsResponse.json();

//         // Fetch product data
//         const productResponse = await fetch(`${config.BASE_URL}/product/${sale.productId}`);
//         const productData = await productResponse.json();

//         return {
//           salesId: sale.salesId,
//           customerId: sale.customerId,
//           guarantorId: sale.guarantorId,
//           productId: sale.productId,
//           displayData: [
//             sale.salesId.toString(), // Use salesId instead of index
//             new Date(sale.saleDate).toLocaleDateString(),
//             customerData.cusName,
//             customerData.nic,
//             guarantorsData.guarantorName,
//             guarantorsData.guarantorNic,
//             productData.productName,
//             sale.paymentStatus,
//             (sale.Transaction?.price || '0').toString(),
//             (sale.Transaction?.extraCharges || '0').toString(),
//             (sale.Transaction?.totalAmount || '0').toString(),
//             (sale.Transaction?.paidAmount || '0').toString(),
//             (sale.Transaction?.due || '0').toString(),
//             sale.status
//           ]
//         };
//       }));

//       setRawData(formattedData);
//       setIsLoading(false);
//     } catch (err) {
//       console.error('Fetch error:', err);
//       setError(err.message);
//       setIsLoading(false);
//     }
//   };
  
//   // const fetchSalesHistory = async () => {
//   //   try {
//   //     const response = await fetch(`${config.BASE_URL}/salesGet`);
//   //     if (!response.ok) {
//   //       throw new Error('Failed to fetch history');
//   //     }
//   //     const salesData = await response.json();

//   //     const formattedData = await Promise.all(salesData.map(async (sale) => {
//   //       // Fetch customer data
//   //       const customerResponse = await fetch(`${config.BASE_URL}/customer/${sale.customerId}`);
//   //       const customerData = await customerResponse.json();

//   //       // Fetch guarantor data
//   //       const guarantorsResponse = await fetch(`${config.BASE_URL}/guarantor/${sale.guarantorId}`);
//   //       const guarantorsData = await guarantorsResponse.json();

//   //       // Fetch product data
//   //       const productResponse = await fetch(`${config.BASE_URL}/product/${sale.productId}`);
//   //       const productData = await productResponse.json();

//   //       return {
//   //         salesId: sale.salesId,
//   //         customerId: sale.customerId,
//   //         guarantorId: sale.guarantorId,
//   //         productId: sale.productId,
//   //         displayData: [
//   //           '', // Index will be added later
//   //           new Date(sale.saleDate).toLocaleDateString(),
//   //           customerData.cusName,
//   //           customerData.nic,
//   //           guarantorsData.guarantorName,
//   //           guarantorsData.guarantorNic,
//   //           productData.productName,
//   //           sale.paymentStatus,
//   //           (sale.Transaction?.price || '0').toString(),
//   //           (sale.Transaction?.extraCharges || '0').toString(),
//   //           (sale.Transaction?.totalAmount || '0').toString(),
//   //           (sale.Transaction?.paidAmount || '0').toString(),
//   //           (sale.Transaction?.due || '0').toString(),
//   //           sale.status
//   //         ]
//   //       };
//   //     }));

//   //     // Sort by date in descending order
//   //     formattedData.sort((a, b) => {
//   //       const dateA = new Date(a.displayData[1]);
//   //       const dateB = new Date(b.displayData[1]);
//   //       return dateB - dateA;
//   //     });

//   //     // Add indices after sorting
//   //     formattedData.forEach((item, index) => {
//   //       item.displayData[0] = (index + 1).toString();
//   //     });

//   //     setRawData(formattedData);
//   //     setIsLoading(false);
//   //   } catch (err) {
//   //     console.error('Fetch error:', err);
//   //     setError(err.message);
//   //     setIsLoading(false);
//   //   }
//   // };

//   const toggleColumn = (columnIndex) => {
//     const columnKey = Object.keys(showColumns)[columnIndex];
//     setShowColumns(prevState => ({
//       ...prevState,
//       [columnKey]: !prevState[columnKey]
//     }));
//   };

//   if (isLoading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="alert alert-danger" role="alert">
//         Error: {error}
//       </div>
//     );
//   }

//   // Get visible column indices
//   const visibleColumnIndices = Object.values(showColumns)
//     .map((isVisible, index) => isVisible ? index : -1)
//     .filter(index => index !== -1);

//   // Filter columns based on visibility
//   const visibleColumns = columns.filter((_, index) => 
//     Object.values(showColumns)[index]
//   );

//   // Prepare visible data for the table
//   const visibleData = rawData.map(item => 
//     visibleColumnIndices.map(index => item.displayData[index])
//   );

//   return (
//     <div className="container-fluid py-4">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h4 className="mb-0">Rent and Hire History</h4>
//         <div className="dropdown">
//           <button
//             className="btn btn-secondary dropdown-toggle"
//             type="button"
//             id="columnToggleDropdown"
//             data-bs-toggle="dropdown"
//             aria-expanded="false"
//           >
//             Toggle Columns
//           </button>
//           <ul 
//             className="dropdown-menu dropdown-menu-end p-3" 
//             aria-labelledby="columnToggleDropdown"
//             style={{ maxHeight: '400px', overflowY: 'auto' }}
//           >
//             {columns.map((col, index) => (
//               <li key={index} className="form-check">
//                 <input
//                   type="checkbox"
//                   className="form-check-input"
//                   id={`col-${index}`}
//                   checked={Object.values(showColumns)[index]}
//                   onChange={() => toggleColumn(index)}
//                 />
//                 <label className="form-check-label ms-2" htmlFor={`col-${index}`}>
//                   {col}
//                 </label>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>

//       <div className="card">
//         <div className="card-body p-0">
//           <PaginatedTable
//             data={visibleData}
//             columns={visibleColumns}
//             showButton={false}
//             showDate={true}
//             title="Rent and Hire History"
//             invoice="rent-hire-history.pdf"
//             showEdit={false}
//             showDelete={true}
//             onDelete={handleDelete}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default History;




import React, { useEffect, useState } from 'react';
import config from '../../config';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ChevronDown, ChevronUp, Download, Search } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const [expandedTransactions, setExpandedTransactions] = useState({});
  const [salesData, setSalesData] = useState({});
  const [customersData, setCustomersData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });

  // Column visibility state
  const [showColumns, setShowColumns] = useState({
    transactionId: true,
    saleDate: true,
    customerName: true,
    subTotal: true,
    extraCharges: true,
    discount: true,
    totalAmount: true,
    paidAmount: true,
    dueAmount: true,
    note: true,
    action: true
  });

  // Define columns for transactions table
  const columns = [
    { id: 'transactionId', label: '#' },
    { id: 'saleDate', label: 'Sale Date' },
    { id: 'customerName', label: 'Customer/Shop' },
    { id: 'subTotal', label: 'Sub Total' },
    { id: 'extraCharges', label: 'Extra Charges' },
    { id: 'discount', label: 'Discount' },
    { id: 'totalAmount', label: 'Total Amount' },
    { id: 'paidAmount', label: 'Paid' },
    { id: 'dueAmount', label: 'Due' },
    { id: 'note', label: 'Note' },
    { id: 'action', label: 'Action' }
  ];

  useEffect(() => {
    fetchTransactionsHistory();
    fetchAllCustomers();
  }, []);

  const fetchAllCustomers = async () => {
    try {
      const response = await fetch(`${config.BASE_URL}/customers`);
      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }
      const customers = await response.json();
      const customersMap = {};
      customers.forEach(customer => {
        customersMap[customer.cusId] = customer.cusName;
      });
      setCustomersData(customersMap);
    } catch (err) {
      console.error('Error fetching customers:', err);
    }
  };

  const fetchTransactionsHistory = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${config.BASE_URL}/api/transactions/all`);

      if (!response.ok) {
        console.error('Response status:', response.status);
        console.error('Response text:', await response.text());
        throw new Error(`Failed to fetch transactions history: ${response.status}`);
      }

      let transactionsData = await response.json();
      console.log('Transactions loaded:', transactionsData.length);

      // Sort transactions by transactionId in descending order
      transactionsData.sort((a, b) => b.transactionId - a.transactionId);

      setTransactions(transactionsData);
      setIsLoading(false);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
      setIsLoading(false);
    }
  };

  const fetchSalesForTransaction = async (transactionId) => {
    try {
      if (salesData[transactionId]) {
        return;
      }

      const response = await fetch(`${config.BASE_URL}/salesByTransactionId/${transactionId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch sales for transaction ${transactionId}`);
      }

      const sales = await response.json();

      const salesWithProducts = await Promise.all(sales.map(async (sale) => {
        const productResponse = await fetch(`${config.BASE_URL}/product/${sale.productId}`);
        const productData = await productResponse.json();

        return {
          ...sale,
          productName: productData.productName
        };
      }));

      setSalesData(prev => ({
        ...prev,
        [transactionId]: salesWithProducts
      }));
    } catch (err) {
      console.error(`Error fetching sales for transaction ${transactionId}:`, err);
      setSalesData(prev => ({
        ...prev,
        [transactionId]: []
      }));
    }
  };

  const toggleExpand = async (transactionId) => {
    if (!expandedTransactions[transactionId]) {
      await fetchSalesForTransaction(transactionId);
    }

    setExpandedTransactions(prev => ({
      ...prev,
      [transactionId]: !prev[transactionId]
    }));
  };

  const handleDelete = async (transactionId) => {
    if (!window.confirm('Are you sure you want to delete this transaction? This will also delete all related sales records.')) {
      return;
    }

    try {
      const response = await fetch(`${config.BASE_URL}/transactionDelete/${transactionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete transaction');
      }

      setTransactions(prevTransactions =>
        prevTransactions.filter(transaction => transaction.transactionId !== transactionId)
      );

      if (expandedTransactions[transactionId]) {
        const { [transactionId]: _, ...rest } = expandedTransactions;
        setExpandedTransactions(rest);
      }

      if (salesData[transactionId]) {
        const { [transactionId]: _, ...rest } = salesData;
        setSalesData(rest);
      }

      alert('Transaction deleted successfully');
    } catch (err) {
      console.error('Error deleting transaction:', err);
      alert('Failed to delete transaction: ' + err.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    return parseFloat(amount || 0).toLocaleString();
  };

  const toggleColumn = (columnId) => {
    setShowColumns(prevState => ({
      ...prevState,
      [columnId]: !prevState[columnId]
    }));
  };

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyDateFilter = () => {
    if (!dateRange.start || !dateRange.end) return transactions;

    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    endDate.setHours(23, 59, 59, 999); // Include the entire end day

    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.createdAt);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  };

  const applySearchFilter = (data) => {
    if (!searchTerm) return data;

    const term = searchTerm.toLowerCase();
    return data.filter(transaction => {
      return (
        transaction.transactionId.toString().includes(term) ||
        (customersData[transaction.cusId] || '').toLowerCase().includes(term) ||
        transaction.note?.toLowerCase().includes(term) ||
        transaction.totalAmount.toString().includes(term)
      );
    });
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const filteredData = applySearchFilter(applyDateFilter());
    
    // Prepare data for PDF
    const pdfData = filteredData.map(transaction => {
      const row = [];
      columns.forEach(col => {
        if (showColumns[col.id]) {
          switch(col.id) {
            case 'transactionId':
              row.push(transaction.transactionId);
              break;
            case 'saleDate':
              row.push(formatDate(transaction.createdAt));
              break;
            case 'customerName':
              row.push(customersData[transaction.cusId] || '-');
              break;
            case 'subTotal':
              row.push(formatCurrency(transaction.price));
              break;
            case 'extraCharges':
              row.push(formatCurrency(transaction.extraCharges));
              break;
            case 'discount':
              row.push(formatCurrency(transaction.discount));
              break;
            case 'totalAmount':
              row.push(formatCurrency(transaction.totalAmount));
              break;
            case 'paidAmount':
              row.push(formatCurrency(transaction.paidAmount));
              break;
            case 'dueAmount':
              row.push(formatCurrency(transaction.due));
              break;
            case 'note':
              row.push(transaction.note || '-');
              break;
          }
        }
      });
      return row;
    });

    // Prepare headers
    const headers = columns
      .filter(col => showColumns[col.id] && col.id !== 'action')
      .map(col => col.label);

    // Add title and date
    doc.text('Transaction History Report', 14, 15);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 22);
    
    if (dateRange.start && dateRange.end) {
      doc.text(`Period: ${dateRange.start} to ${dateRange.end}`, 14, 29);
    }

    // Add table
    doc.autoTable({
      head: [headers],
      body: pdfData,
      startY: 35,
      styles: {
        fontSize: 8,
        cellPadding: 2
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255
      }
    });

    doc.save('transaction-history.pdf');
  };

  const filteredTransactions = applySearchFilter(applyDateFilter());

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0"> ගණුදෙනු ඉතිහාසය </h4>
        <div className="d-flex gap-2">
          <button className="btn btn-primary btn-sm d-flex align-items-center gap-1" onClick={generatePDF}>
            <Download size={16} /> PDF
          </button>
          <div className="dropdown">
            <button
              className="btn btn-secondary btn-sm dropdown-toggle d-flex align-items-center gap-1"
              type="button"
              id="columnToggleDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Columns
            </button>
            <ul 
              className="dropdown-menu dropdown-menu-end p-2" 
              aria-labelledby="columnToggleDropdown"
              style={{ maxHeight: '400px', overflowY: 'auto' }}
            >
              {columns.map((col) => (
                <li key={col.id} className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`col-${col.id}`}
                    checked={showColumns[col.id]}
                    onChange={() => toggleColumn(col.id)}
                  />
                  <label className="form-check-label ms-2" htmlFor={`col-${col.id}`}>
                    {col.label}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="card mb-3">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by ID, customer, note or amount..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="row g-2">
                <div className="col">
                  <input
                    type="date"
                    className="form-control"
                    name="start"
                    value={dateRange.start}
                    onChange={handleDateRangeChange}
                    placeholder="Start date"
                  />
                </div>
                <div className="col">
                  <input
                    type="date"
                    className="form-control"
                    name="end"
                    value={dateRange.end}
                    onChange={handleDateRangeChange}
                    placeholder="End date"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className='table-dark'>
                <tr>
                  {columns.map((col) => (
                    showColumns[col.id] && <th key={col.id}>{col.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <React.Fragment key={transaction.transactionId}>
                    <tr>
                      {showColumns.transactionId && <td>{transaction.transactionId}</td>}
                      {showColumns.saleDate && <td>{formatDate(transaction.createdAt)}</td>}
                      {showColumns.customerName && <td>{customersData[transaction.cusId] || '-'}</td>}
                      {showColumns.subTotal && <td>{formatCurrency(transaction.price)}</td>}
                      {showColumns.extraCharges && <td>{formatCurrency(transaction.extraCharges)}</td>}
                      {showColumns.discount && <td>{formatCurrency(transaction.discount)}</td>}
                      {showColumns.totalAmount && <td>{formatCurrency(transaction.totalAmount)}</td>}
                      {showColumns.paidAmount && <td>{formatCurrency(transaction.paidAmount)}</td>}
                      {showColumns.dueAmount && <td>{formatCurrency(transaction.due)}</td>}
                      {showColumns.note && <td>{transaction.note || '-'}</td>}
                      {showColumns.action && (
                        <td>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-success btn-sm d-flex align-items-center gap-1"
                              onClick={() => toggleExpand(transaction.transactionId)}
                            >
                              {expandedTransactions[transaction.transactionId] ? (
                                <ChevronUp size={20} />
                              ) : (
                                <ChevronDown size={20} />
                              )}
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDelete(transaction.transactionId)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                    {expandedTransactions[transaction.transactionId] && (
                      <tr>
                        <td colSpan={Object.values(showColumns).filter(Boolean).length} className="bg-light p-0">
                          <div className="p-3">
                            <h6 className="mb-3">Sold Items</h6>
                            {salesData[transaction.transactionId]?.length > 0 ? (
                              <table className="table table-sm mb-0 table-striped">
                                <thead className='table-primary'>
                                  <tr>
                                    {/* <th>Sale ID</th> */}
                                    <th>Product Name</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {salesData[transaction.transactionId].map((sale) => (
                                    <tr key={sale.salesId}>
                                      {/* <td>{sale.salesId}</td> */}
                                      <td>{sale.productName}</td>
                                      <td>{sale.quantity || 1}</td>
                                      <td>{formatCurrency(sale.price)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            ) : (
                              <p className="text-muted mb-0">No sales data available for this transaction.</p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center p-4">
              <p className="text-muted">No transactions found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;