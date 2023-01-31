import React, { useMemo, useRef, useState } from 'react';
import { useEscapeListener } from '@libs/hooks';

type Props = {
    checkAll: boolean,
    product: {
        _id: string,
        main_image: string
        name: string,
        slug: string,
        stock: number,
        totalSelled: number,
        price: number,
        data: Date,
    }
}

export default function TableProductLine({ product, checkAll }: Props) {

    const seeMenuRef = useRef(null);
    const [seeMenu, setSeeMenu] = useState(false);
    const [checked, setChecked] = useState(false);
    const [prevCheck, setPrevCheck] = useState({
        checkAll: checkAll,
        checked: checked
    });

    const checkboxChecked = useMemo(() => {
        if(prevCheck.checked !== checked) {
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
                <div className="relative w-10 text-gray-600">
                    <div className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 mr-2 -mt-1 text-xs text-white bg-indigo-700 rounded-full">3</div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-file" width={28} height={28} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" />
                        <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                        <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                    </svg>
                </div>
            </td>
            <td className="pr-6 text-sm leading-4 tracking-normal text-gray-800 whitespace-no-wrap">#MC10023</td>
            <td className="pr-6 text-sm leading-4 tracking-normal text-gray-800 whitespace-no-wrap">Toyota Motors</td>
            <td className="pr-6 whitespace-no-wrap">324</td>
            <td className="pr-6 text-sm leading-4 tracking-normal text-gray-800 whitespace-no-wrap">10</td>
            <td className="pr-6 text-sm leading-4 tracking-normal text-gray-800 whitespace-no-wrap">2,500€</td>
            <td className="pr-6 text-sm leading-4 tracking-normal text-gray-800 whitespace-no-wrap">02.03.20</td>
            <td className="pr-6">
                <div className="w-2 h-2 bg-indigo-400 rounded-full" />
            </td>
            <td className="relative pr-8">
                <div className={`absolute left-0 z-10 w-32 mt-8 -ml-12 shadow-md dropdown-content ${seeMenu && 'hidden'}`}>
                    <ul className="py-1 bg-white rounded shadow ">
                        <li className="px-3 py-3 text-sm font-normal leading-3 tracking-normal text-gray-600 cursor-pointer hover:bg-indigo-700 hover:text-white">Edit</li>
                        <li className="px-3 py-3 text-sm font-normal leading-3 tracking-normal text-gray-600 cursor-pointer hover:bg-indigo-700 hover:text-white">Delete</li>
                        <li className="px-3 py-3 text-sm font-normal leading-3 tracking-normal text-gray-600 cursor-pointer hover:bg-indigo-700 hover:text-white">Duplicate</li>
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
