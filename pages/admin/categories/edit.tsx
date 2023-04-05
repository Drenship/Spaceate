import { NextPage } from 'next/types';
import React, { useMemo, useState } from 'react';
import Link from 'next/link';

import { TypeCategorie } from '@libs/typings';
import db from '@libs/database/dbConnect';
import Categorie from '@libs/models/Categorie';
import { fetchPostJSON, fetchPutJSON } from '@libs/utils/api-helpers';
import { useNotifys } from '@libs/hooks/notify';

import AdminscreenWrapper from '@components/Layouts/AdminscreenLayout'
import InputText from '@components/ui-ux/inputs/InputText';
import InputSelect from '@components/ui-ux/inputs/InputSelect';
import TableSubCategorieLine from '@components/TableLines/TableSubCategorieLine';
import { textToSLug } from '@libs/utils';

type Props = {
    slug: string | null
    initialCategorie: TypeCategorie
}

const EditCartegorieScreen: NextPage<Props> = ({ slug, initialCategorie }) => {

    const { pushNotify } = useNotifys();

    const [categorie, setCategorie] = useState(initialCategorie);
    const [checkAll, setcheckAll] = useState(false);

    const handleSubmitCartegorie = async (e: React.BaseSyntheticEvent) => {
        e.preventDefault();
        try {
            const data: any = new FormData(e.target)
            const formDataObject: any = {};
            for (const [key, value] of data.entries()) {
                formDataObject[key] = value;
            }

            // create new categorie
            if (slug === null) {
                const response = await fetchPostJSON("/api/admin/categories", formDataObject)

                if (response?.data) {
                    setCategorie(response.data)
                }

                pushNotify({
                    title: "",
                    subTitle: response?.message || "Une erreur s'est produite.",
                    icon: "NOTIFICATION",
                    duration: 3
                })

            } else {
                // update categorie
                const response = await fetchPutJSON(`/api/admin/categories/${categorie._id}`, formDataObject)

                if (response?.data) {
                    setCategorie(response.data)
                }

                pushNotify({
                    title: "",
                    subTitle: response?.message || "Une erreur s'est produite.",
                    icon: "NOTIFICATION",
                    duration: 3
                })
            }

        } catch (err) {
            console.log(err);
        }
    }

    const handleSubmitSubCartegorie = async (e: React.BaseSyntheticEvent) => {
        e.preventDefault();
        try {
            const data: any = new FormData(e.target)
            const formDataObject: any = {};
            for (const [key, value] of data.entries()) {
                formDataObject[key] = value;
            }

            // create new categorie
            if (categorie) {
                const response = await fetchPostJSON(`/api/admin/categories/${categorie._id}/subcategories`, formDataObject)
                if (response?.data) {
                    setCategorie(response?.data)
                    e.target.reset();
                }

                pushNotify({
                    title: "",
                    subTitle: response?.message || "Une erreur s'est produite.",
                    icon: "NOTIFICATION",
                    duration: 3
                })

            }

        } catch (err) {
            console.log(err);
        }
    }
    const [automatiqueSlug, setAutomatiqueSlug] = useState<string>("");
    const [newSubCategorieSlugName, setNewSubCategorieSlugName] = useState<string>("");


    return (
        <AdminscreenWrapper title={`${categorie ? categorie?.name + ' - ' : ""} Edit categorie`}>


            <form onSubmit={handleSubmitCartegorie}>
                <div className="px-2 mt-10 md:px-7">
                    <p className="text-xl font-semibold leading-tight text-gray-800">Categorie Details: {slug && <span className='italic font-bold underline uppercase text-sky-600'>{slug}</span>}</p>

                    <div className="grid w-full grid-cols-1 lg:grid-cols-2 md:grid-cols-1 gap-7 mt-7 ">

                        <InputText
                            title="Nom"
                            description="Nom de la catégorie"
                            input={{
                                name: "name",
                                defaultValue: categorie?.name || "",
                                placeholder: "entrer un nom ...",
                            }}
                            onChange={(e: React.BaseSyntheticEvent) => setAutomatiqueSlug(textToSLug(e.target.value))}
                        />

                        <InputText
                            title="Slug"
                            description="Slug de la catégorie"
                            input={{
                                name: "slug",
                                defaultValue: automatiqueSlug ||  categorie?.slug || "",
                                forceValue: automatiqueSlug ||  categorie?.slug,
                                placeholder: "entrer un slug ...",
                            }}
                        />
                    </div>
                </div>
                <hr className="h-[1px] bg-gray-100 my-14" />
                <div className="flex flex-col flex-wrap items-center justify-center w-full px-7 lg:flex-row lg:justify-end md:justify-end gap-x-4 gap-y-4">
                    <Link
                        href='/admin/categories'
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


            {
                categorie && (
                    <div>
                        <form onSubmit={handleSubmitSubCartegorie}>
                            <div className="mt-10 px-7">
                                <p className="text-xl font-semibold leading-tight text-gray-800">Sous categorie Details:</p>
                                <div className="grid w-full grid-cols-1 lg:grid-cols-2 md:grid-cols-1 gap-7 mt-7 ">
                                    <InputText
                                        title="Nom"
                                        description="Nom de la sous catégorie"
                                        input={{
                                            name: "name",
                                            defaultValue: "",
                                            placeholder: "entrer un nom ...",
                                        }}
                                        onChange={(e: React.BaseSyntheticEvent) => setNewSubCategorieSlugName(textToSLug(e.target.value))}
                                    />
                                    <InputText
                                        title="Slug"
                                        description="Slug de la sous catégorie"
                                        input={{
                                            name: "slug",
                                            defaultValue: newSubCategorieSlugName || "",
                                            forceValue: newSubCategorieSlugName,
                                            placeholder: "entrer un slug ...",
                                        }}
                                    />
                                </div>
                                <hr className="h-[1px] bg-gray-100 my-14" />
                                <div className="flex flex-col flex-wrap items-center justify-center w-full lg:flex-row lg:justify-end md:justify-end gap-y-4">
                                    <button
                                        type='submit'
                                        className="bg-indigo-700 rounded hover:bg-indigo-600 transform duration-300 ease-in-out text-sm font-medium px-6 py-4 text-white lg:max-w-[240px] w-full"
                                    >
                                        Ajouter la sous catégorie
                                    </button>
                                </div>
                            </div>
                        </form>

                        {
                            categorie?.subCategories.length > 0 && (
                                <div className="w-full pb-12 overflow-x-scroll xl:overflow-x-hidden">
                                    <table className="min-w-full bg-white">
                                        <thead>
                                            <tr className="w-full h-16 py-8 border-b border-gray-300">
                                                <th className="pl-8 pr-6 text-sm font-normal leading-4 tracking-normal text-left text-gray-600">
                                                    <input
                                                        type="checkbox"
                                                        className="relative w-5 h-5 bg-white border border-gray-400 rounded outline-none cursor-pointer"
                                                        onClick={() => setcheckAll(prev => !prev)}
                                                    />
                                                </th>
                                                <th className="pr-6 text-sm font-normal leading-4 tracking-normal text-left text-gray-600">Nom</th>
                                                <th className="pr-6 text-sm font-normal leading-4 tracking-normal text-left text-gray-600">Slug</th>
                                                <td className="pr-8 text-sm font-normal leading-4 tracking-normal text-left text-gray-600"></td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                categorie?.subCategories.map((subCategorie, key) => <TableSubCategorieLine
                                                    key={key}
                                                    parentCategorie={categorie}
                                                    subCategorie={subCategorie}
                                                    checkAll={checkAll}
                                                    updateMainCategorie={setCategorie}
                                                />)
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            )
                        }

                    </div>
                )
            }


        </AdminscreenWrapper>
    );
}

export const getServerSideProps = async ({ query }: any) => {

    const slug = query.slug || null;
    let categorie = null

    if (slug) {
        await db.connect();
        categorie = await Categorie.findOne({ slug }).lean();
        await db.disconnect()
    }

    return {
        props: {
            slug: slug,
            initialCategorie: categorie ? db.convertDocToObj(categorie) : null,
        },
    }
}

EditCartegorieScreen.auth = { adminOnly: true };
export default EditCartegorieScreen