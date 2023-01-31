import React from 'react';
import AdminscreenWrapper from '@components/Wrapper/AdminscreenWrapper'

function AdminProductsScreen() {
    return (
        <AdminscreenWrapper title="Products">
            <h1>Products</h1>



                <div className="container mx-auto bg-white rounded shadow dark:bg-gray-800">
                    <div className="flex flex-col items-start justify-between w-full p-4 lg:flex-row lg:p-8 lg:items-stretch">
                        <div className="flex flex-col items-start w-full lg:w-1/3 lg:flex-row lg:items-center">
                            <div className="flex items-center">
                                <a className="p-2 text-gray-600 bg-gray-100 border border-transparent rounded cursor-pointer dark:text-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 hover:bg-gray-200 focus:outline-none focus:border-gray-800 focus:shadow-outline-gray" href="javascript: void(0)">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="cursor-pointer icon icon-tabler icon-tabler-edit" width={20} height={20} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" />
                                        <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />
                                        <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />
                                        <line x1={16} y1={5} x2={19} y2={8} />
                                    </svg>
                                </a>
                                <a className="p-2 mx-2 text-gray-600 bg-gray-100 border border-transparent rounded cursor-pointer dark:text-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 hover:bg-gray-200 focus:outline-none focus:border-gray-800 focus:shadow-outline-gray" href="javascript: void(0)">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="cursor-pointer icon icon-tabler icon-tabler-settings" width={20} height={20} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" />
                                        <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <circle cx={12} cy={12} r={3} />
                                    </svg>
                                </a>
                                <a className="p-2 mr-2 text-gray-600 bg-gray-100 border border-transparent rounded cursor-pointer dark:text-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 hover:bg-gray-200 focus:outline-none focus:border-gray-800 focus:shadow-outline-gray" href="javascript: void(0)">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-bookmark" width={20} height={20} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" />
                                        <path d="M9 4h6a2 2 0 0 1 2 2v14l-5-3l-5 3v-14a2 2 0 0 1 2 -2" />
                                    </svg>
                                </a>
                                <a className="p-2 mr-2 text-gray-600 bg-gray-100 border border-transparent rounded cursor-pointer dark:text-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 hover:bg-gray-200 focus:outline-none focus:border-gray-800 focus:shadow-outline-gray" href="javascript: void(0)">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-copy" width={20} height={20} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" />
                                        <rect x={8} y={8} width={12} height={12} rx={2} />
                                        <path d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2" />
                                    </svg>
                                </a>
                                <a className="p-2 text-red-500 bg-gray-100 border border-transparent rounded cursor-pointer dark:bg-gray-700 dark:hover:bg-gray-600 hover:bg-gray-200 focus:outline-none focus:border-gray-800 focus:shadow-outline-gray" href="javascript: void(0)">
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
                            <div className="flex items-center py-3 border-gray-300 lg:border-l lg:border-r dark:border-gray-200 lg:py-0 lg:px-6">
                                <p className="text-base text-gray-600 dark:text-gray-400" id="page-view">
                                    Viewing 1 - 20 of 60
                                </p>
                                <a className="ml-2 text-gray-600 border border-transparent rounded cursor-pointer dark:text-gray-400" onclick="pageView(false)">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-chevron-left" width={20} height={20} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" />
                                        <polyline points="15 6 9 12 15 18" />
                                    </svg>
                                </a>
                                <a className="text-gray-600 border border-transparent rounded cursor-pointer dark:text-gray-400 focus:outline-none" onclick="pageView(true)">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-chevron-right" width={20} height={20} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" />
                                        <polyline points="9 6 15 12 9 18" />
                                    </svg>
                                </a>
                            </div>
                            <div className="flex items-center pb-3 border-gray-300 lg:border-r dark:border-gray-200 lg:pb-0 lg:px-6">
                                <div className="relative z-10 w-32">
                                    <div className="absolute inset-0 z-0 w-5 h-5 m-auto mr-2 text-gray-600 pointer-events-none dark:text-gray-400 xl:mr-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="cursor-pointer icon icon-tabler icon-tabler-chevron-down" width={20} height={20} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" />
                                            <polyline points="6 9 12 15 18 9" />
                                        </svg>
                                    </div>
                                    <select aria-label="Selected tab" className="block w-full px-2 py-2 text-base text-gray-600 bg-transparent border border-transparent rounded appearance-none focus:outline-none focus:border-gray-800 focus:shadow-outline-gray form-select xl:px-3 dark:text-gray-400">
                                        <option>List View</option>
                                        <option>Grid View</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex items-center lg:ml-6">
                                <button className="flex items-center h-8 px-5 text-sm text-indigo-700 transition duration-150 ease-in-out bg-gray-200 border border-transparent rounded focus:outline-none focus:border-gray-800 focus:shadow-outline-gray hover:bg-gray-300">Download All</button>
                                <div className="flex items-center justify-center w-8 h-8 ml-4 text-white transition duration-150 ease-in-out bg-indigo-700 border border-transparent rounded cursor-pointer focus:outline-none focus:border-gray-800 focus:shadow-outline-gray hover:bg-indigo-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-plus" width={28} height={28} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" />
                                        <line x1={12} y1={5} x2={12} y2={19} />
                                        <line x1={5} y1={12} x2={19} y2={12} />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full overflow-x-scroll xl:overflow-x-hidden">
                        <table className="min-w-full bg-white dark:bg-gray-800">
                            <thead>
                                <tr className="w-full h-16 py-8 border-b border-gray-300 dark:border-gray-200">
                                    <th className="pl-8 pr-6 text-sm font-normal leading-4 tracking-normal text-left text-gray-600 dark:text-gray-400">
                                        <input type="checkbox" className="relative w-5 h-5 bg-white border border-gray-400 rounded outline-none cursor-pointer dark:border-gray-200 dark:bg-gray-800" onclick="checkAll(this)" />
                                    </th>
                                    <th className="pr-6 text-sm font-normal leading-4 tracking-normal text-left text-gray-600 dark:text-gray-400">
                                        <div className="relative w-10 text-gray-600 opacity-0 cursor-default dark:text-gray-400">
                                            <div className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 mr-2 -mt-1 text-xs text-white bg-indigo-700 rounded-full">3</div>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-file" width={28} height={28} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" />
                                                <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                                                <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                                            </svg>
                                        </div>
                                    </th>
                                    <th className="pr-6 text-sm font-normal leading-4 tracking-normal text-left text-gray-600 dark:text-gray-400">Invoice Number</th>
                                    <th className="pr-6 text-sm font-normal leading-4 tracking-normal text-left text-gray-600 dark:text-gray-400">Client</th>
                                    <th className="pr-6 text-sm font-normal leading-4 tracking-normal text-left text-gray-600 dark:text-gray-400">Company Contact</th>
                                    <th className="pr-6 text-sm font-normal leading-4 tracking-normal text-left text-gray-600 dark:text-gray-400">Amount</th>
                                    <th className="pr-6 text-sm font-normal leading-4 tracking-normal text-left text-gray-600 dark:text-gray-400">Date</th>
                                    <th className="pr-6 text-sm font-normal leading-4 tracking-normal text-left text-gray-600 dark:text-gray-400">
                                        <div className="w-2 h-2 bg-indigo-400 rounded-full opacity-0" />
                                    </th>
                                    <td className="pr-8 text-sm font-normal leading-4 tracking-normal text-left text-gray-600 dark:text-gray-400">More</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="h-24 border-b border-gray-300 dark:border-gray-200">
                                    <td className="pl-8 pr-6 text-sm leading-4 tracking-normal text-left text-gray-800 whitespace-no-wrap dark:text-gray-100">
                                        <input type="checkbox" className="relative w-5 h-5 bg-white border border-gray-400 rounded outline-none cursor-pointer dark:border-gray-200 dark:bg-gray-800" onclick="tableInteract(this)" />
                                    </td>
                                    <td className="pr-6 text-sm leading-4 tracking-normal text-gray-800 whitespace-no-wrap dark:text-gray-100">
                                        <div className="relative w-10 text-gray-600 dark:text-gray-400">
                                            <div className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 mr-2 -mt-1 text-xs text-white bg-indigo-700 rounded-full">3</div>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-file" width={28} height={28} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" />
                                                <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                                                <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                                            </svg>
                                        </div>
                                    </td>
                                    <td className="pr-6 text-sm leading-4 tracking-normal text-gray-800 whitespace-no-wrap dark:text-gray-100">#MC10023</td>
                                    <td className="pr-6 text-sm leading-4 tracking-normal text-gray-800 whitespace-no-wrap dark:text-gray-100">Toyota Motors</td>
                                    <td className="pr-6 whitespace-no-wrap">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8">
                                                <img src="https://tuk-cdn.s3.amazonaws.com/assets/components/advance_tables/at_1.png" alt className="w-full h-full overflow-hidden rounded-full shadow" />
                                            </div>
                                            <p className="ml-2 text-sm leading-4 tracking-normal text-gray-800 dark:text-gray-100">Carrie Anthony</p>
                                        </div>
                                    </td>
                                    <td className="pr-6 text-sm leading-4 tracking-normal text-gray-800 whitespace-no-wrap dark:text-gray-100">$2,500</td>
                                    <td className="pr-6 text-sm leading-4 tracking-normal text-gray-800 whitespace-no-wrap dark:text-gray-100">02.03.20</td>
                                    <td className="pr-6">
                                        <div className="w-2 h-2 bg-indigo-400 rounded-full" />
                                    </td>
                                    <td className="relative pr-8">
                                        <div className="absolute left-0 z-10 hidden w-32 mt-8 -ml-12 shadow-md dropdown-content">
                                            <ul className="py-1 bg-white rounded shadow dark:bg-gray-800">
                                                <li className="px-3 py-3 text-sm font-normal leading-3 tracking-normal text-gray-600 cursor-pointer dark:text-gray-400 hover:bg-indigo-700 hover:text-white">Edit</li>
                                                <li className="px-3 py-3 text-sm font-normal leading-3 tracking-normal text-gray-600 cursor-pointer dark:text-gray-400 hover:bg-indigo-700 hover:text-white">Delete</li>
                                                <li className="px-3 py-3 text-sm font-normal leading-3 tracking-normal text-gray-600 cursor-pointer dark:text-gray-400 hover:bg-indigo-700 hover:text-white">Duplicate</li>
                                            </ul>
                                        </div>
                                        <button className="text-gray-500 border border-transparent rounded cursor-pointer focus:outline-none">
                                            <svg xmlns="http://www.w3.org/2000/svg" onclick="dropdownFunction(this)" className="icon icon-tabler icon-tabler-dots-vertical dropbtn" width={28} height={28} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" />
                                                <circle cx={12} cy={12} r={1} />
                                                <circle cx={12} cy={19} r={1} />
                                                <circle cx={12} cy={5} r={1} />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                                <tr className="h-24 border-b border-gray-300 dark:border-gray-200">
                                    <td className="pl-8 pr-6 text-sm leading-4 tracking-normal text-left text-gray-800 whitespace-no-wrap dark:text-gray-100">
                                        <input type="checkbox" className="relative w-5 h-5 bg-white border border-gray-400 rounded outline-none cursor-pointer dark:border-gray-200 dark:bg-gray-800" onclick="tableInteract(this)" />
                                    </td>
                                    <td className="pr-6 text-sm leading-4 tracking-normal text-gray-800 whitespace-no-wrap dark:text-gray-100">
                                        <div className="relative w-10 text-gray-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-file" width={28} height={28} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" />
                                                <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                                                <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                                            </svg>
                                        </div>
                                    </td>
                                    <td className="pr-6 text-sm leading-4 tracking-normal text-gray-800 whitespace-no-wrap dark:text-gray-100">#MC10023</td>
                                    <td className="pr-6 text-sm leading-4 tracking-normal text-gray-800 whitespace-no-wrap dark:text-gray-100">Toyota Motors</td>
                                    <td className="pr-6 whitespace-no-wrap">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8">
                                                <img src="https://tuk-cdn.s3.amazonaws.com/assets/components/advance_tables/at_2.png" alt className="w-full h-full overflow-hidden rounded-full shadow" />
                                            </div>
                                            <p className="ml-2 text-sm leading-4 tracking-normal text-gray-800 dark:text-gray-100">Carrie Anthony</p>
                                        </div>
                                    </td>
                                    <td className="pr-6 text-sm leading-4 tracking-normal text-gray-800 whitespace-no-wrap dark:text-gray-100">$2,500</td>
                                    <td className="pr-6 text-sm leading-4 tracking-normal text-gray-800 whitespace-no-wrap dark:text-gray-100">02.03.20</td>
                                    <td className="pr-6">
                                        <div className="w-2 h-2 bg-red-400 rounded-full" />
                                    </td>
                                    <td className="relative pr-8">
                                        <button className="text-gray-500 border border-transparent rounded cursor-pointer focus:outline-none ">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-dots-vertical dropbtn" width={28} height={28} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" onclick="dropdownFunction(this)">
                                                <path stroke="none" d="M0 0h24v24H0z" />
                                                <circle cx={12} cy={12} r={1} />
                                                <circle cx={12} cy={19} r={1} />
                                                <circle cx={12} cy={5} r={1} />
                                            </svg>
                                        </button>
                                        <div className="absolute left-0 z-10 hidden w-32 mt-1 -ml-12 shadow-md dropdown-content">
                                            <ul className="py-1 bg-white rounded shadow dark:bg-gray-800">
                                                <li className="px-3 py-3 text-sm font-normal leading-3 tracking-normal text-gray-600 cursor-pointer dark:text-gray-400 hover:bg-indigo-700 hover:text-white">Edit</li>
                                                <li className="px-3 py-3 text-sm font-normal leading-3 tracking-normal text-gray-600 cursor-pointer dark:text-gray-400 hover:bg-indigo-700 hover:text-white">Delete</li>
                                                <li className="px-3 py-3 text-sm font-normal leading-3 tracking-normal text-gray-600 cursor-pointer dark:text-gray-400 hover:bg-indigo-700 hover:text-white">Duplicate</li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                                <tr className="h-24 border-b border-gray-300 dark:border-gray-200">
                                    <td className="pl-8 pr-6 text-sm leading-4 tracking-normal text-left text-gray-800 whitespace-no-wrap dark:text-gray-100">
                                        <input type="checkbox" className="relative w-5 h-5 bg-white border border-gray-400 rounded outline-none cursor-pointer dark:border-gray-200 dark:bg-gray-800" onclick="tableInteract(this)" />
                                    </td>
                                    <td className="pr-6 text-sm leading-4 tracking-normal text-gray-800 whitespace-no-wrap dark:text-gray-100">
                                        <div className="relative w-10 text-gray-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-file" width={28} height={28} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" />
                                                <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                                                <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                                            </svg>
                                        </div>
                                    </td>
                                    <td className="pr-6 text-sm leading-4 tracking-normal text-gray-800 whitespace-no-wrap dark:text-gray-100">#MC10023</td>
                                    <td className="pr-6 text-sm leading-4 tracking-normal text-gray-800 whitespace-no-wrap dark:text-gray-100">Toyota Motors</td>
                                    <td className="pr-6 whitespace-no-wrap">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8">
                                                <img src="https://tuk-cdn.s3.amazonaws.com/assets/components/advance_tables/at_3.png" alt className="w-full h-full overflow-hidden rounded-full shadow" />
                                            </div>
                                            <p className="ml-2 text-sm leading-4 tracking-normal text-gray-800 dark:text-gray-100">Carrie Anthony</p>
                                        </div>
                                    </td>
                                    <td className="pr-6 text-sm leading-4 tracking-normal text-gray-800 whitespace-no-wrap dark:text-gray-100">$2,500</td>
                                    <td className="pr-6 text-sm leading-4 tracking-normal text-gray-800 whitespace-no-wrap dark:text-gray-100">02.03.20</td>
                                    <td className="pr-6">
                                        <div className="w-2 h-2 bg-indigo-400 rounded-full" />
                                    </td>
                                    <td className="relative pr-8">
                                        <button className="text-gray-500 border border-transparent rounded cursor-pointer focus:outline-none">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-dots-vertical dropbtn" width={28} height={28} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" onclick="dropdownFunction(this)">
                                                <path stroke="none" d="M0 0h24v24H0z" />
                                                <circle cx={12} cy={12} r={1} />
                                                <circle cx={12} cy={19} r={1} />
                                                <circle cx={12} cy={5} r={1} />
                                            </svg>
                                        </button>
                                        <div className="absolute left-0 z-10 hidden w-32 mt-1 -ml-12 shadow-md dropdown-content">
                                            <ul className="py-1 bg-white rounded shadow dark:bg-gray-800">
                                                <li className="px-3 py-3 text-sm font-normal leading-3 tracking-normal text-gray-600 cursor-pointer dark:text-gray-400 hover:bg-indigo-700 hover:text-white">Edit</li>
                                                <li className="px-3 py-3 text-sm font-normal leading-3 tracking-normal text-gray-600 cursor-pointer dark:text-gray-400 hover:bg-indigo-700 hover:text-white">Delete</li>
                                                <li className="px-3 py-3 text-sm font-normal leading-3 tracking-normal text-gray-600 cursor-pointer dark:text-gray-400 hover:bg-indigo-700 hover:text-white">Duplicate</li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                                <tr className="h-24 border-b border-gray-300 dark:border-gray-200">
                                    <td className="pl-8 pr-6 text-sm leading-4 tracking-normal text-left text-gray-800 whitespace-no-wrap dark:text-gray-100">
                                        <input type="checkbox" className="relative w-5 h-5 bg-white border border-gray-400 rounded outline-none cursor-pointer dark:border-gray-200 dark:bg-gray-800" onclick="tableInteract(this)" />
                                    </td>
                                    <td className="pr-6 text-sm leading-4 tracking-normal text-gray-800 whitespace-no-wrap dark:text-gray-100">
                                        <div className="relative w-10 text-gray-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-file" width={28} height={28} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" />
                                                <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                                                <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                                            </svg>
                                        </div>
                                    </td>
                                    <td className="pr-6 text-sm leading-4 tracking-normal text-gray-800 whitespace-no-wrap dark:text-gray-100">#MC10023</td>
                                    <td className="pr-6 text-sm leading-4 tracking-normal text-gray-800 whitespace-no-wrap dark:text-gray-100">Toyota Motors</td>
                                    <td className="pr-6 whitespace-no-wrap">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8">
                                                <img src="https://tuk-cdn.s3.amazonaws.com/assets/components/advance_tables/at_1.png" alt className="w-full h-full overflow-hidden rounded-full shadow" />
                                            </div>
                                            <p className="ml-2 text-sm leading-4 tracking-normal text-gray-800 dark:text-gray-100">Carrie Anthony</p>
                                        </div>
                                    </td>
                                    <td className="pr-6 text-sm leading-4 tracking-normal text-gray-800 whitespace-no-wrap dark:text-gray-100">$2,500</td>
                                    <td className="pr-6 text-sm leading-4 tracking-normal text-gray-800 whitespace-no-wrap dark:text-gray-100">02.03.20</td>
                                    <td className="pr-6">
                                        <div className="w-2 h-2 bg-indigo-400 rounded-full" />
                                    </td>
                                    <td className="relative pr-8">
                                        <button className="text-gray-500 border border-transparent rounded cursor-pointer focus:outline-none">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-dots-vertical dropbtn" width={28} height={28} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" onclick="dropdownFunction(this)">
                                                <path stroke="none" d="M0 0h24v24H0z" />
                                                <circle cx={12} cy={12} r={1} />
                                                <circle cx={12} cy={19} r={1} />
                                                <circle cx={12} cy={5} r={1} />
                                            </svg>
                                        </button>
                                        <div className="absolute left-0 z-10 hidden w-32 mt-1 -ml-12 shadow-md dropdown-content">
                                            <ul className="py-1 bg-white rounded shadow dark:bg-gray-800">
                                                <li className="px-3 py-3 text-sm font-normal leading-3 tracking-normal text-gray-600 cursor-pointer dark:text-gray-400 hover:bg-indigo-700 hover:text-white">Edit</li>
                                                <li className="px-3 py-3 text-sm font-normal leading-3 tracking-normal text-gray-600 cursor-pointer dark:text-gray-400 hover:bg-indigo-700 hover:text-white">Delete</li>
                                                <li className="px-3 py-3 text-sm font-normal leading-3 tracking-normal text-gray-600 cursor-pointer dark:text-gray-400 hover:bg-indigo-700 hover:text-white">Duplicate</li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                                <tr className="h-24 border-b border-gray-300 dark:border-gray-200">
                                    <td className="pl-8 pr-6 text-sm leading-4 tracking-normal text-left text-gray-800 whitespace-no-wrap dark:text-gray-100">
                                        <input type="checkbox" className="relative w-5 h-5 bg-white border border-gray-400 rounded outline-none cursor-pointer dark:border-gray-200 dark:bg-gray-800" onclick="tableInteract(this)" />
                                    </td>
                                    <td className="pr-6 text-sm leading-4 tracking-normal text-gray-800 whitespace-no-wrap dark:text-gray-100">
                                        <div className="relative w-10">
                                            <div className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 mr-2 -mt-1 text-xs text-white bg-indigo-700 rounded-full">1</div>
                                            <div className="text-gray-600 dark:text-gray-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-file" width={28} height={28} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" />
                                                    <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                                                    <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="pr-6 text-sm leading-4 tracking-normal text-gray-800 whitespace-no-wrap dark:text-gray-100">#MC10023</td>
                                    <td className="pr-6 text-sm leading-4 tracking-normal text-gray-800 whitespace-no-wrap dark:text-gray-100">Toyota Motors</td>
                                    <td className="pr-6 whitespace-no-wrap">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8">
                                                <img src="https://tuk-cdn.s3.amazonaws.com/assets/components/advance_tables/at_2.png" alt className="w-full h-full overflow-hidden rounded-full shadow" />
                                            </div>
                                            <p className="ml-2 text-sm leading-4 tracking-normal text-gray-800 dark:text-gray-100">Carrie Anthony</p>
                                        </div>
                                    </td>
                                    <td className="pr-6 text-sm leading-4 tracking-normal text-gray-800 whitespace-no-wrap dark:text-gray-100">$2,500</td>
                                    <td className="pr-6 text-sm leading-4 tracking-normal text-gray-800 whitespace-no-wrap dark:text-gray-100">02.03.20</td>
                                    <td className="pr-6">
                                        <div className="w-2 h-2 bg-red-400 rounded-full" />
                                    </td>
                                    <td className="relative pr-8">
                                        <button className="text-gray-500 border border-transparent rounded cursor-pointer focus:outline-none">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-dots-vertical dropbtn" width={28} height={28} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" onclick="dropdownFunction(this)">
                                                <path stroke="none" d="M0 0h24v24H0z" />
                                                <circle cx={12} cy={12} r={1} />
                                                <circle cx={12} cy={19} r={1} />
                                                <circle cx={12} cy={5} r={1} />
                                            </svg>
                                        </button>
                                        <div className="absolute left-0 z-10 hidden w-32 mt-1 -ml-12 shadow-md dropdown-content">
                                            <ul className="py-1 bg-white rounded shadow dark:bg-gray-800">
                                                <li className="px-3 py-3 text-sm font-normal leading-3 tracking-normal text-gray-600 cursor-pointer dark:text-gray-400 hover:bg-indigo-700 hover:text-white">Edit</li>
                                                <li className="px-3 py-3 text-sm font-normal leading-3 tracking-normal text-gray-600 cursor-pointer dark:text-gray-400 hover:bg-indigo-700 hover:text-white">Delete</li>
                                                <li className="px-3 py-3 text-sm font-normal leading-3 tracking-normal text-gray-600 cursor-pointer dark:text-gray-400 hover:bg-indigo-700 hover:text-white">Duplicate</li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                                <tr className="h-24 border-b border-gray-300 dark:border-gray-200">
                                    <td className="pl-8 pr-6 text-sm leading-4 tracking-normal text-left text-gray-800 whitespace-no-wrap dark:text-gray-100">
                                        <input type="checkbox" className="relative w-5 h-5 bg-white border border-gray-400 rounded outline-none cursor-pointer dark:border-gray-200 dark:bg-gray-800" onclick="tableInteract(this)" />
                                    </td>
                                    <td className="pr-6 text-sm leading-4 tracking-normal text-gray-800 whitespace-no-wrap dark:text-gray-100">
                                        <div className="relative w-10">
                                            <div className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 mr-2 -mt-1 text-xs text-white bg-indigo-700 rounded-full">5</div>
                                            <div className="text-gray-600 dark:text-gray-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-file" width={28} height={28} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" />
                                                    <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                                                    <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="pr-6 text-sm leading-4 tracking-normal text-gray-800 whitespace-no-wrap dark:text-gray-100">#MC10023</td>
                                    <td className="pr-6 text-sm leading-4 tracking-normal text-gray-800 whitespace-no-wrap dark:text-gray-100">Toyota Motors</td>
                                    <td className="pr-6 whitespace-no-wrap">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8">
                                                <img src="https://tuk-cdn.s3.amazonaws.com/assets/components/advance_tables/at_3.png" alt className="w-full h-full overflow-hidden rounded-full shadow" />
                                            </div>
                                            <p className="ml-2 text-sm leading-4 tracking-normal text-gray-800 dark:text-gray-100">Carrie Anthony</p>
                                        </div>
                                    </td>
                                    <td className="pr-6 text-sm leading-4 tracking-normal text-gray-800 whitespace-no-wrap dark:text-gray-100">$2,500</td>
                                    <td className="pr-6 text-sm leading-4 tracking-normal text-gray-800 whitespace-no-wrap dark:text-gray-100">02.03.20</td>
                                    <td className="pr-6">
                                        <div className="w-2 h-2 bg-gray-600 rounded-full" />
                                    </td>
                                    <td className="relative pr-8">
                                        <button className="text-gray-500 border border-transparent rounded cursor-pointer focus:outline-none">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-dots-vertical dropbtn" width={28} height={28} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" onclick="dropdownFunction(this)">
                                                <path stroke="none" d="M0 0h24v24H0z" />
                                                <circle cx={12} cy={12} r={1} />
                                                <circle cx={12} cy={19} r={1} />
                                                <circle cx={12} cy={5} r={1} />
                                            </svg>
                                        </button>
                                        <div className="absolute left-0 z-10 hidden w-32 mt-1 -ml-12 shadow-md dropdown-content">
                                            <ul className="py-1 bg-white rounded shadow dark:bg-gray-800">
                                                <li className="px-3 py-3 text-sm font-normal leading-3 tracking-normal text-gray-600 cursor-pointer dark:text-gray-400 hover:bg-indigo-700 hover:text-white">Edit</li>
                                                <li className="px-3 py-3 text-sm font-normal leading-3 tracking-normal text-gray-600 cursor-pointer dark:text-gray-400 hover:bg-indigo-700 hover:text-white">Delete</li>
                                                <li className="px-3 py-3 text-sm font-normal leading-3 tracking-normal text-gray-600 cursor-pointer dark:text-gray-400 hover:bg-indigo-700 hover:text-white">Duplicate</li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>








        </AdminscreenWrapper>
    );
}

AdminProductsScreen.auth = { adminOnly: true };
export default AdminProductsScreen