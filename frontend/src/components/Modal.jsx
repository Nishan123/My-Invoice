import { createPortal } from "react-dom";
import { useEffect } from "react";
import { X } from "lucide-react";
import PropTypes from "prop-types";

const SIZE_CLASSES = {
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
};

function Modal({ isOpen, onClose, title, children, size = "md" }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div
        className={`bg-gray-900 rounded-xl w-full ${
          SIZE_CLASSES[size] || SIZE_CLASSES.md
        } border max-h-[90vh] flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-800 shrink-0">
          <h3 className="text-lg font-semibold text-gray-50">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-400 p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>,
    document.body
  );
}

Modal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.node,
  children: PropTypes.node,
  size: PropTypes.oneOf(["md", "lg", "xl", "2xl"]),
};

export default Modal;
