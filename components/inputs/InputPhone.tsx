import React, { useState, useCallback, useEffect, useMemo } from 'react';
import Flag from 'react-world-flags';
import { PHONE_REQUIRED } from '@config/index';
import { verifyPhone } from '@libs/utils/formvalidate';
import countries from "@datassets/prefixesPhone.json";

type InputPhoneProps = {
    title: string;
    description?: string;
    input: {
        name: string;
        defaultValue: string;
        placeholder: string;
    };
    onChange: (e: React.BaseSyntheticEvent) => void;
};

interface InputData {
    phone: string;
    selectedCountry: {
        name: string;
        countryCode: string;
        prefix: string;
    };
    isValid: boolean | null;
}

const InputPhone: React.FC<InputPhoneProps> = ({ title, description, input, onChange }) => {
    const { name, defaultValue, placeholder } = input;

    const initialCountry = useMemo(() => countries.find(c => c.countryCode === "FR") || countries[0], []);

    const [inputData, setInputData] = useState<InputData>({
        phone: defaultValue || "",
        selectedCountry: initialCountry,
        isValid: null,
    });

    const handleChangeCountry = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
        const country = countries.find((c) => c.countryCode === event.target.value);
        if (!country) return;

        setInputData((prev) => ({
            ...prev,
            phone: prev.phone.startsWith(prev.selectedCountry.prefix)
                ? prev.phone.replace(prev.selectedCountry.prefix, country.prefix)
                : country.prefix + prev.phone,
            selectedCountry: country,
        }));
    }, []);

    const handleOnChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.trim();
        if(value === inputData.phone) return;

        if (!value.startsWith(inputData.selectedCountry.prefix)) {
            value = value.length < inputData.selectedCountry.prefix.length
                ? inputData.selectedCountry.prefix.slice(0, value.length)
                : inputData.selectedCountry.prefix + value;

        } else if (value.slice(inputData.selectedCountry.prefix.length).startsWith(inputData.selectedCountry.prefix)) {
            value = inputData.selectedCountry.prefix + value.slice(inputData.selectedCountry.prefix.length * 2);
        }

        setInputData((prev) => ({ ...prev, phone: value, isValid: verifyPhone(value, PHONE_REQUIRED)[0] }));
        e.target.value = value;
        onChange(e);
    }, [inputData.selectedCountry.prefix, onChange]);

    const handleOnBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        const value = e.target.value.trim();

        if (!value.startsWith(inputData.selectedCountry.prefix)) {
            setInputData((prev) => ({ ...prev, phone: inputData.selectedCountry.prefix + value }));
        }
    }, [inputData.selectedCountry.prefix]);

    useEffect(() => {
        if (inputData.phone.length > 0) {
            setInputData((prev) => ({ ...prev, isValid: verifyPhone(inputData.phone, PHONE_REQUIRED)[0] }));
        }
    }, [inputData.selectedCountry.prefix, inputData.phone]);

    useEffect(() => {
        if (defaultValue.length > 0) {
            setInputData((prev) => ({ ...prev, isValid: verifyPhone(defaultValue, PHONE_REQUIRED)[0], phone: defaultValue }));
        }
    }, [defaultValue]);

    return (
        <div>
            <p className="text-base font-medium leading-none text-gray-800">{title}</p>
            <div className={`
                flex items-center justify-center mt-4 border rounded 
                ${inputData.isValid === null ? 'border-gray-300' : inputData.isValid ? 'border-blue-600' : 'border-red-500'}
            `}>
                <div className='flex items-center p-1 max-w-[35%] w-full'>
                    <span>
                        <Flag code={inputData.selectedCountry.countryCode} width={28} height={28} />
                    </span>
                    <select
                        className='w-full p-1'
                        value={inputData.selectedCountry.countryCode}
                        onChange={handleChangeCountry}
                    >
                        {countries.map((country) => (
                            <option
                                key={country.countryCode}
                                value={country.countryCode}
                                className='flex items-center'
                            >
                                {country.name}
                            </option>
                        ))}
                    </select>
                </div>
                <input
                    className="w-full p-3 outline-none focus:bg-gray-50"
                    type="tel"
                    name={name}
                    defaultValue={defaultValue}
                    value={inputData.phone || defaultValue}
                    placeholder={placeholder}
                    onChange={handleOnChange}
                    onBlur={handleOnBlur}
                />
            </div>

            <div className='flex items-center justify-between mt-3'>
                {description && <p className="text-xs leading-[15px] text-gray-600">{description}</p>}
                {inputData.isValid !== null && (
                    <p className={`text-xs leading-[15px] italic ${inputData.isValid ? 'text-green-600' : 'text-red-500'}`}>
                        {inputData.isValid ? "Le numéro de téléphone est valide !" : "Le numéro de téléphone n'est pas valide !"}
                    </p>
                )}
            </div>
        </div>
    );
};

export default InputPhone;