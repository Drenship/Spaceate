'use client';

import Button from "@components/buttons/button";
import { useCallback, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";


interface ModalProps {
    isOpen?: boolean;
    onClose: () => void;
    onSubmit: () => void;
    title?: string;
    body?: React.ReactElement;
    footer?: React.ReactElement;
    actionLabel: string;
    disabled?: boolean;
    secondaryAction?: () => void;
    secondaryActionLabel?: string;
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    title,
    body,
    actionLabel,
    footer,
    disabled,
    secondaryAction,
    secondaryActionLabel
}) => {
    const [showModal, setShowModal] = useState(isOpen);

    useEffect(() => {
        setShowModal(isOpen);
    }, [isOpen]);

    const handleClose = useCallback(() => {
        if (disabled) {
            return;
        }

        setShowModal(false);
        setTimeout(() => {
            onClose();
        }, 300)
    }, [onClose, disabled]);

    const handleSubmit = useCallback(() => {
        if (disabled) {
            return;
        }

        onSubmit();
    }, [onSubmit, disabled]);

    const handleSecondaryAction = useCallback(() => {
        if (disabled || !secondaryAction) {
            return;
        }

        secondaryAction();
    }, [secondaryAction, disabled]);

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add("no-scroll");
        } else {
            document.body.classList.remove("no-scroll");
        }
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    return (
        <>
            <div
                className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto text-black outline-none cursor-pointer focus:outline-none bg-black/40"
                onClick={handleClose}
            >

                <div
                    className="relative w-full h-full mx-auto my-6 cursor-default md:w-4/6 lg:w-3/6 xl:w-2/5 lg:h-auto md:h-auto"
                    onClick={(e) => e.stopPropagation()}
                >

                    {/*content*/}
                    <div className={`translate duration-300 h-full ${showModal ? 'translate-y-0' : 'translate-y-full'} ${showModal ? 'opacity-100' : 'opacity-0'}`}>
                        <form
                            onSubmit={e => { 
                                e.preventDefault();
                            }}
                            className="relative flex flex-col w-full h-full bg-white border-0 rounded-lg shadow-lg outline-none translate lg:h-auto md:h-auto focus:outline-none"
                        >
                            {/*header*/}
                            <div className="flex items-center p-6 rounded-t justify-center relative border-b-[1px]">
                                <button
                                    className="absolute p-1 transition border-0 hover:opacity-70 right-5 md:right-9"
                                    onClick={handleClose}
                                >
                                    <IoMdClose size={18} />
                                </button>
                                <div className="text-lg font-semibold">
                                    {title}
                                </div>
                            </div>
                            {/*body*/}
                            <div className="relative flex-auto p-6 overflow-y-auto">
                                {body}
                            </div>
                            {/*footer*/}
                            <div className="flex flex-col gap-2 p-6">
                                <div className="flex flex-row items-center w-full gap-4">
                                    {secondaryAction && secondaryActionLabel && (
                                        <Button
                                            disabled={disabled}
                                            label={secondaryActionLabel}
                                            onClick={handleSecondaryAction}
                                            outline
                                        />
                                    )}
                                    <Button
                                        disabled={disabled}
                                        label={actionLabel}
                                        onClick={handleSubmit}
                                    />
                                </div>
                                {footer}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Modal;