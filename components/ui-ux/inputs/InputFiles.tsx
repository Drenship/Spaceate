import React, { useEffect, useState } from 'react';

type Props = {
    multiple: boolean
}

const defaultProps: Props = {
    multiple: true
};

export default function InputFiles({ multiple } : Props = defaultProps) {

    const [files, setReturnFiles] = useState<any>([]);

    const _ShowMiniature = (e: React.ChangeEvent<HTMLInputElement | any>) => {
        if (!e.currentTarget.files[0]) return;
        if(multiple === true) {
            setReturnFiles([...files, ...e.target.files]);
        } else {
            setReturnFiles([...e.target.files]);
        }
    };

    useEffect(() => {
        console.log(files.length);
        if (files.length === 0) return;
        document.getElementById("show")!.innerHTML = "";
        for (let index = 0; index < files.length; index++) {
            const reader = new FileReader();
            reader.onload = function (e: any) {
                document.getElementById("show")!.innerHTML += `<img class="rounded-lg" alt="" src="${e.target.result}"/>`;
            };
            reader.readAsDataURL(files[index]);
        }
    }, [files]);

    return (
        <div className='flex flex-col space-y-5 lg:flex-row lg:space-x-5 col-span-full'>
            <div id='show' className="grid grid-cols-2 gap-5"></div>
            <input
                type='file'
                accept='image/*'
                multiple={multiple}
                name='preview-location'
                className="w-full h-32 p-5 mt-5 border-2 border-dashed rounded-lg"
                onChange={(e) => _ShowMiniature(e)}
            />
        </div>
    );
}
