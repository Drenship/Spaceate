import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay, Navigation, Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import Image from 'next/image';

// Add necessary Swiper modules
SwiperCore.use([Autoplay, Navigation, Pagination]);

const Slider: React.FC = () => {
    const slides = [
        {
            src: '/banner.png',
            alt: 'Banner 1',
            title: 'Welcome to our store',
        },
        {
            src: '/banner2.png',
            alt: 'Banner 2',
            title: 'New collection',
        },
        {
            src: '/banner3.png',
            alt: 'Banner 3',
            title: 'Limited time offers',
        },
    ];

    return (
        <div className="relative w-full max-h-[420px] h-full">
            <Swiper
                spaceBetween={0}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000 }}
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={index}>
                        <div className="relative w-full h-full">
                            <Image
                                src={slide.src}
                                alt={slide.alt}
                                layout="fill"
                                objectFit="cover"
                                objectPosition="center"
                            />
                            <div className="absolute top-0 left-0 w-full p-4 md:p-8 lg:p-12 h-1/3">
                                <h1 className="mb-2 text-4xl font-semibold text-white md:text-5xl">
                                    {slide.title}
                                </h1>
                            </div>
                            <div className="absolute bottom-0 right-0 p-4 md:p-8 lg:p-12">
                                <button className="px-4 py-2 text-black bg-white rounded-md button-click-effect">
                                    Shop Now
                                </button>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default Slider;
