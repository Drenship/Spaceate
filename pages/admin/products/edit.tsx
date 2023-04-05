import React, { useMemo, useState, useEffect } from 'react';
import { NextPage } from 'next/types';
import axios from 'axios';
import Link from 'next/link';

import { TypeCategorie, TypeProduct, FileInfo } from '@libs/typings';
import db from '@libs/database/dbConnect';
import Product from '@libs/models/Product';
import Categorie from '@libs/models/Categorie';
import { fixedPriceToCurrency, textToSLug } from '@libs/utils';

import AdminscreenWrapper from '@components/Wrapper/AdminscreenWrapper'
import InputText from '@components/ui-ux/inputs/InputText';
import InputSelect from '@components/ui-ux/inputs/InputSelect';
import InputFiles from '@components/ui-ux/inputs/InputFiles';
import InputTextarea from '@components/ui-ux/inputs/InputTextarea';
import { InputNumber } from '@components/ui-ux/inputs/InputNumber';
import InputCheckbox from '@components/ui-ux/inputs/InputCheckbox';

import { useNotifys } from '@libs/hooks/notify';
import { fetchPostJSON, fetchPutJSON } from '@libs/utils/api-helpers';
import { uploadFile } from '@libs/firebase/storage';

type Props = {
    slug: string | null
    productFind: boolean,
    categories: TypeCategorie[]
    initialProduct: TypeProduct
}

const AdminEditProduct: NextPage<Props> = ({ slug, productFind, initialProduct, categories }) => {

    const [product, setProduct] = useState<TypeProduct>(initialProduct);
    const [currentCategorie, setCurrentCategorie] = useState<TypeCategorie>(productFind ? initialProduct.categorie : categories[0]);
    const [currentSubCategorie, setCurrentSubCategorie] = useState<TypeCategorie>();
    const [mainImage, setMainImage] = useState<string | null>(productFind ? initialProduct.main_image : null);
    const [images, setImages] = useState<string[] | null>(productFind ? initialProduct.images : null);

    const { pushNotify } = useNotifys();


    const onChangeUploadHandler = async (files: FileList, callback: any) => {
        Array.from(files).forEach(async (file) => {
            if (file == null) return;
            const result = await uploadFile({
                file: file,
                path: "products"
            })
            if (!result) return;
            callback(result)
        })

    };

    const handleSubmitProduct = async (e: React.BaseSyntheticEvent) => {
        e.preventDefault();
        try {
            const data: any = new FormData(e.target)
            const formDataObject: any = {};
            for (const [key, value] of data.entries()) {
                formDataObject[key] = value;
            }
            formDataObject.description = formDataObject.description.replace(/\r\n|\r|\n/g, '<br>');
            formDataObject.main_image = mainImage;
            formDataObject.images = images

            formDataObject.marge = Number(formDataObject.marge)
            formDataObject.isFeatured = formDataObject.isFeatured === "on" ? true : false
            formDataObject.isPublished = formDataObject.isPublished === "on" ? true : false

            if (productFind === true) {
                console.log(formDataObject)
                // edit product
                const response = await fetchPutJSON(`/api/admin/products/${product._id}`, formDataObject)

                if (response?.data) {
                    setProduct(response.data)
                }

                pushNotify({
                    title: "",
                    subTitle: response?.message || "Une erreur s'est produite.",
                    icon: "NOTIFICATION",
                    duration: 3
                })

            } else {
                // create product
                const response = await fetchPostJSON("/api/admin/products", formDataObject)

                if (response?.data) {
                    setProduct(response.data)
                }

                pushNotify({
                    title: "",
                    subTitle: response?.message || "Une erreur s'est produite.",
                    icon: "NOTIFICATION",
                    duration: 3
                })
            }


        } catch (error) {
            console.log(error);
            throw new Error('Error sending form');
        }
    }

    const [automatiqueSlug, setAutomatiqueSlug] = useState<string>("");



    const [price, setPrice] = useState<number | null>(initialProduct ? initialProduct.price : null);
    const [buyPrice, setBuyPrice] = useState<number | null>(initialProduct ? initialProduct.advancePrice.initialCost : null);
    const [tvaRate, setTvaRate] = useState<number | null>(initialProduct ? initialProduct.advancePrice.tva : null);
    const [stock, setStock] = useState<number>(initialProduct ? initialProduct.countInStock : 0);

    const [marge, prixHT, tva] = useMemo(() => {

        let xPrice: number = price
            ? price
            : product
                ? product.price
                : 0;
        let xBuyPrice: number = buyPrice
            ? buyPrice
            : product
                ? product.advancePrice.initialCost
                : 0;
        let xTva: number = tvaRate
            ? tvaRate
            : product
                ? product.advancePrice.tva
                : 0;


        const marge: number = Number((xPrice - xBuyPrice).toFixed(2));
        const prixHT: number = Number((xPrice / (1 + (xTva / 100))).toFixed(2));
        const tva: number = Number((xPrice - prixHT).toFixed(2));


        return [marge, prixHT, tva]
    }, [price, buyPrice, tvaRate, product]);


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
        setCurrentSubCategorie(x.subCategorie)
        setProduct(prev => Object.assign(prev, x))
    }, [initialProduct])

    return (
        <AdminscreenWrapper title={`${product ? product?.name + ' - ' : ""} Edit product`}>
            <form onSubmit={handleSubmitProduct}>
                <div className="px-2 mt-10 md:px-7">
                    <p className="text-xl font-semibold leading-tight text-gray-800">Produit Details: {slug && <span className='underline uppercase'>{slug}</span>}</p>
                    <div className="grid w-full grid-cols-1 lg:grid-cols-2 md:grid-cols-1 gap-7 mt-7">
                        <div className='grid w-full grid-cols-1 col-span-full lg:grid-cols-2 md:grid-cols-1 gap-7 mt-7'>
                            <div className='space-y-5'>
                                <InputFiles
                                    multiple={false}
                                    input={{
                                        name: "main_image",
                                        values: product?.main_image ? [product?.main_image] : [],
                                        imageClass: "col-span-full w-full sm:mx-auto sm:max-w-[350px] object-cover rounded-lg aspect-square"
                                    }}
                                    onChange={(file: any) => onChangeUploadHandler(file, (next: string) => setMainImage(next))}
                                    setRemoveItem={() => setMainImage(null)}
                                />
                            </div>

                            <div className='space-y-5'>
                                <InputText
                                    title="Nom"
                                    description="Nom du produit"
                                    input={{
                                        name: "name",
                                        defaultValue: product?.name || "",
                                        placeholder: "entrer un nom ...",
                                    }}
                                    onChange={(e: React.BaseSyntheticEvent) => setAutomatiqueSlug(textToSLug(e.target.value))}
                                />

                                <InputText
                                    title="Slug"
                                    description="Slug du produit"
                                    input={{
                                        name: "slug",
                                        defaultValue: automatiqueSlug || product?.slug || "",
                                        forceValue: automatiqueSlug || product?.slug,
                                        placeholder: "entrer un slug ...",
                                    }}
                                />

                                <InputSelect
                                    title="Catégorie"
                                    description="Choisire une catégorie"
                                    input={{
                                        name: 'categorie',
                                        defaultValue: currentCategorie || categories[0],
                                    }}
                                    options={categories}
                                    setChange={(c: any) => setCurrentCategorie(c)}
                                />

                                <InputSelect
                                    title="Sous catégorie"
                                    description="Choisire une sous catégorie"
                                    input={{
                                        name: 'subCategorie',
                                        defaultValue: currentSubCategorie || currentCategorie.subCategories[0],
                                    }}
                                    options={currentCategorie.subCategories}
                                />
                            </div>

                        </div>

                        <InputTextarea
                            title="Description"
                            description="Description du produit"
                            input={{
                                name: "description",
                                defaultValue: product?.description.replace(/<br>/g, '\n') || "",
                                placeholder: "entrer une description ...",
                            }}
                        />

                        <div className='col-span-full'>
                            <InputFiles
                                multiple={true}
                                input={{
                                    name: "images",
                                    values: product?.images || [],
                                    imageClass: "mx-auto w-full md:max-w-[280px] object-cover rounded-lg aspect-square shadow-lg"
                                }}
                                onChange={(files: any) => onChangeUploadHandler(files, (next: string) => {
                                    if (images !== null) {
                                        setImages(prev => [...prev, next])
                                    } else {
                                        setImages([next])
                                    }
                                })}
                                setRemoveItem={(imageUrl) => setImages(prevImages => prevImages ? prevImages.filter(image => image !== imageUrl) : null)}
                            />
                        </div>
                    </div>

                    <p className="block mt-10 text-xl font-semibold leading-tight text-gray-800">Prix et stock</p>
                    <div className="grid w-full grid-cols-1 lg:grid-cols-2 md:grid-cols-1 gap-7 mt-7 ">
                        <InputNumber
                            title="Prix"
                            description="Prix du produit"
                            input={{
                                name: "price",
                                defaultValue: product?.price || 0,
                                min: 0,
                                max: "",
                                step: 0.01,
                                placeholder: "entrer un prix ...",
                            }}
                            onChange={(e: React.BaseSyntheticEvent) => setPrice(e.target.value)}
                        />

                        <InputSelect
                            title="Prix en quantité"
                            description="Prix (g, kg, unité)"
                            input={{
                                name: 'price_in',
                                defaultValue: { name: product?.price_in || 'Kg' },
                            }}
                            options={[{ name: 'g' }, { name: 'Kg' }, { name: 'Unité' }]}
                        />

                        <InputNumber
                            title="Quantité en stock"
                            description="Quantité du produit disponible"
                            input={{
                                name: "countInStock",
                                defaultValue: product?.countInStock || 0,
                                min: 0,
                                max: "",
                                step: 1,
                                placeholder: "entrer votre stock ...",
                            }}
                            onChange={(e: React.BaseSyntheticEvent) => setStock(e.target.value)}
                        />
                    </div>

                    <p className="block mt-10 text-xl font-semibold leading-tight text-gray-800">Details avancer du prix</p>
                    <div className="grid w-full grid-cols-1 lg:grid-cols-2 md:grid-cols-1 gap-7 mt-7 ">
                        <InputNumber
                            title="Prix d'achat du produit"
                            description="Prix d'achat"
                            input={{
                                name: "initialCost",
                                defaultValue: product?.advancePrice?.initialCost || 0,
                                min: 0,
                                max: "",
                                step: 0.01,
                                placeholder: "entrer le prix d'achat ...",
                            }}
                            onChange={(e: React.BaseSyntheticEvent) => setBuyPrice(e.target.value)}
                        />

                        <InputNumber
                            title="Marge du produit"
                            description="Marge sur le produit"
                            input={{
                                name: "marge",
                                defaultValue: product?.advancePrice?.marge || 0,
                                forceValue: marge,
                                min: 0,
                                max: "",
                                step: 0.01,
                                placeholder: "entrer la marge ...",
                            }}
                        />

                        <InputSelect
                            title="Tva applicable"
                            description="5,5% pour l'alimentaire"
                            input={{
                                name: 'tva',
                                defaultValue: { name: product?.advancePrice?.tva.toString() || '5.5' },
                            }}
                            options={[{ name: '5.5' }, { name: '10' }, { name: '20' }]}
                            setChange={(value) => setTvaRate(Number(value.name))}
                        />

                        <InputNumber
                            title="Tva du produit €"
                            description="Marge sur le produit"
                            input={{
                                name: "marge",
                                defaultValue: product?.advancePrice?.tva || 0,
                                forceValue: tva,
                                min: 0,
                                max: "",
                                step: 0.01,
                                placeholder: "entrer la marge ...",
                            }}
                        />

                        {
                            price && buyPrice && marge && tva && (
                                <div className='col-span-full'>
                                    <div className='grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 mt-7 '>
                                        <div className='space-y-2'>
                                            <h4 className='font-bold'>Details du prix:</h4>
                                            <div className='flex items-center justify-between w-full md:max-w-sm'>
                                                <span>Prix achat:</span>
                                                <span>{fixedPriceToCurrency(buyPrice)}</span>
                                            </div>
                                            <div className='flex items-center justify-between w-full md:max-w-sm'>
                                                <span>Marge:</span>
                                                <span>{fixedPriceToCurrency(marge)}</span>
                                            </div>
                                            <div className='flex items-center justify-between w-full md:max-w-sm'>
                                                <span>Prix ht:</span>
                                                <span>{fixedPriceToCurrency(prixHT)}</span>
                                            </div>
                                            <div className='flex items-center justify-between w-full md:max-w-sm'>
                                                <span>TVA ({tvaRate}%):</span>
                                                <span>{fixedPriceToCurrency(tva)}</span>
                                            </div>
                                            <div className='flex items-center justify-between w-full md:max-w-sm'>
                                                <span>Prix TTC:</span>
                                                <span>{fixedPriceToCurrency(price)}</span>
                                            </div>
                                        </div>

                                        <div className='space-y-2'>
                                            <h4 className='font-bold'>Perspective de gains:</h4>
                                            <div className='flex items-center justify-between w-full md:max-w-sm'>
                                                <span>Stock disponible:</span>
                                                <span>{stock}</span>
                                            </div>
                                            <div className='flex items-center justify-between w-full md:max-w-sm'>
                                                <span>Prix achat total:</span>
                                                <span>{fixedPriceToCurrency(stock * buyPrice)}</span>
                                            </div>
                                            <div className='flex items-center justify-between w-full md:max-w-sm'>
                                                <span>Marge total:</span>
                                                <span>{fixedPriceToCurrency(stock * marge)}</span>
                                            </div>
                                            <div className='flex items-center justify-between w-full md:max-w-sm'>
                                                <span>TVA total:</span>
                                                <span>{fixedPriceToCurrency(stock * tva)}</span>
                                            </div>
                                            <div className='flex items-center justify-between w-full md:max-w-sm'>
                                                <span>Bénéfice net estimer:</span>
                                                <span>{fixedPriceToCurrency((stock * marge) - (stock * tva))}</span>
                                            </div>
                                        </div>
                                        {product && product?.slug && (
                                            <div className='space-y-2'>
                                                <h4 className='font-bold'>Gains réaliser:</h4>
                                                <div className='flex items-center justify-between w-full md:max-w-sm'>
                                                    <span>Totals vendu</span>
                                                    <span>{product.stats.totalSelled}</span>
                                                </div>
                                                <div className='flex items-center justify-between w-full md:max-w-sm'>
                                                    <span>Prix achat total:</span>
                                                    <span>{fixedPriceToCurrency(product.stats.totalSelled * buyPrice)}</span>
                                                </div>
                                                <div className='flex items-center justify-between w-full md:max-w-sm'>
                                                    <span>Marge total:</span>
                                                    <span>{fixedPriceToCurrency(product.stats.totalSelled * marge)}</span>
                                                </div>
                                                <div className='flex items-center justify-between w-full md:max-w-sm'>
                                                    <span>TVA total:</span>
                                                    <span>{fixedPriceToCurrency(product.stats.totalSelled * tva)}</span>
                                                </div>
                                                <div className='flex items-center justify-between w-full md:max-w-sm'>
                                                    <span>Bénéfice net:</span>
                                                    <span>{fixedPriceToCurrency((product.stats.totalSelled * marge) - (product.stats.totalSelled * tva))}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        }

                        <div className='space-y-5 col-span-full'>
                            <InputCheckbox
                                title="Mise en avant du produit"
                                description="Cochez cette case pour mettre en avant le produit sur la page d'accueil ou sur d'autres sections de votre site web pour une meilleure visibilité."
                                input={{
                                    name: "isFeatured",
                                    checked: product?.isFeatured || false,
                                }}
                            />

                            <InputCheckbox
                                title="Publication du produit"
                                description="Cochez cette case pour publier le produit sur votre site web. Assurez-vous d'avoir terminé toutes les modifications et de l'avoir vérifié avant de le publier. Une fois publié, votre produit sera visible pour tous les utilisateurs."
                                input={{
                                    name: "isPublished",
                                    checked: product?.isPublished || false,
                                }}
                            />
                        </div>
                    </div>
                </div>
                <hr className="h-[1px] bg-gray-100 my-14" />
                <div className="flex flex-col flex-wrap items-center justify-center w-full px-7 lg:flex-row lg:justify-end md:justify-end gap-x-4 gap-y-4">

                    {product && product?.slug && (
                        <Link
                            href={`/product/${product.slug}`}
                            className="bg-white text-center border-green-700 rounded hover:bg-gray-50 transform duration-300 ease-in-out text-sm font-medium px-6 py-4 text-green-700 border lg:max-w-[95px] w-full"
                        >
                            Voire
                        </Link>
                    )}
                    <Link
                        href='/admin/products'
                        className="bg-white text-center border-indigo-700 rounded hover:bg-gray-50 transform duration-300 ease-in-out text-sm font-medium px-6 py-4 text-indigo-700 border lg:max-w-[95px] w-full"
                    >
                        Annuler
                    </Link>
                    <button
                        type='submit'
                        className="bg-indigo-700 rounded hover:bg-indigo-600 transform duration-300 ease-in-out text-sm font-medium px-6 py-4 text-white lg:max-w-[144px] w-full"
                    >
                        Mettre a jour
                    </button>
                </div>
            </form>
        </AdminscreenWrapper >
    );
}

export const getServerSideProps = async ({ query }: any) => {

    const slug = query.slug || null;
    let product = null

    try {
        await db.connect();
        const categories = await Categorie.find().lean();
        if (slug) {
            product = await Product.findOne({ slug }, { reviews: 0 }).populate('categorie').lean();
        }
        await db.disconnect()

        return {
            props: {
                slug: slug,
                productFind: product ? true : false,
                categories: db.convertDocToObj(categories),
                initialProduct: JSON.parse(JSON.stringify(product)),
            },
        }

    } catch (error) {
        return {
            props: {
                slug: slug,
                categories: [],
                initalProduct: {},
            },
        }
    }
}

AdminEditProduct.auth = { adminOnly: true };
export default AdminEditProduct