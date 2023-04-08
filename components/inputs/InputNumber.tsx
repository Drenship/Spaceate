import React, { useEffect, useState } from 'react';

type InputNumberProps = {
    title: string,
    description?: string,
    input: {
        name: string,
        placeholder?: string,
        defaultValue?: number,
        forceValue?: number,
        min?: number,
        max?: number,
        step?: number
    }
    onChange?: (e: React.BaseSyntheticEvent) => void
}

export const InputNumber: React.FC<InputNumberProps> = ({ title, description, input, onChange }) => {
    const { name, defaultValue, forceValue, min, max, step, placeholder } = input;

    return (
        <div>
            <p className="text-base font-medium leading-none text-gray-800">{title}</p>
            <input
                className="w-full p-3 mt-4 border border-gray-300 rounded outline-none focus:bg-gray-50"
                type="number"
                name={name}
                defaultValue={defaultValue}
                value={forceValue}
                min={min}
                max={max}
                step={step}
                placeholder={placeholder}
                onChange={onChange}
            />
            {description && <p className="mt-3 text-xs leading-[15px] text-gray-600">{description}</p>}
        </div>
    );
}

type InputNumberDefaultProps = {
    min: number,
    max: number,
    defaultValue: number,
    setUpdate: (value: number) => void
}

export const InputNumberDefault: React.FC<InputNumberDefaultProps> = ({ min, max, defaultValue, setUpdate }) => {
    const [count, setCount] = useState<number | string>(defaultValue);

    const addCount = () => setCount(prev => Math.min(prev + 1, max));
    const minusCount = () => setCount(prev => Math.max(prev - 1, min));
    const updateCount = (value: number) => setCount(Math.min(Math.max(value, min), max));

    const handleInputBlur = () => {
        if (count === '') {
            setCount(1);
        }
    };
    
    // Modification de la fonction handleInputChange
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
    
        if (inputValue.length === 0) {
            setCount('');
            return;
        }
    
        updateCount(Number(inputValue));
    };

    useEffect(() => { setUpdate(count) }, [count, setUpdate]);

    return (
        <div className="flex h-7">
            <button onClick={minusCount} className="flex items-center justify-center pb-1 border border-r-0 border-gray-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 w-7 h-7">
                -
            </button>
            <input
                id="counter"
                aria-label="input"
                className="h-full pb-1 text-center border border-gray-300 outline-none w-14"
                type="number"
                value={count}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
            />
            <button onClick={addCount} className="flex items-center justify-center pb-1 border border-l-0 border-gray-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 w-7 h-7 ">
                +
            </button>
        </div>
    );
}

export default InputNumberDefault;