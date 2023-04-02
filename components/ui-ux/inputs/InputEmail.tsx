import { validateEmail } from '@libs/utils/formvalidate';
import React, { useState } from 'react';

type Props = {
    title: string,
    description?: string,
    input: {
        name: string,
        defaultValue: string,
        placeholder: string
    }
    onChange: (e: React.BaseSyntheticEvent) => void
}

export default function InputEmail({ title, description, input, onChange }: Props) {
    const { name, defaultValue, placeholder } = input;

    const [email, setEmail] = useState('');
    const [isValid, setIsValid] = useState<boolean | null>(null);

    const getisValidateEmail = () => setIsValid(email.length > 0 ? validateEmail(email) : null);

    return (
        <div>
            <p className="text-base font-medium leading-none text-gray-800">{title}</p>
            <input
                className={`
                    w-full p-3 mt-4 border border-gray-300 rounded outline-none focus:bg-gray-50 
                    ${isValid === false && "border-red-500 text-red-500"}
                    ${isValid === true && "border-green-600 text-green-600"}
                `}
                type="email"
                name={name}
                defaultValue={defaultValue}
                placeholder={placeholder}
                onChange={(e) => {
                    onChange(e)
                    setEmail(e.target.value)
                    const isvalid = validateEmail(email)
                    if (isvalid) setIsValid(isvalid)
                }}
                onBlur={getisValidateEmail}
            />
            <div className='flex items-center justify-between mt-3'>
                {description && <p className="text-xs leading-[15px] text-gray-600">{description}</p>}
                {isValid === false && <p className='text-xs leading-[15px] text-red-500 italic'>L'email n'est pas valide !</p>}
                {isValid === true && <p className='text-xs leading-[15px] text-green-600 italic'>L'email est valide !</p>}
            </div>
        </div>
    );
}