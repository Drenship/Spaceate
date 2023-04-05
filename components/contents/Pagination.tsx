import React, { useMemo } from 'react';

interface PaginationProps {
    current: number
    pages: number
    pageHandler: (x: number) => void
}

interface ButtonProps {
    current: number
    pageNumber: number
    pageHandler: (x: number) => void
}

const ButtonPage = ({ current, pageNumber, pageHandler }: ButtonProps) => (
    <button
        className={`inline-flex items-center justify-center w-8 h-8 leading-none text-gray-500 border rounded-md shadow border-gray-800 
            ${Number(current) === (1 + pageNumber) ? "dark:bg-gray-800 dark:text-white" : ""}
        `}
        onClick={() => {
            if (current == (1 + pageNumber)) return;
            pageHandler(1 + pageNumber)
        }}
    >{1 + pageNumber}</button>
)

export default function Pagination({ current, pages, pageHandler }: PaginationProps) {

    const paginations: number[] = useMemo(() => [...Array(Number(pages)).keys()], [pages]);

    const prevPage = () => Number(current) > 1 ? pageHandler(Number(current) - 1) : "";
    const nextPage = () => Number(current) < Number(pages) ? pageHandler(1 + Number(current)) : "";

    return (
        <div className="flex justify-end w-full mt-5 space-x-2">
            {
                current > 1 && (
                    <button
                        onClick={prevPage}
                        className="inline-flex items-center justify-center w-8 h-8 leading-none text-gray-800 border border-gray-800 rounded-md shadow">
                        <svg className="w-4" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>
                )
            }

            {
                pages > 1 && paginations.map((pageNumber, key) => <ButtonPage key={key} current={current} pageNumber={pageNumber} pageHandler={pageHandler} />)
            }

            {
                current < pages && (
                    <button
                        onClick={nextPage}
                        className="inline-flex items-center justify-center w-8 h-8 leading-none text-gray-800 border border-gray-800 rounded-md shadow">
                        <svg className="w-4" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                )
            }
        </div>
    );
}