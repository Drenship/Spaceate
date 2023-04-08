import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { generateUUID, replaceURL } from '@libs/utils';

type Props = {
    multiple: boolean
    input: {
        name: string,
        values: string[]
        imageClass: string
    },
    onChange: (files: FileList | File | string) => void;
    setRemoveItem?: (file: string) => void
}

const defaultProps: Props = {
    multiple: true,
    input: {
        name: 'files',
        values: [],
        imageClass: ""
    },
    onChange: (files: FileList | File | string) => { },
    setRemoveItem: (file: string) => { }
};

type SIProps = {
    image: string
    imageClass: string
    setRemoveItem: (x: string) => void
    setUrls: (x: string[]) => void
}

const ShowImage = ({ image, imageClass, setRemoveItem, setUrls }: SIProps) => {
    const removeHandler = useCallback((e: React.BaseSyntheticEvent) => {
        e.preventDefault();
        setRemoveItem(image);
        setUrls(prev => prev.filter(c => c !== image));
    }, [image, setRemoveItem, setUrls]);

    return (
        <React.Fragment>
            <img className={`rounded-lg cursor-pointer ${imageClass}`} alt="" src={image} onDoubleClick={removeHandler} />
        </React.Fragment>
    )
}

export default function InputFiles({ multiple, input, onChange, setRemoveItem }: Props = defaultProps) {

    const { name, values, imageClass } = input;

    const [urls, setUrls] = useState<string[]>(values);
    const [files, setReturnFiles] = useState<any>([]);
    const uuid = useMemo(generateUUID, []);

    const [base64Images, setBase64Images] = useState<string[]>([]);

    useEffect(() => {
        if (files.length === 0) return;
        const newImages: string[] = [];
    
        for (let index = 0; index < files.length; index++) {
            const reader = new FileReader();
            reader.onload = function (e: any) {
                newImages.push(e.target.result);
                setBase64Images([...newImages]);
            };
            reader.readAsDataURL(files[index]);
        }
    }, [files]);

    const combinedImages = useMemo(() => [...urls, ...base64Images], [urls, base64Images]);

    const _ShowMiniature = (e: React.BaseSyntheticEvent) => {
        if (!e.currentTarget.files[0]) return;
        if (multiple === true) {
            setReturnFiles([...files, ...e.target.files]);
        } else {
            setReturnFiles([...e.target.files]);
        }
    };


    const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        if (!event.target.files?.length) {
            return;
        }
        _ShowMiniature(event);
        onChange(event.target.files);
    };

    return (
        <div className='flex flex-col w-full'>
            <div id={uuid} className="grid self-center w-full grid-cols-3 gap-5 md:grid-cols-5">
                {combinedImages.map((data, key) => (
                    <ShowImage
                        key={key}
                        imageClass={imageClass}
                        image={data}
                        setRemoveItem={setRemoveItem}
                        setUrls={setUrls}
                    />
                ))}
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
