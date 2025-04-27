import React, { useEffect, useState } from 'react';
import Table from '../Table/Table';
import Form from '../../Models/Form/Form';
import Modal from 'react-modal';
import ConfirmModal from '../../Models/ConfirmModal';
import config from '../../config';
import InfiniteScroll from 'react-infinite-scroll-component';

const CustomerList = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCus, setSelectedCus] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteRowIndex, setDeleteRowIndex] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [nicFrontImage, setNicFrontImage] = useState(null);
  const [nicBackImage, setNicBackImage] = useState(null);
  
  // Pagination states
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [limit] = useState(10); // Number of records per page
  const [totalCustomers, setTotalCustomers] = useState(0);

  const columns = ['#', 'Shop/Customer Name', 'Phone Number', 'Nic', 'Shop Owner Name', 'Address', 'Customer Review', 'Customer Description' ];

  useEffect(() => {
    // Initial data load
    fetchCustomers();
  }, []);

  const checkImage = async (urls) => {
    for (const url of urls) {
      try {
        const response = await fetch(url, { method: 'HEAD' });
        if (response.ok) return url; // Return the first valid image URL
      } catch (error) {
        continue;
      }
    }
    return null; // No valid image found
  };
  
  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${config.BASE_URL}/customers?page=1&limit=${limit}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch Customer list');
      }
      
      const result = await response.json();
      console.log('API Response:', result); // Debugging log
      
      // Verify that result has the expected structure
      if (!result || !Array.isArray(result.data)) {
        throw new Error('Invalid response format from server');
      }
      
      const customers = result.data;
      setTotalCustomers(result.totalCount || 0);
      
      // Check if we've reached the end of data
      if (customers.length < limit || customers.length === result.totalCount) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
  
      // Format the customer data
      const formattedData = await formatCustomerData(customers);
      console.log('Formatted Data:', formattedData); // Debugging log
  
      setData(formattedData);
      setPage(2); // Set next page to fetch
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError(err.message);
      setIsLoading(false);
    }
  };  
  
  const formatCustomerData = async (customers) => {
    if (!customers || customers.length === 0) return [];
    
    try {
      return Promise.all(
        customers.map(async (cus, index) => {
          if (!cus) {
            console.error('Invalid customer object at index', index);
            return null;
          }
          
          const extensions = ['jpg', 'jpeg', 'png', 'webp'];
    
          const nicFrontUrls = extensions.map(
            (ext) => `${config.BASE_URL}/uploads/cusNicImages/${cus.nic}-front.${ext}`
          );
          const nicBackUrls = extensions.map(
            (ext) => `${config.BASE_URL}/uploads/cusNicImages/${cus.nic}-back.${ext}`
          );
    
          const nicFront = await checkImage(nicFrontUrls);
          const nicBack = await checkImage(nicBackUrls);
    
          return [
            cus.cusId,
            cus.cusName,
            cus.cusPhone,
            cus.nic,
            cus.cusJob,
            cus.cusAddress,
            <span
              key={`review-${cus.cusId}`}
              className={
                cus.customerReview === 'Good'
                  ? 'text-success'
                  : cus.customerReview === 'Normal'
                  ? 'text-warning'
                  : cus.customerReview === 'Bad'
                  ? 'text-danger'
                  : ''
              }
            >
              {cus.customerReview}
            </span>,
            cus.customerDescription,
            
          ];
        })
      ).then(results => results.filter(Boolean)); // Filter out any null entries
    } catch (err) {
      console.error('Error formatting customer data:', err);
      return [];
    }
  }; 

  const loadMoreCustomers = async () => {
    if (!hasMore || isLoading) return;
    
    try {
      setIsLoading(true);
      console.log(`Loading more customers, page: ${page}`);
      
      const response = await fetch(`${config.BASE_URL}/customers?page=${page}&limit=${limit}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch more customers');
      }
      
      const result = await response.json();
      
      // Verify result structure
      if (!result || !Array.isArray(result.data)) {
        throw new Error('Invalid response format from server');
      }
      
      const newCustomers = result.data;
      console.log(`Fetched ${newCustomers.length} more customers`);
      
      // Check if we've reached the end
      if (newCustomers.length === 0 || data.length + newCustomers.length >= result.totalCount) {
        setHasMore(false);
      }
      
      // Format and append new data
      const formattedNewData = await formatCustomerData(newCustomers);
      
      setData(prevData => [...prevData, ...formattedNewData]);
      
      // Increment page for next fetch
      setPage(prevPage => prevPage + 1);
    } catch (err) {
      console.error('Error loading more customers:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const openImageModal = (frontImage, backImage) => {
    setNicFrontImage(frontImage);
    setNicBackImage(backImage);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
  };

  const handleDelete = async () => {
    try {
      if (deleteRowIndex === null || !data[deleteRowIndex]) {
        throw new Error('Invalid customer to delete');
      }
      
      const cusId = data[deleteRowIndex][0];
      const response = await fetch(`${config.BASE_URL}/customer/${cusId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete customer');
      }

      // Reset pagination and reload data
      setData([]);
      setPage(1);
      setHasMore(true);
      fetchCustomers();
    } catch (err) {
      console.error('Error deleting customer:', err);
      setError(err.message);
    } finally {
      setShowConfirmModal(false);
    }
  };

  const confirmDelete = (rowIndex) => {
    setDeleteRowIndex(rowIndex);
    setShowConfirmModal(true);
  };

  const handleEdit = (rowIndex) => {
    if (!data[rowIndex]) {
      console.error('Invalid row index for editing:', rowIndex);
      return;
    }
    
    const selectedCusData = data[rowIndex];
    setSelectedCus({
      cusId: selectedCusData[0],
      cusName: selectedCusData[1],
      cusPhone: selectedCusData[2],
      nic: selectedCusData[3],
      license: selectedCusData[4],
      cusJob: selectedCusData[5],
      cusAddress: selectedCusData[6],
      customerReview: typeof selectedCusData[7]?.props?.children === 'string' 
        ? selectedCusData[7].props.children 
        : 'Normal',
      customerDescription: selectedCusData[8],
    });
    setModalIsOpen(true);
  };

  const openModal = () => {
    setSelectedCus(null);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    // Reset pagination and reload data when a new customer is added
    setData([]);
    setPage(1);
    setHasMore(true);
    fetchCustomers();
  };

  const title = 'Customer List';
  const invoice = 'customer_list.pdf';

  // Loading indicator component
  const loader = (
    <div className="text-center my-3">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p>Loading more customers...</p>
    </div>
  );

  // End message when no more data
  const endMessage = (
    <p className="text-center my-3">
      <b>All customers loaded!</b>
    </p>
  );

  // Error display
  if (error) {
    return (
      <div className="alert alert-danger">
        Error: {error}
        <button className="btn btn-sm btn-outline-danger ms-3" onClick={fetchCustomers}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="scrolling-container" id="scrollable-div" style={{ maxHeight: '80vh', overflow: 'auto' }}>
        <h4>Customer List {isLoading && data.length === 0 && <small>(Loading...)</small>}</h4>

        <InfiniteScroll
          dataLength={data.length}
          next={loadMoreCustomers}
          hasMore={hasMore}
          loader={loader}
          endMessage={endMessage}
          scrollableTarget="scrollable-div"
        >
          <Table
            data={data}
            columns={columns}
            showButton={true}
            btnName={"Add New Customer"}
            onAdd={openModal}
            onDelete={confirmDelete}
            onEdit={handleEdit}
            showDate={false}
            title={title}
            invoice={invoice}
          />
          
          {/* Display when no data is available */}
          {!isLoading && data.length === 0 && (
            <div className="text-center my-5">
              <p>No customers found. Add a new customer to get started.</p>
              <button className="btn btn-primary" onClick={openModal}>
                Add New Customer
              </button>
            </div>
          )}
        </InfiniteScroll>

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Customer Form"
          style={{
            content: {
              width: '80%',
              maxWidth: '800px',
              height: '90%',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            },
          }}
        >
          <Form
            closeModal={closeModal}
            onSave={closeModal}
            cus={selectedCus}
          />
        </Modal>

        {showConfirmModal && (
          <ConfirmModal
            onConfirm={handleDelete}
            onClose={() => setShowConfirmModal(false)}
          />
        )}

        <Modal
          isOpen={showImageModal}
          onRequestClose={closeImageModal}
          contentLabel="NIC Images"
          style={{
            content: {
              width: '90%',
              maxWidth: '800px',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            },
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <h4>NIC Images</h4>
            <div className="row">
              {nicFrontImage && (
                <div className="col-md-6 mb-3">
                  <h5>Front</h5>
                  <img
                    src={nicFrontImage}
                    alt="NIC Front"
                    style={{ maxWidth: '100%' }}
                    className="img-fluid"
                  />
                </div>
              )}
              {nicBackImage && (
                <div className="col-md-6">
                  <h5>Back</h5>
                  <img
                    src={nicBackImage}
                    alt="NIC Back"
                    style={{ maxWidth: '100%' }}
                    className="img-fluid"
                  />
                </div>
              )}
            </div>

            <div className="text-center mt-4">
              <button className="btn btn-secondary" onClick={closeImageModal}>Close</button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default CustomerList;

//version 1 - No on scrolls just load all data.

// import React, { useEffect, useState } from 'react';
// import Table from '../Table/Table';
// import Form from '../../Models/Form/Form';
// import Modal from 'react-modal';
// import ConfirmModal from '../../Models/ConfirmModal';
// import config from '../../config';

// const CustomerList = () => {
//   const [data, setData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [modalIsOpen, setModalIsOpen] = useState(false);
//   const [selectedCus, setSelectedCus] = useState(null);
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [deleteRowIndex, setDeleteRowIndex] = useState(null);
//   const [showImageModal, setShowImageModal] = useState(false);
//   const [nicFrontImage, setNicFrontImage] = useState(null);
//   const [nicBackImage, setNicBackImage] = useState(null);

//   const columns = ['#', 'Name', 'Phone Number', 'Nic', 'License', 'Job', 'Address', 'Customer Review', 'Customer Description', 'NIC Images'];

//   useEffect(() => {
//     fetchCustomer();
//   },);

//   const checkImage = async (urls) => {
//     for (const url of urls) {
//       try {
//         const response = await fetch(url, { method: 'HEAD' });
//         if (response.ok) return url; // Return the first valid image URL
//       } catch (error) {
//         continue;
//       }
//     }
//     return null; // No valid image found
//   };
  
//   const fetchCustomer = async () => {
//     try {
//       const response = await fetch(`${config.BASE_URL}/customers`);
//       if (!response.ok) {
//         setError('Failed to fetch Customer list');
//         return;
//       }
//       const customers = await response.json();
  
//       const formattedData = await Promise.all(
//         customers.map(async (cus, index) => {
//           const extensions = ['jpg', 'jpeg', 'png', 'webp'];
  
//           const nicFrontUrls = extensions.map(
//             (ext) => `${config.BASE_URL}/uploads/cusNicImages/${cus.nic}-front.${ext}`
//           );
//           const nicBackUrls = extensions.map(
//             (ext) => `${config.BASE_URL}/uploads/cusNicImages/${cus.nic}-back.${ext}`
//           );
  
//           const nicFront = await checkImage(nicFrontUrls);
//           const nicBack = await checkImage(nicBackUrls);
  
//           return [
//             cus.cusId,
//             cus.cusName,
//             cus.cusPhone,
//             cus.nic,
//             cus.license,
//             cus.cusJob,
//             cus.cusAddress,
//             <span
//               className={
//                 cus.customerReview === 'Good'
//                   ? 'text-success'
//                   : cus.customerReview === 'Normal'
//                   ? 'text-warning'
//                   : cus.customerReview === 'Bad'
//                   ? 'text-danger'
//                   : ''
//               }
//             >
//               {cus.customerReview}
//             </span>,
//             cus.customerDescription,
//             <div key={index}>
//               {nicFront && (
//                 <img
//                   src={nicFront}
//                   alt="NIC Front"
//                   style={{
//                     cursor: 'pointer',
//                     width: '20px',
//                     height: '20px',
//                     marginRight: '5px',
//                   }}
//                   onClick={() => openImageModal(nicFront, nicBack)}
//                 />
//               )}
//               {nicBack && (
//                 <img
//                   src={nicBack}
//                   alt="NIC Back"
//                   style={{ cursor: 'pointer', width: '20px', height: '20px' }}
//                   onClick={() => openImageModal(nicFront, nicBack)}
//                 />
//               )}
//             </div>,
//           ];
//         })
//       );
  
//       setData(formattedData);
//       setIsLoading(false);
//     } catch (err) {
//       setError(err.message);
//       setIsLoading(false);
//     }
//   };  

//   const openImageModal = (frontImage, backImage) => {
//     setNicFrontImage(frontImage);
//     setNicBackImage(backImage);
//     setShowImageModal(true);
//   };

//   const closeImageModal = () => {
//     setShowImageModal(false);
//   };

//   const handleDelete = async () => {
//     try {
//       const cusId = data[deleteRowIndex][0];
//       const response = await fetch(`${config.BASE_URL}/customer/${cusId}`, {
//         method: 'DELETE',
//       });

//       if (!response.ok) {
//         throw new Error('Failed to delete customer');
//       }

//       setData(prevData => prevData.filter((_, index) => index !== deleteRowIndex));
//       fetchCustomer();
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setShowConfirmModal(false);
//     }
//   };

//   const confirmDelete = (rowIndex) => {
//     setDeleteRowIndex(rowIndex);
//     setShowConfirmModal(true);
//   };

//   const handleEdit = (rowIndex) => {
//     const selectedCusData = data[rowIndex];
//     setSelectedCus({
//       cusId: selectedCusData[0],
//       cusName: selectedCusData[1],
//       cusPhone: selectedCusData[2],
//       nic: selectedCusData[3],
//       license: selectedCusData[4],
//       cusJob: selectedCusData[5],
//       cusAddress: selectedCusData[6],
//       customerReview: selectedCusData[7],
//       customerDescription: selectedCusData[8],
//     });
//     setModalIsOpen(true);
//   };

//   const openModal = () => {
//     setSelectedCus(null);
//     setModalIsOpen(true);
//   };

//   const closeModal = () => {
//     setModalIsOpen(false);
//     fetchCustomer();
//   };

//   const title = 'Customer List';
//   const invoice = 'customer_list.pdf';

//   return (
//     <div>
//       <div className="scrolling-container">
//         <h4>Customer List</h4>

//         <Table
//           data={data}
//           columns={columns}
//           showButton={true}
//           btnName={"Add New Customer"}
//           onAdd={openModal}
//           onDelete={confirmDelete}
//           onEdit={handleEdit}
//           showDate={false}
//           title={title}
//           invoice={invoice}
//         />

//         <Modal
//           isOpen={modalIsOpen}
//           onRequestClose={closeModal}
//           contentLabel="Customer Form"
//         >
//           <Form
//             closeModal={closeModal}
//             onSave={fetchCustomer}
//             cus={selectedCus}
//             style={{
//               content: {
//                 width: '30%',
//                 height: '90%',
//                 top: '50%',
//                 left: '50%',
//                 transform: 'translate(-50%, -50%)',
//               },
//             }}
//           />
//         </Modal>

//         {showConfirmModal && (
//           <ConfirmModal
//             onConfirm={handleDelete}
//             onClose={() => setShowConfirmModal(false)}
//           />
//         )}

//         <Modal
//           isOpen={showImageModal}
//           onRequestClose={closeImageModal}
//           contentLabel="NIC Images"
//         >
//           <div style={{ textAlign: 'center' }}>
//             <h4>NIC Images</h4>
//             <div>
//               <img
//                 src={nicFrontImage}
//                 alt="NIC Front"
//                 style={{ width: '80%', marginBottom: '10px' }}
//               />
//               <img
//                 src={nicBackImage}
//                 alt="NIC Back"
//                 style={{ width: '80%' }}
//               />
//             </div>

//             <div className="form-actions justify-content-center">
//               <button type="button" onClick={closeImageModal}>Close</button>
//             </div>
//           </div>
//         </Modal>

//       </div>
//     </div>
//   );
// };

// export default CustomerList;
