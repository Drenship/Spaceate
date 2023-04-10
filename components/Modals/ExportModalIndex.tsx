import React from 'react';
import CookiePopup from '@components/Modals/Default/CookiePopup';
import LoginModal from '@components/Modals/Auth/LoginModal';
import RegisterModal from '@components/Modals/Auth/RegisterModal';
import ConfirmCodeModal from '@components/Modals/Auth/ConfirmCodeModal';
import EditUserAddressModal from '@components/Modals/User/EditUserAddressModal';
import ProductEditPromotion from '@components/Modals/Admin/ProductEditPromotion';

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

            { /* ADMIN */}
            <ProductEditPromotion />
        </>
    );
}
