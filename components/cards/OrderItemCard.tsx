import BlurImage from '@components/ui-ux/BlurImage';
import { fixedPriceToCurrency, replaceURL } from '@libs/utils';
import React from 'react';

interface OrderItemCardProps {
    item: any
}

export default function OrderItemCard({ item }: OrderItemCardProps) {
    return (
        <div className="flex flex-col items-start justify-start w-full mt-4 md:mt-6 md:flex-row md:items-center md:space-x-6 xl:space-x-8">
            <div className="w-full pb-4 md:pb-8 md:w-40">
                <div className="relative text-gray-600 max-w-[74px]">
                    <div className='relative object-cover w-full overflow-hidden rounded-lg aspect-square'>
                        <BlurImage
                            src={replaceURL(item.image)}
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-start justify-between w-full pb-8 space-y-4 border-b border-gray-200 md:flex-row md:space-y-0">
                <div className="flex flex-col items-start justify-start w-full space-y-8">
                    <h3 className="text-xl font-semibold leading-6 text-gray-800 xl:text-2xl">{item.name}</h3>
                </div>
                <div className="flex items-start justify-between w-full space-x-8">
                    <p className="text-base leading-6 xl:text-lg">{fixedPriceToCurrency(item.price)}</p>
                    <p className="text-base leading-6 text-gray-800 xl:text-lg">{item.quantity <= 9 ? `0${item.quantity}` : item.quantity}</p>
                    <p className="text-base font-semibold leading-6 text-gray-800 xl:text-lg">{fixedPriceToCurrency(item.quantity * item.price)}</p>
                </div>
            </div>
        </div>
    );
}
