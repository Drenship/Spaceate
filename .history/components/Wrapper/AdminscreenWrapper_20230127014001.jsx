import React from 'react'
import Head from 'next/head'
import Navbar from "@components/navbar"
import Link from 'next/link'

const NavLinkItem = ({ href, title }) => (
    <Link
        href={href}
        className='flex items-center w-full h-12 p-2 font-bold uppercase border-b'
    >{title}</Link>
)

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
                    <div className='w-full overflow-x-hidden overflow-y-auto'>

                        <NavLinkItem href="/admin" title="Dashboard"/>
                        <NavLinkItem href="/admin/products" title="Produit"/>

                    </div>
                </div>

                <div className='flex flex-col justify-start flex-1 w-full px-8'>
                    {children}
                </div>

            </main>
        </div>
    )
}