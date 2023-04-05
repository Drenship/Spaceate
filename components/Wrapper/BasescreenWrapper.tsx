import React from 'react'
import Head from 'next/head'
import Navbar from "@components/Navbar/Navbar"
import Footer from "@components/footer"
import { TypeProduct } from '@libs/typings';
import MobileNavbar from '@components/MobileNavbar';

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


            <MobileNavbar />
        </div>
    )
}
