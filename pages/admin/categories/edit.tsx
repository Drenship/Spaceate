import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import AdminscreenWrapper from '@components/Wrapper/AdminscreenWrapper'

import InputText from '@components/ui-ux/inputs/InputText';
import InputSelect from '@components/ui-ux/inputs/InputSelect';

interface QueryUrl {
    id: string
}

export default function edit() {
    const router = useRouter();

    const query: QueryUrl = useMemo(() => {
        return {
            id: ""
        }
    }, [router.query]);

    return (
        <AdminscreenWrapper title="Edit categorie">

            <div className="mt-10 px-7">
                <p className="text-xl font-semibold leading-tight text-gray-800">Meta Details: { query }</p>

                <div className="grid w-full grid-cols-1 lg:grid-cols-2 md:grid-cols-1 gap-7 mt-7 ">
                    <InputSelect
                        title="Catégorie"
                        description="Choisire une catégorie"
                        input={{
                            name: 'selected_categorie',
                            defaultValue: { name: "a" },
                        }}
                        options={[{ name: "a" }, { name: "b" }]}
                    />

                    <InputText
                        title="Nom"
                        description="Nom de la catégorie"
                        input={{
                            name: "categorie_name",
                            defaultValue: "x",
                            placeholder: "p",
                        }}
                    />
                </div>
            </div>

            <hr className="h-[1px] bg-gray-100 my-14" />
            <div className="flex flex-col flex-wrap items-center justify-center w-full px-7 lg:flex-row lg:justify-end md:justify-end gap-x-4 gap-y-4">
                <button className="bg-white border-indigo-700 rounded hover:bg-gray-50 transform duration-300 ease-in-out text-sm font-medium px-6 py-4 text-indigo-700 border lg:max-w-[95px]  w-full ">
                    Cancel
                </button>
                <button className="bg-indigo-700 rounded hover:bg-indigo-600 transform duration-300 ease-in-out text-sm font-medium px-6 py-4 text-white lg:max-w-[144px] w-full ">
                    Save Changes
                </button>
            </div>

        </AdminscreenWrapper>
    );
}
