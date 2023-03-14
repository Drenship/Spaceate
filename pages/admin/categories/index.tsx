import { NextPage } from 'next/types';
import React, { useState, useEffect } from 'react';
import Link from 'next/link'
import AdminscreenWrapper from '@components/Wrapper/AdminscreenWrapper'
import Categorie from '@libs/models/Categorie';
import db from '@libs/database/dbConnect';
import { TypeCategorie } from '@libs/typings';
import TableCategorieLine from '@components/tables/TableCategorieLine';

type Props = {
    categories: TypeCategorie[]
}

const AdminEditCartegorieScreen: NextPage<Props> = ({ categories }) => {
    const [checkAll, setcheckAll] = useState(false);
    const [allCategories, setRemoveCategorie] = useState(categories);

    useEffect(() => {
        console.log(categories)
    }, []);

    return (
        <AdminscreenWrapper title="Categorie">
            <h1 className='text-xl font-bold uppercase'>Categories</h1>

            <div className="flex flex-col items-start justify-between w-full p-4 lg:flex-row lg:p-8 lg:items-stretch">
                <div className="flex flex-col items-start w-full lg:w-1/3 lg:flex-row lg:items-center">
                    <div className="flex items-center">
                        <a className="p-2 text-gray-600 bg-gray-100 border border-transparent rounded cursor-pointer hover:bg-gray-200 focus:outline-none focus:border-gray-800 focus:shadow-outline-gray">
                            <svg xmlns="http://www.w3.org/2000/svg" className="cursor-pointer icon icon-tabler icon-tabler-edit" width={20} height={20} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" />
                                <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />
                                <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />
                                <line x1={16} y1={5} x2={19} y2={8} />
                            </svg>
                        </a>
                        <a className="p-2 mx-2 text-gray-600 bg-gray-100 border border-transparent rounded cursor-pointer hover:bg-gray-200 focus:outline-none focus:border-gray-800 focus:shadow-outline-gray">
                            <svg xmlns="http://www.w3.org/2000/svg" className="cursor-pointer icon icon-tabler icon-tabler-settings" width={20} height={20} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" />
                                <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <circle cx={12} cy={12} r={3} />
                            </svg>
                        </a>
                        <a className="p-2 text-red-500 bg-gray-100 border border-transparent rounded cursor-pointer hover:bg-gray-200 focus:outline-none focus:border-gray-800 focus:shadow-outline-gray">
                            <svg xmlns="http://www.w3.org/2000/svg" className="cursor-pointer icon icon-tabler icon-tabler-trash" width={20} height={20} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" />
                                <line x1={4} y1={7} x2={20} y2={7} />
                                <line x1={10} y1={11} x2={10} y2={17} />
                                <line x1={14} y1={11} x2={14} y2={17} />
                                <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                                <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                            </svg>
                        </a>
                    </div>
                </div>

                <div className="flex flex-col items-start justify-end w-full lg:w-2/3 lg:flex-row lg:items-center">
                    <div className="flex items-center lg:ml-6">
                        <Link href="/admin/categories/edit">
                            <button className="flex items-center justify-center px-3 py-2 ml-4 text-white transition duration-150 ease-in-out bg-indigo-700 border border-transparent rounded cursor-pointer button-click-effect focus:outline-none hover:bg-indigo-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-plus" width={28} height={28} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" />
                                    <line x1={12} y1={5} x2={12} y2={19} />
                                    <line x1={5} y1={12} x2={19} y2={12} />
                                </svg>
                                <span className='text-normal'>Ajouter une categorie</span>
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="w-full h-full overflow-x-scroll xl:overflow-x-hidden">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr className="w-full h-16 py-8 border-b border-gray-300 ">
                            <th className="pl-8 pr-6 text-sm font-normal leading-4 tracking-normal text-left text-gray-600">
                                <input
                                    type="checkbox"
                                    className="relative w-5 h-5 bg-white border border-gray-400 rounded outline-none cursor-pointer"
                                    onClick={() => setcheckAll(prev => !prev)}
                                />
                            </th>
                            <th className="pr-6 text-sm font-normal leading-4 tracking-normal text-left text-gray-600">Nom</th>
                            <th className="pr-6 text-sm font-normal leading-4 tracking-normal text-left text-gray-600">Slug</th>
                            <th className="pr-6 text-sm font-normal leading-4 tracking-normal text-left text-gray-600">Total sous-catégorie</th>
                            <td className="pr-8 text-sm font-normal leading-4 tracking-normal text-left text-gray-600"></td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            allCategories.map((categorie, key) => <TableCategorieLine key={key} categorie={categorie} checkAll={checkAll} setRemoveCategorie={setRemoveCategorie} />)
                        }
                    </tbody>
                </table>
            </div>

        </AdminscreenWrapper>
    );
}

export const getServerSideProps = async () => {

    await db.connect();
    const categories = await Categorie.find().lean();
    await db.disconnect()

    return {
        props: {
            categories: categories.map(db.convertDocToObj),
        },
    }
}

AdminEditCartegorieScreen.auth = { adminOnly: true };
export default AdminEditCartegorieScreen