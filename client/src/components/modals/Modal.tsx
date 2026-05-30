import React from 'react';

type ModalProps = {
  isOpen: boolean;

  onClose: () => void;

  children: React.ReactNode;
};

const Modal = ({
  isOpen,
  onClose,
  children,
}: ModalProps) => {

  if (!isOpen) {
    return null;
  }

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
        >
          ×
        </button>

        {children}

      </div>
    </div>
  );
};

export default Modal;