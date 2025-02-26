export interface RegionCoord {
    name: string;
    nx: number;
    ny: number;
    index: string;
}

// 지역별 격자 좌표 (예시)
export const regionCoords: RegionCoord[] = [
    { name: "서울", nx: 60, ny: 127, index: '108' },
    { name: "부산", nx: 98, ny: 76, index: '159' },
    { name: "대구", nx: 89, ny: 90, index: '143' },
    { name: "인천", nx: 55, ny: 124, index: '112' },
    { name: "광주", nx: 58, ny: 74, index: '156' },
    { name: "대전", nx: 67, ny: 100, index: '133' },
    { name: "울산", nx: 102, ny: 84, index: '152' },
    { name: "경기", nx: 60, ny: 121, index: '119' },
    { name: "강원", nx: 73, ny: 134, index: '105' },
    { name: "충북", nx: 69, ny: 107, index: '131' },
    { name: "충남", nx: 68, ny: 100, index: '232' },
    { name: "경북", nx: 89, ny: 91, index: '138' },
    { name: "경남", nx: 91, ny: 77, index: '155' },
    { name: "전북", nx: 63, ny: 89, index: '146' },
    { name: "전남", nx: 51, ny: 67, index: '168' },
    { name: "제주", nx: 52, ny: 38, index: '184' },
];