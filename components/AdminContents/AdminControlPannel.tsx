import Link from 'next/link';
import React from 'react';

interface AdminControlPannelProps {
    leftPanel?: {

    },
    rightPanel?: {
        itemsByPage?: {
            onChange: (e: React.BaseSyntheticEvent) => void
            data: number[]
            currentValue: number
        },
        addNewItem?: {
            link: string
            title: string
        }
    }
    navigationPanel?: {
        page: number
        maxPages: number
        totalResults: number
    }

    pageHandler: (x: any) => void
}

AdminControlPannel.defaultProps = {
    navigationPanel: {
        page: 0,
        maxPages: 0,
        totalResults: 0
    }
}

export default function AdminControlPannel({ pageHandler, navigationPanel, leftPanel, rightPanel }: AdminControlPannelProps) {

    const { page, maxPages, totalResults } = navigationPanel!;

    const prevPage = () => Number(page) > 1 ? pageHandler({ page: Number(page) - 1 }) : "";
    const nextPage = () => Number(page) < maxPages ? pageHandler({ page: 1 + Number(page) }) : "";

    return (
        <div className="flex flex-col items-start justify-between w-full p-4 lg:flex-row lg:p-8 lg:items-stretch">

            {
                leftPanel! ? (
                    <div className="flex flex-col items-start w-full lg:w-1/3 lg:flex-row lg:items-center">
                        <div className="flex items-center">
                            <a className="p-2 text-gray-600 bg-gray-100 border border-transparent rounded cursor-pointer hover:bg-gray-200 focus:outline-none focus:border-gray-800 focus:shadow-outline-gray" href="#">
                                <svg xmlns="http://www.w3.org/2000/svg" className="cursor-pointer icon icon-tabler icon-tabler-edit" width={20} height={20} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" />
                                    <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />
                                    <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />
                                    <line x1={16} y1={5} x2={19} y2={8} />
                                </svg>
                            </a>
                            <a className="p-2 mx-2 text-gray-600 bg-gray-100 border border-transparent rounded cursor-pointer hover:bg-gray-200 focus:outline-none focus:border-gray-800 focus:shadow-outline-gray" href="#">
                                <svg xmlns="http://www.w3.org/2000/svg" className="cursor-pointer icon icon-tabler icon-tabler-settings" width={20} height={20} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" />
                                    <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <circle cx={12} cy={12} r={3} />
                                </svg>
                            </a>
                            <a className="p-2 mr-2 text-gray-600 bg-gray-100 border border-transparent rounded cursor-pointer hover:bg-gray-200 focus:outline-none focus:border-gray-800 focus:shadow-outline-gray" href="#">
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-bookmark" width={20} height={20} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" />
                                    <path d="M9 4h6a2 2 0 0 1 2 2v14l-5-3l-5 3v-14a2 2 0 0 1 2 -2" />
                                </svg>
                            </a>
                            <a className="p-2 mr-2 text-gray-600 bg-gray-100 border border-transparent rounded cursor-pointer hover:bg-gray-200 focus:outline-none focus:border-gray-800 focus:shadow-outline-gray" href="#">
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-copy" width={20} height={20} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" />
                                    <rect x={8} y={8} width={12} height={12} rx={2} />
                                    <path d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2" />
                                </svg>
                            </a>
                            <a className="p-2 text-red-500 bg-gray-100 border border-transparent rounded cursor-pointer hover:bg-gray-200 focus:outline-none focus:border-gray-800 focus:shadow-outline-gray" href="#">
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
                ) : (<div />)
            }

            <div className="flex flex-col items-start justify-end w-full lg:w-2/3 lg:flex-row lg:items-center">
                {
                    navigationPanel! && (

                        <div className={`flex items-center py-3 border-gray-300 ${rightPanel! && rightPanel.itemsByPage && "lg:border-l lg:border-r"} lg:py-0 lg:px-6`}>
                            <p className="text-base text-gray-600" id="page-view">
                                {totalResults} résultats - page {page} sur {maxPages}
                            </p>
                            <button
                                onClick={prevPage}
                                className="ml-2 text-gray-600 border border-transparent rounded cursor-pointer"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-chevron-left" width={20} height={20} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" />
                                    <polyline points="15 6 9 12 15 18" />
                                </svg>
                            </button>
                            <button
                                onClick={nextPage}
                                className="text-gray-600 border border-transparent rounded cursor-pointerfocus:outline-none"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-chevron-right" width={20} height={20} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" />
                                    <polyline points="9 6 15 12 9 18" />
                                </svg>
                            </button>
                        </div>
                    )
                }

                {
                    rightPanel! && rightPanel.itemsByPage && (

                        <div className={`flex items-center pb-3 border-gray-300 ${rightPanel! && rightPanel.addNewItem && "lg:border-r"} lg:pb-0 lg:px-6`}>
                            <div className="relative z-10 w-32">
                                <div className="absolute inset-0 z-0 w-5 h-5 m-auto text-gray-600 lg:mr-2 pointer-events-nonexl:mr-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="cursor-pointer icon icon-tabler icon-tabler-chevron-down" width={20} height={20} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" />
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </div>
                                <select
                                    onChange={rightPanel.itemsByPage.onChange}
                                    value={rightPanel.itemsByPage.currentValue}
                                    aria-label="Selected tab"
                                    className="block w-full px-2 py-2 text-base text-gray-600 bg-transparent border border-transparent rounded appearance-none focus:outline-none focus:border-gray-800 focus:shadow-outline-gray form-select xl:px-3"
                                >
                                    {
                                        rightPanel.itemsByPage.data.map((x, key) => <option key={key} value={x}>{x}</option>)
                                    }
                                </select>
                            </div>
                        </div>
                    )
                }

                {
                    rightPanel! && rightPanel.addNewItem && (
                        <div className="flex items-center lg:ml-6">
                            <Link href={rightPanel.addNewItem.link}>
                                <button className="flex items-center justify-center px-3 py-2 text-white transition duration-150 ease-in-out bg-indigo-700 border border-transparent rounded cursor-pointer lg:ml-4 button-click-effect focus:outline-none hover:bg-indigo-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-plus" width={28} height={28} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" />
                                        <line x1={12} y1={5} x2={12} y2={19} />
                                        <line x1={5} y1={12} x2={19} y2={12} />
                                    </svg>
                                    <span className='text-normal'>{rightPanel.addNewItem.title}</span>
                                </button>
                            </Link>
                        </div>
                    )
                }

            </div>
        </div>
    );
}
