


import React, { useState, useEffect } from 'react';
import config from '../../config';

const Form = ({ closeModal, onSave, cus }) => {
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    nic: '',
    
    jobPosition: '',
    address: '',
    customerReview: '',
    customerDescription: '',
    
   
  });

  useEffect(() => {
    console.log("Editing customer:", cus);
    if (cus) {
      setFormData({
        name: cus.cusName || '',
        phone: cus.cusPhone || '',
        nic: cus.nic || '',
        
        jobPosition: cus.cusJob || '',
        address: cus.cusAddress || '',
        customerReview: cus.customerReview || '',  // Keep the existing review value
        customerDescription: cus.customerDescription || '',
      });

    
    }
  }, [cus]);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };


  const compressImage = (file, maxWidth = 1024, maxQuality = 0.7) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
  
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
  
          if (width > maxWidth) {
            height = Math.round(height * maxWidth / width);
            width = maxWidth;
          }
  
          canvas.width = width;
          canvas.height = height;
  
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
  
          canvas.toBlob((blob) => {
            if (!blob) {
              console.error("Canvas to Blob conversion failed");
              resolve(file); // Return original file if compression fails
              return;
            }
  
            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
  
            resolve(compressedFile);
          }, 'image/jpeg', maxQuality);
        };
      };
      reader.onerror = () => {
        console.error('Error reading file');
        resolve(file); // Return original file if reading fails
      };
    });
  };

 

  const validate = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required.';
    }

    

    return errors;
  };

  // Check if a customer with the same NIC already exists
  // const checkNicExists = async (nic) => {
  //   if (!nic.trim()) return false;

  //   try {
  //     const response = await fetch(`${config.BASE_URL}/customer/check-nic/${nic}`);
  //     const data = await response.json();
  //     return response.ok && data.exists;
  //   } catch (error) {
  //     console.error('Error checking NIC:', error);
  //     return false;
  //   }
  // };

  const handleSubmitCus = async (e) => {
    e.preventDefault();

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsLoading(true); // Start loading

    try {
      const isUpdate = !!cus;

      // Check if NIC already exists for new customers
      // if (!isUpdate && formData.nic.trim()) {
      //   const nicExists = await checkNicExists(formData.nic);
      //   if (nicExists) {
      //     window.alert('Customer already exists with this NIC!');
      //     setIsLoading(false);
      //     return;
      //   }
      // }
      const hasFileUpdates = formData.nicFront instanceof File || formData.nicBack instanceof File;

      let response;

      // JSON approach - for updates without file changes
      if (isUpdate && !hasFileUpdates) {
        const jsonBody = JSON.stringify({
          cusId: cus.cusId,
          cusName: formData.name.trim(),
          cusPhone: formData.phone.trim(),
          cusAddress: formData.address.trim(),
          cusJob: formData.jobPosition?.trim() || '',
          nic: formData.nic?.trim() || '',
          customerReview: formData.customerReview || '',
          customerDescription: formData.customerDescription?.trim() || '',
        });

        response = await fetch(`${config.BASE_URL}/customer/${cus.cusId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: jsonBody,
        });
      }
      // FormData approach - for new customers or updates with file changes
      else {
        const formDataBody = new FormData();

        // If updating, include customer ID
        if (isUpdate) {
          formDataBody.append('cusId', cus.cusId);

        
        }

        // Add all the form fields
        formDataBody.append('cusName', formData.name.trim());
        formDataBody.append('cusPhone', formData.phone.trim());
        formDataBody.append('cusAddress', formData.address.trim());

        if (formData.jobPosition) {
          formDataBody.append('cusJob', formData.jobPosition.trim());
        }

        if (formData.nic) {
          formDataBody.append('nic', formData.nic.trim());
        }


        if (formData.customerReview) {
          formDataBody.append('customerReview', formData.customerReview);
        }

        if (formData.customerDescription) {
          formDataBody.append('customerDescription', formData.customerDescription.trim());
        }



        const url = isUpdate
          ? `${config.BASE_URL}/customer/${cus.cusId}`
          : `${config.BASE_URL}/customer`;

        const method = isUpdate ? 'PUT' : 'POST';

        response = await fetch(url, {
          method,
          // No Content-Type header for FormData
          body: formDataBody,
        });
      }

      const responseData = await response.json();

      if (!response.ok) {
        switch (response.status) {
          case 400:
            window.alert('Save Unsuccessful: Please check the provided data and try again.');
            break;
          case 409:
            window.alert('Save Unsuccessful: A customer with this information already exists.');
            break;
          case 413:
            window.alert('Save Unsuccessful: The uploaded files are too large. Please use smaller files.');
            break;
          default:
            window.alert('Save Unsuccessful: An error occurred while saving the customer.');
        }
        return;
      }

      window.alert('Saved Successfully!');

      const updatedCustomer = cus
        ? {
          ...cus,
          cusName: formData.name,
          cusPhone: formData.phone,
          cusAddress: formData.address,
          cusJob: formData.jobPosition,
          nic: formData.nic,
          customerReview: formData.customerReview,
          customerDescription: formData.customerDescription,
        }
        : responseData.newCustomer;

      onSave(updatedCustomer);
      closeModal();
    } catch (error) {
      console.error('Error submitting form:', error);
      window.alert('Save Unsuccessful: An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  
  return (
    <div style={{ placeItems: 'center' }}>
      <h2>{cus ? 'Edit Customer' : 'New Customer'}</h2>
      <form onSubmit={handleSubmitCus} autoComplete="off">
        <div className="row mt-2">
          <div className="col-md-6">
            <label className="form-label" htmlFor="name">
              Name <span>*</span>
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter Full Name"
              className="form-control"
              required
              aria-describedby={formErrors.name ? 'name-error' : undefined}
            />
            {formErrors.name && (
              <span id="name-error" className="error-text">
                {formErrors.name}
              </span>
            )}
          </div>
  
          <div className="col-md-6">
            <label className="form-label" htmlFor="phone">
              Phone <span>*</span>
            </label>
            <input
              id="phone"
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter Phone"
              required
              aria-describedby={formErrors.phone ? 'phone-error' : undefined}
            />
            {formErrors.phone && (
              <span id="phone-error" className="error-text">
                {formErrors.phone}
              </span>
            )}
          </div>
        </div>
  
  
        <div className="row mt-2">
          <div className="col-md-6">
            <label className="form-label" htmlFor="jobPosition">
              Shop Owner Name
            </label>
            <input
              id="jobPosition"
              type="text"
              name="jobPosition"
              className="form-control"
              value={formData.jobPosition}
              onChange={handleChange}
              placeholder="Enter Shop Owner Name"
            />
          </div>
  
          <div className="col-md-6">
            <label className="form-label" htmlFor="address">
              Address <span>*</span>
            </label>
            <input
              id="address"
              type="text"
              name="address"
              className="form-control"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter Address"
              required
              aria-describedby={formErrors.address ? 'address-error' : undefined}
            />
            {formErrors.address && (
              <span id="address-error" className="error-text">
                {formErrors.address}
              </span>
            )}
          </div>
        </div>
  
        <div className="row mt-2">
          <div className="col-md-6">
            <label className="form-label" htmlFor="customerReview">
              Customer Review
            </label>
            <select
              id="customerReview"
              name="customerReview"
              className="form-control"
              value={formData.customerReview}
              onChange={handleChange}
            >
              <option value="">Select Review</option>
              <option value="Good">Good</option>
              <option value="Normal">Normal</option>
              <option value="Bad">Bad</option>
            </select>
          </div>
  
          <div className="col-md-6">
            <label className="form-label" htmlFor="customerDescription">
              Customer Description
            </label>
            <input
              id="customerDescription"
              type="text"
              name="customerDescription"
              className="form-control"
              value={formData.customerDescription}
              onChange={handleChange}
              placeholder="Enter Customer Description"
            />
          </div>
        </div>

        
        <div className="row mt-2">
          <div className="col-md-6">
            <label className="form-label" htmlFor="nic">
              NIC
            </label>
            <input
              id="nic"
              type="text"
              name="nic"
              className="form-control"
              value={formData.nic}
              onChange={handleChange}
              placeholder="Enter NIC"
            />
          </div>
  
         
        </div>
  
       
  
        <div className="form-actions">
          <button type="button" onClick={closeModal} disabled={isLoading}>
            Close
          </button>
          <button type="submit" disabled={isLoading}>
            {cus ? 'Update' : 'Save Changes'}
          </button>
        </div>
        {error && <div className="error-message">{error}</div>}
        {isLoading && <div className="loading-message">Uploading Please Wait!</div>}
      </form>
    </div>
  );
};

export default Form;