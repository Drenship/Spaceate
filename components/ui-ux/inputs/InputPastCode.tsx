import isMobile from 'is-mobile';
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

    const mobile = isMobile();

    const handleHiddenInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const input = e.target.value;
        const newCode = input.split("").slice(0, 7);
        setCode((prevCode) => [...newCode, ...prevCode.slice(newCode.length)]);
    };

    const handleHiddenInput = (
        e: React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>
    ) => {
        const input = (e.target as HTMLInputElement).value;
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
            {
                mobile && (
                    <input
                        ref={hiddenInputRef}
                        type="text"
                        className="absolute w-full h-full opacity-0 cursor-default md:z-0"
                        value={code.join("")}
                        onChange={handleHiddenInputChange}
                        onInput={handleHiddenInput}
                        onKeyDown={handleKeyDown}
                        autoFocus
                    />
                )
            }
            <div className="flex space-x-2 md:z-10">
                {code.map((value, index) => (
                    <input
                        ref={(el) => (inputRefs.current[index] = el)}
                        key={index}
                        type="text"
                        maxLength={1}
                        className={`w-10 font-mono text-3xl text-center border-b-2 focus:border-blue-500 focus:outline-none ${value ? "border-blue-500" : "border-gray-300"}`}
                        value={value}
                        onChange={mobile ? undefined : (e) => handleCodeChange(e, index)}
                        onKeyDown={mobile ? undefined : (e) => handleKeyDown(e, index)}
                        readOnly={mobile ? true : undefined}
                    />
                ))}
            </div>
        </div>
    );
}