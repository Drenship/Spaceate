import React, { FC } from 'react';

type InputTextProps = {
    title: string;
    description?: string;
    input: {
        name: string;
        defaultValue: string;
        forceValue?: string;
        placeholder: string;
    };
    onChange: (e: React.BaseSyntheticEvent) => void
};

const InputText: FC<InputTextProps> = ({
    title,
    description,
    input: { name, defaultValue, forceValue, placeholder },
    onChange,
}) => {
    return (
        <div>
            <p className="text-base font-medium leading-none text-gray-800">{title}</p>
            <input
                className="w-full p-3 mt-4 border border-gray-300 rounded outline-none focus:bg-gray-50"
                name={name}
                defaultValue={defaultValue}
                value={forceValue}
                placeholder={placeholder}
                onChange={onChange}
            />
            {description && (
                <p className="mt-3 text-xs leading-[15px] text-gray-600">{description}</p>
            )}
        </div>
    );
};

export default InputText;