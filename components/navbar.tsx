import React, { useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import { useRecoilState } from 'recoil';
import { cartState } from "@atoms/cartState"
import { CART_EMPTY, setCartState } from '@atoms/setStates/setCartState';
import { useTimeout, useEscapeListener } from '@libs/hooks/index'
import SearchResultItem from '@components/cards/SearchResultItem';
//import { useVideoSearch } from '@libs/hooks/useSearch'

import { querySecurMongoDB, replaceURL } from '@libs/utils';
import { fetchPostJSON } from '@libs/utils/api-helpers';
import { BsPersonPlusFill } from 'react-icons/bs';
import { TypeCartItem } from '@libs/typings';

interface NavbarProps {
    placeholderSearch?: string;
}
 
function Navbar({ placeholderSearch }: NavbarProps) {
    const router = useRouter()
    const { status, data: session } = useSession();
    const [cartItem, setCartItem] = useRecoilState(cartState)

    const searchBarMenuRef = useRef(null);
    const [query, setQuery] = useState<null | string>(null);
    const [searchBarFocus, setSearchBarFocus] = useState<boolean>(false);
    const [searchResult, setSearchResult] = useState([]);

    //const { results, hasMore, loading, error } = useVideoSearch(query, pageNumber)

    const searchRequest = async () => {
        if (!query || query.length === 0) {
            setSearchResult([])
            return;
        };

        const { data } = await fetchPostJSON('/api/product/search', { query: query })
        setSearchResult(data)
    }

    const handleRedirectSearch = () => {
        if (!query || query.length === 0) return;
        router.push(`/search?query=${query}`)
    }

    // searchbar => call fetch reasult, add delay for saving request
    useTimeout(searchRequest, 500, query)
    // escape research popup
    useEscapeListener(searchBarMenuRef, () => setSearchBarFocus(false))

    // cart details
    const [totalCartValue, totalCountItems] = useMemo(() => {
        let total = 0
        cartItem.forEach((item: TypeCartItem[]) => total += (item.price * item.quantity))
        const countItems = cartItem.length;
        return [total, countItems]
    }, [cartItem]);

    // logout Handler
    const logoutClickHandler = () => {
        setCartState({
            action: CART_EMPTY,
            product: {},
            cartItem: cartItem,
            setCartItem: setCartItem
        })
        signOut({ callbackUrl: '/auth/login' });
    };

    // SIDEBAR
    const handleToggleSidebar = () => {
        document.body.classList.toggle('sidebar-open');
    };

    const ref = useRef(null)

    useEscapeListener(ref, () => document.body.classList.remove('sidebar-open'))

    return (
        <nav className="fixed top-0 z-50 justify-between h-16 space-x-0.5 shadow-lg md:space-x-4 navbar bg-base-100 md:px-8">
            <div className='flex-none'>

                <button ref={ref} className="btn btn-square btn-ghost lg:hidden" onClick={handleToggleSidebar}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </button>

                <Link href='/' className="hidden text-xl font-black text-transparent uppercase sm:block bg-clip-text bg-gradient-to-r via-sky-500 from-blue-700 to-purple-500" >
                    Spaceate
                </Link>
            </div>

            <div ref={searchBarMenuRef} className='relative border border[#f3f6fd] bg-[#f3f6fd] rounded-full shadow-lg w-full max-w-[480px] h-10 flex justify-between items-center px-3'>
                <input
                    type="search"
                    placeholder='Search'
                    className='w-full bg-transparent outline-none'
                    defaultValue={placeholderSearch || ""}
                    onKeyUp={(e) => {
                        setSearchBarFocus(true);
                        const [value, allow] = querySecurMongoDB(e.currentTarget.value.trim());

                        if(allow){
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
                    searchBarFocus && searchResult.length > 0 && (
                        <div className='absolute left-0 right-0 -z-[1] w-full bg-[#f3f6fd] rounded-b-lg shadow-lg top-5'>
                            <div className='p-1.5 mt-5 space-y-0.5 overflow-hidden rounded-md flex flex-col'>
                                {
                                    searchResult.map((data, key) => <SearchResultItem key={key} product={data} />)
                                }
                            </div>
                        </div>
                    )
                }
            </div>


            <div className="flex-none space-x-1 md:space-x-4">
                <div className='hidden space-x-4 lg:block'>
                    <Link href='/colis' className='mb-1 text-lg font-semibold leading-loose hover:underline underline-offset-8'>Colis</Link>
                    <Link href='/' className='mb-1 text-lg font-semibold leading-loose hover:underline underline-offset-8'>Fruit</Link>
                    <Link href='/' className='mb-1 text-lg font-semibold leading-loose hover:underline underline-offset-8'>Legumes</Link>
                    <Link href='/' className='mb-1 text-lg font-semibold leading-loose hover:underline underline-offset-8'>Contact</Link>
                </div>

                <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost btn-circle">
                        <div className="indicator">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            <span className="badge badge-sm indicator-item">{totalCountItems}</span>
                        </div>
                    </label>
                    <div tabIndex={0} className="mt-3 shadow card card-compact dropdown-content w-52 bg-base-100">
                        <div className="card-body">

                            <div className="-space-x-6 avatar-group">

                                {
                                    cartItem.length > 0 && [...cartItem].slice(0, 4).map((p, k) => <div key={k} className="avatar">
                                        <div className="w-12">
                                            <img src={replaceURL(p.main_image)} alt={`panier spaceate - ${p.name}`} />
                                        </div>
                                    </div>)
                                }

                                {
                                    cartItem.length > 4 && (
                                        <div className="select-none avatar placeholder">
                                            <div className="w-12 bg-neutral-focus text-neutral-content">
                                                <span>+{totalCountItems - 3}</span>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>


                            <span className="text-info">Total: {(totalCartValue).toFixed(2)}€</span>
                            <div className="card-actions">
                                <Link href='/cart' className="border-none btn bg-sky-500 hover:bg-sky-600 btn-block">Voir le panier</Link>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    status !== 'loading' && session?.user ? (
                        <div className="dropdown dropdown-end">
                            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full">
                                    <img src="https://placeimg.com/80/80/people" />
                                </div>
                            </label>
                            <ul tabIndex={0} className="p-2 mt-3 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
                                <li><Link href="/user">Profil</Link></li>
                                <li><Link href="/user/order-history">Mes commandes</Link></li>
                                {
                                    session?.user?.isAdmin && (
                                        <li className='border-t'><Link href="/admin/">Admin Dashboard</Link></li>
                                    )
                                }
                                <li className='border-t'><a onClick={logoutClickHandler}>Se déconnecter</a></li>
                            </ul>
                        </div>
                    ) : (
                        <Link href="/auth/register" className='p-2 text-sm font-bold rounded lg:block button-click-effect'>
                            <BsPersonPlusFill className="w-5 h-5" />
                        </Link>
                    )
                }
            </div>
        </nav>
    )
}

export default dynamic(() => Promise.resolve(Navbar), { ssr: false });