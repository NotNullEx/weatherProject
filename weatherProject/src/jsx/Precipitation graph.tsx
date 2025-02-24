import React from "react";

interface PrecipitationGraph {
    value: number; // 0 ~ 100 퍼센트 값
}

const PrecipitationGraph: React.FC<PrecipitationGraph> = ({ value }) => {
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * ((100 - value) / 100);

    return (
        <div className="circleBox">
            <svg viewBox="0 -10 100 100" className="circle">
                {/* 배경 원 */}
                <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke="#232324"
                    strokeWidth="7"
                    strokeDasharray={circumference}
                    strokeDashoffset={0}
                    transform="rotate(-90 50 50)"
                    className="circleIn"
                />
                {/* 진행 바 */}
                <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke="#00FFFF"
                    strokeWidth="6"
                    // strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    transform="rotate(-90 50 50)"
                    className="circleIn2"

                />
            </svg>
            {/* 중앙 텍스트 */}
            <div className="absolute text-white text-sm font-semibold">
                <p className="circleper">{value}%</p>
            </div>
        </div>
    );
};

export default PrecipitationGraph;