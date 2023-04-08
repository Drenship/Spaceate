import { create } from 'zustand';

interface ConfirmCodeStore<T> {
    isOpen: boolean;
    isLoading: boolean,
    data: any | object;
    handleSubmit: (data: any) => void;
    setData: (code: string) => void;
    setLoading: (l: boolean) => void
    onOpen: (handleSubmit: (data: any) => void, data: any) => void;
    onClose: () => void;
}

const useConfirmCodeStore = create<ConfirmCodeStore<any>>((set) => ({
    isOpen: false,
    isLoading: false,
    data: null,
    handleSubmit: () => { },
    setData: (data: any) => set({ data }),
    setLoading: (isLoading: boolean) => set({ isLoading }),
    onOpen: (handleSubmit: (data: any) => void, data: any) => set({ isOpen: true, handleSubmit, data }),
    onClose: () => set({ isOpen: false })
}));

export default useConfirmCodeStore;