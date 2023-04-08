import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid';
import { verifyPassword } from '@libs/utils/formvalidate';
import React, { useCallback, useState } from 'react';

type InputPasswordProps = {
    title: string,
    description?: string,
    input: {
        name: string,
        defaultValue: string,
        placeholder: string,
        rules?: {
            minLength: number,
            minUpperCase: number,
            minLowerCase: number,
            minNumbers: number,
            minSpecialChars: number,
        }
    }
    onChange?: (e: React.BaseSyntheticEvent) => void
}

const InputPassword: React.FC<InputPasswordProps> = ({ title, description, input, onChange }) => {
    const { name, defaultValue, placeholder, rules } = input;

    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isValid, setIsValid] = useState<boolean | null>(null);

    const getIsVerifyPassword = useCallback(() => {
        if(!rules) return;
        const [valid, object] = password.length > 0 ? verifyPassword(password, rules) : [null, {}]
        setIsValid(valid);
    }, [password]);

    return (
        <div>
            <p className="text-base font-medium leading-none text-gray-800">{title}</p>
            <div className='relative mt-4'>
                <input
                    className={`
                    w-full p-3 border rounded outline-none focus:bg-gray-50 
                    ${isValid === null ? 'border-gray-300' : isValid ? 'border-green-600 text-green-600' : 'border-red-500 text-red-500'}
                `}
                    type={showPassword ? "text" : "password"}
                    name={name}
                    defaultValue={defaultValue}
                    placeholder={placeholder}
                    onChange={(e) => {
                        onChange(e);
                        if(!rules) return;
                        const value = e.target.value;
                        setPassword(value);
                        const [valid] = verifyPassword(value, rules)
                        setIsValid(valid);
                    }}
                    onBlur={getIsVerifyPassword}
                />
                <button
                    onClick={() => setShowPassword(prev => !prev)}
                    className='absolute top-0 bottom-0 right-0 z-10 flex items-center justify-center aspect-square'
                >
                    {
                        showPassword ? <EyeOffIcon className='w-4 h-4' /> : <EyeIcon className='w-4 h-4' />
                    }
                </button>
            </div>
            {description && <p className="mt-3 text-xs leading-[15px] text-gray-600">{description}</p>}
        </div>
    );
}

InputPassword.defaultProps = {
    input: {
        rules: {
            minLength: 8,
            minUpperCase: 1,
            minLowerCase: 1,
            minNumbers: 1,
            minSpecialChars: 1,
        },
    },
    onChange: () => { },
}

export default InputPassword;
