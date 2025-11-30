import React from "react";

const Logo = ({ className = "w-8 h-8" }: { className?: string }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            fill="none"
            className={className}
        >
            <defs>
                <linearGradient id="premiumGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7c3aed" stopOpacity="1" />
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity="1" />
                </linearGradient>
            </defs>

            <g>
                <path
                    d="M30 10 V65 A15 15 0 0 1 15 80 H10"
                    stroke="url(#premiumGradient)"
                    strokeWidth="22"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M70 10 V65 A15 15 0 0 1 55 80 H50"
                    stroke="url(#premiumGradient)"
                    strokeWidth="22"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <circle cx="85" cy="25" r="10" fill="url(#premiumGradient)" />
            </g>
        </svg>
    );
};

export default Logo;
