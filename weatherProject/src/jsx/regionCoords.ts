export interface RegionCoord {
    name: string;
    nx: number;
    ny: number;
}

// 지역별 격자 좌표 (예시)
export const regionCoords: RegionCoord[] = [
    { name: "서울", nx: 60, ny: 127 },
    { name: "부산", nx: 98, ny: 76 },
    { name: "대구", nx: 89, ny: 90 },
    { name: "인천", nx: 55, ny: 124 },
    { name: "광주", nx: 58, ny: 74 },
    { name: "대전", nx: 67, ny: 100 },
    { name: "울산", nx: 102, ny: 84 },
];