import React, { useState, useEffect } from "react";
import { regionCoords } from "./regionCoords";
import { getUltraSrtNcst } from "./openWeather";
// 데이터 타입 정의
interface TableRow {
    id: number;
    columns: string[];
}

interface WeatherProps {
    selectedIndex: number;
}

const months = [
    "1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"
];

const TableData: React.FC<WeatherProps> = ({ selectedIndex }) => {
    const [region, setRegion] = useState<string>("-");
    const fetchWeather = async () => {
        const region = regionCoords[selectedIndex];
        const data = await getUltraSrtNcst(region.nx, region.ny);

        if (data?.response?.header?.resultCode === "00") {
            setRegion(region.name || "-");
        } else {
            console.log("API 응답 오류:", data?.response?.header?.resultMsg);
        }
    };


    // 기본 더미 데이터 (12행 7열)
    const [data] = useState<TableRow[]>(
        Array.from({ length: 12 }, (_, rowIndex) => ({
            id: rowIndex + 1,
            columns: [months[rowIndex], ...Array.from({ length: 7 }, () => ` ${rowIndex + 1}`)],
        }))
    );

    useEffect(() => {
        fetchWeather()
        // 선택된 지역 정보 업데이트
    }, [selectedIndex]);

    return (
        <div className="table">
            <table className="tableMain">
                <thead className="customthead">
                    <tr className="customtr">
                        <th className="customth">{region}</th>
                        {Array.from({ length: 7 }, (_, colIndex) => (
                            <th key={colIndex} className="customth">
                                Column {colIndex + 2}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="customtbody">
                    {data.map((row) => (
                        <tr key={row.id} className="customtr">
                            {row.columns.map((cell, colIndex) => (
                                <td key={colIndex} className="customtd">
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TableData;
