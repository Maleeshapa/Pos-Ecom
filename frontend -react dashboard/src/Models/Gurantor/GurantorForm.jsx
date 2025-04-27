// import React, { useState, useEffect } from 'react';
// import config from '../../config';

// const Form = ({ closeModal, onSave, guarantor }) => {
//   const [formErrors, setFormErrors] = useState({});
//   const [error, setError] = useState(null);
//   const [imagePreviews, setImagePreviews] = useState({
//     nicFrontPreview: null,
//     nicBackPreview: null,
//   });
//   const [formData, setFormData] = useState({
//     guarantorName: '',
//     guarantorNic: '',
//     guarantorPhone: '',
//     guarantorAddress: '',
//     nicFront: null,
//     nicBack: null,
//   });

//   useEffect(() => {
//     if (guarantor) {
//       setFormData({
//         guarantorName: guarantor.guarantorName || '',
//         guarantorNic: guarantor.guarantorNic || '',
//         guarantorPhone: guarantor.guarantorPhone || '',
//         guarantorAddress: guarantor.guarantorAddress || '',
//         nicFront: null,
//         nicBack: null,
//       });
//       if (guarantor.guarantorNic) {
//         setImagePreviews({
//           nicFrontPreview: `${config.BASE_URL}/uploads/guarantorNicImages/${guarantor.guarantorNic}-front.jpg`,
//           nicBackPreview: `${config.BASE_URL}/uploads/guarantorNicImages/${guarantor.guarantorNic}-back.jpg`
//         });
//       }
//     }
//   }, [guarantor]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });

//     if (formErrors[name]) {
//       setFormErrors({ ...formErrors, [name]: '' });
//     }
//   };

//   const handleFileChange = (e) => {
//     const { name, files } = e.target;
//     const file = files?.[0];

//     if (file) {
//       setFormData(prev => ({ ...prev, [name]: file }));

//       const imageURL = URL.createObjectURL(file);
//       setImagePreviews(prev => ({
//         ...prev,
//         [`${name}Preview`]: imageURL,
//       }));
//     }
//   };

//   const validate = () => {
//     const errors = {};

//     if (!formData.guarantorName.trim()) {
//       errors.guarantorName = 'Name is required.';
//     }

//     if (!formData.guarantorNic.trim()) {
//       errors.guarantorNic = 'NIC is required.';
//     }

//     if (!formData.guarantorPhone.trim()) {
//       errors.guarantorPhone = 'Phone is required.';
//     }

//     if (!formData.guarantorAddress.trim()) {
//       errors.guarantorAddress = 'Address is required.';
//     }

//     return errors;
//   };

//   const handleSubmitGuarantor = async (e) => {
//     e.preventDefault();
//     const errors = validate();
//     if (Object.keys(errors).length > 0) {
//       setFormErrors(errors);
//       return;
//     }

//     try {
//       const url = guarantor
//         ? `${config.BASE_URL}/guarantors/${guarantor.guarantorId}`
//         : `${config.BASE_URL}/guarantor`;

//       const formDataToSend = new FormData();
//       formDataToSend.append('guarantorName', formData.guarantorName);
//       formDataToSend.append('guarantorNic', formData.guarantorNic);
//       formDataToSend.append('guarantorPhone', formData.guarantorPhone);
//       formDataToSend.append('guarantorAddress', formData.guarantorAddress);

//       if (formData.nicFront) {
//         formDataToSend.append('nicFront', formData.nicFront);
//       }
//       if (formData.nicBack) {
//         formDataToSend.append('nicBack', formData.nicBack);
//       }

//       const response = await fetch(url, {
//         method: guarantor ? 'PUT' : 'POST',
//         body: formDataToSend,
//       });

//       const responseData = await response.json();

//       if (response.ok) {
//         setError(guarantor ? 'Successfully Updated!' : 'Successfully Created!');
//         onSave(responseData);
//         closeModal();
//       } else {
//         setError(responseData.error || 'An error occurred while saving the guarantor.');
//       }
//     } catch (error) {
//       setError('An error occurred while saving the guarantor.');
//     }
//   };

//   return (
//     <div style={{ placeItems: 'center' }}>
//       <h2>{guarantor ? 'Edit Guarantor' : 'New Guarantor'}</h2>
//       {error && <div className="error-message">{error}</div>}
//       <form onSubmit={handleSubmitGuarantor} autoComplete='off'>
//         <div className="">
//           <div className="form-group">
//             <label className="form-label" htmlFor="guarantorName">Name <span>*</span></label>
//             <input
//               id="guarantorName"
//               type="text"
//               name="guarantorName"
//               value={formData.guarantorName}
//               onChange={handleChange}
//               className="form-control"
//               placeholder="Enter Full Name"
//               required
//               aria-describedby={formErrors.guarantorName ? 'guarantorName-error' : undefined}
//             />
//             {formErrors.guarantorName && <span id="guarantorName-error" className="error-text">{formErrors.guarantorName}</span>}
//           </div>

//           <div className="form-group">
//             <label className="form-label" htmlFor="guarantorNic">NIC <span>*</span></label>
//             <input
//               id="guarantorNic"
//               type="text"
//               name="guarantorNic"
//               value={formData.guarantorNic}
//               onChange={handleChange}
//               className="form-control"
//               placeholder="Enter NIC"
//               required
//               aria-describedby={formErrors.guarantorNic ? 'guarantorNic-error' : undefined}
//             />
//             {formErrors.guarantorNic && <span id="guarantorNic-error" className="error-text">{formErrors.guarantorNic}</span>}
//           </div>

//           <div className="form-group">
//             <label className="form-label" htmlFor="guarantorPhone">Phone <span>*</span></label>
//             <input
//               id="guarantorPhone"
//               type="text"
//               name="guarantorPhone"
//               value={formData.guarantorPhone}
//               onChange={handleChange}
//               className="form-control"
//               placeholder="Enter Phone"
//               required
//             />
//             {formErrors.guarantorPhone && <span id="guarantorPhone-error" className="error-text">{formErrors.guarantorPhone}</span>}
//           </div>

//           <div className="form-group">
//             <label htmlFor="guarantorAddress">Address <span>*</span></label>
//             <input
//               id="guarantorAddress"
//               type="text"
//               name="guarantorAddress"
//               value={formData.guarantorAddress}
//               onChange={handleChange}
//               placeholder="Enter Address"
//               required
//             />
//             {formErrors.guarantorAddress && <span id="guarantorAddress-error" className="error-text">{formErrors.guarantorAddress}</span>}
//           </div>

//           <div className='row mt-2'>
//             <div className="col-md-6">
//               <label className="form-label" htmlFor="nicFront">NIC Front</label>
//               <input id="nicFront" type="file" name="nicFront" className="form-control" onChange={handleFileChange} accept="image/*" />
//               {imagePreviews.nicFrontPreview && (
//                 <div className='mt-3'>
//                   <img
//                     src={imagePreviews.nicFrontPreview}
//                     alt="NIC Front Preview"
//                     className="preview-image"
//                     style={{ width: '250px', height: 'auto' }}
//                   />
//                 </div>
//               )}
//             </div>

//             <div className="col-md-6">
//               <label className="form-label" htmlFor="nicBack">NIC Back</label>
//               <input id="nicBack" type="file" name="nicBack" className="form-control" onChange={handleFileChange} accept="image/*" />
//               {imagePreviews.nicBackPreview && (
//                 <div className='mt-3'>
//                   <img
//                     src={imagePreviews.nicBackPreview}
//                     alt="NIC Back Preview"
//                     className="preview-image"
//                     style={{ width: '250px', height: 'auto' }}
//                   />
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="form-actions">
//             <button type="button" onClick={closeModal}>Close</button>
//             <button type="submit">{guarantor ? 'Update' : 'Save Changes'}</button>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Form;




//version 2

import React, { useState, useEffect } from 'react';
import config from '../../config';

const Form = ({ closeModal, onSave, guarantor }) => {
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state
  const [imagePreviews, setImagePreviews] = useState({
    nicFrontPreview: null,
    nicBackPreview: null,
  });
  const [formData, setFormData] = useState({
    guarantorName: '',
    guarantorNic: '',
    guarantorPhone: '',
    guarantorAddress: '',
    nicFront: null,
    nicBack: null,
  });

  useEffect(() => {
    if (guarantor) {
      setFormData({
        guarantorName: guarantor.guarantorName || '',
        guarantorNic: guarantor.guarantorNic || '',
        guarantorPhone: guarantor.guarantorPhone || '',
        guarantorAddress: guarantor.guarantorAddress || '',
        nicFront: null,
        nicBack: null,
      });
      if (guarantor.guarantorNic) {
        setImagePreviews({
          nicFrontPreview: `${config.BASE_URL}/uploads/guarantorNicImages/${guarantor.guarantorNic}-front.jpg`,
          nicBackPreview: `${config.BASE_URL}/uploads/guarantorNicImages/${guarantor.guarantorNic}-back.jpg`
        });
      }
    }
  }, [guarantor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files?.[0];

    if (file) {
      setFormData(prev => ({ ...prev, [name]: file }));

      const imageURL = URL.createObjectURL(file);
      setImagePreviews(prev => ({
        ...prev,
        [`${name}Preview`]: imageURL,
      }));
    }
  };

  const validate = () => {
    const errors = {};

    if (!formData.guarantorName.trim()) {
      errors.guarantorName = 'Name is required.';
    }

    if (!formData.guarantorNic.trim()) {
      errors.guarantorNic = 'NIC is required.';
    }

    if (!formData.guarantorPhone.trim()) {
      errors.guarantorPhone = 'Phone is required.';
    }

    if (!formData.guarantorAddress.trim()) {
      errors.guarantorAddress = 'Address is required.';
    }

    return errors;
  };

  const handleSubmitGuarantor = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setLoading(true); // Start loading
    setError(null); // Clear previous errors

    try {
      const url = guarantor
        ? `${config.BASE_URL}/guarantors/${guarantor.guarantorId}`
        : `${config.BASE_URL}/guarantor`;

      const formDataToSend = new FormData();
      formDataToSend.append('guarantorName', formData.guarantorName);
      formDataToSend.append('guarantorNic', formData.guarantorNic);
      formDataToSend.append('guarantorPhone', formData.guarantorPhone);
      formDataToSend.append('guarantorAddress', formData.guarantorAddress);

      if (formData.nicFront) {
        formDataToSend.append('nicFront', formData.nicFront);
      }
      if (formData.nicBack) {
        formDataToSend.append('nicBack', formData.nicBack);
      }

      const response = await fetch(url, {
        method: guarantor ? 'PUT' : 'POST',
        body: formDataToSend,
      });

      const responseData = await response.json();

      if (response.ok) {
        setError(guarantor ? 'Successfully Updated!' : 'Successfully Created!');
        onSave(responseData);
        closeModal();
      } else {
        setError(responseData.error || 'An error occurred while saving the guarantor.');
      }
    } catch (error) {
      setError('An error occurred while saving the guarantor.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div style={{ placeItems: 'center' }}>
      <h2>{guarantor ? 'Edit Guarantor' : 'New Guarantor'}</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmitGuarantor} autoComplete='off'>
        <div className="">
          <div className="form-group">
            <label className="form-label" htmlFor="guarantorName">Name <span>*</span></label>
            <input
              id="guarantorName"
              type="text"
              name="guarantorName"
              value={formData.guarantorName}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter Full Name"
              required
              aria-describedby={formErrors.guarantorName ? 'guarantorName-error' : undefined}
            />
            {formErrors.guarantorName && <span id="guarantorName-error" className="error-text">{formErrors.guarantorName}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="guarantorNic">NIC <span>*</span></label>
            <input
              id="guarantorNic"
              type="text"
              name="guarantorNic"
              value={formData.guarantorNic}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter NIC"
              required
              aria-describedby={formErrors.guarantorNic ? 'guarantorNic-error' : undefined}
            />
            {formErrors.guarantorNic && <span id="guarantorNic-error" className="error-text">{formErrors.guarantorNic}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="guarantorPhone">Phone <span>*</span></label>
            <input
              id="guarantorPhone"
              type="text"
              name="guarantorPhone"
              value={formData.guarantorPhone}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter Phone"
              required
            />
            {formErrors.guarantorPhone && <span id="guarantorPhone-error" className="error-text">{formErrors.guarantorPhone}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="guarantorAddress">Address <span>*</span></label>
            <input
              id="guarantorAddress"
              type="text"
              name="guarantorAddress"
              value={formData.guarantorAddress}
              onChange={handleChange}
              placeholder="Enter Address"
              required
            />
            {formErrors.guarantorAddress && <span id="guarantorAddress-error" className="error-text">{formErrors.guarantorAddress}</span>}
          </div>

          <div className='row mt-2'>
            <div className="col-md-6">
              <label className="form-label" htmlFor="nicFront">NIC Front</label>
              <input id="nicFront" type="file" name="nicFront" className="form-control" onChange={handleFileChange} accept="image/*" />
              {imagePreviews.nicFrontPreview && (
                <div className='mt-3'>
                  <img
                    src={imagePreviews.nicFrontPreview}
                    alt="NIC Front Preview"
                    className="preview-image"
                    style={{ width: '250px', height: 'auto' }}
                  />
                </div>
              )}
            </div>

            <div className="col-md-6">
              <label className="form-label" htmlFor="nicBack">NIC Back</label>
              <input id="nicBack" type="file" name="nicBack" className="form-control" onChange={handleFileChange} accept="image/*" />
              {imagePreviews.nicBackPreview && (
                <div className='mt-3'>
                  <img
                    src={imagePreviews.nicBackPreview}
                    alt="NIC Back Preview"
                    className="preview-image"
                    style={{ width: '250px', height: 'auto' }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={closeModal} disabled={loading}>
              Close
            </button>
            <button type="submit" disabled={loading}>
              {loading ? 'Uploading Please Wait...' : (guarantor ? 'Update' : 'Save Changes')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Form;