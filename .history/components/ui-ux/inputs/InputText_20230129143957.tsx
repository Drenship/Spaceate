import React from 'react';

type Props = {
    title: string,
    description: string,
    input: {
        name: string,
        defaultValue: string,
        placeholder: string
    }
}

export default function InputText({ title, description, input }: Props) {
    const { name, defaultValue, placeholder } = input;
    return (
        <div>
            <p className="text-base font-medium leading-none text-gray-800">{title}</p>
            <input
                className="w-full p-3 mt-4 border border-gray-300 rounded outline-none focus:bg-gray-50"
                name={name}
                defaultValue={defaultValue}
                placeholder={placeholder}
            />
            {description && <p className="mt-3 text-xs leading-[15px] text-gray-600">{description}</p>}
        </div>
    );
}