import React from 'react'
import Head from 'next/head'
import Navbar from "@components/navbar"

function AdminscreenWrapper({ title, children }) {

    const titleHead = title ? `${title} - Spaceate` : "Spaceate"

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

AdminscreenWrapper.auth = { adminOnly: true };
export default AdminscreenWrapper