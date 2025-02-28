import mysql from 'mysql2/promise';
import https from 'https';
// api를 받아서 테이블에 데이터 저장하는 파일

// MySQL 연결 설정
const connection = await mysql.createConnection({
  host: 'mysql-db',
  user: 'weather',
  password: '1q2w3e',
  database: 'weatherDB',
  charset: 'utf8mb4',
});

console.log('MySQL 연결 성공!');

// 인코딩 강제 설정
await connection.query("SET NAMES utf8mb4;");
await connection.query("SET CHARACTER SET utf8mb4;");
await connection.query("SET character_set_connection=utf8mb4;");

// 필터링할 도시 목록
const targetCities = ['서울', '수원', '천안', '청주', '강릉', '대구', '창원', '전주', '여수', '제주', '부산', '인천', '대전', '광주', '울산', '포항'];
const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const targetCitiyNumber=[108,119,232,131,105,138,155,146,168,184,159,112,143,133,156,152];

const fetchWeatherData = (url) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: new URL(url).hostname,
      path: new URL(url).pathname + new URL(url).search,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };

    const req = https.request(options, (res) => {
      let result = '';
      res.on('data', (chunk) => (result += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(result));
        } catch (error) {
          reject(error);
        }
      });
    });
    req.on('error', (error) => reject(error));
    req.end();
  });
};

const insertWeatherData3 = async (data, year, month, type) => {
  try {
    const infoList = data.response.body.items.item[0].stndays.info;
    if (infoList.length === 0) return console.warn(`유효한 데이터 없음: ${year}`);

    for (const cityData of infoList) {
      const cityName = data.response.body.items.item[0].stndays.stn_ko;
      if (!targetCities.includes(cityName)) continue;

      const tableName = 'day_weather';
      const columns = '(city, year, month, day, ta_max, ta_min, rn_day, hm)';
  
      if(typeof cityData.tm == Number){
       const values = [
         cityName, 
         year,
         month,
         cityData.tm,
         cityData.ta_max != 'null' ? cityData.ta_max : null,
         cityData.ta_min != 'null' ? cityData.ta_min : null,
         cityData.rn_day != 'null' ? cityData.rn_day : null,
         cityData.hm != 'null' ? cityData.hm : null
       ];
       

       const [existing] = await connection.query(
         `SELECT * FROM ${tableName} WHERE city = ? AND year = ? AND month = ? AND day = ?`,
         [cityName, year, month, day]
       );

       if (existing.length > 0) {
         console.log(`이미 존재: ${year}, ${month}, ${day} 도시: ${cityName}`);
         continue;
       }

       if(type==="dayWeather"){
         const query = `INSERT INTO ${tableName} ${columns} VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
         await connection.query(query, values);
         console.log(`데이터 삽입 완료: ${year}, ${month}, ${cityData.tm} 도시: ${cityName}`);        
       }
      }
    }
  } catch (error) {
    console.error('데이터 삽입 중 오류 발생:', error);
  }
};

// 메인 실행 함수
const main = async () => {
  try {
    for (let year = 2017; year <= 2024; year++) {
      for (const month of months) {
        console.log(`데이터 수집 중: ${year}-${month}`);
        for(let city=0; city<targetCitiyNumber.length; city++){
          const weatherData4 = await fetchWeatherData(`https://apihub.kma.go.kr/api/typ02/openApi/SfcMtlyInfoService/getDailyWthrData?pageNo=1&numOfRows=10&dataType=JSON&year=${year}&month=${month}&station=${targetCitiyNumber[city]}&authKey=hVqmw5caSHOapsOXGhhz3Q`).catch(()=>null);
          if(weatherData4) await insertWeatherData3(weatherData4, year, month, 'dayWeather');
        }
      }
    }
  } catch (error) {
    console.error('오류 발생:', error);
  } finally {
    await connection.end();
    console.log('MySQL 연결 종료');
  }
};

main();