import axios from "axios";

/** 기상청 초단기실황 및 초단기예보 조회 URL */
const NCST_URL = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst";
const FCST_URL = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst";

/** 기상청 API 인증키 */
const SERVICE_KEY = "6+GzKUXL2HYfqUKlZ52RqPZ7xA5d0+dUAuHxAJ+heXYQGgkpYrAMucD9MkyRL066m+aySYTdWguGAT7umpgN/Q==";

/**
 * 특정 날짜 기준으로 초단기실황 및 초단기예보 조회에 필요한 base_date, base_time 계산
 */
function getBaseDateTime(date: Date = new Date(), isForecast: boolean = false) {
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, "0");
    let day = String(date.getDate()).padStart(2, "0");
    let hour = date.getHours();
    let minute = date.getMinutes();

    // 🔹 초단기실황(NCST) → 10분 이전이면 한 시간 전 사용
    if (!isForecast && minute < 10) {
        hour -= 1;
    }
    // 🔹 초단기예보(FCST) → 45분 이전이면 한 시간 전, 이후면 30분 사용
    if (isForecast) {
        if (minute < 45) {
            hour -= 1;
            minute = 30;
        } else {
            minute = 30;
        }
    }

    // 🔹 날짜 조정 (0시 이하인 경우)
    if (hour < 0) {
        hour = 23;
        const yesterday = new Date(date.getTime() - 24 * 60 * 60 * 1000);
        year = yesterday.getFullYear();
        month = String(yesterday.getMonth() + 1).padStart(2, "0");
        day = String(yesterday.getDate()).padStart(2, "0");
    }

    const baseDate = `${year}${month}${day}`;
    const baseTime = String(hour).padStart(2, "0") + (isForecast ? "30" : "00");

    return { baseDate, baseTime };
}

/**
 * 🔹 초단기실황 API 호출 (기온 T1H 값)
 */
export async function getUltraSrtNcst(nx: number, ny: number, date?: Date) {
    const { baseDate, baseTime } = getBaseDateTime(date);

    try {
        const response = await axios.get(NCST_URL, {
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
        console.error("❌ 초단기실황 API 호출 오류:", error);
        return null;
    }
}

/**
 * 🔹 초단기예보 API 호출 (하늘 상태 SKY 값)
 */
export async function getUltraSrtFcst(nx: number, ny: number, date?: Date) {
    const { baseDate, baseTime } = getBaseDateTime(date, true); // 🔹 초단기예보용 baseTime

    try {
        const response = await axios.get(FCST_URL, {
            params: {
                serviceKey: decodeURIComponent(SERVICE_KEY),
                numOfRows: 100,
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
        console.error("❌ 초단기예보 API 호출 오류:", error);
        return null;
    }
}
