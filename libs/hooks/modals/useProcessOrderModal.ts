import { create } from 'zustand';

interface ProcessOrderStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useProcessOrderStore = create<ProcessOrderStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false })
}));


export default useProcessOrderStore;