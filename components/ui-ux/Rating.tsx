import React from 'react';
import { StarIcon } from "@heroicons/react/solid";

interface RatingProps {
    rating: number
}

export default function Rating({ rating }: RatingProps) {
    return (
        <span className='flex' itemProp="reviewRating" itemScope itemType="http://schema.org/Rating">
            <span itemProp="ratingValue" className='hidden'>{rating}</span>
            <StarIcon className={`w-5 ${ rating >= 1 || rating === 0 ? 'text-yellow-400' : 'text-gray-600' }`} />
            <StarIcon className={`w-5 ${ rating >= 2 || rating === 0 ? 'text-yellow-400' : 'text-gray-600' }`} />
            <StarIcon className={`w-5 ${ rating >= 3 || rating === 0 ? 'text-yellow-400' : 'text-gray-600' }`} />
            <StarIcon className={`w-5 ${ rating >= 4 || rating === 0 ? 'text-yellow-400' : 'text-gray-600' }`} />
            <StarIcon className={`w-5 ${ rating >= 5 || rating === 0 ? 'text-yellow-400' : 'text-gray-600' }`} />
        </span>
    )
}