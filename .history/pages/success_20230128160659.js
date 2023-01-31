import Link from 'next/link'
import React from 'react'
import BasescreenWrapper from '@components/Wrapper/BasescreenWrapper';

const Success = () => {
    return (
        <BasescreenWrapper title="Panier" footer={false}>

            <div className='grid h-screen place-items-center'>

                <div className='text-center'>

                    <h1 className='font-bold text-8xl'>Thank You</h1>
                    <p className='text-2xl text-center'>Order Placed Successfully</p>

                    <Link href="/">
                        <p className='px-12 py-4 mt-4 text-white bg-red-600 cursor-pointer hover:bg-red-800'>Continue Shopping</p>
                    </Link>

                </div>

            </div>
        </BasescreenWrapper>
    )
}

export default Success