import React, { useEffect, useState } from 'react';
import Table from '../Table/Table';
import config from '../../config';
import 'bootstrap/dist/css/bootstrap.min.css';

const HireHistory = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 25;

  const columns = [
    '#',
    'Sale Date',
    'Customer',
    'Vechicle',
    'Guarantor Name',
    'Total Amount',
    'Paid Amount',
    'Due Amount',
    'Status'
  ];

  useEffect(() => {
    fetchSalesHistory();
  }, []);

  const fetchSalesHistory = async () => {
    try {
      const response = await fetch(`${config.BASE_URL}/salesHireGet`);
      if (!response.ok) {
        throw new Error('Failed to fetch sales history');
      }
      const salesData = await response.json();
  
      // Fetch customer and product details for each sale
      const formattedData = await Promise.all(salesData.map(async (sale, index) => {
        // Fetch customer name
        const customerResponse = await fetch(`${config.BASE_URL}/customer/${sale.customerId}`);
        const customerData = await customerResponse.json();
        const customerName = customerData.cusName;
  
        // Fetch product name
        const productResponse = await fetch(`${config.BASE_URL}/product/${sale.productId}`);
        const productData = await productResponse.json();
        const productName = productData.productName;

        const guarantorResponse = await fetch(`${config.BASE_URL}/guarantor/${sale.guarantorId}`);
        const guarantorData = await guarantorResponse.json();
        const guarantorName = guarantorData.guarantorName;
  
  
        return [
          index + 1,
          new Date(sale.saleDate).toLocaleDateString(),
          customerName, // Use customer name instead of ID
          productName,  // Use product name instead of ID
          // sale.paymentStatus,
          guarantorName,
          sale.Transaction?.totalAmount || 0,
          sale.Transaction?.paidAmount || 0,
          sale.Transaction?.due || 0,
          sale.status
        ];
      }));

      // Sort by sale date descending
      formattedData.sort((a, b) => new Date(b[1]) - new Date(a[1]));

      setData(formattedData);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const totalPages = Math.ceil(data.length / rowsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const title = 'Hire History';
  const invoice = 'hire_history.pdf';

  if (isLoading) {
    return <div>Loading...</div>;
  }

  
  return (
    <div className="scrolling-container">
      <h4>Hire History</h4>
      <Table
        data={getPaginatedData()}
        columns={columns}
        showButton={false}
        showDate={true}
        title={title}
        invoice={invoice}
      />
      <nav>
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
      </nav>
    </div>
  );
};

export default HireHistory;



// import React, { useEffect, useState } from 'react';
// import Table from '../Table/Table';
// import config from '../../config';

// const HireHistory = () => {
//   const [data, setData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const columns = [
//     '#',
//     'Sale Date',
//     'Customer',
//     'Product',
//     'Payment Status',
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
//       const response = await fetch(`${config.BASE_URL}/salesGet`);
//       if (!response.ok) {
//         throw new Error('Failed to fetch sales history');
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
  
//         return [
//           index + 1,
//           new Date(sale.saleDate).toLocaleDateString(),
//           customerName, // Use customer name instead of ID
//           productName,  // Use product name instead of ID
//           sale.paymentStatus,
//           sale.Transaction?.totalAmount || 0,
//           sale.Transaction?.paidAmount || 0,
//           sale.Transaction?.due || 0,
//           sale.status
//         ];
//       }));
  
//       setData(formattedData);
//       setIsLoading(false);
//     } catch (err) {
//       setError(err.message);
//       setIsLoading(false);
//     }
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
//       <h4>Hire History</h4>
//       <Table
//         data={data}
//         columns={columns}
//         showButton={false}
//         showDate={true}
//         title={title}
//         invoice={invoice}
//       />
//     </div>
//   );
// };

// export default HireHistory;


// import React, { useEffect, useState } from 'react';
// import Table from '../Table/Table';
// import config from '../../config';

// const HireHistory = () => {
//   const [data, setData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const columns = [
//     '#',
//     'Sale Date',
//     'Customer',
//     'Product',
//     'Payment Status',
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
//       console.log('Fetching from:', `${config.BASE_URL}/salesGet`); // Debug log
      
//       const response = await fetch(`${config.BASE_URL}/salesGet`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           // Add any authentication headers if needed
//           // 'Authorization': `Bearer ${token}`
//         }
//       });

//       console.log('Response status:', response.status); // Debug log

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => null);
//         console.error('Error response:', errorData); // Debug log
//         throw new Error(errorData?.message || 'Failed to fetch sales history');
//       }

//       const salesData = await response.json();
//       console.log('Received data:', salesData); // Debug log

//       if (!Array.isArray(salesData)) {
//         throw new Error('Invalid data format received');
//       }

//       const formattedData = salesData.map((sale, index) => [
//         index + 1,
//         new Date(sale.saleDate).toLocaleDateString(),
//         sale.customerId,
//         sale.productId,
//         sale.paymentStatus || 'N/A',
//         sale.Transaction?.totalAmount || 0,
//         sale.Transaction?.paidAmount || 0,
//         sale.Transaction?.due || 0,
//         sale.status || 'N/A'
//       ]);

//       setData(formattedData);
//       setIsLoading(false);
//     } catch (err) {
//       console.error('Fetch error:', err); // Debug log
//       setError(err.message);
//       setIsLoading(false);
//     }
//   };

//   const title = 'Hire History';
//   const invoice = 'hire_history.pdf';

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return (
//       <div className="error-container">
//         <h4>Error Loading Sales History</h4>
//         <p>{error}</p>
//         <button 
//           onClick={fetchSalesHistory}
//           className="retry-button"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="scrolling-container">
//       <h4>Hire History</h4>
//       <Table
//         data={data}
//         columns={columns}
//         showButton={false}
//         showDate={true}
//         title={title}
//         invoice={invoice}
//       />
//     </div>
//   );
// };

// export default HireHistory;