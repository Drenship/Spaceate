import React from 'react'
import Image from "next/image";
import Rating from "@components/ui-ux/Rating"

function CommentaireCard({ img, name, rating, description, date }) {
    return(
        <div className='mt-5'>
            <div className='flex justify-start space-x-3'>
                <div className='relative w-14 h-14'>
                    <Image src={ img } 
                        layout='fill'
                        className='object-cover rounded-full'
                        alt="spaceate fruit & legume - commentaire of user thumbnail"
                    />
                </div>
                <div>
                    <h4 className='font-semibold'>{ name }</h4>
                    <p className='flex space-x-2'>
                        <Rating rating={rating} />
                        <span className='text-gray-400'>•</span>
                        <span className='text-gray-400'>{ date }</span>
                    </p>
                </div>
            </div>
            <p className='px-2 py-4'>{ description }</p>
        </div>
    )
}
export default CommentaireCard;