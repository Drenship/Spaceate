import React, { useRef, useState, useMemo } from 'react';
import { fetchDeleteJSON, fetchPutJSON } from '@libs/utils/api-helpers';
import { useEscapeListener } from '@libs/hooks';
import InputText from '@components/inputs/InputText';

export default function TableSubCategorieLine({ checkAll, parentCategorie, subCategorie, updateMainCategorie }) {

    const seeMenuRef = useRef(null);
    const [seeMenu, setSeeMenu] = useState(false);
    const [updateSubCategorie, setUpdateSubCategorie] = useState(false);
    const [newName, setNewName] = useState(subCategorie.name);
    const [newSlug, setNewSlug] = useState(subCategorie.slug);
    const [checked, setChecked] = useState(false);
    const [prevCheck, setPrevCheck] = useState({
        checkAll: checkAll,
        checked: checked
    });

    const checkboxChecked = useMemo(() => {
        if (prevCheck.checked !== checked) {
            setPrevCheck({
                checkAll: checkAll,
                checked: checked
            })
            setChecked(checked)
            return checked
        }

        setPrevCheck({
            checkAll: checkAll,
            checked: checked
        })
        setChecked(checkAll)
        return checkAll
    }, [checkAll, checked]);


    useEscapeListener(seeMenuRef, () => setSeeMenu(false))

    const handleUpdateSubCatgeorie = async () => {
        try {
            //if(newName && newName.length > 1) return;
            //if(newSlug && newSlug.length > 1) return;
            
            const response = await fetchPutJSON(`/api/admin/categories/${parentCategorie._id}/subcategories?subid=${subCategorie._id}`, {
                name: newName,
                slug: newSlug
            })
            if (response?.data) {
                updateMainCategorie(response?.data)
                setUpdateSubCategorie(false)
            }
        } catch (err) {
            console.log(err);
        }
    }

    const handleDeleteSubCatgeorie = async () => {
        if (confirm("Confirmer la suppression de : " + subCategorie.name) != true) return;

        try {
            const response = await fetchDeleteJSON(`/api/admin/categories/${parentCategorie._id}/subcategories?subid=${subCategorie._id}`)
            if (response?.data) {
                updateMainCategorie(response?.data)
            }
        } catch (err) {
            console.log(err);
        }
    }




    return (
        <tr className={`border-b border-gray-300 ${updateSubCategorie ? 'h-32' : 'h-24'}`}>
            <td className="pl-8 pr-6 text-sm leading-4 tracking-normal text-left text-gray-800 whitespace-no-wrap">
                <input
                    type="checkbox"
                    checked={checkboxChecked}
                    className="relative w-5 h-5 bg-white border border-gray-400 rounded outline-none cursor-pointer"
                    onClick={() => setChecked(prev => !prev)}
                />
            </td>
            <td className="pr-6 text-sm leading-4 tracking-normal text-gray-800 whitespace-no-wrap">
                {
                    updateSubCategorie ? (
                        <InputText
                            title="Nom"
                            description="Nom de la sous catégorie"
                            input={{
                                name: "name",
                                defaultValue: subCategorie.name || "",
                                placeholder: "entrer un nom ...",
                            }}
                            onChange={(e) => setNewName(e.target.value)}
                        />
                    ) : (
                        subCategorie.name
                    )
                }
            </td>
            <td className="pr-6 text-sm leading-4 tracking-normal text-gray-800 whitespace-no-wrap">
                {
                    updateSubCategorie ? (
                        <InputText
                            title="Slug"
                            description="Slug de la sous catégorie"
                            input={{
                                name: "slug",
                                defaultValue: subCategorie.slug || "",
                                placeholder: "entrer un slug ...",
                            }}
                            onChange={(e) => setNewSlug(e.target.value)}
                        />
                    ) : (
                        subCategorie.slug
                    )
                }
            </td>

            {
                updateSubCategorie ? (
                    <td className="relative">
                        <div className="flex flex-col flex-wrap items-center justify-center w-full px-7 lg:flex-row lg:justify-end md:justify-end gap-x-4 gap-y-4">
                            <button
                                onClick={() => setUpdateSubCategorie(false)}
                                className="bg-white text-center border-indigo-700 rounded hover:bg-gray-50 transform duration-300 ease-in-out text-sm font-medium px-6 py-4 text-indigo-700 border lg:max-w-[95px] w-full"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleUpdateSubCatgeorie}
                                className="bg-indigo-700 rounded hover:bg-indigo-600 transform duration-300 ease-in-out text-sm font-medium px-6 py-4 text-white lg:max-w-[144px] w-full"
                            >
                                Mettre a jour
                            </button>
                        </div>
                    </td>
                ) : (
                    <td className="relative pr-8 text-right">
                        <div className={`absolute right-0 z-10 w-32 mt-8 -ml-12 shadow-md dropdown-content ${!seeMenu && 'hidden'}`}>
                            <ul className="py-1 text-left bg-white rounded shadow">
                                <li onClick={() => setUpdateSubCategorie(prev => !prev)} className="px-3 py-3 text-sm font-normal leading-3 tracking-normal text-gray-600 cursor-pointer hover:bg-indigo-700 hover:text-white">Modifier</li>
                                <li onClick={handleDeleteSubCatgeorie} className="px-3 py-3 text-sm font-normal leading-3 tracking-normal text-gray-600 cursor-pointer hover:bg-indigo-700 hover:text-white">Delete</li>
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
                    </td >
                )
            }
        </tr >
    );
}