import React, { useRef, useState } from 'react'
import { useRouter } from 'next/router';

import { useTimeout, useEscapeListener } from '@libs/hooks/index'
import { querySecurMongoDB } from '@libs/utils';
import { fetchPostJSON } from '@libs/utils/api-helpers';
import { TypeProduct, TypeUser } from '@libs/typings';

import SearchResultItem from '@components/cards/SearchResultItem';

interface SearchbarProps {
    user: TypeUser | null,
    placeholderSearch?: string
}

export default function Searchbar({ user, placeholderSearch }: SearchbarProps) {
    const router = useRouter()

    const searchBarMenuRef = useRef(null);
    const [query, setQuery] = useState<null | string>(null);
    const [searchBarFocus, setSearchBarFocus] = useState<boolean>(false);
    const [searchResult, setSearchResult] = useState([]);

    const searchRequest = async () => {
        if (!query || query.length < 2) {
            setSearchResult([])
            return;
        };

        const { data } = await fetchPostJSON('/api/product/search', { query: query })
        setSearchResult(data)
    }

    interface handleRedirectSearchProps { forceQuery?: string | undefined }
    const handleRedirectSearch = async (forceQuery: handleRedirectSearchProps = { forceQuery: undefined }) => {
        const searchQuery = forceQuery ? forceQuery : query
        if (!searchQuery || searchQuery.length === 0) return;
        if (user && searchQuery.length > 1) {
            await fetchPostJSON('/api/user/update/search-history', { query: searchQuery })
        }
        router.push(`/search?query=${searchQuery}`)
    }

    // searchbar => call fetch reasult, add delay for saving request
    useTimeout(searchRequest, 500, query)
    // escape research popup
    useEscapeListener(searchBarMenuRef, () => setSearchBarFocus(false))

    return (
        <div
            ref={searchBarMenuRef}
            className='relative border border-solid border-gray-200 border-x-[0.15rem] focus-within:border-x-sky-500 transition-all duration-300 bg-[#f3f6fd] rounded-full shadow-lg w-full max-w-[480px] h-10 flex justify-between items-center px-3'
        >
            <input
                type="search"
                placeholder='Search'
                className='w-full bg-transparent outline-none'
                defaultValue={placeholderSearch || ""}
                onKeyUp={(e) => {
                    setSearchBarFocus(true);
                    const [value, allow] = querySecurMongoDB(e.currentTarget.value.trim());

                    if (allow) {
                        setQuery(value);
                    }

                    if (e.key === "Enter") {
                        handleRedirectSearch()
                    }
                }}
                onFocus={(e) => { setSearchBarFocus(true) }}
                onBlur={(e) => { setTimeout(() => { setSearchBarFocus(false) }, 200) }}
            />
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                <defs></defs>
                <circle cx="11" cy="11" r="8"></circle>
                <path d="M21 21l-4.35-4.35"></path>
            </svg>

            {
                searchBarFocus && (searchResult.length > 0 || user?.searchHistory?.length) && (
                    <div className='fixed top-8 sm:absolute left-0 right-0 -z-[1] w-full bg-[#f3f6fd] rounded-b-lg shadow-lg sm:top-5'>
                        <div className='p-1.5 mt-5 space-y-0.5 overflow-hidden rounded-md flex flex-col'>
                            {
                                query && user && user?.searchHistory && user.searchHistory.length && (
                                    [...(user.searchHistory || [])]
                                        .filter((history) => history.toLowerCase().includes(query))
                                        .slice(0, 4)
                                        .map((historyQuery, key) => <button
                                            className='flex w-full bg-white py-1 border-t shadow-lg border-[#f3f6fd] p-2 text-sm font-bold uppercase'
                                            key={key}
                                            onClick={() => {
                                                setQuery(historyQuery);
                                                handleRedirectSearch(historyQuery)
                                            }}
                                        >{historyQuery}</button>)
                                )
                            }
                            {
                                searchResult.map((data: TypeProduct) => <SearchResultItem key={data._id} product={data} />)
                            }
                        </div>
                    </div>
                )
            }
        </div>

    );
}
