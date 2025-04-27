import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import { FaAngleUp } from "react-icons/fa";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show the button when the user scrolls down 300px
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll to the top of the page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Add a scroll event listener to toggle button visibility
  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <div className="scroll-to-top">
      {isVisible && (
        <Button
          onClick={scrollToTop}
          variant="primary"
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000, // Ensures the button stays on top of other components
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Optional: Adds a shadow for better visibility
          }}
        >
          <FaAngleUp size={20} />
        </Button>
      )}
    </div>
  );
};

export default ScrollToTop;
