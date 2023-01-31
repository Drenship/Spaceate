import React from 'react'
import Head from 'next/head'
import Navbar from "@components/navbar"

export default function AdminscreenWrapper({ title, footer, children }) {

    const titleHead = title ? `${title} - Spaceate` : "Spaceate"

    const needFooter = footer === false ? false : true

    return (
        <div data-theme="light" className="flex flex-col items-center justify-center w-full min-h-screen ">
            <Head>
                <title>{titleHead}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Navbar />

            <main className="flex flex-col items-center justify-start flex-1 w-full mt-16">
                {children}
            </main>
        </div>
    )
}
