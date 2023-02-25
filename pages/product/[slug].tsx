import React, { useEffect, useState } from 'react'
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

import database from "@devasset/database.json"
import { NextPage } from 'next/types';
import { TypeCartItem, TypeProduct, TypeCommentaire } from '@libs/typings';
import db from '@libs/database/dbConnect';
import Product from '@libs/models/Product';
import { replaceURL } from '@libs/utils';

type Props = {
    initalProduct: TypeProduct
    sameProducts: TypeProduct[]
}

const ProductPage: NextPage<Props> = ({ initalProduct, sameProducts }) => {
    const router = useRouter()
    const [product, setProduct] = useState<TypeProduct>(initalProduct);
    const [quantity, setQuantity] = useState(1);
    const [cartItem, setCartItem] = useRecoilState(cartState)

    useEffect(() => {
        if (typeof product.subCategorie === "object") return;
        let x = {
            subCategorie: {
                _id: initalProduct.subCategorie,
                name: '',
                slug: ''
            }
        }
        x.subCategorie = [...initalProduct.categorie.subCategories].filter(sc => sc._id === initalProduct.subCategorie)[0]
        setProduct(prev => Object.assign(prev, x))
    }, [])

    const addItemsToCart = () => {
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

    const [commentaires, setCommentaires] = useState<TypeCommentaire[]>([]);

    const getCommentaires = async () => {
        try {
            const searchResults = await fetch('/api/commentaires')
                .then((res) => res.json())
                .catch((err) => [])
            setCommentaires(prev => [...prev, ...searchResults])
        } catch {
            setCommentaires([])
        }
    }

    //useEffect(() => { getCommentaires(); }, []);
    useEffect(() => {
        setCommentaires([]);
        getCommentaires()
    }, [router.query]);


    return (
        <BasescreenWrapper title={product.name} footer={true}>
            <div className='flex flex-col md:flex-row w-full min-h-[calc(100vh-64px)] relative bg-gray-100 '>
                { /* left */}
                <div className='flex flex-row md:block md:space-x-0 space-x-4 md:flex-shrink md:max-w-[25vw] md:min-w-[25vw] w-full p-3 sm:p-6 md:p-9 lg:p-12 h-full md:sticky top-16 bg-gray-100'>
                    <div className='relative object-cover w-full overflow-hidden rounded-lg aspect-square max-w-[30vw]'>
                        <BlurImage
                            src={replaceURL(product.main_image)}
                        />
                    </div>
                    <div className='grid w-full grid-cols-2 gap-4 md:mt-4 xl:grid-cols-4'>
                        {
                            product.images?.map((img, key) => <div className='relative object-cover w-full overflow-hidden rounded-lg aspect-square'>
                                <BlurImage
                                    key={key}
                                    src={replaceURL(img)}
                                />
                            </div>)
                        }
                    </div>
                </div>

                { /* right */}
                <div className='flex-grow min-h-full px-5 py-12 bg-white shadow-lg md:px-10 lg:px-20'>

                    { /* Product info */}
                    <section>
                        <p>{product?.categorie?.name} &gt; {product.subCategorie.name}</p>
                        <h1 className='text-3xl font-bold uppercase'>{product.name}</h1>
                        <div className='flex items-center justify-start mt-5 space-x-2'>
                            <Rating rating={product.rating === 0 ? 5 : product.rating} />
                            <p className='space-x-1'>
                                <span>{product.reviews}</span>
                                <span>{product.reviews <= 1 ? "commentaire" : "commentaires"}</span>
                            </p>
                        </div>

                        <p className='mt-5 text-gray-600'>{product.description}</p>

                        <div className='mt-5 space-x-1'>
                            <span className='text-2xl font-bold'>{product.price}€</span>
                            <span className='text-xl'>/</span>
                            <span className='text-xl'>{product.price_in}</span>
                        </div>

                        <div className="flex flex-row items-center justify-start mt-2 space-x-5">
                            <p>Sélectionnez la quantité :</p>
                            <InputNumber
                                min={1}
                                max={product.countInStock}
                                defaultValue={1}
                                setUpdate={setQuantity}
                            />
                        </div>

                        <button
                            onClick={addItemsToCart}
                            className='px-8 py-4 mt-5 text-white uppercase bg-black button-click-effect'
                        >Ajouter au panier</button>
                    </section>

                    { /* Product associate */}
                    <section className='w-full pt-8 mt-8 border-t-2 border-dashed'>
                        <h2 className='text-xl font-bold uppercase'>Produits similaire</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-between gap-x-6 gap-y-5">
                            {
                                [...sameProducts, ...sameProducts]?.map((data, key) => <BestsellerCard product={data} key={key} />)
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
        </BasescreenWrapper>
    )
}

export const getServerSideProps = async ({ query }: any) => {

    const slug = query.slug || null;

    await db.connect();
    let product = await Product.findOne({ slug }).populate("categorie").lean();
    await db.disconnect()

    return {
        props: {
            initalProduct: JSON.parse(JSON.stringify(product)),
            sameProducts: database.products
        },
    }
}

export default ProductPage