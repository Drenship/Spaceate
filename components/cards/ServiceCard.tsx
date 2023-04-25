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
        <Link href={service.link} className='flex flex-col z-10 md:max-w-[350px] max-w-[80vw] min-w-[320px] w-full rounded-lg shadow-lg bg-white'>
            <div className='w-full '>
                <div className='w-full overflow-hidden rounded-lg'>
                    <img src={service.src} alt={service.title} className="object-cover w-full aspect-w-142 aspect-h-199 aspect-[2/3] min-w-[280px]" />
                </div>
                <div className='p-4'>
                    <h2 className='text-2xl font-bold'>{service.title}</h2>

                </div>
            </div>
        </Link>
    );
}

export default ServiceCard