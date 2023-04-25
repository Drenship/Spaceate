"use client";

import Link from 'next/link';
import React from 'react';

interface ServiceCardProps {
    service: {
        title: string,
        link: string,
        src: string,
    }
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {

    return (
        <Link href={service.link} className='flex flex-col z-10 md:max-w-[350px] max-w-[80vw] min-w-[320px] w-full rounded-lg shadow-lg group'>
            <div className='relative w-full overflow-hidden rounded-lg'>
                <img src={service.src} alt={service.title} className="object-cover w-full aspect-w-142 aspect-h-199 aspect-[2/3] min-w-[280px]" />
                <div className='absolute top-0 bottom-0 w-full h-full' />

                <div className='absolute bottom-0 z-10 p-4 '>
                    <h2 className='text-2xl font-bold transition-colors duration-200 group-hover:text-white'>{service.title}</h2>
                </div>

                <div className='absolute bottom-0 w-full h-32 transition-colors duration-200 bg-gradient-to-t from-white/70 group-hover:from-yellow-200/70 to-transparent' />
            </div>
        </Link>
    );
}

export default ServiceCard