import React from 'react'
import Link from 'next/link'
import BlurImage from '@components/ui-ux/BlurImage';

export default function ResultSearchbarCard({ data }) {
    return (
        <Link key={key} href={`/product/${data.slug}`}>
            <div className='flex w-full bg-white py-1 border-t shadow-lg border-[#f3f6fd]'>
                <div className='relative w-12 overflow-hidden rounded-md aspect-square'>
                    <BlurImage src={data.main_image} alt={data.name} />
                </div>
                <div className='flex items-center w-full p-2'>
                    <h3 className='text-sm font-bold uppercase'>{data.name}</h3>
                </div>
            </div>
        </Link>
    )
}
