import React, { useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic';
import { useRecoilState } from 'recoil';
import { cartState } from "@atoms/cartState"
import { useEscapeListener, useResize } from '@libs/hooks/index'

import { replaceURL } from '@libs/utils';

import { TypeCartItem, TypeUser } from '@libs/typings';
import { BiMenuAltRight } from 'react-icons/bi';
import { useSession } from 'next-auth/react';
import Searchbar from '@components/Navbar/Searchbar';

interface NavbarProps {
    leftButton?: boolean
    placeholderSearch?: string;
}

Navbar.defaultProps = {
    leftButton: false,
    placeholderSearch: ''
}

function Navbar({ leftButton, placeholderSearch }: NavbarProps) {
    const { data: session } = useSession();
    const user = session && session.user as TypeUser || null;
    const [cartItem] = useRecoilState(cartState)



    // cart details
    const [totalCartValue, totalCountItems] = useMemo(() => {
        let total = 0
        cartItem.forEach((item: TypeCartItem) => total += (item.price * item.quantity))
        const countItems = cartItem.length;
        return [total, countItems]
    }, [cartItem]);


    const handleToggleSidebar = () => document.body.classList.toggle('user-sidebar-open');
    const handleRemoveSidebar = () => document.body.classList.remove('user-sidebar-open')

    const refUserSidebar = useRef(null)
    useEscapeListener(refUserSidebar, handleRemoveSidebar)
    useResize(handleRemoveSidebar);

    // SIDEBAR
    const handleToggleAdminSidebar = () => {
        document.body.classList.toggle('sidebar-open');
        document.body.classList.toggle('no-scroll')
    };

    const ref = useRef(null)

    useEscapeListener(ref, () => {
        document.body.classList.remove('sidebar-open')
        document.body.classList.remove('no-scroll')
    })

    return (
        <nav className="fixed top-0 z-50 justify-between h-16 space-x-0.5 shadow-lg md:space-x-4 navbar bg-base-100 md:px-8">
            <div className='flex-none'>
                {
                    leftButton && (
                        <button ref={ref} className="btn btn-square btn-ghost lg:hidden" onClick={handleToggleAdminSidebar}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </button>
                    )
                }

                <Link href='/' className="relative hidden px-2 select-none sm:block" >
                    <img width={100} src="/icons/spaceate.svg" alt="My SVG Image" />
                    <div className='absolute inset-0 z-10' />
                </Link>
            </div>

            <Searchbar placeholderSearch={placeholderSearch} user={user} />

            <div className="flex-none space-x-1 md:space-x-4">
                <div className='hidden space-x-4 lg:block'>
                    <Link href='/colis' className='mb-1 text-lg font-semibold leading-loose hover:underline underline-offset-8'>Colis</Link>
                    <Link href='/' className='mb-1 text-lg font-semibold leading-loose hover:underline underline-offset-8'>Fruit</Link>
                    <Link href='/' className='mb-1 text-lg font-semibold leading-loose hover:underline underline-offset-8'>Legumes</Link>
                    <Link href='/' className='mb-1 text-lg font-semibold leading-loose hover:underline underline-offset-8'>Contact</Link>
                </div>

                <div className="hidden dropdown dropdown-end sm:block">
                    <label tabIndex={0} className="btn btn-ghost btn-circle">
                        <div className="indicator">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            <span className="badge badge-sm indicator-item">{totalCountItems}</span>
                        </div>
                    </label>
                    <div tabIndex={0} className="mt-3 shadow card card-compact dropdown-content w-52 bg-base-100">
                        <div className="card-body">

                            <div className="-space-x-6 avatar-group">

                                {
                                    cartItem.length > 0 && [...cartItem].slice(0, 4).map((p, k) => <div key={k} className="avatar">
                                        <div className="w-12">
                                            <img src={replaceURL(p.main_image)} alt={`panier spaceate - ${p.name}`} />
                                        </div>
                                    </div>)
                                }

                                {
                                    cartItem.length > 4 && (
                                        <div className="select-none avatar placeholder">
                                            <div className="w-12 bg-neutral-focus text-neutral-content">
                                                <span>+{totalCountItems - 3}</span>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>

                            <span className="text-info">Total: {(totalCartValue).toFixed(2)}€</span>
                            <div className="card-actions">
                                <Link href='/cart' className="border-none btn bg-sky-500 hover:bg-sky-600 btn-block">Voir le panier</Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="hidden sm:block">
                    <button
                        tabIndex={0}
                        onClick={handleToggleSidebar}
                        ref={refUserSidebar}
                        className="h-[48px] aspect-square flex items-center justify-center btn btn-ghost btn-circle"
                    >
                        <BiMenuAltRight className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </nav>
    )
}


export default dynamic(() => Promise.resolve(Navbar), { ssr: false });