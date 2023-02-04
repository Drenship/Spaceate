import { NextPage } from 'next/types';
import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import AdminscreenWrapper from '@components/Wrapper/AdminscreenWrapper'
import InputText from '@components/ui-ux/inputs/InputText';
import InputSelect from '@components/ui-ux/inputs/InputSelect';

interface QueryUrl {
    id: string
}

const EditCartegorieScreen: NextPage = () => {
    const router = useRouter();

    const query: QueryUrl = useMemo(() => {
        return {
            id: ""
        }
    }, [router.query]);

    const handleSubmitCartegorie = async (e: React.BaseSyntheticEvent) => {
        e.preventDefault();
        try {
            const data = new FormData(e.target)
            for (const pair of data.entries()) {
                console.log(pair)
            }
            
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <AdminscreenWrapper title="Edit categorie">

            <form onSubmit={handleSubmitCartegorie}>
                <div className="mt-10 px-7">
                    <p className="text-xl font-semibold leading-tight text-gray-800">Categorie Details: {query.id}</p>

                    <div className="grid w-full grid-cols-1 lg:grid-cols-2 md:grid-cols-1 gap-7 mt-7 ">
                        {/*<InputSelect
                        title="Catégorie"
                        description="Choisire une catégorie"
                        input={{
                            name: 'selected_categorie',
                            defaultValue: { name: "a" },
                        }}
                        options={[{ name: "a" }, { name: "b" }]}
                    /> */}

                        <InputText
                            title="Nom"
                            description="Nom de la catégorie"
                            input={{
                                name: "name",
                                defaultValue: "",
                                placeholder: "entrer un nom ...",
                            }}
                        />

                        <InputText
                            title="Slug"
                            description="Slug de la catégorie"
                            input={{
                                name: "slug",
                                defaultValue: "",
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

EditCartegorieScreen.auth = { adminOnly: true };
export default EditCartegorieScreen