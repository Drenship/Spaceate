import React from 'react';

export default function InputSelect() {
    return (
        <div>
            <p className="text-base font-medium leading-none text-gray-800">
                Default Layout
            </p>
            <div className="relative top-1">
                <div className="relative w-full mt-2 border border-gray-300 rounded outline-none dropdown-one">
                    <button
                        className="relative flex items-center justify-between w-full px-5 py-4 "
                    >
                        <span
                            className="pr-4 text-sm font-medium text-gray-600"
                            id="drop-down-content-setter-one_form_layout_wizard3"
                        >
                            Layout Vertical
                        </span>
                        <svg
                            id="rotate1"
                            className="absolute z-10 cursor-pointer right-5"
                            width={10}
                            height={6}
                            viewBox="0 0 10 6"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M0.5 0.75L5 5.25L9.5 0.75"
                                stroke="#4B5563"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                    <div
                        className="absolute right-0 z-20 w-full px-1 py-2 bg-white border-t border-gray-200 rounded shadow top-12"
                        id="drop-down-div-one_form_layout_wizard3"
                    >
                        <a href="javascript:void(0)" className="hover">
                            <p
                                className="p-3 text-sm leading-none text-gray-600 cursor-pointer hover:bg-indigo-100 hover:font-medium hover:text-indigo-700 hover:rounded"

                            >
                                Layout Vertical
                            </p>
                        </a>
                        <a href="javascript:void(0)">
                            <p
                                className="p-3 text-sm leading-none text-gray-600 cursor-pointer hover:bg-indigo-100 hover:font-medium hover:text-indigo-700 hover:rounded"

                            >
                                Layout Horizontal
                            </p>
                        </a>
                        <a href="javascript:void(0)">
                            <p className="p-3 text-sm leading-none text-gray-600 cursor-pointer hover:bg-indigo-100 hover:font-medium hover:text-indigo-700 hover:rounded">
                                Layout Primary
                            </p>
                        </a>
                    </div>
                </div>
            </div>
            {/* end */}
            <p className="mt-3 text-xs leading-[15px] text-gray-600">
                Select a layout to show your product display
            </p>
        </div>
    );
}
