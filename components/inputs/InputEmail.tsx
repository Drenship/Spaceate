import React, { useState, useCallback } from 'react';
import { validateEmail } from '@libs/utils/formvalidate';

type InputEmailProps = {
    title: string,
    description?: string,
    input: {
        name: string,
        defaultValue: string,
        placeholder: string
    }
    onChange: (e: React.BaseSyntheticEvent) => void
}

const InputEmail:React.FC<InputEmailProps> = ({ title, description, input, onChange }) => {
    const { name, defaultValue, placeholder } = input;

    const [email, setEmail] = useState('');
    const [isValid, setIsValid] = useState<boolean | null>(null);

    const getIsValidateEmail = useCallback(() => {
        setIsValid(email.length > 0 ? validateEmail(email) : null);
    }, [email]);

    return (
        <div>
            <p className="text-base font-medium leading-none text-gray-800">{title}</p>
            <input
                className={`
                    w-full p-3 mt-4 border rounded outline-none focus:bg-gray-50 
                    ${isValid === null ? 'border-gray-300' : isValid ? 'border-green-600 text-green-600' : 'border-red-500 text-red-500'}
                `}
                type="email"
                name={name}
                defaultValue={defaultValue}
                placeholder={placeholder}
                onChange={(e) => {
                    onChange(e);
                    const value = e.target.value;
                    setEmail(value);
                    setIsValid(validateEmail(value));
                }}
                onBlur={getIsValidateEmail}
            />
            <div className='flex items-center justify-between mt-3'>
                {description && <p className="text-xs leading-[15px] text-gray-600">{description}</p>}
                {isValid !== null && (
                    <p className={`text-xs leading-[15px] italic ${isValid ? 'text-green-600' : 'text-red-500'}`}>
                        {isValid ? "L'email est valide !" : "L'email n'est pas valide !"}
                    </p>
                )}
            </div>
        </div>
    );
}

export default InputEmail;