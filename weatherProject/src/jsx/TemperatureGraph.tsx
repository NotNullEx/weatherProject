import React, { useEffect, useRef, useState } from "react";

const TemperatureGraph: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [temperatures, setTemperatures] = useState<number[]>([]);

    useEffect(() => {
        // API에서 데이터 가져오기 (예제용 setTimeout 사용)
        const fetchData = async () => {
            // 예제: 실제 API 요청을 fetch 또는 axios를 이용하여 변경 가능
            setTimeout(() => {
                setTemperatures([2, 3, 8, 12, 18, 22, 25, 26, 20, 14, 8, 3]);
                setTemperatures([2, 3, 8, 12, 18, 22, 25, 26, 20, 14, 8, 3]);
                setTemperatures([2, 3, 8, 12, 18, 22, 25, 26, 20, 14, 8, 3]);
            }, 1000);
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (temperatures.length === 0) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // 캔버스 크기 설정
        canvas.width = 700;
        canvas.height = 200;

        const labels: string[] = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

        // 최대 및 최소값 설정
        const maxTemp: number = Math.max(...temperatures);
        const minTemp: number = Math.min(...temperatures);

        // 그래프 그리기
        const padding: number = 40;
        const graphWidth: number = canvas.width - padding * 2;
        const graphHeight: number = canvas.height - padding * 2;
        const stepX: number = graphWidth / (temperatures.length - 1);
        const stepY: number = graphHeight / (maxTemp - minTemp);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "#007BFF";
        ctx.lineWidth = 2;
        ctx.beginPath();

        temperatures.forEach((temp, index) => {
            const x: number = padding + index * stepX;
            const y: number = canvas.height - padding - (temp - minTemp) * stepY;
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();

        // 라벨 표시
        ctx.fillStyle = "black";
        ctx.font = "14px Arial";
        labels.forEach((label, index) => {
            const x: number = padding + index * stepX;
            const y: number = canvas.height - 10;
            ctx.fillText(label, x - 10, y);
        });
    }, [temperatures]);

    return <canvas className="canvas" ref={canvasRef} ></canvas>;
};

export default TemperatureGraph;
