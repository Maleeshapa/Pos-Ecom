import React from 'react';

const PaginatedNavigation = ({ currentPage, totalPages, onPageChange }) => {
  // Default to last page if no page is selected
  React.useEffect(() => {
    if (currentPage === 1 && totalPages > 0) {
      onPageChange(totalPages);
    }
  }, [totalPages]);

  return (
    <nav>
      <ul className="pagination justify-content-center">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button 
            className="page-link" 
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
        </li>
        
        {[...Array(totalPages)].map((_, index) => {
          const pageNumber = totalPages - index; // Reverse order of pages
          return (
            <li
              key={index}
              className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}
            >
              <button 
                className="page-link" 
                onClick={() => onPageChange(pageNumber)}
              >
                {pageNumber}
              </button>
            </li>
          );
        })}
        
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button 
            className="page-link" 
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default PaginatedNavigation;