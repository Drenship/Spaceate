import React, { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import AdminscreenWrapper from '@components/Wrapper/AdminscreenWrapper'
import InputText from '@components/ui-ux/inputs/InputText';

export default function edit() {
    const router = useRouter();

    //const query = router.query
    //console.log(query)

    const d = useMemo(() => {
        console.log(router.query)
        return 'ok'
    }, [router.query]);

    useEffect(() => { });

    return (
        <AdminscreenWrapper title="Edit categorie">

            <div className="mt-10 px-7">
                <p className="text-xl font-semibold leading-tight text-gray-800">
                    Meta Details
                </p>
                <div className="grid w-full grid-cols-1 lg:grid-cols-2 md:grid-cols-1 gap-7 mt-7 ">
                    <div>
                        <p className="text-base font-medium leading-none text-gray-800">
                            Theme
                        </p>
                        {/*-Dropdown*/}
                        <div className="relative top-1 ">
                            <div className="relative w-full mt-2 border border-gray-300 rounded outline-none">
                                <button
                                    className="relative flex items-center justify-between w-full px-5 py-4 "
                                >
                                    <span
                                        className="pr-4 text-sm font-medium text-gray-600"
                                        id="drop-down-content-setter_form_layout_wizard3"
                                    >
                                        Beginner
                                    </span>
                                    <svg
                                        id="rotate"
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
                                    className="absolute right-0 z-20 hidden w-full px-1 py-2 bg-white border-t border-gray-200 rounded shadow top-12"
                                    id="drop-down-div_form_layout_wizard3"
                                >
                                    <a href="javascript:void(0)" className="hover">
                                        <p
                                            className="p-3 text-sm leading-none text-gray-600 cursor-pointer hover:bg-indigo-100 hover:font-medium hover:text-indigo-700 hover:rounded"

                                        >
                                            Beginner
                                        </p>
                                    </a>
                                    <a href="javascript:void(0)">
                                        <p
                                            className="p-3 text-sm leading-none text-gray-600 cursor-pointer hover:bg-indigo-100 hover:font-medium hover:text-indigo-700 hover:rounded"

                                        >
                                            Intermediate
                                        </p>
                                    </a>
                                    <a href="javascript:void(0)">
                                        <p
                                            className="p-3 text-sm leading-none text-gray-600 cursor-pointer hover:bg-indigo-100 hover:font-medium hover:text-indigo-700 hover:rounded"

                                        >
                                            Expert
                                        </p>
                                    </a>
                                </div>
                            </div>
                            {/* end */}
                        </div>
                        {/* end */}
                        <p className="mt-3 text-xs leading-[15px] text-gray-600">
                            Set the product theme of your liking
                        </p>
                    </div>
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
                                    className="absolute right-0 z-20 hidden w-full px-1 py-2 bg-white border-t border-gray-200 rounded shadow top-12"
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
                                        <p
                                            className="p-3 text-sm leading-none text-gray-600 cursor-pointer hover:bg-indigo-100 hover:font-medium hover:text-indigo-700 hover:rounded"

                                        >
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
                    <div>
                        <p className="text-base font-medium leading-none text-gray-800">
                            Meta Title
                        </p>
                        <input className="w-full p-3 mt-4 border border-gray-300 rounded outline-none focus:bg-gray-50" />
                        <p className="mt-3 text-xs leading-3 text-gray-600">
                            Set a simple and precise meta title
                        </p>
                    </div>
                    <InputText
                        title="Nom"
                        description="Nom de la catégorie"
                        input={{
                            name: "",
                            defaultValue: "",
                            placeholder: "",
                        }}
                    />
                </div>
            </div>

            <hr className="h-[1px] bg-gray-100 my-14" />
            <div className="flex flex-col flex-wrap items-center justify-center w-full px-7 lg:flex-row lg:justify-end md:justify-end gap-x-4 gap-y-4">
                <button className="bg-white border-indigo-700 rounded hover:bg-gray-50 transform duration-300 ease-in-out text-sm font-medium px-6 py-4 text-indigo-700 border lg:max-w-[95px]  w-full ">
                    Cancel
                </button>
                <button className="bg-indigo-700 rounded hover:bg-indigo-600 transform duration-300 ease-in-out text-sm font-medium px-6 py-4 text-white lg:max-w-[144px] w-full ">
                    Save Changes
                </button>
            </div>

        </AdminscreenWrapper>
    );
}
