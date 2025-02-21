import React, { useEffect, useRef, useState } from "react";

const TemperatureGraph: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [temperatures, setTemperatures] = useState<number[][]>([]);

    useEffect(() => {
        // 예제 데이터: [최저, 평균, 최고]
        setTimeout(() => {
            setTemperatures([
                [0, 2, 5], [1, 3, 6], [4, 8, 12], [8, 12, 16],
                [14, 18, 22], [18, 22, 26], [21, 25, 29], [22, 26, 30],
                [17, 20, 23], [11, 14, 17], [5, 8, 11], [1, 3, 6]
            ]);
        }, 1000);
    }, []);

    useEffect(() => {
        if (temperatures.length === 0) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = 700;
        canvas.height = 200;

        const labels = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

        const minTemp = Math.min(...temperatures.flat());
        const maxTemp = Math.max(...temperatures.flat());

        const padding = 50;
        const graphWidth = canvas.width - padding * 2;
        const graphHeight = canvas.height - padding * 2;
        const stepX = graphWidth / (temperatures.length - 1);
        const stepY = graphHeight / (maxTemp - minTemp);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const colors = ["#FF0000", "#007BFF", "#00FF00"]; // 최고, 평균, 최저
        const labelsText = ["최고 온도", "평균 온도", "최저 온도"];

        temperatures[0].forEach((_, index) => {
            ctx.strokeStyle = colors[index];
            ctx.lineWidth = 2;
            ctx.beginPath();

            temperatures.forEach((tempSet, i) => {
                const x = padding + i * stepX;
                const y = canvas.height - padding - (tempSet[index] - minTemp) * stepY;
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            ctx.stroke();
        });

        // 라벨 표시
        ctx.fillStyle = "black";
        ctx.font = "14px Arial";
        labels.forEach((label, index) => {
            const x = padding + index * stepX;
            const y = canvas.height - 10;
            ctx.fillText(label, x - 10, y);
        });

        // 범례 표시
        labelsText.forEach((text, i) => {
            ctx.fillStyle = colors[i];
            ctx.fillText(text, canvas.width - 120, 20 + i * 20);
        });
    }, [temperatures]);

    return <canvas className="canvas" ref={canvasRef}></canvas>;
};

export default TemperatureGraph;
