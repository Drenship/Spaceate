import { create } from 'zustand';

interface AdminPromotionModalStore {
    isOpen: boolean;
    isLoading: boolean,
    products: string[],
    setLoading: (isLoading: boolean) => void;
    setProducts: (products: string[]) => void;
    onOpen: () => void;
    onClose: () => void;
}

const useAdminPromotionStore = create<AdminPromotionModalStore>((set) => ({
    isOpen: false,
    isLoading: false,
    products: [],
    setProducts: (products: string[]) => set({ products }),
    setLoading: (isLoading: boolean) => set({ isLoading }),
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false })
}));


export default useAdminPromotionStore;