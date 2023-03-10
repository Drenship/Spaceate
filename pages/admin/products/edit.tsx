import React, { useMemo, useState, useEffect } from 'react';
import { NextPage } from 'next/types';
import axios from 'axios';
import Link from 'next/link';

import { TypeCategorie, TypeProduct, FileInfo } from '@libs/typings';
import db from '@libs/database/dbConnect';
import Product from '@libs/models/Product';
import Categorie from '@libs/models/Categorie';
import { textToSLug } from '@libs/utils';

import AdminscreenWrapper from '@components/Wrapper/AdminscreenWrapper'
import InputText from '@components/ui-ux/inputs/InputText';
import InputSelect from '@components/ui-ux/inputs/InputSelect';
import InputFiles from '@components/ui-ux/inputs/InputFiles';
import InputTextarea from '@components/ui-ux/inputs/InputTextarea';
import { InputNumber } from '@components/ui-ux/inputs/InputNumber';
import InputCheckbox from '@components/ui-ux/inputs/InputCheckbox';

import PrintObject from '@components/PrintObject';
import { useNotifys } from '@libs/hooks/notify';
import { fetchPostJSON, fetchPutJSON } from '@libs/utils/api-helpers';

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
    const [mainImage, setMainImage] = useState<FileInfo[] | string | null>(productFind ? initialProduct.main_image : null);
    const [newMainImageURL, setNewMainImageURL] = useState<string | null>(null);
    const [images, setImages] = useState<FileInfo[] | string[] | null>(productFind ? initialProduct.images : null);

    const { pushNotify } = useNotifys();

    const onChangeUploadHandler = async (formData: FormData, callback: any) => {
        try {
            const config: any = {
                headers: { 'content-type': 'multipart/form-data' },
                onUploadProgress: (event: ProgressEvent) => {
                    console.log(`Current progress:`, Math.round((event.loaded * 100) / event.total));
                },
            };

            const response = await axios.post('/api/admin/uploader', formData, config);
            const { data: { files } } = response;

            console.log('response', files);
            callback(files);
        } catch (error) {
            console.log(error);
            throw new Error('Error uploading file');
        }
    };

    const handleSubmitProduct = async (e: React.BaseSyntheticEvent) => {
        e.preventDefault();
        try {
            const data: any = new FormData(e.target)
            const formDataObject: any = {};
            for (const [key, value] of data.entries()) {
                formDataObject[key] = value;
            }


            formDataObject.main_image = mainImage && mainImage[0] && mainImage[0]?.url
                ? mainImage[0].url : mainImage
                    ? mainImage : newMainImageURL
                        ? newMainImageURL : ""

            formDataObject.images = []
            if (images) {
                let imagesForm: string[] = []
                images.forEach((i: FileInfo) => imagesForm.push(i?.url ? i.url : i))
                formDataObject.images = imagesForm
            }

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

    const [newName, setNewName] = useState<string | null>(null);
    const automatiqueSlug = useMemo(() => {
        const text = newName || product?.name || ""
        const slug = textToSLug(text)
        console.log(slug)
        return slug
    }, [newName, product]);


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
                                        values: [product?.main_image],
                                        imageClass: "col-span-full mx-auto max-w-[350px] object-cover rounded-lg aspect-square"
                                    }}
                                    onChange={(formData: FormData) => onChangeUploadHandler(formData, setMainImage)}
                                />
                                <InputText
                                    title="Url de l'image"
                                    description="Lien de l'image"
                                    input={{
                                        name: "mainImageUrl",
                                        defaultValue: product?.main_image || "",
                                        placeholder: "entrer une url ...",
                                    }}
                                    onChange={(e: React.BaseSyntheticEvent) => setNewMainImageURL(e.target.value)}
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
                                    onChange={(e: React.BaseSyntheticEvent) => setNewName(e.target.value)}
                                />

                                <InputText
                                    title="Slug"
                                    description="Slug du produit"
                                    input={{
                                        name: "slug",
                                        defaultValue: automatiqueSlug || "",
                                        forceValue: automatiqueSlug,
                                        placeholder: "entrer un slug ...",
                                    }}
                                    onChange={() => { }}
                                />

                                <InputSelect
                                    title="Cat??gorie"
                                    description="Choisire une cat??gorie"
                                    input={{
                                        name: 'categorie',
                                        defaultValue: currentCategorie || categories[0],
                                    }}
                                    options={categories}
                                    setChange={(c: any) => setCurrentCategorie(c)}
                                />

                                <InputSelect
                                    title="Sous cat??gorie"
                                    description="Choisire une sous cat??gorie"
                                    input={{
                                        name: 'subCategorie',
                                        defaultValue: currentSubCategorie || currentCategorie.subCategories[0],
                                    }}
                                    options={currentCategorie.subCategories}
                                    setChange={() => { }}
                                />
                            </div>

                        </div>

                        <InputTextarea
                            title="Description"
                            description="Description du produit"
                            input={{
                                name: "description",
                                defaultValue: product?.description || "",
                                placeholder: "entrer une description ...",
                            }}
                            onChange={() => { }}
                        />

                        <div className='col-span-full'>
                            <InputFiles
                                multiple={true}
                                input={{
                                    name: "images",
                                    values: product?.images || [],
                                    imageClass: "mx-auto max-w-[280px] object-cover rounded-lg aspect-square"
                                }}
                                onChange={(formData: FormData) => onChangeUploadHandler(formData, (next: FileInfo[]) => {
                                    if (images !== null) {
                                        setImages([...images, ...next])
                                    } else {
                                        setImages(next)
                                    }
                                })}
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
                            onChange={() => { }}
                        />

                        <InputSelect
                            title="Prix en quantit??"
                            description="Prix (g, kg, unit??)"
                            input={{
                                name: 'price_in',
                                defaultValue: { name: product?.price_in || 'Kg' },
                            }}
                            options={[{ name: 'g' }, { name: 'Kg' }, { name: 'Unit??' }]}
                            setChange={() => { }}
                        />

                        <InputNumber
                            title="Quantit?? en stock"
                            description="Quantit?? du produit disponible"
                            input={{
                                name: "countInStock",
                                defaultValue: product?.countInStock || 0,
                                min: 0,
                                max: "",
                                step: 1,
                                placeholder: "entrer votre stock ...",
                            }}
                            onChange={() => { }}
                        />

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
                            onChange={() => { }}
                        />

                        <InputSelect
                            title="Tva produit"
                            description="5,5% pour l'alimentaire"
                            input={{
                                name: 'tva',
                                defaultValue: { name: product?.advancePrice?.marge.toString() || '5.5' },
                            }}
                            options={[{ name: '0' }, { name: '5.5' }, { name: '10' }, { name: '20' }]}
                            setChange={() => { }}
                        />

                        <InputNumber
                            title="Marge du produit"
                            description="Marge sur le produit"
                            input={{
                                name: "marge",
                                defaultValue: product?.advancePrice?.marge || 0,
                                min: 0,
                                max: "",
                                step: 0.01,
                                placeholder: "entrer la marge ...",
                            }}
                            onChange={() => { }}
                        />

                        <div className='space-y-5 col-span-full'>
                            <InputCheckbox
                                title="Mise en avant du produit"
                                description="Cochez cette case pour mettre en avant le produit sur la page d'accueil ou sur d'autres sections de votre site web pour une meilleure visibilit??."
                                input={{
                                    name: "isFeatured",
                                    checked: product?.isFeatured || false,
                                }}
                                onChange={() => { }}
                            />

                            <InputCheckbox
                                title="Publication du produit"
                                description="Cochez cette case pour publier le produit sur votre site web. Assurez-vous d'avoir termin?? toutes les modifications et de l'avoir v??rifi?? avant de le publier. Une fois publi??, votre produit sera visible pour tous les utilisateurs."
                                input={{
                                    name: "isPublished",
                                    checked: product?.isPublished || false,
                                }}
                                onChange={() => { }}
                            />
                        </div>
                    </div>
                </div>
                <hr className="h-[1px] bg-gray-100 my-14" />
                <div className="flex flex-col flex-wrap items-center justify-center w-full px-7 lg:flex-row lg:justify-end md:justify-end gap-x-4 gap-y-4">
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
        </AdminscreenWrapper>
    );
}

export const getServerSideProps = async ({ query }: any) => {

    const slug = query.slug || null;
    let product = null

    try {
        await db.connect();
        const categories = await Categorie.find().lean();
        if (slug) {
            product = await Product.findOne({ slug }).populate('categorie').lean();
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