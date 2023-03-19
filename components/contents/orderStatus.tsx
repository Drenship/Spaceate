import { TypeOrder } from '@libs/typings';
import React from 'react';

interface Props {
    order: TypeOrder
}

export default function OrderStatus({ order }: Props) {
    return (
        <p className='text-sm text-gray-500'>
            {
                order.isRefund
                    ? "Commande rembourser"
                    : order.isRefundAsked
                        ? "Remboursement demander"
                        : order.isCancel
                            ? "Commande annuler"
                            : order.isDelivered
                                ? `Livré : ${new Date(order.deliveredAt!).toLocaleDateString()}`
                                : order.isSended
                                    ? "Commande envoyée"
                                    : order.isPaid
                                        ? "En cours de Préparation"
                                        : <span className='text-red-600'>Payement en attente</span>
            }
        </p>
    );
}
