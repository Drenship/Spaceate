import React from 'react';

type Props = {
    title: string,
    description: string
}

export default function InputText({ title, description }: Props) {
    return (
        <div>
            <p className="text-base font-medium leading-none text-gray-800">{ title }</p>
            <input className="w-full p-3 mt-4 border border-gray-300 rounded outline-none focus:bg-gray-50" />
            <p className="mt-3 text-xs leading-[15px] text-gray-600">{ description }</p>
        </div>
    );
}
