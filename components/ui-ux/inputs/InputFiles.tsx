import React, { useEffect, useState, useMemo } from 'react';
import { generateUUID } from '@libs/utils';

type Props = {
    multiple: boolean
    input: {
        name: string,
    }
}

const defaultProps: Props = {
    multiple: true,
    input: {
        name: 'image',
    }
};

export default function InputFiles({ multiple, input }: Props = defaultProps) {

    const { name } = input;

    const [files, setReturnFiles] = useState<any>([]);
    const uuid = useMemo(generateUUID, []);

    const _ShowMiniature = (e: React.ChangeEvent<HTMLInputElement | any>) => {
        if (!e.currentTarget.files[0]) return;
        if (multiple === true) {
            setReturnFiles([...files, ...e.target.files]);
        } else {
            setReturnFiles([...e.target.files]);
        }
    };

    useEffect(() => {
        console.log(files.length);
        if (files.length === 0) return;
        document.getElementById(uuid)!.innerHTML = "";
        for (let index = 0; index < files.length; index++) {
            const reader = new FileReader();
            reader.onload = function (e: any) {
                document.getElementById(uuid)!.innerHTML += `<img class="rounded-lg" alt="" src="${e.target.result}"/>`;
            };
            reader.readAsDataURL(files[index]);
        }
    }, [files]);

    return (
        <div className='flex flex-col w-full'>
            <div id={uuid} className="grid self-center w-full grid-cols-2 gap-5"></div>
            <input
                type='file'
                accept='image/*'
                multiple={multiple}
                name={name}
                className="w-full h-32 p-5 mt-5 border-2 border-dashed rounded-lg"
                onChange={(e) => _ShowMiniature(e)}
            />
        </div>
    );
}