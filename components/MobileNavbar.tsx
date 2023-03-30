import React, { useRef } from 'react';
import Link from 'next/link';
import { HomeIcon } from '@heroicons/react/solid';
import { BsPerson } from 'react-icons/bs';

import { useEscapeListener, useSwipeAxeX } from '@libs/hooks';
import { BiMenuAltRight } from 'react-icons/bi';

export default function MobileNavbar() {

    const ref = useRef(null)

    // SIDEBAR
    const handleToggleSidebar = () => {
        if(document.body.classList.contains('no-scroll')) return;
        
        document.body.classList.toggle('mobile-sidebar-open');
        document.body.classList.toggle('no-scroll')
    };
    
    const handleRemoveSidebar = () => {
        document.body.classList.remove('mobile-sidebar-open')
        document.body.classList.remove('no-scroll')
    };

    useEscapeListener(ref, handleRemoveSidebar)

    useSwipeAxeX(
        handleToggleSidebar,
        handleRemoveSidebar
    )

    return (
        <nav className='fixed bottom-0 z-50 flex items-center justify-between w-full h-16 bg-white border-t shadow-lg sm:hidden'>
            <Link className='flex items-center justify-center w-full h-full border-r' href={"/"}>
                <HomeIcon className="w-5 h-5" />
            </Link>
            <Link className='flex items-center justify-center w-full h-full border-r' href={"/user"}>
                <BsPerson className="w-5 h-5" />
            </Link>
            <Link className='flex items-center justify-center w-full h-full border-r' href={"/cart"}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </Link>
            <button
                className='flex items-center justify-center w-full h-full'
                ref={ref}
                onClick={handleToggleSidebar}
            >
                <BiMenuAltRight className="w-6 h-6" />
            </button>
        </nav>
    );
}
