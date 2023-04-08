import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { generateUUID } from '@libs/utils';

type InputCheckboxProps = {
    title: string,
    description?: string,
    input: {
        name: string,
        checked: boolean,
    }
    onChange?: (e: React.BaseSyntheticEvent) => void
}

const InputCheckbox: React.FC<InputCheckboxProps> = ({ title, description, input, onChange }) => {
    const { name } = input;

    const [checked, setChecked] = useState(input.checked);
    const uuid = useMemo(generateUUID, []);

    useEffect(() => {
        setChecked(input.checked);
    }, [input.checked]);

    const handleChange = useCallback((e: React.BaseSyntheticEvent) => {
        const newChecked = e.target.checked;
        setChecked(newChecked);

        if (onChange) {
            onChange(e);
        }
    }, [onChange]);

    return (
        <div className="flex">
            <div className="flex items-center h-5">
                <input
                    id={uuid}
                    aria-describedby={"helper-" + uuid}
                    name={name}
                    type="checkbox"
                    checked={checked}
                    onChange={handleChange}
                    className="w-4 h-4 rounded outline-none"
                />
            </div>
            <div className="ml-2 text-sm">
                <label htmlFor={uuid} className="font-medium text-gray-90">{title}</label>
                {description && <p id={"helper-" + uuid} className="text-xs font-normal text-gray-500">{description}</p>}
            </div>
        </div>
    );
}

export default InputCheckbox;