import React, { useEffect, useRef, useState } from 'react';

interface InputPastCodeProps {
    setValue: (code: string) => void
    codeLength: number
}

InputPastCode.defaultProps = {
    codeLength: 7
}

export default function InputPastCode({ setValue, codeLength }: InputPastCodeProps) {

    const [code, setCode] = useState<string[]>(Array(codeLength).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const hiddenInputRef = useRef<HTMLInputElement>(null);

    const handleHiddenInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const input = e.target.value;
        const newCode = input.split("").slice(0, 7);
        setCode((prevCode) => [...newCode, ...prevCode.slice(newCode.length)]);
    };

    const handlePasteOnContainer = (
        e: React.ClipboardEvent<HTMLDivElement>
    ) => {
        const pastedData = e.clipboardData.getData("text");
        const newCode = pastedData.split("").slice(0, 7);
        setCode((prevCode) => [...newCode, ...prevCode.slice(newCode.length)]);
        const focusIndex = Math.min(newCode.length - 1, code.length - 1);
        inputRefs.current[focusIndex]?.focus();
    };

    const handleCodeChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number
    ) => {
        const input = e.target.value;
        if (input.length > 1) {
            const newCode = input.split('').slice(0, 7);
            setCode((prevCode) => [...newCode, ...prevCode.slice(newCode.length)]);
            inputRefs.current[newCode.length - 1]?.focus();
            return;
        }

        const newCode = [...code];
        newCode[index] = input;
        setCode(newCode);

        if (input && index < code.length - 1) {
            // Focus on the next input field
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        index: number
    ) => {
        if (
            e.key === 'Backspace' &&
            !e.currentTarget.value &&
            index > 0
        ) {
            // Focus on the previous input field
            inputRefs.current[index - 1]?.focus();
        }
    };

    useEffect(() => setValue(code.join('')), [code]);

    return (
        <div
            className="relative flex justify-center"
            onPaste={(e) => handlePasteOnContainer(e)}
        >
            <input
                ref={hiddenInputRef}
                type="text"
                className="absolute z-0 w-full h-full opacity-0 cursor-default"
                value={code.join("")}
                onChange={handleHiddenInputChange}
                onKeyDown={handleKeyDown}
                autoFocus
            />
            <div className="z-10 flex space-x-2">
                {code.map((value, index) => (
                    <input
                        ref={(el) => (inputRefs.current[index] = el)}
                        key={index}
                        type="text"
                        maxLength={1}
                        className="w-10 font-mono text-3xl text-center border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none"
                        value={value}
                        onChange={(e) => handleCodeChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                    />
                ))}
            </div>
        </div>
    );
}
