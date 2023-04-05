import { create } from 'zustand';

interface EditUserAddressModalStore {
  isOpen: boolean;
  mode: 'add' | 'edit' | 'delete';
  address: Record<string, any> | null;
  onOpenAdd: () => void;
  onOpenEdit: (data: Record<string, any>) => void;
  onOpenDelete: (data: Record<string, any>) => void;
  onClose: () => void;
}

const useEditUserAddressModal = create<EditUserAddressModalStore>((set) => ({
  isOpen: false,
  mode: 'add',
  address: null,
  onOpenAdd: () => set({ isOpen: true, mode: 'add', address: null }),
  onOpenEdit: (data) => set({ isOpen: true, mode: 'edit', address: data }),
  onOpenDelete: (data) => set({ isOpen: true, mode: 'delete', address: data }),
  onClose: () => set({ isOpen: false, address: null })
}));

export default useEditUserAddressModal;