import React from 'react';
import Image from 'next/image';
import { BiPhoneCall } from 'react-icons/bi';

import { Address } from '@libs/typings';

import DefaultSendButton from '@components/buttons/DefaultSendButton';
import useEditUserAddressModal from '@libs/hooks/modals/useEditUserAddressModal';


interface UserAddressCardProps {
    address: Address
}

const UserAddressCard: React.FC<UserAddressCardProps> = ({ address }) => {

    const eitUserAddressModal = useEditUserAddressModal();

    return (
        <div className='flex flex-col justify-between p-3 space-y-2 border rounded-md shadow-md'>
            <div>
                <div className='flex items-center justify-start space-x-2'>
                    <Image src='/icons/home.svg' alt="home svg" width={24} height={24} />
                    <span className='font-bold'>{address.fullName}</span>
                </div>
                {address.isDefault && <span className='text-sm italic text-gray-400'>addresse de {address.addressType === "shipping" ? 'livraison' : 'facturation'} par default</span>}
            </div>
            <div className='flex flex-col space-y-0.5'>
                <span> {address.streetAddress} </span>
                <span> {address.city} </span>
                <span> {address.postalCode}, {address.country} </span>
            </div>

            <div className='flex flex-col space-y-2'>
                <div className='flex items-center py-1 space-x-2 border-t border-b'>
                    <BiPhoneCall />
                    <span>{address.phone}</span>
                </div>
                <DefaultSendButton
                    title='Modifier'
                    onClick={() => eitUserAddressModal.onOpenEdit(address)}
                />
                <button
                    onClick={() => eitUserAddressModal.onOpenDelete(address)}
                    className='text-red-500 underline hover:text-red-600'
                >Supprimer</button>
            </div>
        </div>
    );
}

export default UserAddressCard;