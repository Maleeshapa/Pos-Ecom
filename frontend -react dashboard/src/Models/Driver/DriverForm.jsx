import React, { useState, useEffect } from 'react';
import './Form.css';
import config from '../../config';



const DriverForm = ({ closeModal, onSave, driver }) => {
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    driverName: '',
    driverAge: '',
    driverNic: '',
    driverLicence: '',
    driverPhone: '',
    driverAddress: '',
    driverStatus: 'Active',
  });

  useEffect(() => {
    if (driver) {
      setFormData({
        driverName: driver.driverName || '',
        driverAge: driver.driverAge || '',
        driverNic: driver.driverNic || '',
        driverLicence: driver.driverLicence || '',
        driverPhone: driver.driverPhone || '',
        driverAddress: driver.driverAddress || '',
        driverStatus: driver.driverStatus || 'Active',
      });
    }
  }, [driver]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  const validate = () => {
    const errors = {};

    if (!formData.driverName.trim()) {
      errors.driverName = 'Name is required.';
    }

    if (!formData.driverNic.trim()) {
      errors.driverNic = 'NIC is required.';
    }

    if (!formData.driverLicence.trim()) {
      errors.driverLicence = 'License number is required.';
    }

    if (!formData.driverAge || formData.driverAge < 18) {
      errors.driverAge = 'Driver must be at least 18 years old.';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const url = driver
        ? `${config.BASE_URL}/driver/${driver.id}`
        : `${config.BASE_URL}/driver`;
      const method = driver ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (response.ok) {
        setError(driver ? 'Successfully Updated!' : 'Successfully Created!');
        onSave(formData);
        closeModal();
      } else {
        setError(responseData.error || 'An error occurred while saving the driver.');
      }
    } catch (error) {
      setError('An error occurred while saving the driver.');
    }
  };

  return (
    <div style={{ placeItems: 'center' }}>
      <h2>{driver ? 'Edit Driver' : 'New Driver'}</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="form-container" autoComplete='off'>
        <div className="form-group-1">
          <div className="form-group">
            <label htmlFor="driverName">Name <span>*</span></label>
            <input
              id="driverName"
              type="text"
              name="driverName"
              value={formData.driverName}
              onChange={handleChange}
              placeholder="Enter Full Name"
              required
              aria-describedby={formErrors.driverName ? 'driverName-error' : undefined}
            />
            {formErrors.driverName && <span id="driverName-error" className="error-text">{formErrors.driverName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="driverAge">Age <span>*</span></label>
            <input
              id="driverAge"
              type="number"
              name="driverAge"
              value={formData.driverAge}
              onChange={handleChange}
              placeholder="Enter Age"
              required
              min="18"
              aria-describedby={formErrors.driverAge ? 'driverAge-error' : undefined}
            />
            {formErrors.driverAge && <span id="driverAge-error" className="error-text">{formErrors.driverAge}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="driverNic">NIC <span>*</span></label>
            <input
              id="driverNic"
              type="text"
              name="driverNic"
              value={formData.driverNic}
              onChange={handleChange}
              placeholder="Enter NIC"
              required
              aria-describedby={formErrors.driverNic ? 'driverNic-error' : undefined}
            />
            {formErrors.driverNic && <span id="driverNic-error" className="error-text">{formErrors.driverNic}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="driverLicence">License Number <span>*</span></label>
            <input
              id="driverLicence"
              type="text"
              name="driverLicence"
              value={formData.driverLicence}
              onChange={handleChange}
              placeholder="Enter License Number"
              required
              aria-describedby={formErrors.driverLicence ? 'driverLicence-error' : undefined}
            />
            {formErrors.driverLicence && <span id="driverLicence-error" className="error-text">{formErrors.driverLicence}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="driverPhone">Phone</label>
            <input
              id="driverPhone"
              type="text"
              name="driverPhone"
              value={formData.driverPhone}
              onChange={handleChange}
              placeholder="Enter Phone"
            />
          </div>

          <div className="form-group">
            <label htmlFor="driverAddress">Address</label>
            <input
              id="driverAddress"
              type="text"
              name="driverAddress"
              value={formData.driverAddress}
              onChange={handleChange}
              placeholder="Enter Address"
            />
          </div>

          <div className="form-group">
            <label htmlFor="driverStatus">Status</label>
            <select
              id="driverStatus"
              name="driverStatus"
              value={formData.driverStatus}
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" onClick={closeModal}>Close</button>
            <button type="submit">{driver ? 'Update' : 'Save Changes'}</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DriverForm;