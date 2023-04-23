import Image from 'next/image';
import React from 'react';


interface SpliteWrapperProps {
    children: React.ReactNode;
    title?: string;
}

const SpliteWrapper: React.FC<SpliteWrapperProps> = ({ children, title }) => {
    return (
        <div className='w-full h-[calc(100vh-64px)]'>
            <div className='relative grid min-h-[calc(100vh-64px)] grid-cols-1 lg:grid-cols-2 grid-reverse'>
                { /* Left */}
                <div className='sticky top-0 hidden h-[calc(100vh-64px)] lg:inline-block'>
                    <div className='relative w-full h-full'>
                        <Image src='https://images8.alphacoders.com/110/thumb-1920-1102284.jpg' objectFit='cover' layout='fill' />
                        <div className='absolute top-0 left-0 w-full h-full'></div>
                    </div>
                </div>

                <div className='h-full'>
                    <div className='flex flex-col justify-between h-full p-10 xl:px-20'>
                        <div className='mt-16'>
                            {title && <h2 className='text-3xl font-bold'>{title}</h2>}
                            <div className='flex items-center justify-center w-full h-full mt-10'>

                                {children}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SpliteWrapper