import create, { StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import { TypeUser, TypeCartItem } from '@libs/typings';
import { fetchGetJSON, fetchPostJSON } from '@libs/utils/api-helpers';

interface UserStore {
    isLoading: boolean;
    setIsLoading: (user: boolean) => void;
    user: TypeUser | null;
    setUser: (user: TypeUser) => void;
    clearUser: () => void;
    fetchUser: () => void;
    cart: TypeCartItem[];
    addToCart: (item: TypeCartItem) => Promise<void>;
    removeFromCart: (itemId: string) => Promise<void>;
    updateCartItemQuantity: (itemId: string, quantity: number) => Promise<void>;
    clearCart: () => void;
}

const useUserStore = create<UserStore>(
    persist(
        (set, get) => ({
            user: null,
            isLoading: false,
            setIsLoading: (x) => set({ isLoading: x }),
            setUser: (user) => set({ user }),
            clearUser: () => set({ user: null }),
            fetchUser: async () => {
                set({ isLoading: true });
                try {
                    const { user } = await fetchGetJSON('/api/user');
                    if (user) {
                        set({ user });
                        if (user.cart) {
                            set({ cart: user.cart.map((c: TypeCartItem) => ({ ...c.productId, quantity: c.quantity, cart_id: c._id })) });
                        }
                    }
                } catch (error) {
                    console.error(error);
                } finally {
                    set({ isLoading: false });
                }
            },
            cart: [],
            addToCart: async (item) => {
                set({ isLoading: true });
                const currentState = get();
                const { user, cart } = currentState;
                try {
                    if (user) {
                        const result = await fetchPostJSON("/api/user/update", {
                            updateType: "ADD_ITEM_CART",
                            data: {
                                productId: item._id,
                                quantity: item.quantity
                            }
                        });
                        if (result.success) {
                            if (result.data.cart) {
                                return set({ cart: result.data.cart.map((c: TypeCartItem) => ({ ...c.productId, quantity: c.quantity, cart_id: c._id })) });
                            }
                        }
                    }
                    set((state) => ({ cart: [...state.cart, item] }));
                } catch (error) {
                    console.error(error);
                } finally {
                    set({ isLoading: false });
                }
            },
            removeFromCart: async (itemId) => {
                set({ isLoading: true });
                const currentState = get();
                const { user, cart } = currentState;
                try {
                    if (user) {
                        await fetchPostJSON("/api/user/update", {
                            updateType: "REMOVE_ITEM_CART",
                            data: { itemId }
                        });
                    }
                    set((state) => ({ cart: state.cart.filter((item) => item.cart_id !== itemId) }));
                } catch (error) {
                    console.error(error);
                } finally {
                    set({ isLoading: false });
                }
            },
            updateCartItemQuantity: async (itemId, quantity) => {
                set({ isLoading: true });
                const currentState = get();
                const { user, cart } = currentState;
                try {
                    if (user) {
                        await fetchPostJSON("/api/user/update", {
                            updateType: "UPDATE_ITEM_QUANTITY_CART",
                            data: { itemId, quantity }
                        });
                    }
                    set((state) => ({
                        cart: state.cart.map((item) => (item.cart_id === itemId ? { ...item, quantity } : item)),
                    }));
                } catch (error) {
                    console.error(error);
                } finally {
                    set({ isLoading: false });
                }
            },

            clearCart: () => set({ cart: [] }),
        }),
        {
            name: 'user-cart-storage', // Le nom de la clé de stockage dans localStorage
            getStorage: () => localStorage, // Utilisez localStorage pour la persistance
            partialize: (state) => ({ cart: state.cart }), // Store only the cart state
        }
    ) as StateCreator<UserStore>
);

export default useUserStore;