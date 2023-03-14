
import React from 'react';

type Props = {
    onRemove: () => void
}

export default function Popup({ onRemove }: Props) {

    return (
        <div className='bg-white rounded-lg min-w-[50vw] min-h-[50vh] p-5'>

            <button onClick={() => onRemove()} className="text-red-600">click</button>
        </div>
    );
}
