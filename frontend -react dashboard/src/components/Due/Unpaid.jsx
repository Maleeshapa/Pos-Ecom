// import React, { useEffect, useState } from 'react';
// import './DueInvoice.css';
// import { jsPDF } from "jspdf";
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import config from '../../config';
// import one from '../../assets/1.jpg'; // Colkan header image
// import two from '../../assets/2.jpg'; // Haman header image
// import three from '../../assets/3.jpg'; // Terra header image

// const UnpaidInvoice = () => {
//     const { cusId } = useParams(); // Get cusId from URL
//     const [customer, setCustomer] = useState(null);
//     const [transactionData, setTransactionData] = useState([]);
//     const [invoiceNumbers, setInvoiceNumbers] = useState({}); // Store invoice numbers
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);

//     // Store states
//     const [colkan, setColkan] = useState(false);
//     const [haman, setHaman] = useState(false);
//     const [terra, setTerra] = useState(false);

//     // Fetch customer details and transaction data
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 // Fetch customer details
//                 const customerResponse = await axios.get(`${config.BASE_URL}/customer/${cusId}`);
//                 setCustomer(customerResponse.data);

//                 // Set company header based on customer's store type
//                 switch (customerResponse.data.cusStore) {
//                     case 'colkan':
//                         setColkan(true);
//                         setHaman(false);
//                         setTerra(false);
//                         break;
//                     case 'haman':
//                         setColkan(false);
//                         setHaman(true);
//                         setTerra(false);
//                         break;
//                     case 'terra':
//                         setColkan(false);
//                         setHaman(false);
//                         setTerra(true);
//                         break;
//                     default:
//                         setColkan(false);
//                         setHaman(false);
//                         setTerra(false);
//                 }

//                 // Fetch transaction data for the customer
//                 const transactionResponse = await axios.get(`${config.BASE_URL}/transactions/customer/${cusId}`);
//                 setTransactionData(transactionResponse.data);

//                 // Fetch invoice numbers for each transaction
//                 const fetchInvoiceNumbers = async () => {
//                     const invoiceNumbersMap = {};
//                     for (const transaction of transactionResponse.data) {
//                         try {
//                             const invoiceResponse = await axios.get(`${config.BASE_URL}/invoice/${transaction.invoice_invoiceId}`);
//                             invoiceNumbersMap[transaction.invoice_invoiceId] = invoiceResponse.data.invoiceNo;
//                         } catch (error) {
//                             console.error('Error fetching invoice details:', error);
//                             invoiceNumbersMap[transaction.invoice_invoiceId] = 'N/A'; // Fallback if invoice fetch fails
//                         }
//                     }
//                     setInvoiceNumbers(invoiceNumbersMap);
//                 };

//                 fetchInvoiceNumbers();
//             } catch (error) {
//                 console.error('Error fetching data:', error);
//                 setError('Failed to fetch data');
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchData();
//     }, [cusId]);

//     // Filter transactions with "due" > 0 (unpaid invoices)
//     const unpaidTransactions = transactionData.filter(transaction => transaction.due > 0);

//     // Handle printing
//     const handlePrint = () => {
//         const printContent = document.getElementById('invoice-card');
//         if (printContent) {
//             const doc = new jsPDF();
//             doc.html(printContent, {
//                 callback: function (doc) {
//                     doc.autoPrint();
//                     window.open(doc.output('bloburl'), '_blank');
//                     doc.save('Unpaid_Invoice.pdf');
//                 },
//                 x: 10,
//                 y: 10,
//                 width: 190,
//                 windowWidth: 800,
//             });
//         } else {
//             console.error('Invoice card not found!');
//         }
//     };

//     if (isLoading) {
//         return <div>Loading...</div>;
//     }

//     if (error) {
//         return <div>Error: {error}</div>;
//     }

//     return (
//         <div>
//             <div className="scrolling-container">
//                 <h4>UNPAID INVOICE</h4>
//                 <div className="invoice-page">
//                     <div className="invoice">
//                         <div id="invoice-card">
//                             {/* Company Header */}
//                             {colkan && (
//                                 <section className="invoice-header">
//                                     <img src={one} alt="Colkan Holdings" className="header-img" />
//                                 </section>
//                             )}
//                             {haman && (
//                                 <section className="invoice-header">
//                                     <img src={two} alt="Haman" className="header-img" />
//                                 </section>
//                             )}
//                             {terra && (
//                                 <section className="invoice-header">
//                                     <img src={three} alt="Terra Walkers" className="header-img" />
//                                 </section>
//                             )}

//                             {/* Customer Details */}
//                             <section className="billing-details">
//                                 <div className="invoice-info">
//                                     <label className='mb-3'><b>Customer Details</b></label>
//                                     <p className="details-paragraph">
//                                         {customer?.cusName && `Name: ${customer.cusName}. `} <br />
//                                         {customer?.cusJob && `Job Title: ${customer.cusJob}. `} <br />
//                                         {customer?.cusAddress && `Address: ${customer.cusAddress}.`} <br />
//                                     </p>
//                                 </div>

//                                 <div className="invoice-info">
//                                     <div className="details mb-2">
//                                         <label>Date</label>
//                                         <input
//                                             type="text"
//                                             className="date"
//                                             value={new Date().toLocaleDateString()} // Today's date
//                                             readOnly
//                                         />
//                                     </div>
//                                 </div>
//                             </section>

//                             {/* Payment Mode and Bank Details */}
//                             <section>
//                                 <p>
//                                     <b>Payment Mode:</b> Cash or cheque. All cheques are to be drawn in favour of {colkan ? "Colkan Holdings (Pvt) Ltd" : haman ? "Haman" : terra ? "Terra Walkers" : "[Insert Company Name]"} and crossed account payee only payee only.
//                                 </p>
//                                 <p>
//                                     <b>Bank:</b> {colkan ? (
//                                         <>HNB | Account Number: 250010032342 | Account Name: Colkan Holdings (Pvt) LTD | Branch Name: Colkan</>
//                                     ) : haman ? (
//                                         <>BOC | Account Number: 93829087 | Account Name: Haman | Branch Name: Wellewathe</>
//                                     ) : terra ? (
//                                         <>Sampath Bank | Account Number: 0117 1000 1407 | Account Name: Terra Walkers | Branch Name: Kirulapona</>
//                                     ) : (
//                                         "[Insert Bank Details]"
//                                     )}
//                                 </p>
//                             </section>

//                             {/* Invoice Table */}
//                             <table className="invoice-table mb-2">
//                                 <thead>
//                                     <tr>
//                                         <th>Invoice No</th>
//                                         <th>Sold Date</th>
//                                         {/* <th>Cheque Given Date</th>
//                                         <th>Dated Cheque</th> */}
//                                         <th>Total Due</th>
//                                         {/* <th>Paid</th> */}
//                                         <th>Paid Yes Or No</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {unpaidTransactions.length === 0 ? (
//                                         <tr>
//                                             <td colSpan={4}>No unpaid invoices found for this customer.</td>
//                                         </tr>
//                                     ) : (
//                                         unpaidTransactions.map((transaction, index) => (
//                                             <tr key={index}>
//                                                 <td>{invoiceNumbers[transaction.invoice_invoiceId] || 'N/A'}</td>
//                                                 <td>{new Date(transaction.dateTime).toLocaleDateString()}</td>
//                                                 {/* <td>{transaction.dueDate ? new Date(transaction.dueDate).toLocaleDateString() : 'N/A'}</td>
//                                                 <td>{transaction.datedCheque ? new Date(transaction.datedCheque).toLocaleDateString() : 'N/A'}</td> */}
//                                                 <td>{transaction.due}</td>
//                                                 {/* <td>{transaction.paid}</td> */}
//                                                 <td>
//                                                     <span
//                                                         style={{
//                                                             color: transaction.due > 0 ? 'red' : 'green',
//                                                             fontWeight: transaction.due === 0 ? 'bold' : 'normal',
//                                                         }}
//                                                     >
//                                                         {transaction.due > 0 ? 'No' : 'Yes'}
//                                                     </span>
//                                                 </td>
//                                             </tr>
//                                         ))
//                                     )}
//                                 </tbody>
//                             </table>

                          
//                         </div>
//                     </div>

//                     {/* Print Button */}
//                     <div className="options">
//                         <button onClick={handlePrint} className="btn btn-success">
//                             Print
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default UnpaidInvoice;

import React, { useEffect, useState } from 'react';
import './DueInvoice.css';
import { jsPDF } from "jspdf";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import config from '../../config';
import one from '../../assets/1.jpg'; // Colkan header image
import two from '../../assets/2.jpg'; // Haman header image
import three from '../../assets/3.jpg'; // Terra header image

const UnpaidInvoice = () => {
    const { cusId } = useParams(); // Get cusId from URL
    const [customer, setCustomer] = useState(null);
    const [transactionData, setTransactionData] = useState([]);
    const [invoiceNumbers, setInvoiceNumbers] = useState({}); // Store invoice numbers
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);


    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(10);


    // Store states
    const [colkan, setColkan] = useState(false);
    const [haman, setHaman] = useState(false);
    const [terra, setTerra] = useState(false);

    // Fetch customer details and transaction data
 useEffect(() => {
        const fetchData = async () => {
            try {
                const customerResponse = await axios.get(`${config.BASE_URL}/customer/${cusId}`);
                setCustomer(customerResponse.data);

                switch (customerResponse.data.cusStore) {
                    case 'colkan':
                        setColkan(true);
                        setHaman(false);
                        setTerra(false);
                        break;
                    case 'haman':
                        setColkan(false);
                        setHaman(true);
                        setTerra(false);
                        break;
                    case 'terra':
                        setColkan(false);
                        setHaman(false);
                        setTerra(true);
                        break;
                    default:
                        setColkan(false);
                        setHaman(false);
                        setTerra(false);
                }

                const transactionResponse = await axios.get(`${config.BASE_URL}/transactions/customer/${cusId}`);
                setTransactionData(transactionResponse.data);

                const fetchInvoiceNumbers = async () => {
                    const invoiceNumbersMap = {};
                    for (const transaction of transactionResponse.data) {
                        try {
                            const invoiceResponse = await axios.get(`${config.BASE_URL}/invoice/${transaction.invoice_invoiceId}`);
                            invoiceNumbersMap[transaction.invoice_invoiceId] = invoiceResponse.data.invoiceNo;
                        } catch (error) {
                            console.error('Error fetching invoice details:', error);
                            invoiceNumbersMap[transaction.invoice_invoiceId] = 'N/A';
                        }
                    }
                    setInvoiceNumbers(invoiceNumbersMap);
                };

                fetchInvoiceNumbers();
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to fetch data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [cusId]);

    const unpaidTransactions = transactionData.filter(transaction => transaction.due > 0);

    // Pagination logic
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = unpaidTransactions.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(unpaidTransactions.length / rowsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Generate page numbers
    const getPageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }
        return pageNumbers.reverse(); // Reverse to show newest pages first
    };

    // Handle printing
    const handlePrint = () => {
        const printContent = document.getElementById('invoice-card');
        if (printContent) {
            const doc = new jsPDF();
            doc.html(printContent, {
                callback: function (doc) {
                    doc.autoPrint();
                    window.open(doc.output('bloburl'), '_blank');
                    doc.save('Unpaid_Invoice.pdf');
                },
                x: 10,
                y: 10,
                width: 190,
                windowWidth: 800,
            });
        } else {
            console.error('Invoice card not found!');
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <div className="scrolling-container">
                <h4>UNPAID INVOICE</h4>
                <div className="invoice-page">
                    <div className="invoice">
                        <div id="invoice-card">
                            {/* Company Header */}
                            {colkan && (
                                <section className="invoice-header">
                                    <img src={one} alt="Colkan Holdings" className="header-img" />
                                </section>
                            )}
                            {haman && (
                                <section className="invoice-header">
                                    <img src={two} alt="Haman" className="header-img" />
                                </section>
                            )}
                            {terra && (
                                <section className="invoice-header">
                                    <img src={three} alt="Terra Walkers" className="header-img" />
                                </section>
                            )}

                            {/* Customer Details */}
                            <section className="billing-details">
                                <div className="invoice-info">
                                    <label className='mb-3'><b>Customer Details</b></label>
                                    <p className="details-paragraph">
                                        {customer?.cusName && `Name: ${customer.cusName}. `} <br />
                                        {customer?.cusJob && `Job Title: ${customer.cusJob}. `} <br />
                                        {customer?.cusAddress && `Address: ${customer.cusAddress}.`} <br />
                                    </p>
                                </div>

                                <div className="invoice-info">
                                    <div className="details mb-2">
                                        <label>Date</label>
                                        <input
                                            type="text"
                                            className="date"
                                            value={new Date().toLocaleDateString()} // Today's date
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Payment Mode and Bank Details */}
                            <section>
                                <p>
                                    <b>Payment Mode:</b> Cash or cheque. All cheques are to be drawn in favour of {colkan ? "Colkan Holdings (Pvt) Ltd" : haman ? "Haman" : terra ? "Terra Walkers" : "[Insert Company Name]"} and crossed account payee only payee only.
                                </p>
                                <p>
                                    <b>Bank:</b> {colkan ? (
                                        <>HNB | Account Number: 250010032342 | Account Name: Colkan Holdings (Pvt) LTD | Branch Name: Colkan</>
                                    ) : haman ? (
                                        <>BOC | Account Number: 93829087 | Account Name: Haman | Branch Name: Wellewathe</>
                                    ) : terra ? (
                                        <>Sampath Bank | Account Number: 0117 1000 1407 | Account Name: Terra Walkers | Branch Name: Kirulapona</>
                                    ) : (
                                        "[Insert Bank Details]"
                                    )}
                                </p>
                            </section>

                            {/* Invoice Table */}
                            <table className="invoice-table mb-2">
                                <thead>
                                    <tr>
                                        <th>Invoice No</th>
                                        <th>Sold Date</th>
                                        <th>Total Due</th>
                                        <th>Paid Yes Or No</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentRows.length === 0 ? (
                                        <tr>
                                            <td colSpan={4}>No unpaid invoices found for this customer.</td>
                                        </tr>
                                    ) : (
                                        currentRows.map((transaction, index) => (
                                            <tr key={index}>
                                                <td>{invoiceNumbers[transaction.invoice_invoiceId] || 'N/A'}</td>
                                                <td>{new Date(transaction.dateTime).toLocaleDateString()}</td>
                                                <td>{transaction.due}</td>
                                                <td>
                                                    <span
                                                        style={{
                                                            color: transaction.due > 0 ? 'red' : 'green',
                                                            fontWeight: transaction.due === 0 ? 'bold' : 'normal',
                                                        }}
                                                    >
                                                        {transaction.due > 0 ? 'No' : 'Yes'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>

                            {/* Pagination Controls */}
                            {unpaidTransactions.length > rowsPerPage && (
                                <div className="flex items-center justify-center gap-2 mt-4">
                                    <button
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 border rounded hover:bg-gray-100"
                                    >
                                        &lt;
                                    </button>
                                    
                                    {getPageNumbers().map(number => (
                                        <button
                                            key={number}
                                            onClick={() => paginate(number)}
                                            className={`px-3 py-1 border rounded ${
                                                currentPage === number
                                                    ? 'bg-blue-500 text-white'
                                                    : 'hover:bg-gray-100'
                                            }`}
                                        >
                                            {number}
                                        </button>
                                    ))}
                                    
                                    <button
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 border rounded hover:bg-gray-100"
                                    >
                                        &gt;
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="options">
                        <button onClick={handlePrint} className="btn btn-success">
                            Print
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UnpaidInvoice;