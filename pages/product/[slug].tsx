import React, { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/router';
import { AnnotationIcon } from '@heroicons/react/solid';
import { useRecoilState } from "recoil"
import { cartState } from "@atoms/cartState"
import { setCartState, CART_ADD_ITEM } from "@atoms/setStates/setCartState"

import BasescreenWrapper from '@components/Wrapper/BasescreenWrapper'
import BestsellerCard from '@components/cards/BestsellerCard'
import CommentaireCard from '@components/cards/CommentaireCard'
import BlurImage from '@components/ui-ux/BlurImage'
import InputNumber from '@components/ui-ux/inputs/InputNumber'
import Rating from "@components/ui-ux/Rating"

import { NextPage } from 'next/types';
import { TypeCartItem, TypeProduct, TypeCommentaire } from '@libs/typings';
import db from '@libs/database/dbConnect';
import Product from '@libs/models/Product';
import { replaceURL, teinteDeLimage } from '@libs/utils';
import Link from 'next/link';
import { useEscapeGallery } from '@libs/hooks';

type Props = {
    productFind: boolean
    initialProduct: TypeProduct
    sameProducts: TypeProduct[]
}

const ProductPage: NextPage<Props> = ({ productFind, initialProduct, sameProducts }) => {
    const router = useRouter()
    const [product, setProduct] = useState<TypeProduct>(initialProduct);
    const [commentaires, setCommentaires] = useState<TypeCommentaire[]>([]);
    const [quantity, setQuantity] = useState(1);
    const [cartItem, setCartItem] = useRecoilState(cartState)

    const [isOpenLightboxGallery, setIsOpenLightboxGallery] = useState<boolean>(false)
    const [lightboxGallery, setLightboxGallery] = useState<string[]>([product.main_image, ...product.images])
    const [color, setColor] = useState<string>("");



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
        setCommentaires([]);
        teinteDeLimage(replaceURL(initialProduct.main_image)).then((RGBcolor) => {
            setColor(RGBcolor)
        })
    }, [router.query]);

    useEffect(() => {
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



    useEscapeGallery(isOpenLightboxGallery, setIsOpenLightboxGallery)


    return (
        <BasescreenWrapper title={product.name} footer={true}>
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
                                <div className='block space-x-0 flex-shrink md:max-w-[25vw] md:min-w-[25vw] w-full p-3 sm:p-6 lg:p-9 h-full md:sticky top-16 bg-gray-100'>
                                    <div style={{ boxShadow: `0px 0px 20px 5px ${color}` }} className='relative object-cover w-full overflow-hidden rounded-lg aspect-square'>
                                        <BlurImage
                                            src={replaceURL(product.main_image)}
                                            className="cursor-pointer"
                                            onClick={() => setIsOpenLightboxGallery(true)}
                                        />
                                    </div>
                                    <div className='grid w-full grid-cols-4 gap-2 mt-2 lg:mt-4 lg:gap-4'>
                                        {
                                            [...product.images].slice(0, 4)?.map((img, key) => <div className='relative object-cover w-full overflow-hidden rounded-lg aspect-square'>
                                                <BlurImage
                                                    key={key}
                                                    src={replaceURL(img)}
                                                    className="cursor-pointer"
                                                    onClick={() => setIsOpenLightboxGallery(true)}
                                                />
                                                {
                                                    product.images.length > 4 && key === 3 && (
                                                        <div className="absolute inset-0 w-full cursor-pointer select-none avatar placeholder" onClick={() => setIsOpenLightboxGallery(true)}>
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
                                        <h1 className='text-3xl font-bold uppercase'>{product.name}</h1>
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
                                    <section className='w-full pt-8 mt-8 border-t-2 border-dashed'>
                                        <h2 className='text-xl font-bold uppercase'>Produits similaire</h2>
                                        <div className="grid grid-cols-1 mt-5 sm:grid-cols-2 lg:grid-cols-3 justify-items-between gap-x-6 gap-y-5">
                                            {
                                                sameProducts?.map((data, key) => <BestsellerCard product={data} key={key} />)
                                            }
                                        </div>
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
                                isOpenLightboxGallery && (
                                    <div
                                        className='fixed inset-0 z-50 w-screen h-screen p-8 overflow-hidden bg-black/20'
                                    >
                                        <div className='relative w-full h-full'>
                                            <BlurImage
                                                src={replaceURL(lightboxGallery[0])}
                                                objectFit="contain"
                                                className='object-contain group-hover:opacity-100'
                                            />
                                        </div>
                                    </div>
                                )
                            }
                        </>
                    )
            }
        </BasescreenWrapper>
    )
}

export const getServerSideProps = async ({ query }: any) => {
    try {
        const slug = query.slug || null;
        let product: any = {}
        let sameProducts: any = []

        if (slug) {

            await db.connect();
            product = await Product.findOne({ slug: slug, isPublished: true }).populate("categorie").lean();
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
        return {
            props: {
                productFind: false,
                initialProduct: {},
                sameProducts: []
            },
        }
    }
}

export default ProductPage