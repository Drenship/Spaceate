import React, { useEffect } from 'react';
import ScrollShadowWrapper from './ScrollShadowWrapper';

interface PopupWrapperProps {
    toggleModal: boolean,
    setToggleModal: (state: boolean) => void;
    children: React.ReactNode;
}

export default function PopupWrapper({ toggleModal, setToggleModal, children }: PopupWrapperProps) {

    const close = () => setToggleModal(false);

    useEffect(() => {
        if (toggleModal) document.body.classList.add("no-scroll");
        return () => document.body.classList.remove("no-scroll");
    }, [toggleModal]);

    return (
        <div
            className='fixed inset-0 z-50 flex items-center justify-center cursor-pointer bg-black/10'
            onClick={close}
        >
            <div
                className='relative w-full max-w-md p-5 bg-white rounded-md cursor-default max-h-[calc(100vh-140px)] overflow-y-auto'
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="absolute text-2xl font-bold leading-none text-gray-400 transition-colors duration-300 top-5 right-5 hover:text-red-600"
                    onClick={close}
                >&times;</button>
                {children}
            </div>
        </div>
    );
}
