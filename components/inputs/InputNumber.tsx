import React, { useEffect, useState } from 'react';

type InputNumberDefault = {
    min: number,
    max: number,
    defaultValue: number,
    setUpdate: (value: number) => void
}

type InputNumber = {
    title: string,
    description: string,
    input: {
        name: string,
        placeholder: string
        defaultValue: number | 0,
        forceValue?: number | 0,
        min: number | 0,
        max: number | '',
        step?: number
    }
    onChange?: (e: React.BaseSyntheticEvent) => void
}



export const InputNumber: React.FC<InputNumber> = ({ title, description, input, onChange }) => {
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

export default function InputNumberDefault({ min, max, defaultValue, setUpdate }: InputNumberDefault) {
    const [count, setCount] = useState<number>(Number(defaultValue) || Number(min));

    const addCount = () => {
        if (max > count) {
            setCount(prev => Number(prev) + 1);
        } else {
            setCount(max)
        }
    };

    const minusCount = () => {
        if (count > min) {
            setCount(prev => prev - 1);
        }
    };

    const writeCount = (e: React.FormEvent<HTMLInputElement>) => {
        const inputValue = e.currentTarget.value;
        if (inputValue.length === 0) {
            setCount(min)
            return;
        }

        const number = Number(inputValue)
        if (min <= number && number < max) {
            setCount(number)
        } else {
            setCount(max)
        }
    }

    const writeCountBlur = () => {
        if (count === 0) setCount(min)
    }

    useEffect(() => { setUpdate(count) }, [count]);

    return (
        <div className="flex h-7">
            <span onClick={minusCount} className="flex items-center justify-center pb-1 border border-r-0 border-gray-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 w-7 h-7">
                -
            </span>
            <input
                id="counter"
                aria-label="input"
                className="h-full pb-1 text-center border border-gray-300 outline-none w-14"
                type="text"
                value={count.toString()}
                onChange={writeCount}
                onBlur={writeCountBlur}
            />
            <span onClick={addCount} className="flex items-center justify-center pb-1 border border-l-0 border-gray-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 w-7 h-7 ">
                +
            </span>
        </div>
    );
}