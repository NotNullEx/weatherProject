export interface RegionCoord {
    name: string;
    nx: number;
    ny: number;
}

// 지역별 격자 좌표 (예시)
export const regionCoords: RegionCoord[] = [
    { name: "서울", nx: 60, ny: 127 },
    { name: "경기", nx: 60, ny: 121 },
    { name: "강원", nx: 73, ny: 134 },
    { name: "충북", nx: 69, ny: 107 },
    { name: "충남", nx: 68, ny: 100 },
    { name: "경북", nx: 89, ny: 91 },
    { name: "경남", nx: 91, ny: 77 },
    { name: "전북", nx: 63, ny: 89 },
    { name: "전남", nx: 51, ny: 67 },
    { name: "제주", nx: 52, ny: 38 },
];