import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  // Handle key events for accessibility (e.g., pressing "Escape" to close the modal)
  useEffect(() => {
    if (!isOpen) return; // Only attach event listeners when the modal is open

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Cleanup the event listener when the modal is closed or on component unmount
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]); // Make sure the effect runs when `isOpen` changes

  // If the modal is not open, don't render anything
  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Overlay with keyboard accessibility */}
      <div
        className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"
        role="button"
        tabIndex={0}
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Enter' && onClose()}
      ></div>

      {/* Modal container */}
      <div className="flex items-center justify-center min-h-screen p-4 text-center">
        <div
          className={classNames(
            'relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full'
          )}
          role="document"
          tabIndex={-1}
        >
          {/* Modal close button */}
          <button
            onClick={onClose}
            className="absolute top-0 right-0 m-3 text-gray-400 hover:text-gray-600"
            aria-label="Close modal"
          >
            <span className="sr-only">Close</span>
            &times;
          </button>

          {/* Modal content */}
          <div className="bg-white p-6">{children}</div>
        </div>
      </div>
    </div>,
    document.body // Ensure modal is rendered outside of the root component
  );
};

export default Modal;
