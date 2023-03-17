
import React, { useMemo, useRef, useState } from 'react';
import Link from 'next/link';

import { TypeOrder } from '@libs/typings';
import { useEscapeListener } from '@libs/hooks';
import { replaceURL, splitString, UTCStringToDate } from '@libs/utils';

interface Props {
    order: TypeOrder,
    checkAll: boolean
}

export default function TableOrderLIne({ order, checkAll }: Props) {

    const seeMenuRef = useRef(null);
    const [seeMenu, setSeeMenu] = useState(false);
    const [checked, setChecked] = useState(false);
    const [prevCheck, setPrevCheck] = useState({
        checkAll: checkAll,
        checked: checked
    });

    const checkboxChecked = useMemo(() => {
        if (prevCheck.checked !== checked) {
            setPrevCheck({
                checkAll: checkAll,
                checked: checked
            })
            setChecked(checked)
            return checked
        }

        setPrevCheck({
            checkAll: checkAll,
            checked: checked
        })
        setChecked(checkAll)
        return checkAll
    }, [checkAll, checked]);



    useEscapeListener(seeMenuRef, () => setSeeMenu(false))

    return (
        <tr className="h-24 border-b border-gray-300">
            <td className="pl-8 pr-6 text-sm leading-4 tracking-normal text-left text-gray-800 whitespace-no-wrap">
                <input
                    type="checkbox"
                    checked={checkboxChecked}
                    className="relative w-5 h-5 bg-white border border-gray-400 rounded outline-none cursor-pointer"
                    onClick={() => setChecked(prev => !prev)}
                />
            </td>
            <td className="pr-6 text-sm leading-4 tracking-normal text-gray-800 whitespace-no-wrap">
                <Link href={`/admin/orders/${order._id}`}>{splitString(order._id)}</Link>
            </td>
            <td className="pr-6 text-sm leading-4 tracking-normal text-gray-800 whitespace-no-wrap">
                <div className="-space-x-6 avatar-group">

                    {
                        order.orderItems.length > 0 && [...order.orderItems].slice(0, 4).map((p, k) => <div key={k} className="avatar">
                            <div className="w-12">
                                <img src={replaceURL(p.image)} alt={`panier spaceate - ${p.name}`} />
                            </div>
                        </div>)
                    }

                    {
                        order.orderItems.length > 4 && (
                            <div className="select-none avatar placeholder">
                                <div className="w-12 bg-neutral-focus text-neutral-content">
                                    <span>+{order.orderItems.length - 3}</span>
                                </div>
                            </div>
                        )
                    }
                </div>
            </td>
            <td className="pr-6 whitespace-no-wrap">
                {
                    order.isCancel
                        ? "Cancel"
                        : order.isRefund
                            ? "Commande rembourser"
                            : order.isDelivered
                                ? `Livré : ${new Date(order.deliveredAt!).toLocaleDateString()}`
                                : order.isSended
                                    ? "Commande envoyée"
                                    : order.isPaid
                                        ? "En cours de Préparation"
                                        : "Payement en attente"
                }
            </td>
            <td className="pr-6 text-sm leading-4 tracking-normal text-gray-800 whitespace-no-wrap">
                {
                    order.isCancel ? <span className="w-2 h-2 px-2.5 py-1 text-white bg-yellow-500 rounded-full">Commande Annuler</span>
                        : order.isPaid ? (
                            <span className="w-2 h-2 px-2.5 py-1 text-white bg-green-600 rounded-full">Payer</span>
                        ) : (
                            <span className="w-2 h-2 px-2.5 py-1 text-white bg-red-600 rounded-full">Payement en attente</span>
                        )
                }
            </td>
            <td className="pr-6 text-sm leading-4 tracking-normal text-gray-800 whitespace-no-wrap">{order.totalPrice}€</td>
            <td className="pr-6 text-sm leading-4 tracking-normal text-gray-800 whitespace-no-wrap">{UTCStringToDate(order.createdAt)}</td>
            <td className="relative pr-8">
                <div className={`absolute left-0 z-10 w-32 mt-8 -ml-12 shadow-md dropdown-content ${!seeMenu && 'hidden'}`}>
                    <ul className="py-1 bg-white rounded shadow ">
                        <Link href={`/product/${order._id}`}>
                            <li className="px-3 py-3 text-sm font-normal leading-3 tracking-normal text-gray-600 cursor-pointer hover:bg-indigo-700 hover:text-white">Voire</li>
                        </Link>
                        <Link href={`/admin/products/edit?slug=${order._id}`}>
                            <li className="px-3 py-3 text-sm font-normal leading-3 tracking-normal text-gray-600 cursor-pointer hover:bg-indigo-700 hover:text-white">Edit</li>
                        </Link>
                    </ul>
                </div>
                <button className="text-gray-500 border border-transparent rounded cursor-pointer focus:outline-none" ref={seeMenuRef}>
                    <svg xmlns="http://www.w3.org/2000/svg" onClick={() => setSeeMenu(prev => !prev)} className="icon icon-tabler icon-tabler-dots-vertical dropbtn" width={28} height={28} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" />
                        <circle cx={12} cy={12} r={1} />
                        <circle cx={12} cy={19} r={1} />
                        <circle cx={12} cy={5} r={1} />
                    </svg>
                </button>
            </td>
        </tr>
    )
}