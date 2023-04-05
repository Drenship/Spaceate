import BlurImage from '@components/contents/BlurImage';
import { fixedPriceToCurrency, replaceURL } from '@libs/utils';
import Link from 'next/link';
import React from 'react';

interface OrderItemCardProps {
    item: any
}
const OrderItemCard: React.FC<OrderItemCardProps> = ({ item }) => {

    return (
        <div className="flex flex-row items-center w-full mt-4 space-x-3 border-b md:mt-6 md:space-x-6 xl:space-x-8 last:border-none">
            <div className="w-full pb-4 md:pb-8 max-w-[120px]">
                <div className="relative w-full text-gray-600">
                    <div className='relative object-cover w-full overflow-hidden rounded-lg aspect-square'>
                        <BlurImage
                            src={replaceURL(item.image)}
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-start justify-between w-full pb-8 md:flex-row">
                <div className="flex flex-col items-start justify-start w-full">

                    <h3 className="text-xl font-semibold leading-6 text-gray-800 xl:text-2xl">
                        <Link href={`/product/${item.slug}`}>{item.name}</Link>
                    </h3>

                    <div className="flex flex-col w-full">
                        <div className='flex items-center justify-between'>
                            <p className='font-semibold'>Prix de l'article</p>
                            <p className="text-base leading-6 xl:text-lg">{fixedPriceToCurrency(item.price)}</p>
                        </div>
                        <div className='flex items-center justify-between'>
                            <p className='font-semibold'>Quantité</p>
                            <p className="text-base leading-6 text-gray-800 xl:text-lg">{item.quantity <= 9 ? `0${item.quantity}` : item.quantity}</p>
                        </div>
                        <div className='flex items-center justify-between'>
                            <p className='font-semibold'>Sous-total</p>
                            <p className="text-base leading-6 text-gray-800 xl:text-lg">{fixedPriceToCurrency(item.quantity * item.price)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderItemCard;