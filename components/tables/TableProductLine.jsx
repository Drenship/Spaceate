import React, { useMemo, useRef, useState } from 'react';
import { useEscapeListener } from '@libs/hooks';
import Link from 'next/link';
import BlurImage from '@components/ui-ux/BlurImage';
import { replaceURL, UTCStringToDate } from '@libs/utils';

export default function TableProductLine({ product, checkAll, updateMainProducts }) {

    const seeMenuRef = useRef(null);
    const [seeMenu, setSeeMenu] = useState(false);
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

    console.log(product)

    return (
        <tr className="h-24 border-b border-gray-300">
            <td className="pl-8 pr-6 text-sm leading-4 tracking-normal text-left text-gray-800 whitespace-no-wrap">
                <input
                    type="checkbox"
                    checked={checkboxChecked}
                    className="relative w-5 h-5 bg-white border border-gray-400 rounded outline-none cursor-pointer"
                    onClick={() => setChecked(prev => !prev)}
                />
            </td>
            <td className="pr-6 text-sm leading-4 tracking-normal text-gray-800 whitespace-no-wrap ">
                <div className="relative text-gray-600 max-w-20">
                    <div className='relative object-cover w-full overflow-hidden rounded-lg aspect-square'>
                        <BlurImage
                            src={replaceURL(product.main_image)}
                        />
                    </div>
                </div>
            </td>
            <td className="pr-6 text-sm leading-4 tracking-normal text-gray-800 whitespace-no-wrap">{product.name}</td>
            <td className="pr-6 text-sm leading-4 tracking-normal text-gray-800 whitespace-no-wrap">{product.slug}</td>
            <td className="pr-6 whitespace-no-wrap">{product.countInStock}</td>
            <td className="pr-6 text-sm leading-4 tracking-normal text-gray-800 whitespace-no-wrap">{product?.stats?.totalSelled || 0}</td>
            <td className="pr-6 text-sm leading-4 tracking-normal text-gray-800 whitespace-no-wrap">{product.price}€</td>
            <td className="pr-6 text-sm leading-4 tracking-normal text-gray-800 whitespace-no-wrap">{UTCStringToDate(product.createdAt)}</td>
            <td className="pr-6">
                <div className="w-2 h-2 bg-indigo-400 rounded-full" />
            </td>
            <td className="relative pr-8">
                <div className={`absolute left-0 z-10 w-32 mt-8 -ml-12 shadow-md dropdown-content ${!seeMenu && 'hidden'}`}>
                    <ul className="py-1 bg-white rounded shadow ">
                        <Link href={`/product/${product.slug}`}>
                            <li className="px-3 py-3 text-sm font-normal leading-3 tracking-normal text-gray-600 cursor-pointer hover:bg-indigo-700 hover:text-white">Voire</li>
                        </Link>
                        <li className="px-3 py-3 text-sm font-normal leading-3 tracking-normal text-gray-600 cursor-pointer hover:bg-indigo-700 hover:text-white">Edit</li>
                        <li className="px-3 py-3 text-sm font-normal leading-3 tracking-normal text-gray-600 cursor-pointer hover:bg-indigo-700 hover:text-white">Delete</li>
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
            </td>
        </tr>
    )
}