import React from 'react';

export default function ServiceCard({ service }: any) {
    return (
        <div className='z-10 rounded-lg shadow-md'>
            <div className='overflow-hidden rounded-lg'>
                <img src={service.src} alt={service.title} className="aspect-[453/304] object-cover" />
            </div>
            <div className='p-4'>
                <h2 className='text-2xl font-bold'>{service.title}</h2>

            </div>
        </div>
    );
}
