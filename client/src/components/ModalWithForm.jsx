import React, { useEffect, useRef } from "react";
import "./ModalWithForm.css";
import closeBtn from "../assets/closeBtn.svg";

const ModalWithForm = ({ children, onClose, title = "Dialog" }) => {
  const dialogRef = useRef(null);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Focus the dialog on mount for keyboard users
  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  const handleBackdropClick = (e) => {
    if (dialogRef.current && !dialogRef.current.contains(e.target)) {
      onClose();
    }
  };

  return (
    <div
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={handleBackdropClick}
    >
      <div
        className="modal__content"
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <header className="modal__header">
          <h2 id="modal-title" className="modal__title">{title}</h2>
          <button className="modal__close" onClick={onClose} aria-label="Close">
            <img src={closeBtn} alt="" aria-hidden="true" />
          </button>
        </header>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  );
};

export default ModalWithForm;
