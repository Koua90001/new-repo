import React, { useEffect, useRef } from "react";
import "./ModalWithForm.css";
import closeBtn from "../assets/closeBtn.svg";

const ModalWithForm = ({ children, onClose }) => {
  const modalRef = useRef();

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Handle outside click
  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  return (
    <div className="modal" onClick={handleOutsideClick}>
      <div className="modal__content" ref={modalRef} onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose}>
          <img src={closeBtn} alt="Close button" />
        </button>
        {children}
      </div>
    </div>
  );
};

export default ModalWithForm;
