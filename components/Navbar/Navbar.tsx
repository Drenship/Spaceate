import React, { useRef } from 'react'
import dynamic from 'next/dynamic';

import { useEscapeListener, useResize } from '@libs/hooks/index'

import { TypeUser } from '@libs/typings';
import { BiMenuAltRight } from 'react-icons/bi';
import { useSession } from 'next-auth/react';

import Searchbar from '@components/Navbar/Searchbar';
import Logo from '@components/Navbar/Logo';
import Cart from '@components/Navbar/Cart';

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

                <Logo />
            </div>

            <Searchbar placeholderSearch={placeholderSearch} user={user} />

            <div className="flex-none space-x-1 md:space-x-4">

                <Cart />

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