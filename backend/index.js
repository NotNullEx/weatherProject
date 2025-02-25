import mysql from 'mysql2';
import getSelect from "./select.js";
import './server.js';
// MySQL 연결 설정
const connection = mysql.createConnection({
  host: 'mysql-db',
  user: 'weather',
  password: '1q2w3e',
  database: 'weatherDB',
});

// 연결 시도
connection.connect((err) => {
  // if (err) {
  //   console.error('MySQL 연결 실패:', err);
  //   return;
  // }
  // console.log('MySQL 연결 성공!');

  // 데이터 삽입 예제
  const query = `
    INSERT INTO month_temperature_weather
    (id, city, year, month, taavg, tamax, tamin, avghm)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [null, 'seoul', 2024, 12, 1.1, 2.2, 3.3, 60];

  // connection.query(query, values, (err, result) => {
  //   if (err) {
  //     console.error('데이터 삽입 실패:', err);
  //     connection.end();
  //   } 
  //   console.log('데이터 삽입 성공:', result);
    
    
  // });
  getSelect(connection,() =>{
    // console.log("데이터 조회 성공!");
    connection.end();
  });
});
