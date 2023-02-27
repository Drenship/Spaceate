import React, { useRef, useState, useMemo } from 'react';
import { fetchDeleteJSON } from '@libs/utils/api-helpers';
import { useEscapeListener } from '@libs/hooks';
import { UTCStringToDate } from '@libs/utils';

export default function TableUserLine({ checkAll, user, updateMainUsers }) {

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


    const handleDeleteUser = async () => {
        if (confirm("Confirmer la suppression de : " + user.name) != true) return;

        try {
            const response = await fetchDeleteJSON(`/api/admin/users/${user._id}`)
            if (response?.data) {
                updateMainUsers(response?.data)
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <tr className="h-20 border-b border-gray-300">
            <td className="pl-8 pr-6 text-sm leading-4 tracking-normal text-left text-gray-800 whitespace-no-wrap">
                <input
                    type="checkbox"
                    checked={checkboxChecked}
                    className="relative w-5 h-5 bg-white border border-gray-400 rounded outline-none cursor-pointer"
                    onClick={() => setChecked(prev => !prev)}
                />
            </td>
            <td className="pr-6 leading-4 tracking-normal text-center text-gray-800 whitespace-no-wrap">
                {
                    user.isAdmin ? (
                        <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                    ) : (
                        <div className='w-2 h-2 bg-gray-300 rounded-full'></div>
                    )
                }
            </td>
            <td className="pr-6 text-sm leading-4 tracking-normal text-gray-800 whitespace-no-wrap">
                {user.name}
            </td>
            <td className="pr-6 text-sm leading-4 tracking-normal text-gray-800 whitespace-no-wrap">
                {user.email}
            </td>
            <td className="pr-6 text-sm leading-4 tracking-normal text-center text-gray-800 whitespace-no-wrap">
                {user.ordersHistory.length}
            </td>

            <td className="pr-6 text-sm leading-4 tracking-normal text-gray-800 whitespace-no-wrap">
                {UTCStringToDate(user.createdAt)}
            </td>

            <td className="relative pr-8 text-right">
                <div className={`absolute right-0 z-10 w-32 mt-8 -ml-12 shadow-md dropdown-content ${!seeMenu && 'hidden'}`}>
                    <ul className="py-1 text-left bg-white rounded shadow">
                        <li className="px-3 py-3 text-sm font-normal leading-3 tracking-normal text-gray-600 cursor-pointer hover:bg-indigo-700 hover:text-white">Modifier</li>
                        <li onClick={handleDeleteUser} className="px-3 py-3 text-sm font-normal leading-3 tracking-normal text-gray-600 cursor-pointer hover:bg-indigo-700 hover:text-white">Delete</li>
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
        </tr >
    );
}