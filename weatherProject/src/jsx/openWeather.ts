export const getOpenWeatherData = async (lat: number, lon: number) => {
    const API_KEY = "b38c1aa9b51d2705b80ad742bf49fba8";
    const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=kr`;

    try {
        const response = await fetch(URL);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("OpenWeather API 호출 오류:", error);
        return null;
    }
};
