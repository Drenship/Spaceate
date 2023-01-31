import React from 'react'
import Head from 'next/head'
import Navbar from "@components/navbar"

export default function AdminscreenWrapper({ title, children }) {

    const titleHead = title ? `${title} - Spaceate` : "Spaceate"

    return (
        <div data-theme="light" className="flex flex-col items-center justify-center w-full min-h-screen ">
            <Head>
                <title>{titleHead}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Navbar />

            <main className="flex w-full mt-16">
                <div className='w-[280px] h-screen border-r shadow-lg relative'>
                    <div className='static top-0'>

                        <h1>sidebar</h1>
                    </div>
                </div>

                <div className='flex flex-col items-center justify-start flex-1 w-full'>
                    {children}
                </div>

            </main>
        </div>
    )
}