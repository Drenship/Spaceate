"use client";

import Image from 'next/image';
import React, { FC } from 'react';
import { TypeOrder } from '@libs/typings';
import { fixedPriceToCurrency, replaceURL } from '@libs/utils';

interface UserProfilOrderCardProps {
    order: TypeOrder
}

const UserProfilOrderCard: FC<UserProfilOrderCardProps> = ({ order }) => (
    <div className="flex flex-col overflow-hidden border rounded-xl shadow-lg md:max-w-[320px] max-w-[80vw] min-w-[320px] w-full cursor-pointer button-click-effect">

        <div className="relative w-full h-40">
            <Image
                src={replaceURL(order.orderItems[0].image)}
                layout='fill'
                objectFit="cover"
            />
        </div>
        <div className="p-5">
            <h3 className="text-lg font-bold">{order.shippingAddress.fullName}</h3>
            <p className="text-sm text-gray-600 truncate">{order.shippingAddress.address}</p>
            <p className="font-bold text-right">{fixedPriceToCurrency(order.totalPrice)}</p>
        </div>

    </div>
)

export default UserProfilOrderCard;