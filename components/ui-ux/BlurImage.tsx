import Image from 'next/image';
import React from 'react';
import { useState } from 'react';
interface Props {
    src: string
    className?: string
    objectFit?: "contain" | ""
    alt?: string
    hoverOpacity?: boolean
    onClick?: () => void
}

BlurImage.defaultProps = {
    alt: "spaceate fruit & legume",
    className: "",
    hoverOpacity: true,
    objectFit: "",
    onClick: () => { }
}

export default function BlurImage({ src, alt, className, hoverOpacity, onClick, objectFit }: Props) {
    const [isLoading, setIsLoading] = useState(true);

    function cn(...classes: any) {
        return classes.filter(Boolean).join(' ')
    }

    return (
        <div className='group' onClick={onClick}>
            <div className="w-full overflow-hidden bg-gray-800 rounded-lg aspect-w-1 aspect-h-1 xl:aspect-w-7 xl:aspect-h-8">
                <Image
                    src={src}
                    fill={true}
                    objectFit={objectFit}
                    alt={alt}
                    className={cn(
                        'duration-700 ease-in-out object-cover',
                        hoverOpacity ? "group-hover:opacity-80 active:opacity-100 focus:opacity-100" : "",
                        className,
                        isLoading
                            ? 'blur-sm'
                            : 'blur-0'
                    )}
                    onLoadingComplete={() => setIsLoading(false)}
                />
            </div>
        </div>
    );
}
