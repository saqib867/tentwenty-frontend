import { create } from "zustand";

export type TypedModal = "question-modal";

interface ModalState {
  isOpen: boolean;
  modalType: TypedModal | null;

  modalData: any;
  openModal: (type: TypedModal) => void;

  closeModal: () => void;
  setModalData: (data: any) => void;
}

const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  modalType: null,

  modalData: null,

  // Opens the modal by setting isOpen to [true] and sets the type of the modal
  openModal: (type: TypedModal) => set({ isOpen: true, modalType: type }),

  // Closes modal by setting isOpen to [false] and modalType to [null]
  closeModal: () => set({ isOpen: false, modalType: null }),
  setModalData: (data: any) => set({ modalData: data }),
}));

export default useModalStore;
