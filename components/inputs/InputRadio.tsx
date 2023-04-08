import { generateUUID } from '@libs/utils';
import React, { useMemo } from 'react';

type InputRadioProps = {
    label: string,
    input: {
        name: string,
        value: any,
        checked: boolean
    }
    onChange?: (e: React.BaseSyntheticEvent) => void
}

const InputRadio: React.FC<InputRadioProps> = ({ label, input, onChange }) => {
    const { name, value, checked } = input;

    const uuid = useMemo(generateUUID, []);

    return (
        <div className={`flex items-center pl-4 border ${checked ? "border-blue-600" : "border-gray-200"} rounded cursor-pointer`}>
            <input
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 cursor-pointer"
                id={uuid}
                type="radio"
                name={name}
                value={value}
                checked={checked}
                onChange={onChange}
            />
            <label htmlFor={uuid} className="w-full py-4 ml-2 text-sm font-medium cursor-pointer">{label}</label>
        </div>
    );
}

export default InputRadio;