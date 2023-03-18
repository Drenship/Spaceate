import { fixedPriceToCurrency, replaceURL } from '@libs/utils';
import React from 'react';
import BlurImage from './BlurImage';

const ItemOfClassement = ({ item, index }) => (
    <div className="flex items-center py-1 border-t">
        <div className="">{index}</div>
        <div className="relative w-8 h-8 ml-2 overflow-hidden rounded-full">
            <BlurImage
                src={replaceURL(item.image)}
            />
        </div>
        <div className="ml-2">{item.name}</div>
        
        <div className="flex-grow" />

        <div className='flex items-center justify-between w-[90px]'>
            <span>{item.totalQuantity}</span>
            <span>{fixedPriceToCurrency(item.totalPrice)}</span>
        </div>
        <img
            src="https://assets.codepen.io/3685267/res-react-dash-country-up.svg"
            alt=""
            className="w-4 h-4 mx-3"
        />
    </div>
)

export default function ListClassement({ title, datasets }) {
    return (
        <div className="w-full max-w-lg px-4 overflow-hidden">
            <div className="h-full rounded-lg bg-card">
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-3">
                        <div className="font-bold">{title}</div>
                    </div>

                    {
                        datasets.map((item, key) => <ItemOfClassement key={key} item={item} index={key+1} />)

                    }
                </div>
            </div>
        </div>
    );
}
