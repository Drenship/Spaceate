import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Keyboard } from "swiper";


// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import { TypeProduct } from "@libs/typings";
import Productcard from "@components/cards/product-card";

interface Props {
    overflow?: 'hidden' | 'visible'
    products: TypeProduct[]
}

CarouselProduct.defaultProps = {
    overflow: 'visible',
    products: []
}

function CarouselProduct({ products, overflow }: Props) {

    return (
        <Swiper
            slidesPerView={1}
            spaceBetween={20}
            breakpoints={{
                640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                768: {
                    slidesPerView: 3,
                    spaceBetween: 20,
                },
                1024: {
                    slidesPerView: 4,
                    spaceBetween: 20,
                },
            }}
            keyboard={{
                enabled: true,
            }}
            grabCursor={true}
            modules={[Navigation, Keyboard]}
            className="w-full max-w-screen"
            style={{
                overflow: `${overflow} !important;`
            }}
        >
            {
                products.map((data, key) => <SwiperSlide key={key}>
                    <Productcard product={data} />
                </SwiperSlide>)
                }
        </Swiper>
    );
}

export default CarouselProduct;