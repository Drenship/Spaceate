import React, { useEffect, useState, useMemo } from 'react';
import { generateUUID, replaceURL } from '@libs/utils';

type Props = {
    multiple: boolean
    input: {
        name: string,
        values: string[]
        imageClass: string
    },
    onChange: (formData: FormData) => void;
}

const defaultProps: Props = {
    multiple: true,
    input: {
        name: 'files',
        values: [],
        imageClass: ""
    },
    onChange: (formData: FormData) => {}
};

export default function InputFiles({ multiple, input, onChange }: Props = defaultProps) {

    const { name, values, imageClass } = input;

    const [urls, setUrls] = useState<string[]>(values);
    const [files, setReturnFiles] = useState<any>([]);
    const uuid = useMemo(generateUUID, []);

    const _ShowMiniature = (e: React.BaseSyntheticEvent) => {
        if (!e.currentTarget.files[0]) return;
        if (multiple === true) {
            setReturnFiles([...files, ...e.target.files]);
        } else {
            setReturnFiles([...e.target.files]);
        }
    };

    useEffect(() => {
        if (files.length === 0) return;
        document.getElementById(uuid)!.innerHTML = "";
        if(multiple === true){
            for (let index = 0; index < urls.length; index++) {
                document.getElementById(uuid)!.innerHTML += `<img class="rounded-lg ${imageClass}" alt="" src="${replaceURL(urls[index])}"/>`;
            }
        }
        for (let index = 0; index < files.length; index++) {
            const reader = new FileReader();
            reader.onload = function (e: any) {
                document.getElementById(uuid)!.innerHTML += `<img class="rounded-lg ${imageClass}" alt="" src="${e.target.result}"/>`;
            };
            reader.readAsDataURL(files[index]);
        }
    }, [files]);

    const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files?.length) {
            return;
        }

        _ShowMiniature(event);

        const formData = new FormData();

        Array.from(event.target.files).forEach((file) => {
            formData.append(event.target.name, file);
        });

        onChange(formData);
    };

    return (
        <div className='flex flex-col w-full'>
            <div id={uuid} className="grid self-center w-full grid-cols-5 gap-5">
                {
                    urls?.map((data, key) =><img key={key} className={`rounded-lg ${imageClass}`} alt="" src={replaceURL(data)}/>)
                }
            </div>
            <input
                type='file'
                accept='image/*'
                multiple={multiple}
                name={name}
                className="w-full h-32 p-5 mt-5 border-2 border-dashed rounded-lg"
                onChange={onChangeHandler}
            />
        </div>
    );
}