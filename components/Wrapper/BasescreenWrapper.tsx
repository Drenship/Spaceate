import React from 'react'
import Head from 'next/head'
import Navbar from "@components/navbar"
import Footer from "@components/footer"
import { TypeProduct } from '@libs/typings';
import Link from 'next/link';
import { HomeIcon, MenuAlt1Icon } from '@heroicons/react/solid';
import { BsPersonFill } from 'react-icons/bs';

interface Props {
    title?: string;
    placeholderSearch?: string;
    footer?: boolean;
    children: React.ReactNode;

    meta: {
        description?: string;
        keywords?: string;
        url?: string;
        image?: string;
        twitterCardType?: 'summary' | 'summary_large_image' | 'app' | 'player';
        ogType?: 'website' | 'article' | 'video.movie' | 'book' | 'profile' | string;
        product?: TypeProduct
    }
}

BasescreenWrapper.defaultProps = {
    footer: true,
    meta: {
        description: "Découvrez notre sélection de fruits, légumes et fleurs de qualité pour votre jardin. Commandez en ligne et recevez vos produits frais directement chez vous.",
        keywords: "fruits, légumes, fleurs, e-commerce, jardin, jardinerie, boutique en ligne",
        url: "https://spaceate.vercel.app/",
        image: "https://spaceate.vercel.app/_next/image?url=%2Fuploads%2F824e34a2-ea15-4d9a-8c7f-e546c4677ec5.jpg&w=1920&q=75",
        twitterCardType: "summary_large_image",
        ogType: "website",
    }
}

export default function BasescreenWrapper({
    title, placeholderSearch, footer, children, meta
}: Props) {

    const titleHead = title ? `${title} - Spaceate` : "Spaceate"

    const needFooter = footer === false ? false : true

    return (
        <div data-theme="light" className="flex flex-col items-center justify-center w-full min-h-screen">
            <Head>
                <title>{titleHead}</title>

                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="theme-color" content="#ffffff" />
                <meta charSet="utf-8" />
                <link rel="icon" href="/favicons/favicon.ico" />
                <link rel="apple-touch-icon" href="/favicons/apple-touch-icon.png" />
                <link rel="manifest" href="/site.webmanifest" />

                <meta name="description" content={meta.description} />
                <meta name="keywords" content={meta.keywords} />

                {/* Open Graph */}
                <meta property="og:title" content={titleHead} />
                <meta property="og:description" content={meta.description} />
                <meta property="og:type" content={meta.ogType} />
                <meta property="og:url" content={meta.url} />
                <meta property="og:image" content={meta.image} />

                {/* Twitter Card */}
                <meta name="twitter:card" content={meta.twitterCardType} />
                <meta name="twitter:title" content={titleHead} />
                <meta name="twitter:description" content={meta.description} />
                <meta name="twitter:image" content={meta.image} />

                {
                    meta.product && (
                        <script
                            type="application/ld+json"
                            dangerouslySetInnerHTML={{
                                __html: JSON.stringify({
                                    '@context': 'https://schema.org',
                                    '@type': 'Product',
                                    productID: meta.product._id,
                                    name: title,
                                    description: meta.description,
                                    category: meta.product.categorie.name,
                                    image: meta.image,
                                    sku: meta.product.slug,
                                    releaseDate: meta.product.createdAt,
                                    offers: {
                                        '@type': 'Offer',
                                        availability: meta.product.countInStock > 0 ? "InStock" : "OutOfStock",
                                        priceCurrency: 'EUR',
                                        price: meta.product.price,
                                    },
                                }),
                            }}
                        />
                    )
                }

            </Head>

            <Navbar placeholderSearch={placeholderSearch} />

            <main className={`flex flex-col items-center justify-start flex-1 w-full mt-16 overflow-x-hidden ${!needFooter && " pb-16 sm:pb-0"} `}>
                {children}
            </main>

            {
                needFooter && <Footer />
            }


            <nav className='fixed bottom-0 z-50 flex items-center justify-between w-full h-16 bg-white border-t shadow-lg sm:hidden'>
                <Link className='flex items-center justify-center w-full h-full border-r' href={"/"}>
                    <HomeIcon className="w-5 h-5" />
                </Link>
                <Link className='flex items-center justify-center w-full h-full border-r' href={"/user"}>
                    <BsPersonFill className="w-5 h-5" />
                </Link>
                <Link className='flex items-center justify-center w-full h-full border-r' href={"/cart"}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </Link>
                <button className='flex items-center justify-center w-full h-full'>
                    <MenuAlt1Icon className="w-5 h-5" />
                </button>
            </nav>
        </div>
    )
}
