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
        <Link href={service.link} className='z-10 mt-5 rounded-lg shadow-md sm:mt-0'>
            <div className='w-full'>
                <div className='w-full overflow-hidden rounded-lg'>
                    <img src={service.src} alt={service.title} className="max-aspect-[453/304] w-full object-cover" />
                </div>
                <div className='p-4'>
                    <h2 className='text-2xl font-bold'>{service.title}</h2>

                </div>
            </div>
        </Link>
    );
}

export default ServiceCard