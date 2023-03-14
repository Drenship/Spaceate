import React, { useState } from "react";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";
import { RxDotFilled } from "react-icons/rx";

import { useInterval } from "@libs/hooks";
import { Line } from "react-chartjs-2";
import Link from "next/link";

interface slide {
    url: string,
    link: string

}

type Props = {
    slides: slide[]
}

export default function Slider({ slides }: Props) {

    const [currentIndex, setCurrentIndex] = useState(0)
    const defaultDelay = 10000; //10s
    const [delay, setDelay] = useState(defaultDelay)
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [startX, setStartX] = useState(0);

    const resetSwipeDelaySlide = () => {
        setDelay(0)
        setTimeout(() => {
            setDelay(defaultDelay)
        }, 5000)
    }

    const prevSlide = () => {
        resetSwipeDelaySlide()
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex)
    }

    const nextSlide = () => {
        resetSwipeDelaySlide()
        const isLastSlide = currentIndex === (slides.length - 1);
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex)
    }

    const goToSlide = (index: number) => {
        resetSwipeDelaySlide()
        setCurrentIndex(index)
    }

    useInterval(nextSlide, delay)

    return (
        <div className="max-w-[1400px] h-[580px] w-full m-auto py-8 px-4 relative group">
            <Link href={slides[currentIndex].link || ''}>
                <div style={{ backgroundImage: `url(${slides[currentIndex].url})` }} className="w-full h-full duration-500 bg-center bg-cover rounded-2xl"></div>
            </Link>

            <div onClick={prevSlide} className="opacity-0 group-hover:opacity-100 duration-75 absolute top-[50%] translate-x-0 -translate-y-[50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
                <BsChevronCompactLeft size={30} />
            </div>
            <div onClick={nextSlide} className="opacity-0 group-hover:opacity-100 duration-75 absolute top-[50%] translate-x-0 -translate-y-[50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
                <BsChevronCompactRight size={30} />
            </div>

            <div className="flex items-center justify-center w-full py-2">
                {
                    slides.map((slide, slideIndex) => (
                        <div
                            key={slideIndex}
                            onClick={() => goToSlide(slideIndex)}
                            className="text-2xl cursor-pointer"
                        >
                            <RxDotFilled />
                        </div>
                    ))
                }
            </div>
        </div>
    );
}