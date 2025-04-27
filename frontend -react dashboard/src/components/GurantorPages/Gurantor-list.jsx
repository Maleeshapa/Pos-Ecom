import React, { useEffect, useState } from 'react';
import Table from '../Table/Table';
import Form from '../../Models/Gurantor/GurantorForm';
import Modal from 'react-modal';
import ConfirmModal from '../../Models/ConfirmModal';
import config from '../../config';

const GuarantorList = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedGuarantor, setSelectedGuarantor] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteRowIndex, setDeleteRowIndex] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [nicFrontImage, setNicFrontImage] = useState(null);
  const [nicBackImage, setNicBackImage] = useState(null);

  const columns = ['#', 'Name', 'NIC', 'Phone', 'Address', 'NIC Images'];

  useEffect(() => {
    fetchGuarantors();
  });

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

  const fetchGuarantors = async () => {
    try {
      const response = await fetch(`${config.BASE_URL}/guarantors`);
      if (!response.ok) {
        throw new Error('Failed to fetch Guarantor list');
      }
      const guarantors = await response.json();

      const formattedData = await Promise.all(
        guarantors.map( async(guarantor, index) => {
        const extensions = ['jpg', 'jpeg', 'png', 'webp'];

        const nicFrontUrls = extensions.map(
          (ext) => `${config.BASE_URL}/uploads/guarantorNicImages/${guarantor.guarantorNic}-front.${ext}`
        );
        const nicBackUrls = extensions.map(
          (ext) => `${config.BASE_URL}/uploads/guarantorNicImages/${guarantor.guarantorNic}-back.${ext}`
        );
        const nicFront = await checkImage(nicFrontUrls);
        const nicBack = await checkImage(nicBackUrls);

        return [
          index + 1,
          guarantor.guarantorName,
          guarantor.guarantorNic,
          guarantor.guarantorPhone,
          guarantor.guarantorAddress,
          <div key={index}>
            <img
              src={nicFront}
              alt="NIC Front"
              style={{ cursor: 'pointer', width: '20px', height: '20px', marginRight: '5px' }}
              onClick={() => openImageModal(nicFront, nicBack)}
            />
            <img
              src={nicBack}
              alt="NIC Back"
              style={{ cursor: 'pointer', width: '20px', height: '20px' }}
              onClick={() => openImageModal(nicFront, nicBack)}
            />
          </div>
        ];
      }));

      setData(formattedData);
    } catch (err) {
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

  const handleDelete = async () => {
    try {
      const response = await fetch(`${config.BASE_URL}/guarantors`);
      if (!response.ok) {
        throw new Error('Failed to fetch guarantors');
      }
      const guarantors = await response.json();
      const guarantorToDelete = guarantors[deleteRowIndex];
      const guarantorId = guarantorToDelete.guarantorId;

      const deleteResponse = await fetch(`${config.BASE_URL}/guarantors/${guarantorId}`, {
        method: 'DELETE',
      });

      if (!deleteResponse.ok) {
        const errorData = await deleteResponse.json();
        if (deleteResponse.status === 400) {
          alert(errorData.message);
        } else {
          throw new Error('Failed to delete guarantor');
        }
      } else {
        setData(prevData => prevData.filter((_, index) => index !== deleteRowIndex));
        fetchGuarantors();
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
    const selectedGuarantorData = data[rowIndex];
    setSelectedGuarantor({
      guarantorId: selectedGuarantorData[0],
      guarantorName: selectedGuarantorData[1],
      guarantorNic: selectedGuarantorData[2],
      guarantorPhone: selectedGuarantorData[3],
      guarantorAddress: selectedGuarantorData[4],
    });
    setModalIsOpen(true);
  };

  const openModal = () => {
    setSelectedGuarantor(null);
    setModalIsOpen(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    fetchGuarantors();
  };

  const title = 'Guarantor List';
  const invoice = 'guarantor_list.pdf';

  return (
    <div>
      <div className="scrolling-container">
        <h4>Guarantor List</h4>
        <Table
          data={data}
          columns={columns}
          showButton={true}
          btnName={"Add New Guarantor"}
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
          contentLabel="Guarantor Form"
        >
          <Form
            closeModal={closeModal}
            onSave={fetchGuarantors}
            guarantor={selectedGuarantor}
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

        <Modal
          isOpen={showImageModal}
          onRequestClose={closeImageModal}
          contentLabel="NIC Images"
        >
          <div style={{ textAlign: 'center' }}>
            <h4>NIC Images</h4>
            <div>
              <img
                src={nicFrontImage}
                alt="NIC Front"
                style={{ width: '80%', marginBottom: '10px' }}
              />
              <img
                src={nicBackImage}
                alt="NIC Back"
                style={{ width: '80%' }}
              />
            </div>

            <div className="form-actions justify-content-center">
              <button type="button" onClick={closeImageModal}>Close</button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default GuarantorList;
