import React from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Keyboard } from "swiper";


// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import { TypeProduct } from "@libs/typings";
import ProductCard_V2 from "@components/cards/ProductCard_V2";

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
                0: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                },
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
            style={{ overflow: `${overflow} !important` }}
        >
            {
                products.map((data, key) => <SwiperSlide key={key} className="w-full">
                    <ProductCard_V2 product={data} />
                </SwiperSlide>)
            }
        </Swiper>
    );
}

export default CarouselProduct;