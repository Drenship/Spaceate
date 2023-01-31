import React, { useMemo } from 'react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react';
import { useRecoilState } from 'recoil';
import { cartState } from "@atoms/cartState"
import { CART_EMPTY, setCartState } from '@atoms/setStates/setCartState';

export default function Navbar() {

    const { status, data: session } = useSession();
    const [cartItem, setCartItem] = useRecoilState(cartState)

    const totalPrice = useMemo(() => {
        let total = 0
        cartItem.forEach(item => total += (item.price * item.quantity))
        return total
    }, [cartItem]);

    const totalItems = useMemo(() => {
        return cartItem.length
    }, [cartItem]);

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
        <nav className="fixed top-0 z-50 justify-between h-16 space-x-4 shadow-lg navbar bg-base-100 md:px-8">
            <div className='flex-none'>
                <button className="btn btn-square btn-ghost lg:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </button>

                <Link href='/' className="hidden text-xl font-black text-transparent uppercase sm:block bg-clip-text bg-gradient-to-r via-sky-500 from-blue-700 to-purple-500" >
                    Spaceate
                </Link>
            </div>

            <div className='overflow-x-hidden border border[#f3f6fd] bg-[#f3f6fd] rounded-full shadow-lg w-full max-w-[480px] h-10 flex justify-between items-center px-3'>
                <input type="text" placeholder='Search' className='w-full bg-transparent outline-none' />
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                    <defs></defs>
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="M21 21l-4.35-4.35"></path>
                </svg>
            </div>




            <div className="flex-none space-x-4">
                <div className='hidden space-x-4 lg:block'>
                    <Link href='/colis' className='mb-1 text-lg font-semibold leading-loose hover:underline underline-offset-8'>Colis</Link>
                    <Link href='/' className='mb-1 text-lg font-semibold leading-loose hover:underline underline-offset-8'>Fruit</Link>
                    <Link href='/' className='mb-1 text-lg font-semibold leading-loose hover:underline underline-offset-8'>Legumes</Link>
                    <Link href='/' className='mb-1 text-lg font-semibold leading-loose hover:underline underline-offset-8'>Contact</Link>
                </div>

                <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost btn-circle">
                        <div className="indicator">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            <span className="badge badge-sm indicator-item">{totalItems}</span>
                        </div>
                    </label>
                    <div tabIndex={0} className="mt-3 shadow card card-compact dropdown-content w-52 bg-base-100">
                        <div className="card-body">

                            <div className="-space-x-6 avatar-group">

                                {
                                    cartItem.length > 0 && [...cartItem].slice(0, 4).map((p, k) => <div key={k} className="avatar">
                                        <div className="w-12">
                                            <img src={p.main_image} />
                                        </div>
                                    </div>)
                                }

                                {
                                    cartItem.length > 4 && (

                                        <div className="select-none avatar placeholder">
                                            <div className="w-12 bg-neutral-focus text-neutral-content">
                                                <span>+{totalItems - 3}</span>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>


                            <span className="text-info">Total: {(totalPrice).toFixed(2)}€</span>
                            <div className="card-actions">
                                <Link href='/cart' className="border-none btn bg-sky-500 hover:bg-sky-600 btn-block">Voir le panier</Link>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    status !== 'loading' && session?.user ? (
                        <div className="dropdown dropdown-end">
                            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full">
                                    <img src="https://placeimg.com/80/80/people" />
                                </div>
                            </label>
                            <ul tabIndex={0} className="p-2 mt-3 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
                                <li><a>Profil</a></li>
                                <li><a>Paramètres</a></li>
                                <li><a onClick={logoutClickHandler}>Se déconnecter</a></li>
                            </ul>
                        </div>

                    ) : <Link href="/auth/login" className='hidden px-4 py-2 font-bold uppercase border border-black rounded text-medium lg:block'>Se connecter</Link>

                }
            </div>
        </nav>
    )
}
