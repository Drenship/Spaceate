import { generateUUID } from '@libs/utils';
import React, { useMemo } from 'react';

type InputRadioProps = {
    label: string,
    description?: string,
    input: {
        name: string,
        value: any,
        checked: boolean
    }
    onChange?: (e: React.BaseSyntheticEvent) => void
}

const InputRadio: React.FC<InputRadioProps> = ({ label, description, input, onChange }) => {
    const { name, value, checked } = input;

    const uuid = useMemo(generateUUID, []);

    const handleDivClick = (e: React.BaseSyntheticEvent) => {
        e.preventDefault();
        onChange(e);
    };

    return (
        <div
            className={`
                    flex items-center pl-4 border rounded cursor-pointer
                    ${checked ? "border-blue-600" : "border-gray-200"} 
                `}
            onClick={handleDivClick}
        >
            <input
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 cursor-pointer"
                id={uuid}
                aria-describedby={"helper-" + uuid}
                type="radio"
                name={name}
                value={value}
                checked={checked}
                onChange={onChange}
            />
            <div className='flex flex-col items-start justify-center w-full py-2 pl-4'>
                <label htmlFor={uuid} className="w-full text-sm font-medium cursor-pointer">{label}</label>
                {description && (
                    <p id={"helper-" + uuid} className="text-xs leading-[15px] text-gray-600">{description}</p>
                )}
            </div>
        </div>
    );
}

export default InputRadio;