import React from 'react'
import Head from 'next/head'
import Navbar from "@components/navbar"
import Footer from "@components/footer"
interface Props {
    title?: string;
    placeholderSearch?: string;
    footer?: boolean;
    children: React.ReactNode;
}

export default function BasescreenWrapper({ title, placeholderSearch, footer = true, children }: Props) {

    const titleHead = title ? `${title} - Spaceate` : "Spaceate"

    const needFooter = footer === false ? false : true

    return (
        <div data-theme="light" className="flex flex-col items-center justify-center w-full min-h-screen ">
            <Head>
                <title>{titleHead}</title>
                <link rel="icon" href="/favicon.ico" />
                <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/Swiper/3.3.1/js/swiper.min.js"></script>
            </Head>

            <Navbar placeholderSearch={placeholderSearch} />

            <main className="flex flex-col items-center justify-start flex-1 w-full mt-16">
                {children}
            </main>

            {
                needFooter && <Footer />
            }
        </div>
    )
}
