import { NextPage } from 'next/types';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router'

import AdminscreenWrapper from '@components/Wrapper/AdminscreenWrapper'
import InputText from '@components/ui-ux/inputs/InputText';
import InputSelect from '@components/ui-ux/inputs/InputSelect';
import { TypeCategorie } from '@libs/typings';
import Categorie from '@libs/models/Categorie';
import db from '@libs/database/dbConnect';
import { fetchPostJSON } from '@libs/utils/api-helpers';
import { useNotifys } from '@libs/hooks/notify';

type Props = {
    slug: string | null
    categorie: TypeCategorie
}

const EditCartegorieScreen: NextPage<Props> = ({ slug, categorie }) => {
    const router = useRouter()
    const { pushNotify } = useNotifys();;

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
                
                if(response?._id) {
                    setTimeout(()=> {
                        router.push('/admin/categories')
                    }, 3000)
                } 

                pushNotify({
                    title: "",
                    subTitle: response?.message || "Une erreur s'est produite.",
                    icon: "NOTIFICATION",
                    duration: 3
                })
                
            } else {
                // update categorie
                alert('update categorie')
            }

        } catch (err) {
            console.log(err);
        }
    }

    return (
        <AdminscreenWrapper title="Edit categorie">

            <form onSubmit={handleSubmitCartegorie}>
                <div className="mt-10 px-7">
                    <p className="text-xl font-semibold leading-tight text-gray-800">Categorie Details: {slug}</p>

                    <div className="grid w-full grid-cols-1 lg:grid-cols-2 md:grid-cols-1 gap-7 mt-7 ">
                        {/*
                            <InputSelect
                                title="Catégorie"
                                description="Choisire une catégorie"
                                input={{
                                    name: 'selected_categorie',
                                    defaultValue: { name: "a" },
                                }}
                                options={[{ name: "a" }, { name: "b" }]}
                            /> 
                        */}

                        <InputText
                            title="Nom"
                            description="Nom de la catégorie"
                            input={{
                                name: "name",
                                defaultValue: categorie?.name || "",
                                placeholder: "entrer un nom ...",
                            }}
                        />

                        <InputText
                            title="Slug"
                            description="Slug de la catégorie"
                            input={{
                                name: "slug",
                                defaultValue: categorie?.slug || "",
                                placeholder: "entrer un slug ...",
                            }}
                        />
                    </div>
                </div>

                <hr className="h-[1px] bg-gray-100 my-14" />
                <div className="flex flex-col flex-wrap items-center justify-center w-full px-7 lg:flex-row lg:justify-end md:justify-end gap-x-4 gap-y-4">
                    <Link
                        href='/admin/categories'
                        className="bg-white border-indigo-700 rounded hover:bg-gray-50 transform duration-300 ease-in-out text-sm font-medium px-6 py-4 text-indigo-700 border lg:max-w-[95px] w-full"
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
    let categorie = null

    if (slug) {
        await db.connect();
        categorie = await Categorie.findOne({ slug }).lean();
        await db.disconnect()
    }

    return {
        props: {
            slug: slug,
            categorie: categorie ? db.convertDocToObj(categorie) : null,
        },
    }
}

EditCartegorieScreen.auth = { adminOnly: true };
export default EditCartegorieScreen