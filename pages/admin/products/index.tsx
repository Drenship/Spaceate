import React, { useState } from 'react';

import db from '@libs/database/dbConnect';
import Product from '@libs/models/Product';
import { TypeProduct } from '@libs/typings';

import AdminscreenWrapper from '@components/Wrapper/AdminscreenWrapper'
import TableProductLine from '@components/tables/TableProductLine';
import Link from 'next/link';

type Props = {
    initialProducts: TypeProduct[]
}

function AdminProductsScreen({ initialProducts }: Props) {

    const [checkAll, setcheckAll] = useState(false);
    const [products, setProducts] = useState(initialProducts);

    console.log(products)

    return (
        <AdminscreenWrapper title="Products">
            <h1 className='text-xl font-bold uppercase'>Products</h1>

            <div className="flex flex-col items-start justify-between w-full p-4 lg:flex-row lg:p-8 lg:items-stretch">
                <div className="flex flex-col items-start w-full lg:w-1/3 lg:flex-row lg:items-center">
                    <div className="flex items-center">
                        <a className="p-2 text-gray-600 bg-gray-100 border border-transparent rounded cursor-pointer hover:bg-gray-200 focus:outline-none focus:border-gray-800 focus:shadow-outline-gray" href="javascript: void(0)">
                            <svg xmlns="http://www.w3.org/2000/svg" className="cursor-pointer icon icon-tabler icon-tabler-edit" width={20} height={20} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" />
                                <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />
                                <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />
                                <line x1={16} y1={5} x2={19} y2={8} />
                            </svg>
                        </a>
                        <a className="p-2 mx-2 text-gray-600 bg-gray-100 border border-transparent rounded cursor-pointer hover:bg-gray-200 focus:outline-none focus:border-gray-800 focus:shadow-outline-gray" href="javascript: void(0)">
                            <svg xmlns="http://www.w3.org/2000/svg" className="cursor-pointer icon icon-tabler icon-tabler-settings" width={20} height={20} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" />
                                <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <circle cx={12} cy={12} r={3} />
                            </svg>
                        </a>
                        <a className="p-2 mr-2 text-gray-600 bg-gray-100 border border-transparent rounded cursor-pointer hover:bg-gray-200 focus:outline-none focus:border-gray-800 focus:shadow-outline-gray" href="javascript: void(0)">
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-bookmark" width={20} height={20} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" />
                                <path d="M9 4h6a2 2 0 0 1 2 2v14l-5-3l-5 3v-14a2 2 0 0 1 2 -2" />
                            </svg>
                        </a>
                        <a className="p-2 mr-2 text-gray-600 bg-gray-100 border border-transparent rounded cursor-pointer hover:bg-gray-200 focus:outline-none focus:border-gray-800 focus:shadow-outline-gray" href="javascript: void(0)">
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-copy" width={20} height={20} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" />
                                <rect x={8} y={8} width={12} height={12} rx={2} />
                                <path d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2" />
                            </svg>
                        </a>
                        <a className="p-2 text-red-500 bg-gray-100 border border-transparent rounded cursor-pointer hover:bg-gray-200 focus:outline-none focus:border-gray-800 focus:shadow-outline-gray" href="javascript: void(0)">
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
                    <div className="flex items-center py-3 border-gray-300 lg:border-l lg:border-r lg:py-0 lg:px-6">
                        <p className="text-base text-gray-600" id="page-view">
                            Viewing 1 - 20 of 60
                        </p>
                        <a className="ml-2 text-gray-600 border border-transparent rounded cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-chevron-left" width={20} height={20} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" />
                                <polyline points="15 6 9 12 15 18" />
                            </svg>
                        </a>
                        <a className="text-gray-600 border border-transparent rounded cursor-pointerfocus:outline-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-chevron-right" width={20} height={20} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" />
                                <polyline points="9 6 15 12 9 18" />
                            </svg>
                        </a>
                    </div>
                    <div className="flex items-center pb-3 border-gray-300 lg:border-r lg:pb-0 lg:px-6">
                        <div className="relative z-10 w-32">
                            <div className="absolute inset-0 z-0 w-5 h-5 m-auto mr-2 text-gray-600 pointer-events-nonexl:mr-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="cursor-pointer icon icon-tabler icon-tabler-chevron-down" width={20} height={20} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" />
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </div>
                            <select aria-label="Selected tab" className="block w-full px-2 py-2 text-base text-gray-600 bg-transparent border border-transparent rounded appearance-none focus:outline-none focus:border-gray-800 focus:shadow-outline-gray form-select xl:px-3">
                                <option>List View</option>
                                <option>Grid View</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex items-center lg:ml-6">
                        <Link href="/admin/products/edit">
                            <button className="flex items-center justify-center px-3 py-2 ml-4 text-white transition duration-150 ease-in-out bg-indigo-700 border border-transparent rounded cursor-pointer button-click-effect focus:outline-none hover:bg-indigo-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-plus" width={28} height={28} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" />
                                    <line x1={12} y1={5} x2={12} y2={19} />
                                    <line x1={5} y1={12} x2={19} y2={12} />
                                </svg>
                                <span className='text-normal'>Ajouter un produit</span>
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
                            <th className="pr-6 text-sm font-normal leading-4 tracking-normal text-left text-gray-600">
                                <div className="relative w-10 text-gray-600 opacity-0 cursor-default">
                                    <div className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 mr-2 -mt-1 text-xs text-white bg-indigo-700 rounded-full">3</div>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-file" width={28} height={28} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" />
                                        <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                                        <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                                    </svg>
                                </div>
                            </th>
                            <th className="pr-6 text-sm font-normal leading-4 tracking-normal text-left text-gray-600">Nom</th>
                            <th className="pr-6 text-sm font-normal leading-4 tracking-normal text-left text-gray-600">Slug</th>
                            <th className="pr-6 text-sm font-normal leading-4 tracking-normal text-left text-gray-600">En stock</th>
                            <th className="pr-6 text-sm font-normal leading-4 tracking-normal text-left text-gray-600">Total des ventes</th>
                            <th className="pr-6 text-sm font-normal leading-4 tracking-normal text-left text-gray-600">Prix</th>
                            <th className="pr-6 text-sm font-normal leading-4 tracking-normal text-left text-gray-600">Date</th>
                            <th className="pr-6 text-sm font-normal leading-4 tracking-normal text-left text-gray-600">
                                <div className="w-2 h-2 bg-indigo-400 rounded-full opacity-0" />
                            </th>
                            <td className="pr-8 text-sm font-normal leading-4 tracking-normal text-left text-gray-600">More</td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            products.map((product, key) => <TableProductLine
                                key={key}
                                product={product}
                                checkAll={checkAll}
                                updateMainProducts={setProducts}
                            />)
                        }
                    </tbody>
                </table>
            </div>

        </AdminscreenWrapper>
    );
}

export const getServerSideProps = async () => {

    await db.connect();
    const products = await Product.find().populate("categorie").lean();
    await db.disconnect();

    return {
        props: {
            initialProducts: JSON.parse(JSON.stringify(products)),
        },
    }
}

AdminProductsScreen.auth = { adminOnly: true };
export default AdminProductsScreen