import React from 'react'
import Image from "next/image";
import Rating from "@components/ui-ux/Rating"

function CommentaireCard({ img, name, rating, description, date }) {
    return (
        <div className='mt-5' itemscope itemtype="http://schema.org/Review">
            <div className='flex justify-start space-x-3'>
                <div className='relative w-14 h-14'>
                    <Image src={img}
                        layout='fill'
                        className='object-cover rounded-full'
                        alt="spaceate fruit & legume - commentaire of user thumbnail"
                    />
                </div>
                <div>
                    <h4 className='font-semibold' itemprop="author">
                        <span itemprop="name">{name}</span>
                    </h4>
                    <p className='flex space-x-2'>
                        <Rating rating={rating} />
                        <span className='text-gray-400'>•</span>
                        <span className='text-gray-400' itemprop="date">{date}</span>
                    </p>
                </div>
            </div>
            <p className='px-2 py-4' itemprop="description">{description}</p>
        </div>
    )
}
export default CommentaireCard;