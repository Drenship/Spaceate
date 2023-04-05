import React, { useEffect, useRef, useState, CSSProperties, ReactNode } from "react";

interface ScrollShadowWrapperProps {
    children: ReactNode;
    className?: string;
    style?: CSSProperties;
}

const ScrollShadowWrapper: React.FC<ScrollShadowWrapperProps> = ({
    children,
    className = "",
    style = {},
}) => {

    const [scrollTop, setScrollTop] = useState(0)
    const [scrollHeight, setScrollHeight] = useState(0)
    const [clientHeight, setClientHeight] = useState(0)

    const onScrollHandler = (event) => {
        setScrollTop(event.currentTarget.scrollTop)
        setScrollHeight(event.currentTarget.scrollHeight)
        setClientHeight(event.currentTarget.clientHeight)
    }

    const wrapperRef = useRef(null)

    const getVisibleSides = () => {
        const isBottom = clientHeight === scrollHeight - scrollTop
        const isTop = scrollTop === 0
        const isBetween = scrollTop > 0 && clientHeight < scrollHeight - scrollTop
        console.log({
            top: (isBottom || isBetween) && !(isTop && isBottom),
            bottom: (isTop || isBetween) && !(isTop && isBottom),
        })
        return {
            top: (isBottom || isBetween) && !(isTop && isBottom),
            bottom: (isTop || isBetween) && !(isTop && isBottom),
        }
    }

    useEffect(() => {
        const resetRefSizes = (ref) => {
            if (!ref.current) return

            setScrollTop(ref.current.scrollTop)
            setScrollHeight(ref.current.scrollHeight)
            setClientHeight(ref.current.clientHeight)
        }

        resetRefSizes(wrapperRef)
    }, [wrapperRef?.current?.clientHeight])

    return (
        <div
            ref={wrapperRef}
            style={style}
            className={`relative overflow-y-auto overflow-x-hidden ${className}`}
            onScroll={onScrollHandler}
        >
            {/*SHADOW TOP*/}
            <div
                className={`sticky top-0 h-4 -mt-4 bg-white bg-scroll-shadow-up transition-opacity duration-300 ${getVisibleSides().top === true ? 'hidden' : 'hidden'}`}
            />

            {children}

            {/* SHADOW BOTTOM */}
            <div
                className={`sticky h-4 bottom-0 bg-scroll-shadow-bottom rotate-180 transition-opacity duration-300 ${getVisibleSides().bottom === true ? '' : 'hidden'}`}
            />
        </div>
    )
}

export default ScrollShadowWrapper