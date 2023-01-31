import React from 'react'
import Link from 'next/link'
import BlurImage from '@components/ui-ux/BlurImage';

export default function SearchResultItem({ product }) {
    return (
        <Link href={`/product/${product.slug}`}>
            <div className='flex w-full bg-white py-1 border-t shadow-lg border-[#f3f6fd]'>
                <div className='relative w-12 overflow-hidden rounded-md aspect-square'>
                    <BlurImage src={product.main_image} alt={product.name} />
                </div>
                <div className='flex items-center w-full p-2'>
                    <h3 className='text-sm font-bold uppercase'>{product.name}</h3>
                </div>
            </div>
        </Link>
    )
}
