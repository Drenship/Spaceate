import React from 'react';
import CookiePopup from '@components/Modals/Default/CookiePopup';
import LoginModal from '@components/Modals/Auth/LoginModal';
import RegisterModal from '@components/Modals/Auth/RegisterModal';
import ConfirmCodeModal from '@components/Modals/Auth/ConfirmCodeModal';
import EditUserAddressModal from '@components/Modals/User/EditUserAddressModal';
import ProductEditPromotion from '@components/Modals/Admin/ProductEditPromotion';
import ProcessOrderModal from './User/ProcessOrderModal';

export default function ExportModalIndex() {
    return (
        <>
            { /* DEFAULT */}
            <CookiePopup />
            { /* AUTH */}
            <LoginModal />
            <RegisterModal />
            <ConfirmCodeModal />

            { /* USER */}
            <EditUserAddressModal />
            <ProcessOrderModal />

            { /* ADMIN */}
            <ProductEditPromotion />
        </>
    );
}
