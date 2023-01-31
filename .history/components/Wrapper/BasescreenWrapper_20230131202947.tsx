import React, { ReactElement, ReactPortal } from 'react'
import Head from 'next/head'
import Navbar from "@components/navbar"
import Footer from "@components/footer"


type ReactText = string | number;
type ReactChild = ReactElement | ReactText;
interface ReactNodeArray extends Array<ReactNode> {}
type ReactFragment = {} | ReactNodeArray;
type ReactNode = ReactChild | ReactFragment | ReactPortal | boolean | null | undefined;


type Props = {
    title: String, 
    footer: Boolean, 
    children: ReactNode
}

export default function BasescreenWrapper({ title, footer, children } : Props) {

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

            {
                needFooter && <Footer />
            }


        </div>
    )
}
