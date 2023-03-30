import Link from 'next/link';
import React from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRecoilState } from 'recoil';
import { cartState } from "@atoms/cartState"
import { CART_EMPTY, setCartState } from '@atoms/setStates/setCartState';
import { HomeIcon, LoginIcon, LogoutIcon } from '@heroicons/react/solid';
import { BsPerson, BsTools } from 'react-icons/bs';
import { BiBox } from 'react-icons/bi';


export default function Sidebar() {
    const { data: session } = useSession();
    const [cartItem, setCartItem] = useRecoilState(cartState)

    const logoutClickHandler = () => {
        setCartState({
            action: CART_EMPTY,
            product: {},
            cartItem: cartItem,
            setCartItem: setCartItem
        })
        signOut({ callbackUrl: '/auth/login' });
    };

    return (
        <div className="fixed top-16 z-40 h-[calc(100vh-124px)] sm:h-[calc(100vh-64px)] bg-white border-l shadow-xl w-[300px] text-black user-sidebar">
            <h3 className="p-4 text-xl font-bold shadow-lg">Menu</h3>
            <Link href="/" className="flex items-center p-4 font-semibold border-t border-b cursor-pointer button-click-effect"><HomeIcon className="w-5 mr-2" /> Accueil</Link>
            {
                session && session.user ? (
                    <>
                        <Link href="/user" className="flex items-center p-4 font-semibold border-b cursor-pointer button-click-effect"><BsPerson className="w-5 mr-2 scale-125" />Profil</Link>
                        <Link href="/user/order-history" className="flex items-center p-4 font-semibold border-b cursor-pointer button-click-effect"><BiBox className="w-5 mr-2 scale-110" />Mes commandes</Link>
                        {
                            session?.user?.isAdmin && (
                                <Link href="/admin/" className="flex items-center w-full p-4 font-semibold border-b cursor-pointer button-click-effect"><BsTools className="w-5 mr-2" />Admin Dashboard</Link>
                            )
                        }
                        <button className="flex items-center w-full p-4 font-semibold border-b cursor-pointer button-click-effect" onClick={logoutClickHandler}><LogoutIcon className="w-5 mr-2" />Se déconnecter</button>
                    </>
                ) : (
                    <>
                        <Link href="/auth/login" className="flex items-center p-4 font-semibold border-b cursor-pointer button-click-effect"><LoginIcon className="w-5 mr-2" />Connection</Link>
                    </>
                )
            }
        </div>
    );
}
