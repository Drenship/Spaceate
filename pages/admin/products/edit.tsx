import React, { useState } from 'react';
import { NextPage } from 'next/types';
import Link from 'next/link';

import { TypeCategorie, TypeProduct } from '@libs/typings';
import Product from '@libs/models/Product';
import db from '@libs/database/dbConnect';
import Categorie from '@libs/models/Categorie';

import AdminscreenWrapper from '@components/Wrapper/AdminscreenWrapper'
import InputText from '@components/ui-ux/inputs/InputText';
import InputSelect from '@components/ui-ux/inputs/InputSelect';
import InputFiles from '@components/ui-ux/inputs/InputFiles';
import InputTextarea from '@components/ui-ux/inputs/InputTextarea';
import { InputNumber } from '@components/ui-ux/inputs/InputNumber';

type Props = {
    slug: string | null
    categories: TypeCategorie[]
    initialProduct: TypeProduct
}

const AdminEditProduct: NextPage<Props> = ({ slug, initialProduct, categories }) => {

    const [product, setProduct] = useState<TypeProduct>(initialProduct);
    const [currentCategorie, setCurrentCategorie] = useState<TypeCategorie>(categories[0]);

    const handleSubmitProduct = async (e: React.BaseSyntheticEvent) => {
        e.preventDefault();
        try {
            const data: any = new FormData(e.target)
            const formDataObject: any = {};
            for (const [key, value] of data.entries()) {
                formDataObject[key] = value;
            }
            console.log(formDataObject)
        } catch (error) {
            console.log(error)
        }
    }


    //main_image: string;
    //images: string[];

    //price_in: string;
    //advancePrice: {
    //    initialCost: number;
    //    tva: number;
    //    marge: number;
    //};

    //isFeatured: boolean;
    //isPublished: boolean;

    return (
        <AdminscreenWrapper title={`${product ? product?.name + ' - ' : ""} Edit product`}>
            <form onSubmit={handleSubmitProduct}>
                <div className="mt-10 px-7">
                    <p className="text-xl font-semibold leading-tight text-gray-800">Produit Details: {slug && <span className='italic font-bold underline uppercase text-sky-600'>{slug}</span>}</p>

                    <div className="grid w-full grid-cols-1 lg:grid-cols-2 md:grid-cols-1 gap-7 mt-7">
                        <InputFiles multiple={false} />

                        <InputText
                            title="Nom"
                            description="Nom du produit"
                            input={{
                                name: "name",
                                defaultValue: product?.name || "",
                                placeholder: "entrer un nom ...",
                            }}
                            onChange={() => { }}
                        />

                        <InputText
                            title="Slug"
                            description="Slug du produit"
                            input={{
                                name: "slug",
                                defaultValue: product?.slug || "",
                                placeholder: "entrer un slug ...",
                            }}
                            onChange={() => { }}
                        />

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

                        <InputSelect
                            title="Catégorie"
                            description="Choisire une catégorie"
                            input={{
                                name: 'categorie',
                                defaultValue: categories[0],
                            }}
                            options={categories}
                            setChange={(c: any) => setCurrentCategorie(c)}
                        />

                        <InputSelect
                            title="Sous catégorie"
                            description="Choisire une sous catégorie"
                            input={{
                                name: 'subCategorie',
                                defaultValue: currentCategorie.subCategories[0],
                            }}
                            options={currentCategorie.subCategories}
                            setChange={() => { }}
                        />
                    </div>

                    <p className="block mt-10 text-xl font-semibold leading-tight text-gray-800">Prix et stock</p>
                    <div className="grid w-full grid-cols-1 lg:grid-cols-2 md:grid-cols-1 gap-7 mt-7 ">
                        <InputNumber
                            title="Prix"
                            description="Prix du produit"
                            input={{
                                name: "slug",
                                defaultValue: product?.price || "",
                                min: "",
                                max: "",
                                placeholder: "entrer un prix ...",
                            }}
                            onChange={() => { }}
                        />

                        <InputSelect
                            title="Prix en quantité"
                            description="Prix (g, kg, unité)"
                            input={{
                                name: 'price_in',
                                defaultValue: { name: 'Kg' },
                            }}
                            options={[{ name: 'g' }, { name: 'Kg' }, { name: 'Unité' }]}
                            setChange={() => {}}
                        />

                        <InputNumber
                            title="Quantité du stock"
                            description="Quantité du produit"
                            input={{
                                name: "countInStock",
                                defaultValue: product?.countInStock || "",
                                min: "",
                                max: "",
                                placeholder: "entrer votre stock ...",
                            }}
                            onChange={() => { }}
                        />

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

    await db.connect();
    const categories = await Categorie.find().lean();
    if (slug) {
        product = await Product.findOne({ slug }).lean();
    }
    await db.disconnect()

    return {
        props: {
            slug: slug,
            categories: db.convertDocToObj(categories),
            initialCategorie: product ? db.convertDocToObj(product) : null,
        },
    }
}

AdminEditProduct.auth = { adminOnly: true };
export default AdminEditProduct