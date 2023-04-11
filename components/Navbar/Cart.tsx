import React, { useMemo } from 'react'
import { useRouter } from "next/navigation";
import { useRecoilState } from 'recoil';

import { cartState } from "@atoms/cartState"
import { TypeCartItem, TypePromotions } from '@libs/typings';
import { replaceURL } from '@libs/utils';

export default function Cart() {
    const router = useRouter();
    const [cartItem] = useRecoilState(cartState)


    const activePromotion = (product: TypeCartItem) => {
        const now = new Date();
        return product?.promotions?.filter(promo => {
            const startDate = new Date(promo.startDate);
            const endDate = new Date(promo.endDate);
            return now >= startDate && now <= endDate && promo.isActive === true;
        });
    };

    const priceWithPromotion = (product: TypeCartItem, activePromotion: TypePromotions[]) => activePromotion && activePromotion[0] ? (product.price * (1 - (activePromotion[0]?.discountPercentage || 0) / 100)) : product.price

    // cart details
    const [totalCartValue, totalCountItems] = useMemo(() => {
        let total = 0
        cartItem.forEach((item: TypeCartItem) => total += (priceWithPromotion(item, activePromotion(item)) * item.quantity))
        const countItems = cartItem.length;
        return [total, countItems]
    }, [cartItem]);

    return (

        <div className="hidden dropdown dropdown-end sm:block">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
                <div className="indicator">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    <span className="badge badge-sm indicator-item">{totalCountItems}</span>
                </div>
            </label>
            <div tabIndex={0} className="mt-3 shadow card card-compact dropdown-content w-52 bg-base-100">
                <div className="card-body">

                    <div className="-space-x-6 avatar-group">

                        {
                            cartItem.length > 0 && [...cartItem].slice(0, 4).map((p, k) => <div key={k} className="avatar">
                                <div className="w-12">
                                    <img src={replaceURL(p.main_image)} alt={`panier spaceate - ${p.name}`} />
                                </div>
                            </div>)
                        }

                        {
                            cartItem.length > 4 && (
                                <div className="select-none avatar placeholder">
                                    <div className="w-12 bg-neutral-focus text-neutral-content">
                                        <span>+{totalCountItems - 3}</span>
                                    </div>
                                </div>
                            )
                        }
                    </div>

                    <span className="text-info">Total: {(totalCartValue).toFixed(2)}€</span>
                    <div className="card-actions">
                        <button
                            onClick={() => router.push('/cart')}
                            className="border-none btn bg-sky-500 hover:bg-sky-600 btn-block"
                        >Voir le panier</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
