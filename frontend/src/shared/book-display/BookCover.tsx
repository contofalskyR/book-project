import React from 'react';
import './BookCover.css';

export const getRandomColor = (): string => {
    // Generate random RGB color values
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r},${g},${b})`;
};

export const getRandomGradient = (): string => {
    // Generate random angle for gradient
    const angle = Math.floor(Math.random() * 360);
    // Generate random RGB color values for gradient stops
    const color1 = getRandomColor();
    const color2 = getRandomColor();
    return `linear-gradient(${angle}deg, ${color1}, ${color2})`;
};

export default function BookCover(): JSX.Element {
    return (
        <div
            className="book-image"
            style={{ backgroundImage: getRandomGradient() }}
        ></div>
    );
}