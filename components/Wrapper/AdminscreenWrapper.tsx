import React from 'react'
import Head from 'next/head'
import Navbar from "@components/navbar"
import Link from 'next/link'
import { HiTemplate, HiArchive, HiCollection, HiClipboardList, HiGift, HiChartBar, HiUsers } from "react-icons/hi";

interface NavLinkItemProps {
    href: string;
    title: string;
    children: React.ReactNode;
}

const NavLinkItem = ({ href, title, children }: NavLinkItemProps) => (
    <Link
        href={href}
        className='flex items-center w-full h-12 p-2 pl-6 space-x-2 font-bold uppercase border-b bg-white/80 hover:bg-white hover:shadow-lg'
    >
        {children}
        <span>{title}</span>
    </Link>
)

interface Props {
    title?: string;
    children: React.ReactNode;
}

export default function AdminscreenWrapper({ title, children }: Props) {

    const titleHead = title ? `${title} - Spaceate` : "Spaceate"

    return (
        <div data-theme="light" className="flex flex-col items-center justify-center w-full min-h-screen ">
            <Head>
                <title>{titleHead}</title>
                <link rel="icon" href="/favicons/favicon.ico" />
                <link rel="manifest" href="/site.webmanifest" />
            </Head>

            <Navbar leftButton={true} />

            <main className="flex w-full h-full mt-16">
                <div className='sidebar w-[280px] h-[calc(100vh-64px)] border-r shadow-lg sticky top-16 bg-gray-100 hidden lg:block z-40'>
                    <div className='w-full overflow-x-hidden overflow-y-auto'>
                        <NavLinkItem href="/admin" title="Dashboard">
                            <HiTemplate />
                        </NavLinkItem>
                        <NavLinkItem href="/admin/products" title="Produits">
                            <HiCollection />
                        </NavLinkItem>
                        <NavLinkItem href="/admin/categories" title="Catégories">
                            <HiClipboardList />
                        </NavLinkItem>
                        <NavLinkItem href="/admin/orders" title="Commandes">
                            <HiArchive />
                        </NavLinkItem>
                        <NavLinkItem href="/admin/subscription" title="Abonnement">
                            <HiGift />
                        </NavLinkItem>
                        <NavLinkItem href="/admin/users" title="Utilisateurs">
                            <HiUsers />
                        </NavLinkItem>
                        <NavLinkItem href="/admin/analityx" title="Statistique">
                            <HiChartBar />
                        </NavLinkItem>
                    </div>
                </div>

                <div className='flex flex-col justify-start flex-1 w-full px-4 py-8 md:px-8'>
                    {children}
                </div>
            </main>
        </div>
    )
}