'use client';
import { useRouter } from "next/navigation";

const Logo = () => {
    const router = useRouter();

    return (
        <div
            onClick={() => router.push('/')}
            className="relative hidden px-2 cursor-pointer select-none sm:block"
        >
            <img width={100} src="/icons/spaceate.svg" alt="My SVG Image" />
            <div className='absolute inset-0 z-10' />
        </div>
    );
}

export default Logo;