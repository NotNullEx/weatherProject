import axios from "axios";

/** 기상청 초단기실황 조회 URL */
const KMA_URL =
    "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst";
/** 기상청 API 인증키 */
const SERVICE_KEY = "6+GzKUXL2HYfqUKlZ52RqPZ7xA5d0+dUAuHxAJ+heXYQGgkpYrAMucD9MkyRL066m+aySYTdWguGAT7umpgN/Q==";

/**
 * 특정 날짜 기준으로 초단기실황 조회에 필요한 base_date, base_time 계산
 */
function getBaseDateTime(date: Date = new Date()) {
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, "0");
    let day = String(date.getDate()).padStart(2, "0");
    let hour = date.getHours();
    const minute = date.getMinutes();

    // 10분 이전이면 한 시간 전 사용
    if (minute < 10) {
        hour -= 1;
        if (hour < 0) {
            hour = 23;
            const yesterday = new Date(date.getTime() - 24 * 60 * 60 * 1000);
            year = yesterday.getFullYear();
            month = String(yesterday.getMonth() + 1).padStart(2, "0");
            day = String(yesterday.getDate()).padStart(2, "0");
        }
    }

    const baseDate = `${year}${month}${day}`;
    const baseTime = String(hour).padStart(2, "0") + "00";

    return { baseDate, baseTime };
}

/**
 * 초단기실황 API 호출 (특정 날짜 가능)
 */
export async function getUltraSrtNcst(nx: number, ny: number, date?: Date) {
    const { baseDate, baseTime } = getBaseDateTime(date);

    try {
        const response = await axios.get(KMA_URL, {
            params: {
                serviceKey: decodeURIComponent(SERVICE_KEY),
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
