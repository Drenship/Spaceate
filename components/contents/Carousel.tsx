import React, { useEffect } from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/solid';
import Swiper from "swiper";

type TypeSlide = {
    image: string
    title: string
    subtitle: string
    description: string
    link: string
}

interface SlideProps {
    slide: TypeSlide
}

function Slide({ slide }: SlideProps) {
    const { image, title, subtitle, description, link } = slide;
    return (
        <div className="swiper-slide">
            <div className="swiper-slide__block">
                <div className="swiper-slide__block__img" data-swiper-parallax-y="70%">
                    <a target="_blank" href="#">
                        <img src={image} alt="" />
                    </a>
                </div>
                <div className="swiper-slide__block__text">
                    <p data-swiper-parallax-x="-60%" className="main__title">{title}<span>.</span></p>
                    <h3 data-swiper-parallax-x="-50%" className="main__subtitle">{subtitle}</h3>
                    <p data-swiper-parallax-x="-40%" className="paragraphe">{description}</p>
                    <a data-swiper-parallax-x="-30%" className="link" target="_blank" href={link}>Discover</a>
                    <span data-swiper-parallax-y="60%" className="number">1</span>
                </div>
            </div>
        </div>
    )
}

interface CarouselProps {
    slidesData: TypeSlide[]
}

export default function Carousel({ slidesData }: CarouselProps) {

    useEffect(() => {

        if (window.innerWidth < 1200) {
            const swiper = new Swiper(".swiper-container", {
                direction: "horizontal",
                slidesPerView: 1,
                navigation: {
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev",
                },
                paginationClickable: !0,
                spaceBetween: 0,
                autoplay: 2500,
                loop: !0
            })
            return () => swiper.destroy()
        } else {
            const swiper = new Swiper(".swiper-container", {
                direction: "horizontal",
                slidesPerView: 1,
                parallax: !0,
                navigation: {
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev",
                },
                paginationClickable: !0,
                spaceBetween: 0,
                speed: 1500,
                parallax: !0,
                autoplay: 2500,
                loop: !0
            })
            return () => swiper.destroy()
        }

    }, []);

    return (
        <section className="section__slider">
            <div className="container__center">
                <div className="swiper-container">
                    <div className="swiper-wrapper">
                        {
                            slidesData.map((slide, key) => <Slide key={key} slide={slide} />)
                        }
                    </div>
                    <button className="swiper-button-next group">
                        <ArrowRightIcon className='fa-long-arrow-right group-active:scale-75' />
                    </button>
                    <button className="swiper-button-prev group">
                        <ArrowLeftIcon className='fa-long-arrow-left group-active:scale-75' />
                    </button>
                </div>
            </div>
        </section>
    );
}
