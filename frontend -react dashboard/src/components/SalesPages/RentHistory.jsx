// import React, { useEffect, useState } from 'react';
// import Table from '../Table/Table';
// import config from '../../config';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const RentHistory = () => {
//   const [data, setData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const rowsPerPage = 25;

//   const columns = [
//     '#',
//     'Sale Date',
//     'Customer',
//     'Product',
//     'Guarantor Name',
//     'Total Amount',
//     'Paid Amount',
//     'Due Amount',
//     'Status'
//   ];

//   useEffect(() => {
//     fetchSalesHistory();
//   }, []);

//   const fetchSalesHistory = async () => {
//     try {
//       const response = await fetch(`${config.BASE_URL}/salesRentGet`);
//       if (!response.ok) {
//         throw new Error('No Rent History to Show');
//       }
//       const salesData = await response.json();

//       // Fetch customer and product details for each sale
//       const formattedData = await Promise.all(salesData.map(async (sale, index) => {
//         // Fetch customer name
//         const customerResponse = await fetch(`${config.BASE_URL}/customer/${sale.customerId}`);
//         const customerData = await customerResponse.json();
//         const customerName = customerData.cusName;

//         // Fetch product name
//         const productResponse = await fetch(`${config.BASE_URL}/product/${sale.productId}`);
//         const productData = await productResponse.json();
//         const productName = productData.productName;

//         const guarantorResponse = await fetch(`${config.BASE_URL}/guarantor/${sale.guarantorId}`);
//         const guarantorData = await guarantorResponse.json();
//         const guarantorName = guarantorData.guarantorName;


//         return [
//           index + 1,
//           new Date(sale.saleDate).toLocaleDateString(),
//           customerName, // Use customer name instead of ID

//           productName,  // Use product name instead of ID
//           // sale.paymentStatus,
//           guarantorName,
//           sale.Transaction?.totalAmount || 0,
//           sale.Transaction?.paidAmount || 0,
//           sale.Transaction?.due || 0,
//           sale.status
//         ];
//       }));

//       // Sort by sale date descending
//       formattedData.sort((a, b) => new Date(b[1]) - new Date(a[1]));

//       setData(formattedData);
//       setIsLoading(false);
//     } catch (err) {
//       setError(err.message);
//       setIsLoading(false);
//     }
//   };

//   const totalPages = Math.ceil(data.length / rowsPerPage);

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   const getPaginatedData = () => {
//     const startIndex = (currentPage - 1) * rowsPerPage;
//     const endIndex = startIndex + rowsPerPage;
//     return data.slice(startIndex, endIndex);
//   };

//   const title = 'Hire History';
//   const invoice = 'hire_history.pdf';

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   return (
//     <div className="scrolling-container">
//       <h4>Rent History</h4>
//       <Table
//         data={getPaginatedData()}
//         columns={columns}
//         showButton={false}
//         showDate={true}
//         title={title}
//         invoice={invoice}
//         showDelete={true}
//         onDelete={handleDelete}
//       />
//       <nav>
//         <ul className="pagination justify-content-center">
//           <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
//             <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>&lt;</button>
//           </li>
//           {[...Array(totalPages)].map((_, index) => (
//             <li
//               key={index}
//               className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
//             >
//               <button className="page-link" onClick={() => handlePageChange(index + 1)}>
//                 {index + 1}
//               </button>
//             </li>
//           ))}
//           <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
//             <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>&gt;</button>
//           </li>
//         </ul>
//       </nav>
//     </div>
//   );
// };

// export default RentHistory;

// import React, { useEffect, useState } from 'react';
// import Table from '../Table/Table';
// import config from '../../config';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { faTrash } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import UpdateModal from '../../Models/RentHireUpdate/UpdateModal';
// import { faPen } from '@fortawesome/free-solid-svg-icons';

// const RentHistory = () => {
//   const [data, setData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const rowsPerPage = 25;

//   const [selectedSale, setSelectedSale] = useState(null);
// const [showEditModal, setShowEditModal] = useState(false);

//   const columns = [
//     '#',
//     'Sale Date',
//     'Customer',
//     'Product',
//     'Guarantor Name',
//     'Total Amount',
//     'Paid Amount',
//     'Due Amount',
//     'Status',
//     'Actions',

//   ];

//   useEffect(() => {
//     fetchSalesHistory();
//   }, []);

//   const fetchSalesHistory = async () => {
//     try {
//       const response = await fetch(`${config.BASE_URL}/salesRentGet`);
//       if (!response.ok) {
//         throw new Error('No Rent History to Show');
//       }
//       const salesData = await response.json();

//       // Fetch details for each sale
//       const formattedData = await Promise.all(salesData.map(async (sale, index) => {
//         const customerResponse = await fetch(`${config.BASE_URL}/customer/${sale.customerId}`);
//         const customerData = await customerResponse.json();
//         const customerName = customerData.cusName;

//         const productResponse = await fetch(`${config.BASE_URL}/product/${sale.productId}`);
//         const productData = await productResponse.json();
//         const productName = productData.productName;

//         const guarantorResponse = await fetch(`${config.BASE_URL}/guarantor/${sale.guarantorId}`);
//         const guarantorData = await guarantorResponse.json();
//         const guarantorName = guarantorData.guarantorName;

//         return {
//           id: sale.salesId,
//           rowData: [
//             index + 1,
//             new Date(sale.saleDate).toLocaleDateString(),
//             customerName,
//             productName,
//             guarantorName,
//             sale.Transaction?.totalAmount || 0,
//             sale.Transaction?.paidAmount || 0,
//             sale.Transaction?.due || 0,
//             sale.status,
//             <div className="btn-group" role="group">
//               <button 
//                 className="btn btn-warning btn-sm"
//                 onClick={() => handleEdit(sale)}
//               >
//                 <FontAwesomeIcon icon={faPen} />
//               </button>
//               <button 
//                 className="btn btn-danger btn-sm"
//                 onClick={() => handleDelete(sale.salesId)}
//               >
//                 <FontAwesomeIcon icon={faTrash} />
//               </button>
//             </div>
//           ]
//         };
//       }));

//       formattedData.sort((a, b) => new Date(b.rowData[1]) - new Date(a.rowData[1]));

//       setData(formattedData);
//       setIsLoading(false);
//     } catch (err) {
//       setError(err.message);
//       setIsLoading(false);
//     }
//   };

//   const handleDelete = async (salesId) => {
//     if (!window.confirm("Are you sure you want to delete this sale?")) return;

//     try {
//       const response = await fetch(`${config.BASE_URL}/salesDelete/${salesId}`, {
//         method: 'DELETE'
//       });

//       if (!response.ok) {
//         throw new Error('Failed to delete sale');
//       }

//       // Update state instantly by removing the deleted sale
//       setData(prevData => prevData.filter(sale => sale.id !== salesId));
//     } catch (err) {
//       alert(`Error: ${err.message}`);
//     }
//   };

//   const totalPages = Math.ceil(data.length / rowsPerPage);

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   const getPaginatedData = () => {
//     const startIndex = (currentPage - 1) * rowsPerPage;
//     const endIndex = startIndex + rowsPerPage;
//     return data.slice(startIndex, endIndex).map(sale => sale.rowData);
//   };

//   const title = 'Hire History';
//   const invoice = 'hire_history.pdf';

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   const handleSaleUpdated = (updatedSale) => {
//     setData(prevData => 
//       prevData.map(item => {
//         if (item.id === updatedSale.sale.salesId) {
//           const newRowData = [...item.rowData];
//           newRowData[1] = new Date(updatedSale.sale.saleDate).toLocaleDateString();
//           newRowData[5] = updatedSale.transaction.totalAmount;
//           newRowData[6] = updatedSale.transaction.paidAmount;
//           newRowData[7] = updatedSale.transaction.due;
//           return { ...item, rowData: newRowData };
//         }
//         return item;
//       })
//     );
//   };

//   const handleEdit = (sale) => {
//     setSelectedSale(sale);
//     setShowEditModal(true);
//   };



//   return (
//     <div className="scrolling-container">
//       <h4>Rent History</h4>
//       <Table
//         data={getPaginatedData()}
//         columns={columns}
//         showButton={false}
//         showDate={true}
//         title={title}
//         invoice={invoice}
//         showActions={false}
//       />
//       <UpdateModal
//       sale={selectedSale}
//       show={showEditModal}
//       onClose={() => {
//         setShowEditModal(false);
//         setSelectedSale(null);
//       }}
//       onSaleUpdated={handleSaleUpdated}
//     />
//       <nav>
//         <ul className="pagination justify-content-center">
//           <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
//             <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>&lt;</button>
//           </li>
//           {[...Array(totalPages)].map((_, index) => (
//             <li
//               key={index}
//               className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
//             >
//               <button className="page-link" onClick={() => handlePageChange(index + 1)}>
//                 {index + 1}
//               </button>
//             </li>
//           ))}
//           <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
//             <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>&gt;</button>
//           </li>
//         </ul>
//       </nav>
//     </div>
//   );
// };

// export default RentHistory;



//version--------------------------------------------------------------------------------------------

// import React, { useEffect, useState } from 'react';
// import Table from '../Table/Table';
// import config from '../../config';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { faTrash } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import UpdateModal from '../../Models/RentHireUpdate/UpdateModal';
// import { faPen } from '@fortawesome/free-solid-svg-icons';

// const RentHistory = () => {
//   const [data, setData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedSale, setSelectedSale] = useState(null);
//   const [showEditModal, setShowEditModal] = useState(false);

//   const rowsPerPage = 25;

//   const columns = [
//     '#',
//     'Sale Date',
//     'Customer',
//     'Vechicle',
//     'Guarantor Name',
//     'Total Amount',
//     'Paid Amount',
//     'Due Amount',
//     'Status',
//     'Actions',
//   ];

//   // Define handlers first
//   const handleEdit = (sale) => {
//     setSelectedSale(sale);
//     setShowEditModal(true);
//   };

//   const handleDelete = async (salesId) => {
//     if (!window.confirm("Are you sure you want to delete this sale?")) return;

//     try {
//       const response = await fetch(`${config.BASE_URL}/salesDelete/${salesId}`, {
//         method: 'DELETE'
//       });

//       if (!response.ok) {
//         throw new Error('Failed to delete sale');
//       }

//       setData(prevData => prevData.filter(sale => sale.id !== salesId));
//     } catch (err) {
//       alert(`Error: ${err.message}`);
//     }
//   };

//   const handleSaleUpdated = (updatedSale) => {
//     setData(prevData => 
//       prevData.map(item => {
//         if (item.id === updatedSale.sale.salesId) {
//           const newRowData = [...item.rowData];
//           newRowData[1] = new Date(updatedSale.sale.saleDate).toLocaleDateString();
//           newRowData[5] = updatedSale.transaction.totalAmount;
//           newRowData[6] = updatedSale.transaction.paidAmount;
//           newRowData[7] = updatedSale.transaction.due;
//           return { ...item, rowData: newRowData };
//         }
//         return item;
//       })
//     );
//   };

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   const fetchSalesHistory = async () => {
//     try {
//       const response = await fetch(`${config.BASE_URL}/salesRentGet`);
//       if (!response.ok) {
//         throw new Error('No Rent History to Show');
//       }
//       const salesData = await response.json();

//       const formattedData = await Promise.all(salesData.map(async (sale, index) => {
//         const customerResponse = await fetch(`${config.BASE_URL}/customer/${sale.customerId}`);
//         const customerData = await customerResponse.json();
//         const customerName = customerData.cusName;

//         const productResponse = await fetch(`${config.BASE_URL}/product/${sale.productId}`);
//         const productData = await productResponse.json();
//         const productName = productData.productName;

//         const guarantorResponse = await fetch(`${config.BASE_URL}/guarantor/${sale.guarantorId}`);
//         const guarantorData = await guarantorResponse.json();
//         const guarantorName = guarantorData.guarantorName;

//         return {
//           id: sale.salesId,
//           rowData: [
//             index + 1,
//             new Date(sale.saleDate).toLocaleDateString(),
//             customerName,
//             productName,
//             guarantorName,
//             sale.Transaction?.totalAmount || 0,
//             sale.Transaction?.paidAmount || 0,
//             sale.Transaction?.due || 0,
//             sale.status,
//             <div className="btn-group" role="group">
//               <button 
//                 className="btn btn-warning btn-sm"
//                 onClick={() => handleEdit(sale)}
//               >
//                 <FontAwesomeIcon icon={faPen} />
//               </button>
//               <button 
//                 className="btn btn-danger btn-sm"
//                 onClick={() => handleDelete(sale.salesId)}
//               >
//                 <FontAwesomeIcon icon={faTrash} />
//               </button>
//             </div>
//           ]
//         };
//       }));

//       formattedData.sort((a, b) => new Date(b.rowData[1]) - new Date(a.rowData[1]));
//       setData(formattedData);
//       setIsLoading(false);
//     } catch (err) {
//       setError(err.message);
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSalesHistory();
//   }, []);

//   const getPaginatedData = () => {
//     const startIndex = (currentPage - 1) * rowsPerPage;
//     const endIndex = startIndex + rowsPerPage;
//     return data.slice(startIndex, endIndex).map(sale => sale.rowData);
//   };

//   const totalPages = Math.ceil(data.length / rowsPerPage);
//   const title = 'Hire History';
//   const invoice = 'hire_history.pdf';

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   return (
//     <div className="scrolling-container">
//       <h4>Rent History</h4>
//       <Table
//         data={getPaginatedData()}
//         columns={columns}
//         showButton={false}
//         showDate={true}
//         title={title}
//         invoice={invoice}
//         showActions={false}
//       />
//       <UpdateModal
//         sale={selectedSale}
//         show={showEditModal}
//         onClose={() => {
//           setShowEditModal(false);
//           setSelectedSale(null);
//         }}
//         onSaleUpdated={handleSaleUpdated}
//       />
//       <nav>
//         <ul className="pagination justify-content-center">
//           <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
//             <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>&lt;</button>
//           </li>
//           {[...Array(totalPages)].map((_, index) => (
//             <li
//               key={index}
//               className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
//             >
//               <button className="page-link" onClick={() => handlePageChange(index + 1)}>
//                 {index + 1}
//               </button>
//             </li>
//           ))}
//           <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
//             <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>&gt;</button>
//           </li>
//         </ul>
//       </nav>
//     </div>
//   );
// };

// export default RentHistory;


import React, { useEffect, useState } from 'react';
// import Table from '../Table/Table';
import config from '../../config';
import 'bootstrap/dist/css/bootstrap.min.css';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UpdateModal from '../../Models/RentHireUpdate/UpdateModal';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';
import PaginatedTable from '../Table/PaginatedTable';
import PaginatedNavigation from '../Table/PaginatedNavigation';

const RentHistory = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSale, setSelectedSale] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [rentImages, setRentImages] = useState([]);

  const rowsPerPage = 10;

  const columns = [
    '#',
    'Sale Date',
    'Return Date',
    'Customer',
    'Customer Nic',
    'Vehicle',
    'Guarantor Name',
    'Total Amount',
    'Paid Amount',
    'Due Amount',
    'Images', // New column for images
    'Refundable Deposit', // New column for images
    'Actions',
  ];

  const handleEdit = (sale) => {
    setSelectedSale(sale);
    setShowEditModal(true);
  };

  const handleDelete = async (salesId) => {
    if (!window.confirm("Are you sure you want to delete this sale?")) return;

    try {
      const response = await fetch(`${config.BASE_URL}/salesDelete/${salesId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete sale');
      }

      setData(prevData => prevData.filter(sale => sale.id !== salesId));
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  // const handleSaleUpdated = (updatedSale) => {
  //   setData(prevData =>
  //     prevData.map(item => {
  //       if (item.id === updatedSale.sale.salesId) {
  //         const newRowData = [...item.rowData];
  //         newRowData[2] = new Date(updatedSale.transaction.returnDate).toLocaleDateString();
  //         newRowData[6] = updatedSale.transaction.totalAmount;
  //         newRowData[7] = updatedSale.transaction.paidAmount;
  //         newRowData[8] = updatedSale.transaction.due;
  //         return { ...item, rowData: newRowData };
  //       }
  //       return item;
  //     })
  //   );
  // };

  const handleSaleUpdated = (updatedSale) => {
    setData(prevData =>
      prevData.map(item => {
        // Check if this is the sale we're updating
        if (item.id === updatedSale.salesId) {
          // Safely access the transaction data
          const transaction = updatedSale.Transaction || {};
          const returnDate = transaction.returnDate 
            ? new Date(transaction.returnDate).toLocaleDateString() 
            : '';
  
          // Create new row data with updated values
          return {
            id: updatedSale.salesId,
            rowData: [
              item.rowData[0], // Keep the original index/salesId
              item.rowData[1], // Keep the original sale date
              returnDate,
              item.rowData[3], // Keep customer name
              item.rowData[4], // Keep customer name
              item.rowData[5], // Keep product name
              item.rowData[6], // Keep guarantor name
              transaction.totalAmount || 0,
              transaction.paidAmount || 0,
              transaction.due || 0,
              item.rowData[10], // Keep images
              item.rowData[12] // Keep actions
            ]
          };
        }
        return item;
      })
    );
  
    // Fetch updated data to ensure consistency
    fetchSalesHistory();
  };

  

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  // Fetch rent images by salesId
  const fetchRentImages = async (salesId) => {
    try {
      const response = await fetch(`${config.BASE_URL}/rentImages/${salesId}`);
      if (!response.ok) {
        throw new Error(' No images');
      }
      const images = await response.json();
      setRentImages(images);
      setShowImageModal(true);
    } catch (err) {
      setError(err.message);
    }
  };

  // Open image modal
  const openImageModal = (salesId) => {
    fetchRentImages(salesId);
  };

  // Close image modal
  const closeImageModal = () => {
    setShowImageModal(false);
    setRentImages([]);
  };

  // Fetch sales history
//   const fetchSalesHistory = async () => {
//     try {
//       const response = await fetch(`${config.BASE_URL}/salesRentGet`);
//       if (!response.ok) {
//         throw new Error('No Rent History to Show');
//       }
//       const salesData = await response.json();

//       const formattedData = await Promise.all(salesData.map(async (sale, index) => {
//         const customerResponse = await fetch(`${config.BASE_URL}/customer/${sale.customerId}`);
//         const customerData = await customerResponse.json();
//         const customerName = customerData.cusName;

//         const productResponse = await fetch(`${config.BASE_URL}/product/${sale.productId}`);
//         const productData = await productResponse.json();
//         const productName = productData.productName;

//         const guarantorResponse = await fetch(`${config.BASE_URL}/guarantor/${sale.guarantorId}`);
//         const guarantorData = await guarantorResponse.json();
//         const guarantorName = guarantorData.guarantorName;

//         const rentImagesResponse = await fetch(`${config.BASE_URL}/rentImages/${sale.salesId}`);
//         const rentImagesData = await rentImagesResponse.json();

//         const returnDate = sale.Transaction?.returnDate 
//         ? new Date(sale.Transaction.returnDate).toLocaleDateString() 
//         : '';

//         return {
//           id: sale.salesId,
//           rowData: [
//             index + 1,
//             new Date(sale.saleDate).toLocaleDateString(),
//             // new Date(sale.Transaction?.returnDate).toLocaleDateString(),
//             returnDate,
//             customerName,
//             productName,
//             guarantorName,
//             sale.Transaction?.totalAmount || 0,
//             sale.Transaction?.paidAmount || 0,
//             sale.Transaction?.due || 0,
//             <div key={index}>
//               {/* <button
//                 className="btn btn-info btn-sm"
//                 onClick={() => openImageModal(sale.salesId)}
//               >
//                 View Images
//               </button> */}


//               <img
//                 src={`${config.BASE_URL}${rentImagesData.imageOne}`}
//                 // alt="Image One"
//                 style={{ cursor: 'pointer', width: '20px', height: '20px', marginRight: '5px' }}
//                 onClick={() => openImageModal(sale.salesId)}
//               />


//               {/* <img
//                 src={`${config.BASE_URL}${rentImagesData.imageTwo}`}
//                 // alt="Image Two"
//                 style={{ cursor: 'pointer', width: '20px', height: '20px' }}
//                 onClick={() => openImageModal(sale.salesId)}
//               />

//               <img
//                 src={`${config.BASE_URL}${rentImagesData.imageThree}`}
//                 // alt="Image Two"
//                 style={{ cursor: 'pointer', width: '20px', height: '20px' }}
//                 onClick={() => openImageModal(sale.salesId)}
//               />

// <img
//                 src={`${config.BASE_URL}${rentImagesData.imageFour}`}
//                 // alt="Image Two"
//                 style={{ cursor: 'pointer', width: '20px', height: '20px' }}
//                 onClick={() => openImageModal(sale.salesId)}
//               /> */}

//             </div>,
//             <div className="btn-group" role="group">
//               <button
//                 className="btn btn-warning btn-sm"
//                 onClick={() => handleEdit(sale)}
//               >
//                 <FontAwesomeIcon icon={faPen} />
//               </button>
//               <button
//                 className="btn btn-danger btn-sm"
//                 onClick={() => handleDelete(sale.salesId)}
//               >
//                 <FontAwesomeIcon icon={faTrash} />
//               </button>
//             </div>
//           ]
//         };
//       }));

//       formattedData.sort((a, b) => new Date(b.rowData[1]) - new Date(a.rowData[1]));
//       setData(formattedData);
//       setIsLoading(false);
//     } catch (err) {
//       setError(err.message);
//       setIsLoading(false);
//     }
//   };

// const fetchSalesHistory = async () => {
//   try {
//     const response = await fetch(`${config.BASE_URL}/salesRentGet`);
//     if (!response.ok) {
//       throw new Error('No Rent History to Show');
//     }
//     const salesData = await response.json();

//     const formattedData = await Promise.all(salesData.map(async (sale, index) => {
//       const customerResponse = await fetch(`${config.BASE_URL}/customer/${sale.customerId}`);
//       const customerData = await customerResponse.json();
//       const customerName = customerData.cusName;

//       const productResponse = await fetch(`${config.BASE_URL}/product/${sale.productId}`);
//       const productData = await productResponse.json();
//       const productName = productData.productName;

//       const guarantorResponse = await fetch(`${config.BASE_URL}/guarantor/${sale.guarantorId}`);
//       const guarantorData = await guarantorResponse.json();
//       const guarantorName = guarantorData.guarantorName;

//       const rentImagesResponse = await fetch(`${config.BASE_URL}/rentImages/${sale.salesId}`);
//       const rentImagesData = await rentImagesResponse.json();

//       const returnDate = sale.Transaction?.returnDate 
//         ? new Date(sale.Transaction.returnDate).toLocaleDateString() 
//         : '';

//       return {
//         id: sale.salesId,
//         rowData: [
//           index + 1,
//           new Date(sale.saleDate).toLocaleDateString(),
//           returnDate,
//           customerName,
//           productName,
//           guarantorName,
//           sale.Transaction?.totalAmount || 0,
//           sale.Transaction?.paidAmount || 0,
//           sale.Transaction?.due || 0,
//           <div key={index}>
//             <img
//               src={`${config.BASE_URL}${rentImagesData.imageOne}`}
//               style={{ cursor: 'pointer', width: '20px', height: '20px', marginRight: '5px' }}
//               onClick={() => openImageModal(sale.salesId)}
//             />
//           </div>,
//           <div className="btn-group" role="group">
//             <button
//               className="btn btn-warning btn-sm"
//               onClick={() => handleEdit(sale)}
//             >
//               <FontAwesomeIcon icon={faPen} />
//             </button>
//             <button
//               className="btn btn-danger btn-sm"
//               onClick={() => handleDelete(sale.salesId)}
//             >
//               <FontAwesomeIcon icon={faTrash} />
//             </button>
//           </div>
//         ]
//       };
//     }));

//     formattedData.sort((a, b) => new Date(b.rowData[1]) - new Date(a.rowData[1]));
//     setData(formattedData);
//     setIsLoading(false);
//   } catch (err) {
//     setError(err.message);
//     setIsLoading(false);
//   }
// };


// const fetchSalesHistory = async () => {
//   try {
//     const response = await fetch(`${config.BASE_URL}/salesRentGet`);
//     if (!response.ok) {
//       throw new Error('No Rent History to Show');
//     }
//     const salesData = await response.json();

//     // Sort salesData by salesId in descending order before processing
//     salesData.sort((a, b) => b.salesId - a.salesId);

//     const formattedData = await Promise.all(salesData.map(async (sale, index) => {
//       const customerResponse = await fetch(`${config.BASE_URL}/customer/${sale.customerId}`);
//       const customerData = await customerResponse.json();
//       const customerName = customerData.cusName;

//       const productResponse = await fetch(`${config.BASE_URL}/product/${sale.productId}`);
//       const productData = await productResponse.json();
//       const productName = productData.productName;

//       const guarantorResponse = await fetch(`${config.BASE_URL}/guarantor/${sale.guarantorId}`);
//       const guarantorData = await guarantorResponse.json();
//       const guarantorName = guarantorData.guarantorName;

//       const rentImagesResponse = await fetch(`${config.BASE_URL}/rentImages/${sale.salesId}`);
//       const rentImagesData = await rentImagesResponse.json();

//       const returnDate = sale.Transaction?.returnDate 
//         ? new Date(sale.Transaction.returnDate).toLocaleDateString() 
//         : '';

//       return {
//         id: sale.salesId,
//         rowData: [
//           sale.salesId, // Use actual salesId instead of index + 1
//           new Date(sale.saleDate).toLocaleDateString(),
//           returnDate,
//           customerName,
//           productName,
//           guarantorName,
//           sale.Transaction?.totalAmount || 0,
//           sale.Transaction?.paidAmount || 0,
//           sale.Transaction?.due || 0,
//           <div key={sale.salesId}>
//             <img
//               src={`${config.BASE_URL}${rentImagesData.imageOne}`}
//               style={{ cursor: 'pointer', width: '20px', height: '20px', marginRight: '5px' }}
//               onClick={() => openImageModal(sale.salesId)}
//             />
//           </div>,
//           <div className="btn-group" role="group">
//             <button
//               className="btn btn-warning btn-sm"
//               onClick={() => handleEdit(sale)}
//             >
//               <FontAwesomeIcon icon={faPen} />
//             </button>
//             <button
//               className="btn btn-danger btn-sm"
//               onClick={() => handleDelete(sale.salesId)}
//             >
//               <FontAwesomeIcon icon={faTrash} />
//             </button>
//           </div>
//         ]
//       };
//     }));

//     setData(formattedData);
//     setIsLoading(false);
//   } catch (err) {
//     setError(err.message);
//     setIsLoading(false);
//   }
// };

const fetchSalesHistory = async () => {
  try {
    setIsLoading(true);
    setError(null);
    
    const response = await fetch(`${config.BASE_URL}/salesRentGet`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.error || 'Failed to fetch rent history';
      
      // Check for database schema issues
      if (errorMessage.includes('Unknown column') || errorMessage.includes('field list')) {
        throw new Error('Database schema mismatch. Please contact administrator.');
      }
      
      throw new Error(errorMessage);
    }
    
    const salesData = await response.json();
    
    // Handle empty data case gracefully
    if (!salesData || salesData.length === 0) {
      setData([]);
      setIsLoading(false);
      return;
    }

    // Sort salesData by salesId in descending order before processing
    salesData.sort((a, b) => b.salesId - a.salesId);

    const formattedData = await Promise.all(salesData.map(async (sale, index) => {
      try {
        // Fetch related data with error handling
        const [customerResponse, productResponse, guarantorResponse, rentImagesResponse] = await Promise.all([
          fetch(`${config.BASE_URL}/customer/${sale.customerId}`),
          fetch(`${config.BASE_URL}/product/${sale.productId}`),
          fetch(`${config.BASE_URL}/guarantor/${sale.guarantorId}`),
          fetch(`${config.BASE_URL}/rentImages/${sale.salesId}`)
        ]);

        // Process each response - gracefully handle errors
        let customerData = { cusName: 'N/A', nic: 'N/A' };
        let productData = { productName: 'N/A' };
        let guarantorData = { guarantorName: 'N/A' };
        let rentImagesData = {};
        
        if (customerResponse.ok) customerData = await customerResponse.json();
        if (productResponse.ok) productData = await productResponse.json();
        if (guarantorResponse.ok) guarantorData = await guarantorResponse.json();
        if (rentImagesResponse.ok) rentImagesData = await rentImagesResponse.json();

        const returnDate = sale.Transaction?.returnDate 
          ? new Date(sale.Transaction.returnDate).toLocaleDateString() 
          : '';

        return {
          id: sale.salesId,
          rowData: [
            sale.salesId,
            new Date(sale.saleDate).toLocaleDateString(),
            returnDate,
            customerData.cusName,
            customerData.nic,
            productData.productName,
            guarantorData.guarantorName,
            sale.Transaction?.totalAmount || 0,
            sale.Transaction?.paidAmount || 0,
            sale.Transaction?.due || 0,
            <div key={sale.salesId}>
              {rentImagesData.imageOne && (
                <img
                  src={`${config.BASE_URL}${rentImagesData.imageOne}`}
                  style={{ cursor: 'pointer', width: '20px', height: '20px', marginRight: '5px' }}
                  onClick={() => openImageModal(sale.salesId)}
                  alt="Rent"
                />
              )}
            </div>,
            sale.refund || 0,
            <div className="btn-group" role="group" key={`actions-${sale.salesId}`}>
              <button
                className="btn btn-warning btn-sm"
                onClick={() => handleEdit(sale)}
              >
                <FontAwesomeIcon icon={faPen} />
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDelete(sale.salesId)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          ]
        };
      } catch (err) {
        console.error(`Error processing sale ${sale.salesId}:`, err);
        // Return a row with error state instead of failing completely
        return {
          id: sale.salesId,
          rowData: [
            sale.salesId,
            new Date(sale.saleDate).toLocaleDateString(),
            'N/A',
            'Data unavailable',
            'Data unavailable',
            'Data unavailable',
            'Data unavailable',
            0,
            0,
            0,
            <div key={sale.salesId}></div>,
            0,
            <div className="btn-group" role="group" key={`actions-${sale.salesId}`}>
              <button
                className="btn btn-warning btn-sm"
                onClick={() => handleEdit(sale)}
              >
                <FontAwesomeIcon icon={faPen} />
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDelete(sale.salesId)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          ]
        };
      }
    }));

    setData(formattedData);
    setIsLoading(false);
  } catch (err) {
    console.error('Error fetching sales history:', err);
    setError(err.message);
    setIsLoading(false);
    // Set empty data array to prevent mapping errors
    setData([]);
  }
};

  useEffect(() => {
    fetchSalesHistory();
  }, []);

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return data.slice(startIndex, endIndex).map(sale => sale.rowData);
  };

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const title = 'Rent History';
  const invoice = 'rent_history.pdf';

  if (isLoading) {
    return <div>Loading...</div>;
  }

 

  return (
    <div className="scrolling-container">
      <h4>Rent History</h4>
      <PaginatedTable
        data={getPaginatedData()}
        columns={columns}
        showButton={false}
        showDate={true}
        title={title}
        invoice={invoice}
        showActions={false}
      />
      <UpdateModal
        sale={selectedSale}
        show={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedSale(null);
        }}
        onSaleUpdated={handleSaleUpdated}
      />
      <Modal
        isOpen={showImageModal}
        onRequestClose={closeImageModal}
        contentLabel="Rent Images"
      >
        <div style={{ textAlign: 'center' }}>
          <h4>Rent Images</h4>
          <div>
            {rentImages.imageOne && (
              <img
                src={`${config.BASE_URL}${rentImages.imageOne}`}
                alt="Image One"
                style={{ width: '80%', marginBottom: '10px' }}
              />
            )}
            {rentImages.imageTwo && (
              <img
                src={`${config.BASE_URL}${rentImages.imageTwo}`}
                alt="Image Two"
                style={{ width: '80%', marginBottom: '10px' }}
              />
            )}
            {rentImages.imageThree && (
              <img
                src={`${config.BASE_URL}${rentImages.imageThree}`}
                alt="Image Three"
                style={{ width: '80%', marginBottom: '10px' }}
              />
            )}
            {rentImages.imageFour && (
              <img
                src={`${config.BASE_URL}${rentImages.imageFour}`}
                alt="Image Four"
                style={{ width: '80%', marginBottom: '10px' }}
              />
            )}
          </div>
          <button type="button" onClick={closeImageModal}>Close</button>
        </div>
      </Modal>
      {/* <nav>
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>&lt;</button>
          </li>
          {[...Array(totalPages)].map((_, index) => (
            <li
              key={index}
              className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
            >
              <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                {index + 1}
              </button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>&gt;</button>
          </li>
        </ul>
      </nav> */}

      

{/* <nav>
  <ul className="pagination justify-content-center">
    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
      <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>&lt;</button>
    </li>
    {[...Array(totalPages)].map((_, index) => (
      <li
        key={index}
        className={`page-item ${currentPage === totalPages - index ? 'active' : ''}`} // Active last page
      >
        <button className="page-link" onClick={() => handlePageChange(totalPages - index)}>
          {totalPages - index}
        </button>
      </li>
    ))}
    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
      <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>&gt;</button>
    </li>
  </ul>
</nav> */}

<PaginatedNavigation
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={handlePageChange}
/>


    </div>
  );
};

export default RentHistory;