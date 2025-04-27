import React, { useEffect, useState } from 'react';
import Table from '../Table/Table'; 
import Modal from 'react-modal';
import ConfirmModal from '../../Models/ConfirmModal';
import config from '../../config';
import DriverForm from '../../Models/Driver/DriverForm';

const DriverList = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteRowIndex, setDeleteRowIndex] = useState(null);

  const columns = ['#', 'Name', 'Age', 'NIC', 'License', 'Phone', 'Address', 'Status'];

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const response = await fetch(`${config.BASE_URL}/getAllDrivers`);
      if (!response.ok) {
        setError('Failed to fetch Drivers list');
        return;
      }
      const drivers = await response.json();

      const formattedData = drivers.map((driver, index) => [
        driver.id, // Using actual driver ID instead of index
        driver.driverName,
        driver.driverAge,
        driver.driverNic,
        driver.driverLicence,
        driver.driverPhone,
        driver.driverAddress,
        driver.driverStatus,
      ]);
      setData(formattedData);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      // Get the actual driver ID from the data array
      const driverId = data[deleteRowIndex][0]; // Using the ID from the first column
      
      const deleteResponse = await fetch(`${config.BASE_URL}/deleteDriverId/${driverId}`, {
        method: 'DELETE',
      });

      if (!deleteResponse.ok) {
        const errorData = await deleteResponse.json();
        if (deleteResponse.status === 400) {
          alert(errorData.message);
        } else {
          throw new Error('Failed to delete driver');
        }
      } else {
        setData(prevData => prevData.filter((_, index) => index !== deleteRowIndex));
        fetchDrivers(); // Refresh the list after deletion
      }
    } catch (err) {
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
    const selectedDriverData = data[rowIndex];
    setSelectedDriver({
      id: selectedDriverData[0], // Using actual driver ID
      driverName: selectedDriverData[1],
      driverAge: selectedDriverData[2],
      driverNic: selectedDriverData[3],
      driverLicence: selectedDriverData[4],
      driverPhone: selectedDriverData[5],
      driverAddress: selectedDriverData[6],
      driverStatus: selectedDriverData[7],
    });
    setModalIsOpen(true);
  };

  const openModal = () => {
    setSelectedDriver(null);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    fetchDrivers(); // Refresh the list after form submission
  };

  const title = 'Driver List';
  const invoice = 'Driver_list.pdf';

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div className="scrolling-container">    
        <h4>Driver List</h4>       
        <Table
          data={data}
          columns={columns}
          showButton={true}
          btnName={"Add New Driver"}
          onAdd={openModal}
          onDelete={confirmDelete}
          onEdit={handleEdit}
          showDate={false}
          title={title}
          invoice={invoice}
        />
        
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Driver Form"
        >
          <DriverForm
            closeModal={closeModal}
            onSave={fetchDrivers}
            driver={selectedDriver}
            style={{
              content: {
                width: '30%',
                height: '70%',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              },
            }}
          />
        </Modal>
        {showConfirmModal && (
          <ConfirmModal
            onConfirm={handleDelete}
            onClose={() => setShowConfirmModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default DriverList;