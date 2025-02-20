import axios from "axios";

/** 기상청 초단기실황 조회 URL */
const KMA_URL =
    "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst";
/** 기상청 API 인증키 (공공데이터포털에서 발급) */
const SERVICE_KEY = "6+GzKUXL2HYfqUKlZ52RqPZ7xA5d0+dUAuHxAJ+heXYQGgkpYrAMucD9MkyRL066m+aySYTdWguGAT7umpgN/Q==";

/**
 * 현재 날짜/시간을 바탕으로 초단기실황 조회에 맞는 base_date, base_time 계산
 * - 매 시 정각 데이터를 약 10분 후에 발표
 * - 분이 10분 미만이면 한 시간 전을 사용
 */
function getBaseDateTime() {
    const now = new Date();

    let year = now.getFullYear();
    let month = String(now.getMonth() + 1).padStart(2, "0");
    let day = String(now.getDate()).padStart(2, "0");
    let hour = now.getHours();
    const minute = now.getMinutes();

    // 10분 이전이면 아직 정각 데이터가 올라오지 않았다고 가정 → 한 시간 전 사용
    if (minute < 10) {
        hour -= 1;
        // 만약 0시 이전으로 넘어가면 전날로 세팅
        if (hour < 0) {
            hour = 23;
            const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            year = yesterday.getFullYear();
            month = String(yesterday.getMonth() + 1).padStart(2, "0");
            day = String(yesterday.getDate()).padStart(2, "0");
        }
    }

    const baseDate = `${year}${month}${day}`;
    const baseTime = String(hour).padStart(2, "0") + "00"; // 예: 0700

    return { baseDate, baseTime };
}

/**
 * 기상청 초단기실황(getUltraSrtNcst) API를 호출하여 실황 데이터를 가져옴
 * @param nx 격자 X 좌표 (서울: 60)
 * @param ny 격자 Y 좌표 (서울: 127)
 */
export async function getUltraSrtNcst(nx: number, ny: number) {
    const { baseDate, baseTime } = getBaseDateTime();

    try {
        const response = await axios.get(KMA_URL, {
            params: {
                serviceKey: decodeURIComponent(SERVICE_KEY), // 인증키는 디코딩 필요
                numOfRows: 60,
                pageNo: 1,
                dataType: "JSON",
                base_date: baseDate,
                base_time: baseTime,
                nx,
                ny,
            },
        });

        return response.data;
    } catch (error) {
        console.error("기상청 초단기실황 API 호출 오류:", error);
        return null;
    }
}