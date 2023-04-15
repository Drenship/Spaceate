import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Address } from '@libs/typings';

interface OrderAddressCardProps {
    address: Address;
    currentValue: Address | null;
    onAddressSelect: (address: Address) => void;
}

const OrderAddressCard: React.FC<OrderAddressCardProps> = ({ address, currentValue, onAddressSelect }) => {
    const [isChecked, setIsChecked] = useState(false);

    const handleDivClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsChecked(true);
        onAddressSelect(address);
    };

    useEffect(() => setIsChecked(currentValue && currentValue._id === address._id ? true : false), [currentValue, address]);
    useEffect(() => {
        if (address.isDefault) {
            setIsChecked(true);
            onAddressSelect(address);
        }
    }, []);

    return (
        <div
            className={
                `md:max-w-[320px] max-w-[80vw] min-w-[320px] w-full flex flex-col justify-between p-3 space-y-2 border rounded-md shadow-md cursor-pointer
                ${isChecked ? 'border-blue-600' : 'border-gray-200'}`
            }
            onClick={handleDivClick}
        >
            <div className="flex items-center justify-start space-x-2">
                <input
                    type="radio"
                    name={"address_"+address.addressType}
                    value={address._id}
                    checked={isChecked}
                    onChange={() => { }}
                    className="text-blue-600 focus:ring-blue-400"
                />
                <Image src="/icons/home.svg" alt="home svg" width={24} height={24} />
                <span className="font-bold">{address.fullName}</span>
            </div>
            <span className="text-sm italic text-gray-400">
                Adresse de {address.addressType === 'shipping' ? 'livraison' : 'facturation'}{' '}
                {address.isDefault && ' par défaut'}
            </span>
            <div className="flex flex-col space-y-0.5">
                <span> {address.streetAddress} </span>
                <span> {address.city} </span>
                <span>
                    {' '}
                    {address.postalCode}, {address.country}{' '}
                </span>
            </div>
        </div>
    );
};

export default OrderAddressCard;
