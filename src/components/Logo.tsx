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
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            <g filter="url(#glow)">
                <path
                    d="M35 25 V65 A15 15 0 0 1 20 80 H15"
                    stroke="url(#premiumGradient)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M65 25 V65 A15 15 0 0 1 50 80 H45"
                    stroke="url(#premiumGradient)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <circle cx="80" cy="30" r="6" fill="url(#premiumGradient)" />
            </g>
        </svg>
    );
};

export default Logo;
