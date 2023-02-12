import React, { useMemo } from 'react';
import { generateUUID } from '@libs/utils';

type Props = {
    title: string,
    description: string,
    input: {
        name: string,
        checked: boolean
    }
    onChange: (e: React.BaseSyntheticEvent) => void
}

export default function InputCheckbox({ title, description, input, onChange }: Props) {
    const { name, checked } = input;

    const uuid = useMemo(generateUUID, []);

    return (
        <div className="flex">
            <div className="flex items-center h-5">
                <input
                    id={uuid}
                    aria-describedby={"helper-" + uuid}
                    name={name}
                    type="checkbox"
                    defaultChecked={checked}
                    onChange={onChange}
                    className="w-4 h-4 rounded outline-none"
                />
            </div>
            <div className="ml-2 text-sm">
                <label htmlFor={uuid} className="font-medium text-gray-90">{title}</label>
                <p id={"helper-" + uuid} className="text-xs font-normal text-gray-500">{description}</p>
            </div>
        </div>
    );
}