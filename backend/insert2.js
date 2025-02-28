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

// 인코딩 설정
await connection.query("SET NAMES utf8mb4;");
await connection.query("SET CHARACTER SET utf8mb4;");
await connection.query("SET character_set_connection=utf8mb4;");

const targetCities = ['서울', '수원', '천안', '청주', '강릉', '대구', '창원', '전주', '여수', '제주', '부산', '인천', '대전', '광주', '울산', '포항'];

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

const insertWeatherData2 = async (data, year, type) => {
  try {
    const infoList = data.response.body.items.item[0].temp.info;
    if (infoList.length === 0) return console.warn(`유효한 데이터 없음: ${year}`);

    for (const cityData of infoList) {
      const cityName = cityData.stn_ko;
      if (!targetCities.includes(cityName)) continue;
      const tableName = 'year_temper_precipi_weather';
      const columns = '(city, year, Va_lst_11, Va_lst_13, Va_lst_14, Va_lst_03, Va_lst_05, Va_lst_06, Va_lst_07, Va_lst_09, Va_lst_10)';
      const values = [
        cityName, 
        year, 
        cityData.va_lst_11 != 'null' ? cityData.va_lst_11 : 0,
        cityData.va_lst_13 != 'null' ? cityData.va_lst_13 : 0,
        cityData.va_lst_14 != 'null' ? cityData.va_lst_14 : 0,
        cityData.va_lst_03 != 'null' ? cityData.va_lst_03 : 0,
        cityData.va_lst_05 != 'null' ? cityData.va_lst_05 : 0,
        cityData.va_lst_06 != 'null' ? cityData.va_lst_06 : 0,
        cityData.va_lst_07 != 'null' ? cityData.va_lst_07 : 0,
        cityData.va_lst_09 != 'null' ? cityData.va_lst_09 : 0,
        cityData.va_lst_10 != 'null' ? cityData.va_lst_10 : 0
      ];
      const [existing] = await connection.query(
        `SELECT * FROM ${tableName} WHERE city = ? AND year = ?`,
        [cityName, year]
      );

      if (existing.length > 0) {
        console.log(`이미 존재: ${year}, 도시: ${cityName}`);
        continue;
      }

      if(type==="precipi"){
        const query = `INSERT INTO ${tableName} ${columns} VALUES (?, ?, ?, ?, ?, ?, ?,?,?,?,?)`;
        await connection.query(query, values);
        console.log(`데이터 삽입 완료: ${year}, 도시: ${cityName}`);        
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
      const weatherData3 = await fetchWeatherData(`https://apihub.kma.go.kr/api/typ02/openApi/SfcYearlyInfoService/getYearSumry?pageNo=1&numOfRows=10&dataType=JSON&year=${year}&authKey=hVqmw5caSHOapsOXGhhz3Q`).catch(() => null); 
      if (weatherData3) await insertWeatherData2(weatherData3,year,"precipi");
    }
  } catch (error) {
    console.error('오류 발생:', error);
  } finally {
    await connection.end();
    console.log('MySQL 연결 종료');
  }
};

main();