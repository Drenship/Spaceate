import isMobile from 'is-mobile';
import React, { FC, useEffect, useRef, useState } from 'react';

interface InputPastCodeProps {
    setValue: (code: string) => void;
    codeLength?: number;
}

const InputPastCode: FC<InputPastCodeProps> = ({ setValue, codeLength = 7 }) => {
    const [code, setCode] = useState<string[]>(Array(codeLength).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const hiddenInputRef = useRef<HTMLInputElement>(null);

    const mobile = isMobile();

    const handleHiddenInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        const newCode = input.split('').slice(0, codeLength);
        const remaining = codeLength - newCode.length;
        setCode([...newCode, ...Array(remaining).fill('')]);
    };

    const handlePasteOnContainer = (e: React.ClipboardEvent<HTMLDivElement>) => {
        const input = e.clipboardData.getData('text');
        const newCode = input.split('').slice(0, codeLength);
        setCode(newCode);
        const focusIndex = Math.min(newCode.length - 1, code.length - 1);
        inputRefs.current[focusIndex]?.focus();
    };

    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const input = e.target.value;

        if (input.length > 1) {
            const newCode = input.split('').slice(0, codeLength);
            setCode(newCode);
            inputRefs.current[newCode.length - 1]?.focus();
            return;
        }

        setCode((prevCode) => {
            const newCode = [...prevCode];
            newCode[index] = input;
            return newCode;
        });

        if (input && index < code.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && !e.currentTarget.value && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    useEffect(() => setValue(code.join('')), [code, setValue]);

    return (
        <div className="relative flex flex-col justify-center" onPaste={handlePasteOnContainer}>
            {mobile && (
                <input
                    ref={hiddenInputRef}
                    type="text"
                    className="absolute z-0 w-full h-full opacity-0 cursor-default"
                    value={code.join('')}
                    onChange={handleHiddenInputChange}
                    onKeyDown={handleKeyDown}
                    autoFocus
                />
            )}
            <div className="z-10 flex items-center justify-between space-x-2">
                {code.map((value, index) => (
                    <input
                        ref={(el) => (inputRefs.current[index] = el)}
                        key={index}
                        type="text"
                        maxLength={1}
                        className={`w-10 font-mono text-3xl text-center border-b-2 focus:border-blue-500 focus:outline-none ${value ? 'border-blue-500' : 'border-gray-300'
                            }`}
                        value={value}
                        onChange={(e) => handleCodeChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                    />
                ))}
            </div>
        </div>
    );
}

export default InputPastCode;