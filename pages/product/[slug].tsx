import React, { useEffect, useState, useMemo, useRef } from 'react'
import { NextPage } from 'next/types';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AnnotationIcon } from '@heroicons/react/solid';
import { useRecoilState } from "recoil"
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Keyboard } from "swiper";
import "swiper/css";
import "swiper/css/navigation";

import { cartState } from "@atoms/cartState"
import { setCartState, CART_ADD_ITEM } from "@atoms/setStates/setCartState"
import { TypeCartItem, TypeProduct, TypeCommentaire, TypeUser } from '@libs/typings';
import db from '@libs/database/dbConnect';
import Product from '@libs/models/Product';
import { replaceURL, teinteDeLimage } from '@libs/utils';
import { useClickOutside, useEscapeGallery, useEscapeListener, useSwipeAndDoubleTap } from '@libs/hooks';

import BasescreenWrapper from '@components/Wrapper/BasescreenWrapper'
import CommentaireCard from '@components/cards/CommentaireCard'
import BlurImage from '@components/ui-ux/BlurImage'
import InputNumber from '@components/ui-ux/inputs/InputNumber'
import CarouselProduct from '@components/ui-ux/Carousel/CarouselProduct';
import Rating from "@components/ui-ux/Rating"
import { getSession, useSession } from 'next-auth/react';


type Props = {
    productFind: boolean
    initialProduct: TypeProduct
    sameProducts: TypeProduct[]
}

const ProductPage: NextPage<Props> = ({ productFind, initialProduct, sameProducts }) => {
    const router = useRouter();

    const { data: session } = useSession();
    const user: TypeUser | null = session?.user ?? null;
    const seeMenuRef = useRef(null);
    const [seeMenu, setSeeMenu] = useState<boolean>(false);

    const [product, setProduct] = useState<TypeProduct>(initialProduct);
    const [commentaires, setCommentaires] = useState<TypeCommentaire[]>([]);
    const [quantity, setQuantity] = useState(1);
    const [cartItem, setCartItem] = useRecoilState(cartState)
    const [color, setColor] = useState<string>("");

    const refGallery = useRef(null);
    const [Gallery, setGallery] = useState<string[]>([
        product.main_image,
        ...(product?.images || [])
    ])
    const [isOpenGallery, setIsOpenGallery] = useState<boolean>(false)



    const isOutOfStock = useMemo(() => product.countInStock <= 0, [product]);


    const addItemsToCart = () => {
        if (isOutOfStock) {
            return alert('le produit est en rupture de stock');
        }

        let newProductCart: TypeCartItem = {
            ...product,
            quantity: quantity
        }

        setCartState({
            action: CART_ADD_ITEM,
            product: newProductCart,
            cartItem: cartItem,
            setCartItem: setCartItem
        })

        router.push('/cart')
    }

    const getCommentaires = async () => {
        console.log('> getCommentaires')
        try {
            const searchResults = await fetch(`/api/product/${product._id}/commentaires`)
                .then((res) => res.json())
                .catch((err) => [])
            setCommentaires(prev => [...prev, ...searchResults])
        } catch {
            setCommentaires([])
        }
    }

    // update change product
    useEffect(() => {
        setProduct(initialProduct);
        setQuantity(1);
        setGallery([
            initialProduct.main_image,
            ...(initialProduct?.images || [])
        ])
        setCommentaires([]);
        teinteDeLimage(replaceURL(initialProduct.main_image)).then((RGBcolor) => {
            setColor(RGBcolor)
        })

        if (!productFind) return;
        if (typeof initialProduct.subCategorie === "object") return;
        let x = {
            subCategorie: {
                _id: initialProduct.subCategorie,
                name: '',
                slug: ''
            }
        }
        x.subCategorie = [...initialProduct.categorie.subCategories].filter(sc => sc._id === initialProduct.subCategorie)[0]
        setProduct(prev => Object.assign(prev, x))
    }, [router.query])


    // Gallery
    const closeGallery = () => setIsOpenGallery(false)
    useEscapeGallery(isOpenGallery, setIsOpenGallery)
    useClickOutside(refGallery, closeGallery)
    useSwipeAndDoubleTap(setIsOpenGallery);

    // Admin menu
    useEscapeListener(seeMenuRef, () => setSeeMenu(false))


    return (
        <BasescreenWrapper title={product.name} footer>
            {
                productFind === false
                    ? (
                        <>
                            <h1>Le produit est introuvable</h1>
                            <Link href="/">Back to home</Link>
                        </>
                    )
                    : (
                        <>
                            <div className='flex flex-col md:flex-row w-full min-h-[calc(100vh-64px)] relative bg-gray-100 '>
                                { /* left */}
                                <div className='block space-x-0 flex-shrink md:max-w-[25vw] md:min-w-[25vw] w-full p-3 sm:p-6 lg:p-9 h-full md:sticky bg-gray-100'>
                                    <div style={{ boxShadow: `0px 0px 20px 5px ${color}` }} className='relative object-cover w-full overflow-hidden rounded-lg aspect-square'>
                                        <BlurImage
                                            src={replaceURL(product.main_image)}
                                            className="cursor-pointer"
                                            onClick={() => {
                                                setIsOpenGallery(true);
                                            }}
                                        />
                                    </div>
                                    <div className='grid w-full grid-cols-4 gap-2 mt-2 lg:mt-4 lg:gap-4'>
                                        {
                                            [...(product.images || [])].slice(0, 4)?.map((img, key) => <div className='relative object-cover w-full overflow-hidden rounded-lg aspect-square'>
                                                <BlurImage
                                                    key={key}
                                                    src={replaceURL(img)}
                                                    className="cursor-pointer"
                                                    onClick={() => {
                                                        setIsOpenGallery(true);
                                                    }}
                                                />
                                                {
                                                    product.images.length > 4 && key === 3 && (
                                                        <div className="absolute inset-0 w-full cursor-pointer select-none avatar placeholder"
                                                            onClick={() => {
                                                                setIsOpenGallery(true);
                                                            }}>
                                                            <div className="w-full bg-neutral-focus/30 text-neutral-content">
                                                                <span>+{product.images.length - 4}</span>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            </div>)
                                        }

                                    </div>
                                </div>

                                { /* right */}
                                <div className='flex-grow min-h-full px-5 py-12 bg-white shadow-lg md:px-10 lg:px-20'>

                                    { /* Product info */}
                                    <section>
                                        <p>Accueil &gt; {product?.categorie?.name} &gt; {product?.subCategorie?.name}</p>
                                        <div className='flex items-center justify-between'>
                                            <h1 className='mt-5 text-3xl font-bold uppercase'>{product.name}</h1>
                                            {
                                                user && user.isAdmin && (
                                                    <div className="relative pr-8">
                                                        <div className={`absolute left-0 z-10 w-32 mt-8 -ml-24 shadow-md dropdown-content ${!seeMenu && 'hidden'}`}>
                                                            <ul className="py-1 bg-white rounded shadow ">
                                                                <Link href={`/admin/products/edit?slug=${product.slug}`}>
                                                                    <li className="px-3 py-3 text-sm font-normal leading-3 tracking-normal text-gray-600 cursor-pointer hover:bg-indigo-700 hover:text-white">Modifier</li>
                                                                </Link>
                                                            </ul>
                                                        </div>
                                                        <button className="text-gray-500 border border-transparent rounded cursor-pointer focus:outline-none" ref={seeMenuRef}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" onClick={() => setSeeMenu(prev => !prev)} className="icon icon-tabler icon-tabler-dots-vertical dropbtn" width={28} height={28} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                                <path stroke="none" d="M0 0h24v24H0z" />
                                                                <circle cx={12} cy={12} r={1} />
                                                                <circle cx={12} cy={19} r={1} />
                                                                <circle cx={12} cy={5} r={1} />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                )
                                            }
                                        </div>
                                        <div className='flex items-center justify-start mt-5 space-x-2'>
                                            <Rating rating={product.rating === 0 ? 5 : product.rating} />
                                            <p className='space-x-1'>
                                                <span>{product.numReviews}</span>
                                                <span>{product.numReviews <= 1 ? "commentaire" : "commentaires"}</span>
                                            </p>
                                        </div>

                                        <p className='mt-5 text-gray-600'>{product.description}</p>

                                        <div className='mt-5 space-x-1'>
                                            <span className='text-2xl font-bold'>{product.price}€</span>
                                            <span className='text-xl'>/</span>
                                            <span className='text-xl'>{product.price_in}</span>
                                        </div>

                                        {
                                            !isOutOfStock && (
                                                <div className="flex flex-row items-center justify-start mt-2 space-x-5">
                                                    <p>Sélectionnez la quantité :</p>
                                                    <InputNumber
                                                        min={1}
                                                        max={product.countInStock}
                                                        defaultValue={1}
                                                        setUpdate={setQuantity}
                                                    />
                                                </div>
                                            )
                                        }


                                        <button
                                            onClick={addItemsToCart}
                                            disabled={isOutOfStock}
                                            className='px-8 py-4 mt-5 text-white uppercase bg-black button-click-effect'
                                        >
                                            {
                                                isOutOfStock ? "Rupture de stock" : "Ajouter au panier"
                                            }
                                        </button>
                                    </section>

                                    { /* Product associate */}
                                    <section className='max-w-[1260px] pt-8 mt-8 border-t-2 border-dashed'>
                                        <h2 className='mb-5 text-xl font-bold uppercase'>Produits similaire</h2>
                                        {
                                            sameProducts && <CarouselProduct overflow="hidden" products={sameProducts} />
                                        }
                                    </section>

                                    { /* Commentaire section */}
                                    <section className='w-full pt-8 mt-8 border-t-2 border-dashed'>
                                        <h3 className='flex text-xl font-bold'><AnnotationIcon className='w-5 mr-2' /> 2 commentaires</h3>
                                        { /* Commentaires container */}
                                        <div className='grid grid-cols-1 space-x-3 lg:grid-cols-2'>
                                            { /* Commentaires */}
                                            {
                                                commentaires?.map((item, key) => <CommentaireCard
                                                    key={key}
                                                    img={item.img}
                                                    name={item.name}
                                                    rating={item.rating}
                                                    description={item.description}
                                                    date={item.date}
                                                />)
                                            }
                                        </div>

                                        <button
                                            className='block px-4 py-4 mx-auto mt-5 border rounded-full button-click-effect'
                                            onClick={getCommentaires}
                                        >Afficher plus de commentaires</button>

                                    </section>

                                </div>
                            </div>

                            {
                                isOpenGallery === true && (
                                    <div
                                        className="fixed inset-0 z-50 px-4 py-16 overflow-hidden md:px-8 bg-black/20"
                                        onDoubleClick={closeGallery}
                                    >
                                        <Swiper
                                            slidesPerView={1}
                                            spaceBetween={30}
                                            loop={true}
                                            keyboard={{
                                                enabled: true,
                                            }}
                                            navigation={true}
                                            modules={[Navigation, Keyboard]}
                                            className="cursor-pointer"
                                            ref={refGallery}
                                        >
                                            {
                                                Gallery.map(img => (
                                                    <SwiperSlide key={img}>
                                                        <div className='relative flex h-full'>
                                                            <BlurImage
                                                                src={replaceURL(img)}
                                                                objectFit="contain"
                                                                hoverOpacity={false}
                                                                className='opacity-100 group-hover:opacity-100 active:cursor-grab'
                                                            />
                                                        </div>
                                                    </SwiperSlide>
                                                ))
                                            }
                                        </Swiper>
                                    </div>
                                )
                            }
                        </>
                    )
            }
        </BasescreenWrapper >
    )
}

export const getServerSideProps = async (context: any) => {

    const defaultReturn = {
        props: {
            productFind: false,
            initialProduct: {},
            sameProducts: []
        },
    }
    try {
        const { query } = context;
        const slug = query.slug || null;
        let product: any = {}
        let sameProducts: any = []

        if (slug) {

            const { user } = await getSession(context);

            const querySearch = user && user.isAdmin
                ? { slug: slug }
                : { slug: slug, isPublished: true }

            console.log(querySearch)
            await db.connect();
            product = await Product.findOne(querySearch).populate("categorie").lean();
            const find = product ? true : false
            if (find) {
                sameProducts = await Product.find({
                    _id: { $ne: product._id },
                    isPublished: true,

                    $or: [
                        { categorie: product.categorie._id, isPublished: true },
                        { subCategorie: product.subCategorie, isPublished: true, },
                    ]
                }, {
                    _id: 1,
                    main_image: 1,
                    name: 1,
                    slug: 1,
                    price: 1,
                    price_in: 1,
                    rating: 1,
                    countInStock: 1,
                    numReviews: 1
                })
            }
            await db.disconnect()
        }

        return {
            props: {
                productFind: product ? true : false,
                initialProduct: JSON.parse(JSON.stringify(product)) || {},
                sameProducts: JSON.parse(JSON.stringify(sameProducts)) || []
            },
        }

    } catch (error) {
        return defaultReturn;
    }
}

export default ProductPage