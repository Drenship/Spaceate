import React, { useEffect, useState } from 'react';

type Props = {
    min: Number,
    max: Number,
    defaultValue: Number,
    setUpdate: () => {}
}

export default function InputNumber({ min, max, defaultValue, setUpdate }: Props) {
    const [count, setCount] = useState(defaultValue || 1);

    const addCount = () => {
        if (max > count) {
            setCount(prev => Number(prev) + 1);
        } else {
            setCount(max)
        }
    };

    const minusCount = () => {
        if (count > min) {
            setCount((prev) => Number(prev) - 1);
        }
    };

    const writeCount = (e: React.FormEvent<HTMLInputElement>) => {

        if (e.currentTarget.value.length === 0) {
            setCount('')
            return;
        }

        const number = Number(e.currentTarget.value)
        const n = number >= min ? number : 1

        if (min <= n && n < max) {
            setCount(n)
        } else {
            setCount(max)
        }
    }

    const writeCountBlur = () => {
        if (count === '') setCount(1)
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
                value={count}
                onChange={writeCount}
                onBlur={writeCountBlur}
            />
            <span onClick={addCount} className="flex items-center justify-center pb-1 border border-l-0 border-gray-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 w-7 h-7 ">
                +
            </span>
        </div>
    );
}