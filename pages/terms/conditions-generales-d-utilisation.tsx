import { NextPage } from "next";
import React, { useEffect, useState } from 'react'
import { BsSliders } from "react-icons/bs";
import { useResize, useSwipeAxeX } from "@libs/hooks";

import BasescreenWrapper from "@components/Wrapper/BasescreenWrapper";

import jsonFileCGU from "@datassets/CGU.json"

const CGU: NextPage = ({ jsonCGU }) => {
    const cguTitle = "Conditions Générales d'Utilisation"
    const [cgu, setCgu] = useState(jsonCGU[cguTitle]);
    const [articleRefs, setArticleRefs] = useState(new Map());

    const fixeValueFiltersPannel = "-100vw";
    const [toggleFiltersPannel, setToggleFiltersPannel] = useState<0 | "-100vw">(fixeValueFiltersPannel);

    const [filterPositionY, setFilterPositionY] = useState<number>(80);

    const getTouchY = (event: TouchEvent<HTMLButtonElement>) => {
        const touch = event.touches[0];
        const screenHeight = window.innerHeight - 80;

        if (touch && touch.clientY && touch.clientY >= 80 && touch.clientY <= screenHeight) {
            setFilterPositionY(touch.clientY);
        }
    };

    const renderCgu = (data) => {
        return Object.entries(data).map(([key, value]) => {
            if (typeof value === 'object') {
                const ref = articleRefs.get(key);

                return (
                    <div key={key} className="space-y-1" ref={ref}>
                        <h2 className="text-xl font-bold">{key}</h2>
                        {renderCgu(value)}
                    </div>
                );
            } else {
                return (
                    <div key={key}>
                        <strong>{key}:</strong> {value}
                    </div>
                );
            }
        });
    };

    const scrollToArticle = (article) => {
        const ref = articleRefs.get(article);
        if (ref && ref.current) {
            const rect = ref.current.getBoundingClientRect();
            window.scrollTo({
                top: rect.top + window.pageYOffset - 80,
                behavior: 'smooth',
            });
        }
    };

    const renderMenu = () => {
        return Object.keys(cgu).map((key) => (
            <button
                key={key}
                onClick={() => {
                    scrollToArticle(key)
                    setToggleFiltersPannel(fixeValueFiltersPannel)
                }}
                className="block w-full px-2 mt-1 font-bold text-left text-normal hover:underline"
            >
                {key}
            </button>
        ));
    };

    useEffect(() => {
        if (toggleFiltersPannel) {
            document.body.classList.remove("no-scroll");
        } else {
            document.body.classList.add("no-scroll");
        }
    }, [toggleFiltersPannel]);


    useEffect(() => {
        const newArticleRefs = new Map();
        Object.keys(cgu || {}).forEach((key) => {
            newArticleRefs.set(key, React.createRef());
        });
        setArticleRefs(newArticleRefs);
    }, [cgu]);


    // toggle filter panel on mobile
    useSwipeAxeX(
        () => setToggleFiltersPannel(fixeValueFiltersPannel),
        () => setToggleFiltersPannel(0)
    )

    useResize(
        () => document.body.classList.remove("no-scroll")
    )

    return (
        <BasescreenWrapper title={cguTitle}>
            <div className="relative flex w-full h-full overflow-visible bg-gray-100 max-w-screen">
                <button
                    className='fixed left-0 z-40 flex items-center justify-center w-12 h-12 bg-white border border-l-0 border-black rounded-r-lg top-20 md:hidden button-click-effect'
                    onClick={() => setToggleFiltersPannel(prev => prev === 0 ? fixeValueFiltersPannel : 0)}

                    onTouchStart={(e) => {
                        getTouchY(e);
                        document.body.classList.add('no-scroll');
                    }}

                    onTouchMove={(e) => getTouchY(e)}

                    onTouchEnd={(e) => {
                        getTouchY(e)
                        document.body.classList.remove('no-scroll')
                    }}
                    style={{ top: filterPositionY }}
                >
                    <BsSliders className='rotate-90' />
                </button>
                <div
                    className='bg-gray-100  max-md:fixed z-40 min-h-[calc(100vh-64px)] h-full -left-[100vw] duration-300 transition-all flex-row md:block md:flex-shrink md:max-w-[25vw] md:min-w-[25vw] w-full px-3 py-8 sm:px-6 sm:h-full'
                    style={{ left: toggleFiltersPannel }}
                >
                    <div className="sticky z-40 w-full top-20">
                        <h2 className="text-xl font-bold">Navigation rapide</h2>
                        {cgu && renderMenu()}
                    </div>
                </div>
                <div className="w-full px-5 py-8 space-y-5 bg-white border-l-0 shadow-lg">
                    <h1 className="text-3xl font-bold">{cguTitle}</h1>
                    {cgu && renderCgu(cgu)}
                </div>

            </div>
        </BasescreenWrapper>
    );
}

export const getStaticProps = async () => {
    try {
        return {
            props: {
                jsonCGU: jsonFileCGU
            }
        }
    } catch (err) {
        return {
            props: {
                jsonCGU: {}
            }
        }
    }
}

export default CGU;