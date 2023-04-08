import { TypeUser } from '@libs/typings';
import { fetchGetJSON } from '@libs/utils/api-helpers';
import { create } from 'zustand';

interface UserStore {
    isLoading: boolean,
    setIsLoading: (user: boolean) => void;
    user: TypeUser | null;
    setUser: (user: TypeUser) => void;
    clearUser: () => void;
    fetchUser: () => void;
}

const useUserStore = create<UserStore>((set) => ({
    user: null,
    isLoading: false,
    setIsLoading: (x) => set({isLoading: x}),
    setUser: (user) => set({ user }),
    clearUser: () => set({ user: null }),
    fetchUser: async () => {
        set({ isLoading: true })
        try {
            const { user } = await fetchGetJSON("/api/user");
            if(user) {
                set({ user });
            }
        } catch (error) {
            console.error(error);
        } finally {
            set({ isLoading: false })
        }
    },
}));

export default useUserStore;