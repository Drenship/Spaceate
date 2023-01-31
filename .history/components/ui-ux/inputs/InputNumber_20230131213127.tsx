import React, { useEffect, useState } from 'react';

type Props = {
    min: number,
    max: number,
    defaultValue: number,
    setUpdate: (value: number) => void
}

export default function InputNumber({ min, max, defaultValue, setUpdate }: Props) {
    const [count, setCount] = useState<number>(defaultValue || min);

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