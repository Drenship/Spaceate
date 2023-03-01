import React from 'react'
import Link from 'next/link'
import BlurImage from '@components/ui-ux/BlurImage'
import { replaceURL } from '@libs/utils'

export default function Productcard({ product }) {

    return (
        <Link href={`/product/${product.slug}`} className="bg-white group">
            <div className='overflow-hidden rounded-lg shadow-md'>
                <div className='relative aspect-square h-[210px] w-full object-cover'>
                    <BlurImage
                        src={replaceURL(product.main_image)}
                    />
                </div>
                <div className='relative px-5 mb-5'>
                    <h2 className="w-full text-lg font-bold text-gray-900">{product.name}</h2>
                    <p className='w-full text-sm text-gray-500'>{product.categorie_products_id}</p>
                    <p className='text-sm font-bold'>{product.price}€/{product.price_in}</p>
                    <div className='flex items-center justify-between'>
                        { /* icon coeur (like) */}
                    </div>
                </div>
            </div>
        </Link>
    )
}
