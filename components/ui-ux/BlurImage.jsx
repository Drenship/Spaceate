import Image from 'next/image';
import React from 'react';
import { useState } from 'react';

export default function BlurImage({ src }) {
    const [isLoading, setIsLoading] = useState(true);

    function cn(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    return (
        <div className='group'>
            <div className="w-full overflow-hidden bg-gray-200 rounded-lg aspect-w-1 aspect-h-1 xl:aspect-w-7 xl:aspect-h-8">
                <Image 
                    src={ src }
                    fill={true}
                    alt="spaceate fruit & legume"
                    className={cn(
                        'duration-700 ease-in-out group-hover:opacity-75 object-cover',
                        isLoading
                            ? 'blur-md'
                            : 'blur-0'
                    )}
                    onLoadingComplete={() => setIsLoading(false)} 
                />
            </div>
        </div>
    );
}
