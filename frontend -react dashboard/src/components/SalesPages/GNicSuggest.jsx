import React, { useState, useRef, useEffect } from "react";
import config from '../../config';

const GNicSuggest = ({ onSelectGuarantor }) => {
  const [nicInput, setNicInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);

  // Handle click outside suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions as user types
  const fetchSuggestions = async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await fetch(`${config.BASE_URL}/guarantors/nic-suggestions/${query}`);
      const data = await response.json();
      
      if (response.ok) {
        setSuggestions(data);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  // Handle NIC input change
  const handleNicInputChange = (e) => {
    const value = e.target.value;
    setNicInput(value);
    fetchSuggestions(value);
  };

  // Select a guarantor from suggestions
  const handleSelectGuarantor = (guarantor) => {
    setNicInput(guarantor.guarantorNic);  
    setShowSuggestions(false);
    onSelectGuarantor({
        guarantorId: guarantor.guarantorId,
        nic: guarantor.guarantorNic,   
        guarantorName: guarantor.guarantorName,
        guarantorPhone: guarantor.guarantorPhone,
        guarantorAddress: guarantor.guarantorAddress
    });
};

  return (
    <div className="position-relative" ref={suggestionsRef}>
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Guarantor NIC"
        value={nicInput}
        onChange={handleNicInputChange}
      />
      
      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="position-absolute w-100 bg-white shadow border rounded mt-1" 
             style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}>
         {suggestions.map((guarantor) => (
    <div
        key={guarantor.guarantorId}
        className="p-2 cursor-pointer hover-bg-light border-bottom"
        onClick={() => handleSelectGuarantor(guarantor)}
        style={{ cursor: 'pointer' }}
    >
        <div className="fw-bold">{guarantor.guarantorNic}</div>  
        <div className="small text-muted">{guarantor.guarantorName}</div>
    </div>
))}
        </div>
      )}
    </div>
  );
};

export default GNicSuggest;