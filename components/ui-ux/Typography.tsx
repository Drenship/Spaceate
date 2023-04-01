import React from 'react';

interface TypographyProps {
    children: React.ReactNode;
    className?: string;
    color?: string;
    size?: string;
    uppercase?: boolean;
    italic?: boolean;
    underline?: boolean;
    lineThrough?: boolean;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
}

const baseClasses = {
    h1: "font-bold leading-none mb-4 mt-8",
    h2: "font-semibold leading-tight mb-4",
    h3: "font-medium leading-snug mb-4",
    h4: "font-medium leading-snug mb-4",
    h5: "font-medium leading-snug mb-3",
    h6: "font-medium leading-snug mb-2",
    p: "font-normal leading-relaxed mb-4",
    small: "font-normal leading-relaxed mb-2",
    tiny: "font-normal leading-relaxed mb-1",
};

const baseSize = {
    h1: "4xl",
    h2: "3xl",
    h3: "2xl",
    h4: "xl",
    h5: "lg",
    h6: "base",
    p: "base",
    small: "sm",
    tiny: "xs",
};

export const TypographyH1: React.FC<TypographyProps> = ({ children, className, color, size }) => {
    return <h1 className={`${baseClasses.h1} ${className} text-${size || baseSize.h1} text-${color}`}>{children}</h1>;
};

export const TypographyH2: React.FC<TypographyProps> = ({ children, className, color, size }) => {
    return <h2 className={`${baseClasses.h2} ${className} text-${size || baseSize.h2} text-${color}`}>{children}</h2>;
};

export const TypographyH3: React.FC<TypographyProps> = ({ children, className, color, size }) => {
    return <h3 className={`${baseClasses.h3} ${className} text-${size || baseSize.h3} text-${color}`}>{children}</h3>;
};

export const TypographyH4: React.FC<TypographyProps> = ({ children, className, color, size }) => {
    return <h4 className={`${baseClasses.h4} ${className} text-${size || baseSize.h4} text-${color}`}>{children}</h4>;
};

export const TypographyH5: React.FC<TypographyProps> = ({ children, className, color, size }) => {
    return <h5 className={`${baseClasses.h5} ${className} text-${size || baseSize.h5} text-${color}`}>{children}</h5>;
};

export const TypographyH6: React.FC<TypographyProps> = ({ children, className, color, size }) => {
    return <h6 className={`${baseClasses.h6} ${className} text-${size || baseSize.h6} text-${color}`}>{children}</h6>;
};

export const TypographyP: React.FC<TypographyProps> = ({ children, className, color, size }) => {
    return <p className={`${baseClasses.p} ${className} text-${size || baseSize.p} text-${color}`}>{children}</p>;
};

export const TypographySmall: React.FC<TypographyProps> = ({ children, className, color, size }) => {
    return <p className={`${baseClasses.small} ${className} text-${size || baseSize.small} text-${color}`}>{children}</p>;
};

export const TypographyTiny: React.FC<TypographyProps> = ({ children, className, color, size }) => {
    return <p className={`${baseClasses.tiny} ${className} text-${size || baseSize.tiny} text-${color}`}>{children}</p>;
};