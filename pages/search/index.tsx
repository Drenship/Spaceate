import React, { useState, useMemo, useEffect } from 'react'
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
import { BsSliders } from 'react-icons/bs';
import { RxEyeClosed } from 'react-icons/rx';
import Pagination from '@components/ui-ux/Pagination';
import { useLeftSwipe, useRightSwipe } from '@libs/hooks';

const PAGE_SIZE = 20;
const ratings = [1, 2, 3, 4, 5];
const prices = [
    {
        name: 'moins de 1€',
        value: '0-1',
    }, {
        name: '1€ à 10€',
        value: '1-10',
    },
    {
        name: '10€ à 20€',
        value: '10.01-20',
    },
    {
        name: '20€ à 50',
        value: '20.01-50',
    }, {
        name: '50€ et plus',
        value: '50.01',
    }
];

interface FilterSearchParams {
    page?: number;
    categorie?: string;
    subCategorie?: string;
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
    pages: number
}


const Search: NextPage<Props> = ({ searchQuery, products, countProducts, categories, pages }) => {
    const router = useRouter()
    const fixeValueFiltersPannel = "-100vw";
    const [toggleFiltersPannel, setToggleFiltersPannel] = useState<0 | "-100vw">(fixeValueFiltersPannel);

    const {
        query = 'all',
        categorie = 'all',
        subCategorie = 'all',
        price = 'all',
        rating = 'all',
        sort = 'featured',
        page = 1,
    }: RouterQueryParams = router.query;

    const filterSearch = ({
        page,
        categorie,
        subCategorie,
        sort,
        min = null,
        max = null,
        searchQuery,
        price,
        rating,
    }: FilterSearchParams) => {
        setToggleFiltersPannel(fixeValueFiltersPannel)
        const { query }: any = router;
        if (page) query.page = page;
        if (searchQuery) query.searchQuery = searchQuery;
        if (sort) query.sort = sort;
        if (categorie) query.categorie = categorie;
        if (subCategorie) query.subCategorie = subCategorie;
        if (price) query.price = price;
        if (rating) query.rating = rating;
        if (min) query.min ? query.min : query.min === 0 ? 0 : min;
        if (max) query.max ? query.max : query.max === 0 ? 0 : max;

        router.push({
            pathname: router.pathname,
            query: query,
        });
    };

    const [getSubCategories, currentSubCategorie] = useMemo(() => {
        if (categorie === 'all') return [[], null]
        const subCategories = [...categories].filter(c => c._id === categorie)[0].subCategories
        const currentSubCategorie = subCategories.filter(sc => sc._id === subCategorie)[0]

        return subCategories.length > 0 ? [subCategories, currentSubCategorie] : [[], null]
    }, [categorie, subCategorie]);

    const categorieHandler = (e: React.BaseSyntheticEvent) => filterSearch({ categorie: e.target.value, subCategorie: 'all' });

    const subCategorieHandler = (e: React.BaseSyntheticEvent) => filterSearch({ subCategorie: e.target.value });

    const pageHandler = (page: number) => filterSearch({ page });

    const sortHandler = (e: React.BaseSyntheticEvent) => filterSearch({ sort: e.target.value });

    const priceHandler = (e: React.BaseSyntheticEvent) => filterSearch({ price: e.target.value });

    const ratingHandler = (e: React.BaseSyntheticEvent) => filterSearch({ rating: e.target.value });

    // toggle filter panel on mobile
    useRightSwipe(() => setToggleFiltersPannel(0)) // add
    useLeftSwipe(() => setToggleFiltersPannel(fixeValueFiltersPannel)) // remove

    useEffect(() => {
        if (toggleFiltersPannel) {
            document.body.classList.remove("no-scroll");
        } else {
            document.body.classList.add("no-scroll");
        }
    }, [toggleFiltersPannel]);

    return (
        <BasescreenWrapper placeholderSearch={searchQuery} title={searchQuery} footer={false}>
            <div className="flex flex-col md:flex-row w-full min-h-[calc(100vh-64px)] relative bg-gray-100">
                { /* filtre options left */}
                <button
                    className='fixed left-0 z-40 flex items-center justify-center w-12 h-12 bg-white border border-l-0 border-black rounded-r-lg top-20 md:hidden button-click-effect'
                    onClick={() => setToggleFiltersPannel(prev => prev === 0 ? fixeValueFiltersPannel : 0)}
                >
                    <BsSliders className='rotate-90' />
                </button>
                <div
                    className='fixed z-40 h-[calc(100vh-64px)] -left-[100vw] duration-300 transition-all flex-row md:block md:flex-shrink md:max-w-[25vw] md:min-w-[25vw] w-full p-3 sm:px-6 sm:h-full md:sticky top-16 bg-gray-100'
                    style={{ left: toggleFiltersPannel }}
                >
                    <div className='flex items-center justify-between mb-3 space-x-3 md:hidden'>
                        <h1 className='flex items-center w-full h-12 px-3 uppercase bg-white border rounded-lg font-500'>Filtres</h1>
                        <button
                            className='flex items-center justify-center flex-shrink-0 w-12 h-12 bg-white border rounded-lg button-click-effect'
                            onClick={() => setToggleFiltersPannel(fixeValueFiltersPannel)}
                        >
                            <RxEyeClosed />
                        </button>
                    </div>

                    <div className="p-2 mb-3 bg-white border rounded-lg">
                        <select
                            className="w-full bg-white outline-none"
                            value={categorie}
                            onChange={categorieHandler}
                        >
                            <option value="all">Tous les categories</option>
                            {categories &&
                                categories.map((categorie, key) => (
                                    <option key={key} value={categorie._id}>
                                        {categorie.name}
                                    </option>
                                ))}
                        </select>
                    </div>

                    {
                        categorie && categorie !== 'all' && (
                            <div className="p-2 mb-3 bg-white border rounded-lg">
                                <select
                                    className="w-full bg-white outline-none"
                                    value={subCategorie}
                                    onChange={subCategorieHandler}
                                >
                                    <option value="all">Tous les sous categories</option>
                                    {getSubCategories &&
                                        getSubCategories.map((categorie, key) => (
                                            <option key={key} value={categorie._id}>
                                                {categorie.name}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        )
                    }

                    <div className="p-2 mb-3 bg-white border rounded-lg">
                        <select className="w-full bg-white outline-none" value={price} onChange={priceHandler}>
                            <option value="all">Tous les prix</option>
                            {prices &&
                                prices.map((price) => (
                                    <option key={price.value} value={price.value}>
                                        {price.name}
                                    </option>
                                ))}
                        </select>
                    </div>

                    <div className="p-2 mb-3 bg-white border rounded-lg">
                        <select className="w-full bg-white outline-none" value={rating} onChange={ratingHandler}>
                            <option value="all">Tous les notes</option>
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
                    <div className="flex flex-col items-start justify-between pb-2 mb-2 border-b-2 md:items-center md:flex-row w-ull">
                        <div className="flex items-center">
                            {products.length === 0 ? 'No' : countProducts} Résultats
                            {query !== 'all' && query !== '' && ' : ' + query}
                            {categorie !== 'all' && ', ' + categories.filter(sc => sc._id === categorie)[0].name}
                            {subCategorie !== 'all' && currentSubCategorie !== null && ', ' + currentSubCategorie.name}
                            {price !== 'all' && ', Prix ' + price}
                            {rating !== 'all' && ', étoile ' + rating + ' et plus'}
                            &nbsp;

                            {
                                [categorie, subCategorie, price, rating].find(x => x !== 'all') && (
                                    <button onClick={() => router.push('/search?query=' + query)}>
                                        <XCircleIcon className="w-5 h-5" />
                                    </button>
                                )
                            }
                        </div>
                        <div className='mt-3 md:mt-0'>
                            Filtre par{' '}
                            <select className='bg-white' value={sort} onChange={sortHandler}>
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
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {products.map((product, key) => (
                                <BestsellerCard
                                    key={key}
                                    product={product}
                                />
                            ))}
                        </div>
                        <Pagination
                            current={page}
                            pages={pages}
                            pageHandler={(x) => pageHandler(x)}
                        />
                    </div>
                </div>
            </div>
        </BasescreenWrapper>
    )
}

type QuerySearch = {
    query: {
        page: number
        categorie: string
        subCategorie: string
        price: string
        rating: string
        sort: string
        query: string
    }
}

export async function getServerSideProps({ query }: QuerySearch) {

    const pageSize = PAGE_SIZE;
    const page = query.page >= 1 ? query.page : 1;
    const categorie = query.categorie || '';
    const subCategorie = query.subCategorie || '';
    const price = query.price || '';
    const rating = query.rating || '';
    const sort = query.sort || '';
    const [searchQuery] = query && query.query ? querySecurMongoDB(query.query) : [''];

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
    const subcategorieFilter = subCategorie && subCategorie !== 'all' ? { subCategorie } : {};

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

        const productSearchFullQuery = {
            isPublished: true,
            ...queryFilter,
            ...categorieFilter,
            ...subcategorieFilter,
            ...priceFilter,
            ...ratingFilter,
        };
        const categories = await Categorie.find().lean();
        const productDocs = await Product.find(productSearchFullQuery, {
            _id: 1,
            main_image: 1,
            name: 1,
            slug: 1,
            price: 1,
            price_in: 1,
            rating: 1,
            countInStock: 1,
            numReviews: 1
        })
            .sort(order)
            .skip(pageSize * (page - 1))
            .limit(pageSize)
            //.populate("categorie")
            .lean();

        const countProducts = await Product.countDocuments(productSearchFullQuery);

        await db.disconnect();

        return {
            props: {
                searchQuery: searchQuery,
                products: JSON.parse(JSON.stringify(productDocs)),
                countProducts: countProducts,
                pages: Math.ceil(countProducts / pageSize),
                categories: categories.map(db.convertDocToObj),
            },
        };

    } catch (error) {
        await db.disconnect();
        return {
            props: {
                searchQuery: searchQuery,
                products: [],
                countProducts: 0,
                pages: 0,
                categories: [],
            },
        };
    }
}

export default Search