import React from 'react'
import { NextPage } from 'next/types'
import { useRouter } from 'next/router'
import BasescreenWrapper from '@components/Wrapper/BasescreenWrapper'
import Product from '@libs/models/Product';
import db from '@libs/database/dbConnect';
import BestsellerCard from '@components/cards/BestsellerCard';
import { XCircleIcon } from '@heroicons/react/solid';
import Categorie from '@libs/models/Categorie';
import { querySecurMongoDB } from '@libs/utils';
import { TypeCategorie, TypeProduct } from '@libs/typings';

const PAGE_SIZE = 4;
const ratings = [1, 2, 3, 4, 5];
const prices = [
    {
        name: 'moins de 1€',
        value: '0-1',
    }, {
        name: '1€ à 50€',
        value: '1-50',
    },
    {
        name: '51€ à 200€',
        value: '51-200',
    },
    {
        name: '201€ à 1000€',
        value: '201-1000',
    },
];

interface FilterSearchParams {
    page?: number;
    categorie?: string;
    sort?: string;
    min?: number | null;
    max?: number | null;
    searchQuery?: string;
    price?: string;
    rating?: string;
}

interface RouterQueryParams extends FilterSearchParams {
    query?: string;
}

type Props = {
    searchQuery: string,
    products: TypeProduct[],
    countProducts: number,
    categories: TypeCategorie[],
    pages: number | any
}

const Search: NextPage<Props> = ({ searchQuery, products, countProducts, categories, pages }) => {
    const router = useRouter()

    const {
        query = 'all',
        categorie = 'all',
        price = 'all',
        rating = 'all',
        sort = 'featured',
        page = 1,
    }: RouterQueryParams = router.query;

    const filterSearch = ({
        page,
        categorie,
        sort,
        min = null,
        max = null,
        searchQuery,
        price,
        rating,
    }: FilterSearchParams) => {
        const { query }: any = router;
        if (page) query.page = page;
        if (searchQuery) query.searchQuery = searchQuery;
        if (sort) query.sort = sort;
        if (categorie) query.categorie = categorie;
        if (price) query.price = price;
        if (rating) query.rating = rating;
        if (min) query.min ? query.min : query.min === 0 ? 0 : min;
        if (max) query.max ? query.max : query.max === 0 ? 0 : max;

        router.push({
            pathname: router.pathname,
            query: query,
        });
    };

    const categorieHandler = (e: React.BaseSyntheticEvent) => filterSearch({ categorie: e.target.value });

    const pageHandler = (page: number) => filterSearch({ page });

    const sortHandler = (e: React.BaseSyntheticEvent) => filterSearch({ sort: e.target.value });

    const priceHandler = (e: React.BaseSyntheticEvent) => filterSearch({ price: e.target.value });

    const ratingHandler = (e: React.BaseSyntheticEvent) => filterSearch({ rating: e.target.value });


    return (
        <BasescreenWrapper placeholderSearch={searchQuery} title={searchQuery} footer={false}>
            <div className="flex flex-col md:flex-row w-full min-h-[calc(100vh-64px)] relative bg-gray-100">
                    { /* filtre options left */}
                <div className='flex flex-row md:block md:flex-shrink md:max-w-[25vw] md:min-w-[25vw] w-full p-3 sm:px-6 h-full md:sticky top-16 bg-gray-100'>
                    <div className="my-3">
                        <h2>Categories</h2>
                        <select
                            className="w-full"
                            value={categorie}
                            onChange={categorieHandler}
                        >
                            <option value="all">Tous</option>
                            {categories &&
                                categories.map((categorie, key) => (
                                    <option key={key} value={categorie._id}>
                                        {categorie.name}
                                    </option>
                                ))}
                        </select>
                    </div>

                    <div className="mb-3">
                        <h2>Prix</h2>
                        <select className="w-full" value={price} onChange={priceHandler}>
                            <option value="all">Tous</option>
                            {prices &&
                                prices.map((price) => (
                                    <option key={price.value} value={price.value}>
                                        {price.name}
                                    </option>
                                ))}
                        </select>
                    </div>

                    <div className="mb-3">
                        <h2>Notes</h2>
                        <select className="w-full" value={rating} onChange={ratingHandler}>
                            <option value="all">Tous</option>
                            {ratings &&
                                ratings.map((rating) => (
                                    <option key={rating} value={rating}>
                                        {rating} étoile{rating > 1 && 's'} et plus
                                    </option>
                                ))}
                        </select>
                    </div>
                </div>

                { /* Global body */}
                <div className='flex-grow min-h-full px-5 py-12 bg-white shadow-lg md:px-10 lg:px-20'>
                    { /* filtre option top */}
                    <div className="flex items-center justify-between pb-2 mb-2 border-b-2">
                        <div className="flex items-center">
                            {products.length === 0 ? 'No' : countProducts} Résultats
                            {query !== 'all' && query !== '' && ' : ' + query}
                            {categorie !== 'all' && ' : ' + categorie}
                            {price !== 'all' && ' : Price ' + price}
                            {rating !== 'all' && ' : Rating ' + rating + ' & up'}
                            &nbsp;
                            {(query !== 'all' && query !== '') ||
                                categorie !== 'all' ||
                                rating !== 'all' ||
                                price !== 'all' ? (
                                <button onClick={() => router.push('/search?query=')}>
                                    <XCircleIcon className="w-5 h-5" />
                                </button>
                            ) : null}
                        </div>
                        <div>
                            Filtre par{' '}
                            <select value={sort} onChange={sortHandler}>
                                <option value="featured">Populaires</option>
                                <option value="lowest">Prix croissant</option>
                                <option value="highest">Prix décroissant</option>
                                <option value="toprated">Avis des clients</option>
                                <option value="newest">Les plus récents</option>
                            </select>
                        </div>
                    </div>

                    { /* Content body result */}
                    <div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                            {products.map((product, key) => (
                                <BestsellerCard
                                    key={key}
                                    product={product}
                                />
                            ))}
                        </div>
                        <ul className="flex">
                            {products.length > 0 &&
                                [...Array(pages).keys()].map((pageNumber) => (
                                    <li key={pageNumber}>
                                        <button
                                            className={`default-button m-2 ${page == pageNumber + 1 ? 'font-bold' : ''
                                                } `}
                                            onClick={() => pageHandler(pageNumber + 1)}
                                        >
                                            {pageNumber + 1}
                                        </button>
                                    </li>
                                ))}
                        </ul>
                    </div>
                </div>
            </div>
        </BasescreenWrapper>
    )
}

type QuerySearch = {
    query: {
        pageSize: number
        page: number
        categorie: string
        price: string
        rating: string
        sort: string
        query: string
    }
}

export async function getServerSideProps({ query }: QuerySearch) {

    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const categorie = query.categorie || '';
    const price = query.price || '';
    const rating = query.rating || '';
    const sort = query.sort || '';
    const [searchQuery, allow] = querySecurMongoDB(query.query) || '';

    const queryFilter =
        searchQuery && searchQuery !== 'all'
            ? {
                name: {
                    $regex: searchQuery,
                    $options: 'i',
                },
            }
            : {};
    const categorieFilter = categorie && categorie !== 'all' ? { categorie } : {};
    const ratingFilter =
        rating && rating !== 'all'
            ? {
                rating: {
                    $gte: Number(rating),
                },
            }
            : {};
    // 10-50
    const priceFilter =
        price && price !== 'all'
            ? {
                price: {
                    $gte: Number(price.split('-')[0]),
                    $lte: Number(price.split('-')[1]),
                },
            }
            : {};
    const order: any =
        sort === 'featured'
            ? { isFeatured: -1 }
            : sort === 'lowest'
                ? { price: 1 }
                : sort === 'highest'
                    ? { price: -1 }
                    : sort === 'toprated'
                        ? { rating: -1 }
                        : sort === 'newest'
                            ? { createdAt: -1 }
                            : { _id: -1 };
    try {

        await db.connect();
        const categories = await Categorie.find().lean();
        const productDocs = await Product.find(
            {
                isPublished: true,
                ...queryFilter,
                ...categorieFilter,
                ...priceFilter,
                ...ratingFilter,
            }, {
            _id: 1,
            main_image: 1,
            name: 1,
            slug: 1,
            price: 1,
            price_in: 1,
            rating: 1
        }
        )
            .sort(order)
            .skip(pageSize * (page - 1))
            .limit(pageSize)
            .populate("categorie")
            .lean();

        const countProducts = await Product.countDocuments({
            isPublished: true,
            ...queryFilter,
            ...categorieFilter,
            ...priceFilter,
            ...ratingFilter,
        });

        await db.disconnect();

        return {
            props: {
                searchQuery: searchQuery,
                products: JSON.parse(JSON.stringify(productDocs)),
                countProducts,
                page,
                pages: Math.ceil(countProducts / pageSize),
                categories: categories.map(db.convertDocToObj),
            },
        };

    } catch (error) {
        return {
            props: {
                searchQuery: searchQuery,
                products: [],
                countProducts: 1,
                page: 1,
                pages: 1,
                categories: [],
            },
        };
    }
}

export default Search