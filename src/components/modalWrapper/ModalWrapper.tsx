import React, { useRef } from "react";

const ModalWrapper = ({ onClose, isOpen, children }) => {
  const modalRef = useRef();

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
      event.stopPropagation();
    }
  };

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <>
      {isOpen && (
        <div className="modal-wrapper" style={{ position: "relative" }}>
          <div ref={modalRef} className="modal">
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default ModalWrapper;
