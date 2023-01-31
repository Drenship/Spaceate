import React from 'react'
import Head from 'next/head'
import Navbar from "@components/navbar"
import Link from 'next/link'

export default function AdminscreenWrapper({ title, children }) {

    const titleHead = title ? `${title} - Spaceate` : "Spaceate"

    return (
        <div data-theme="light" className="flex flex-col items-center justify-center w-full min-h-screen ">
            <Head>
                <title>{titleHead}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Navbar />

            <main className="flex w-full h-full mt-16">
                
                <div className='w-[280px] h-[calc(100vh-64px)] border-r shadow-lg sticky top-16'>

                    <h1>sidebar</h1>
                    
                    <div className='w-full max-h-[calc(100%-64px)] overflow-x-hidden overflow-y-auto'>

                    <Link href="/admin/products" className='flex items-center w-full h-12 p-2 font-bold text-white uppercase bg-gray-800'>Produit</Link>
                    <Link href="/admin/products" className='flex items-center w-full h-12 p-2 font-bold text-white uppercase bg-gray-800'>Produit</Link>
                    <Link href="/admin/products" className='flex items-center w-full h-12 p-2 font-bold text-white uppercase bg-gray-800'>Produit</Link>
                    <Link href="/admin/products" className='flex items-center w-full h-12 p-2 font-bold text-white uppercase bg-gray-800'>Produit</Link>
                    <Link href="/admin/products" className='flex items-center w-full h-12 p-2 font-bold text-white uppercase bg-gray-800'>Produit</Link>
                    <Link href="/admin/products" className='flex items-center w-full h-12 p-2 font-bold text-white uppercase bg-gray-800'>Produit</Link>
                    <Link href="/admin/products" className='flex items-center w-full h-12 p-2 font-bold text-white uppercase bg-gray-800'>Produit</Link>
                        <Link href="/admin/products" className='flex items-center w-full h-12 p-2 font-bold text-white uppercase bg-gray-800'>Produit</Link>

                    </div>
                    
                </div>

                <div className='flex flex-col justify-start flex-1 w-full'>
                    {children}
                </div>

            </main>
        </div>
    )
}