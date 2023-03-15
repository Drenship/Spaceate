import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';

import db from '@libs/database/dbConnect';
import Product from '@libs/models/Product';
import { TypeProduct } from '@libs/typings';

import AdminscreenWrapper from '@components/Wrapper/AdminscreenWrapper'
import TableProductLine from '@components/tables/TableProductLine';
import AdminControlPannel from '@components/AdminContents/AdminControlPannel';

const PAGE_SIZE = 20;

type Props = {
    pageSize: number
    page: number
    totalResults: number
    initialProducts: TypeProduct[]
}

interface PageHandler {
    page?: number
    pageSize?: number
}

function AdminProductsScreen({ pageSize, page, totalResults, initialProducts }: Props) {

    const router = useRouter()
    const [checkAll, setcheckAll] = useState(false);
    const [products, setProducts] = useState<TypeProduct[]>(initialProducts);

    const maxPages = useMemo(() => Math.ceil(totalResults / pageSize), [totalResults, pageSize]);

    const pageHandler = ({
        page,
        pageSize
    }: PageHandler) => {

        const { query }: any = router;
        if (page) query.page = page;
        if (pageSize) query.pageSize = pageSize;

        router.push({
            pathname: router.pathname,
            query: query,
        });
    }

    useEffect(() => setProducts(initialProducts), [initialProducts]);

    return (
        <AdminscreenWrapper title="Products">
            <h1 className='text-xl font-bold uppercase'>Products</h1>

            <AdminControlPannel
                pageHandler={pageHandler}

                navigationPanel={{
                    page,
                    maxPages,
                    totalResults
                }}

                rightPanel={{
                    itemsByPage: {
                        onChange: (e) => pageHandler({ pageSize: e.currentTarget.value }),
                        data: [5, 10, 20, 30, 40, 50, 75, 100],
                        currentValue: pageSize
                    },
                    addNewItem: {
                        link: "/admin/products/edit",
                        title: "Ajouter un produit"
                    }
                }}
            />

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
                            <th className="pr-6 text-sm font-normal leading-4 tracking-normal text-left text-gray-600">Ventes en attentes</th>
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


type QuerySearch = {
    query: {
        page?: number
        pageSize?: number
    }
}

export const getServerSideProps = async ({ query }: QuerySearch) => {

    const pageSize = query.pageSize ? query.pageSize : PAGE_SIZE || 20;
    const page = query.page! && query.page >= 1 ? query.page : 1;

    try {
        await db.connect();
        const productSearchFullQuery = {};

        const products = await Product.find(productSearchFullQuery, {
            _id: 1,
            main_image: 1,
            name: 1,
            slug: 1,
            price: 1,
            countInStock: 1,
            stats: 1,
            isPublished: 1,
            createdAt: 1
        })
            .skip(pageSize * (page - 1))
            .limit(pageSize)
            .lean();

        const totalResults = await Product.countDocuments(productSearchFullQuery);
        await db.disconnect();

        return {
            props: {
                initialProducts: JSON.parse(JSON.stringify(products)),
                totalResults: totalResults,
                page: page,
                pageSize: pageSize
            },
        }
    } catch (error) {
        await db.disconnect();
        return {
            props: {
                initialProducts: [],
                totalResults: 0,
                page: 1,
                pageSize: pageSize
            },
        }
    }
}

AdminProductsScreen.auth = { adminOnly: true };
export default AdminProductsScreen