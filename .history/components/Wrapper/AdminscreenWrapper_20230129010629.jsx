import React from 'react'
import Head from 'next/head'
import Navbar from "@components/navbar"
import Link from 'next/link'

import { HiTemplate } from "react-icons/hi";

const NavLinkItem = ({ href, title }) => (
    <Link
        href={href}
        className='flex items-center w-full h-12 p-2 pl-6 font-bold uppercase border-b hover:bg-gray-100/50 hover:shadow-lg'
    >   

        <span>{title}</span>
    </Link>
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

                        <NavLinkItem href="/admin" title="Dashboard">
                            <HiTemplate />
                        </NavLinkItem>
                        <NavLinkItem href="/admin/commandes" title="Commandes" />
                        <NavLinkItem href="/admin/products" title="Produits" />
                        <NavLinkItem href="/admin/categories" title="Catégories" />

                    </div>
                </div>

                <div className='flex flex-col justify-start flex-1 w-full p-8'>
                    {children}
                </div>

            </main>
        </div>
    )
}