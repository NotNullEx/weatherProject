import './index.js';
import https from "https";
// const https = require('https');

const apiUrl = 'https://apihub.kma.go.kr/api/typ02/openApi/SfcMtlyInfoService/getMmSumry2?pageNo=1&numOfRows=10&dataType=json&year=2016&month=09&authKey=SbnYSQwuQ-G52EkMLhPhlQ';

const url = new URL(apiUrl);
const options = {
  hostname: url.hostname,
  port: url.port,
  path: url.pathname + url.search,
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

// 요청 생성
const req = https.request(options, (res) => {
  let result = '';
 
  res.on('data', (chunk) => {
    result += chunk;
  });

  res.on('end', () => {
    const json_response = JSON.parse(result);
    console.log(json_response.response.body.items.item[0].month.info);
  });
});

// 에러 이벤트 처리
req.on('error', (error) => {
  console.error(error);
});

// 요청 완료
req.end();