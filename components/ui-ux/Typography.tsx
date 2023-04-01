import React from 'react';

interface TypographyProps {
  children: React.ReactNode;
}

export const TypographyH1: React.FC<TypographyProps> = ({ children }) => {
  return <h1 className="mt-8 mb-4 text-4xl font-bold leading-none">{children}</h1>;
};

export const TypographyH2: React.FC<TypographyProps> = ({ children }) => {
  return <h2 className="mb-4 text-3xl font-semibold leading-tight">{children}</h2>;
};

export const TypographyH3: React.FC<TypographyProps> = ({ children }) => {
  return <h3 className="mb-4 text-2xl font-semibold leading-snug">{children}</h3>;
};

export const TypographyH4: React.FC<TypographyProps> = ({ children }) => {
  return <h4 className="mb-4 text-xl font-semibold leading-snug">{children}</h4>;
};

export const TypographyH5: React.FC<TypographyProps> = ({ children }) => {
  return <h5 className="mb-3 text-lg font-medium leading-snug">{children}</h5>;
};

export const TypographyH6: React.FC<TypographyProps> = ({ children }) => {
  return <h6 className="mb-2 text-base font-medium leading-snug">{children}</h6>;
};

export const TypographyP: React.FC<TypographyProps> = ({ children }) => {
  return <p className="mb-4 text-base font-normal leading-relaxed">{children}</p>;
};

export const TypographySmall: React.FC<TypographyProps> = ({ children }) => {
  return <p className="mb-2 text-sm font-normal leading-relaxed">{children}</p>;
};

export const TypographyTiny: React.FC<TypographyProps> = ({ children }) => {
  return <p className="mb-1 text-xs font-normal leading-relaxed">{children}</p>;
};