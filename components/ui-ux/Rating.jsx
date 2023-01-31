import React from 'react';
import { StarIcon } from "@heroicons/react/solid";

export default function Rating({ rating }) {
    return (
        <span className='flex'>
            <StarIcon className={`w-5 ${ rating >= 1 ? 'text-yellow-400' : 'text-gray-600' }`} />
            <StarIcon className={`w-5 ${ rating >= 2 ? 'text-yellow-400' : 'text-gray-600' }`} />
            <StarIcon className={`w-5 ${ rating >= 3 ? 'text-yellow-400' : 'text-gray-600' }`} />
            <StarIcon className={`w-5 ${ rating >= 4 ? 'text-yellow-400' : 'text-gray-600' }`} />
            <StarIcon className={`w-5 ${ rating >= 5 ? 'text-yellow-400' : 'text-gray-600' }`} />
        </span>
    )
}