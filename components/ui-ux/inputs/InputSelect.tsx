import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useEscapeListener } from '@libs/hooks';

interface OptionType {
    _id?: string,
    name: string
}

type PropsOption = {
    option: OptionType,
    setUpdate: (value: OptionType) => void
}

type PropsInput = {
    title: string,
    description: string,
    input: {
        name: string,
        defaultValue: OptionType,
    },
    options: OptionType[]
    setChange: (value: OptionType) => void
}

function Option({ option, setUpdate }: PropsOption) {
    const { name } = option;

    return (
        <button className='w-full' onClick={(e) => {
            e.preventDefault();
            setUpdate(option)
        }}>
            <p className="w-full p-3 text-sm leading-none text-left text-gray-600 cursor-pointer hover:bg-indigo-100 hover:font-medium hover:text-indigo-700 hover:rounded">
                {name}
            </p>
        </button>
    )
}

export default function InputSelect({ title, description, input, options, setChange }: PropsInput) {

    const { name, defaultValue } = input;

    const seeMenuRef = useRef(null);
    const [seeMenu, setSeeMenu] = useState(false);
    const [inputValue, setInputValue] = useState<OptionType>(defaultValue);

    useEscapeListener(seeMenuRef, () => setSeeMenu(false))
    useEffect(() => { setInputValue(defaultValue) }, [defaultValue]);
    useEffect(() => { setChange(inputValue) }, [inputValue]);

    return (
        <div>
            <p className="text-base font-medium leading-none text-gray-800">{title}</p>

            <div className="relative top-1">
                <div className="relative w-full mt-2 border border-gray-300 rounded outline-none dropdown-one">
                    <button
                        ref={seeMenuRef}
                        className="relative flex items-center justify-between w-full px-5 py-4 "
                        onClick={(e) => {
                            e.preventDefault();
                            setSeeMenu(prev => !prev)
                        }}
                    >
                        <span className="pr-4 text-sm font-medium text-gray-600">{inputValue.name}</span>
                        <svg
                            className="absolute z-10 cursor-pointer right-5"
                            width={10}
                            height={6}
                            viewBox="0 0 10 6"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M0.5 0.75L5 5.25L9.5 0.75" stroke="#4B5563" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <div className={`absolute right-0 z-20 w-full px-1 py-2 bg-white border-t border-gray-200 rounded shadow top-12 ${!seeMenu && 'hidden'}`}>
                        {
                            options.map((opt, key) => <Option
                                option={opt}
                                setUpdate={setInputValue}
                                key={key}
                            />)
                        }
                    </div>
                    <input
                        type="hidden"
                        className='hidden'
                        name={name}
                        value={inputValue._id || inputValue.name}
                    />
                </div>
            </div>

            {description && <p className="mt-3 text-xs leading-[15px] text-gray-600">{description}</p>}
        </div>
    );
}
