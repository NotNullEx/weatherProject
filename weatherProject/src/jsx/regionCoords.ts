export interface RegionCoord {
    name: string;
    nx: number;
    ny: number;
    index: string;
}

// 지역 좌표
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


export interface todayRegionCoord {
    name: string;
    lat: number;
    lon: number;
    index: string;
}

// 현재(실시간) 지역 좌표에 사용
export const todayRegionCoords: todayRegionCoord[] = [
    { name: "서울", lat: 37.5665, lon: 126.9780, index: '108' },
    { name: "부산", lat: 35.1796, lon: 129.0756, index: '159' },
    { name: "대구", lat: 35.8714, lon: 128.6014, index: '143' },
    { name: "인천", lat: 37.4563, lon: 126.7052, index: '112' },
    { name: "광주", lat: 35.1595, lon: 126.8526, index: '156' },
    { name: "대전", lat: 36.3504, lon: 127.3845, index: '133' },
    { name: "울산", lat: 35.5384, lon: 129.3114, index: '152' },
    { name: "경기", lat: 37.4138, lon: 127.5183, index: '119' },
    { name: "강원", lat: 37.8228, lon: 128.1555, index: '105' },
    { name: "충북", lat: 36.6357, lon: 127.4912, index: '131' },
    { name: "충남", lat: 36.6588, lon: 126.6728, index: '232' },
    { name: "경북", lat: 36.5760, lon: 128.5056, index: '138' },
    { name: "경남", lat: 35.2598, lon: 128.6647, index: '155' },
    { name: "전북", lat: 35.7175, lon: 127.1530, index: '146' },
    { name: "전남", lat: 34.8679, lon: 126.9910, index: '168' },
    { name: "제주", lat: 33.4996, lon: 126.5312, index: '184' },
];