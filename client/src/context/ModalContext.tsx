import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from 'react';

type ModalOptions = {
  title: string;

  message: string;

  onConfirm: () => void;
};

type ModalContextType = {
  openModal: (
    options: ModalOptions
  ) => void;

  closeModal: () => void;
};

const ModalContext =
  createContext<
    ModalContextType | undefined
  >(undefined);

export const ModalProvider = ({
  children,
}: {
  children: ReactNode;
}) => {

  const [modal, setModal] =
    useState<ModalOptions | null>(
      null
    );

  const openModal = (
    options: ModalOptions
  ) => {

    setModal(options);
  };

  const closeModal = () => {

    setModal(null);
  };

  return (

    <ModalContext.Provider
      value={{
        openModal,
        closeModal,
      }}
    >

      {children}

      {modal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">

            <h2 className="text-xl font-bold mb-4">

              {modal.title}

            </h2>

            <p className="text-gray-600 mb-6">

              {modal.message}

            </p>

            <div className="flex justify-end gap-3">

              <button
                onClick={closeModal}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={() => {

                  modal.onConfirm();

                  closeModal();
                }}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
              >
                Confirm
              </button>

            </div>

          </div>

        </div>
      )}

    </ModalContext.Provider>
  );
};

export const useModal = () => {

  const context =
    useContext(ModalContext);

  if (!context) {

    throw new Error(
      'useModal must be used inside ModalProvider'
    );
  }

  return context;
};