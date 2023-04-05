import React, { useState, useEffect } from 'react';

type Props = {
    title: string,
    description: string,
    input: {
        name: string,
        defaultValue: string,
        placeholder: string
    }
    onChange: (e: React.BaseSyntheticEvent) => void
}

export default function InputTextarea({ title, description, input, onChange }: Props) {
    const { name, defaultValue, placeholder } = input;

    const [height, setHeight] = useState(0);

    const onResize = () => {
        const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
        textarea.style.height = 'auto';
        textarea.style.height = (textarea.scrollHeight+30) + 'px';
    };
    
    useEffect(onResize, [height]);

    useEffect(() => {
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    return (
        <div className='col-span-full'>
            <p className="text-base font-medium leading-none text-gray-800">{title}</p>
            <textarea
                name={name}
                defaultValue={defaultValue}
                placeholder={placeholder}
                className="w-full p-3 mt-4 border border-gray-300 rounded outline-none focus:bg-gray-50"
                style={{ height }}
                onChange={(event) => {
                    setHeight(event.target.scrollHeight)
                    onChange(event)
                }}
            />
            {description && <p className="mt-3 text-xs leading-[15px] text-gray-600">{description}</p>}
        </div>
    );
}