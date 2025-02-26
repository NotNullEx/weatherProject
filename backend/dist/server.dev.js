"use strict";

var _express = _interopRequireDefault(require("express"));

var _cors = _interopRequireDefault(require("cors"));

var _mysql = _interopRequireDefault(require("mysql2"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
var PORT = 5000; // cors 설정 -> 이게 리엑트에서 api 호출 가능하게 함

app.use((0, _cors["default"])()); // app.use(express.json());
// mysql 연결

var connection = _mysql["default"].createConnection({
  host: "mysql-db",
  user: "weather",
  password: "1q2w3e",
  database: "weatherDB"
});

connection.connect(function (err) {
  if (err) {
    console.log("DB 연결 실패...", err);
    return;
  }

  console.log("DB 연결 성공!");
}); // 데이터 조회 api

app.get("/api/temperature", function (req, res) {
  var selectedYear = req.query.year; // 요청에서 year 파라미터 가져오기

  console.log("선택된 연도:", selectedYear);
  var query = "SELECT year, month, city, taavg, tamax, tamin, avghm FROM month_temperature_weather";

  if (selectedYear) {
    query += " WHERE year = ?";
  }

  connection.query(query, selectedYear ? [selectedYear] : [], function (err, result) {
    if (err) {
      console.log("데이터 조회 실패...", err);
      res.status(500).json({
        error: "데이터 조회 실패"
      });
    } else {
      res.json(result); //console.log("조회된 데이터:",result);
    }
  });
});
app.get("/api/precipitation", function (req, res) {
  var selectedYear = req.query.year; // 요청에서 year 파라미터 가져오기

  var selectedCity = req.query.city;
  console.log("선택된 도시:", selectedCity);
  var query = "SELECT city, year, month, rnDay, maxRnDay, tmRnDay FROM month_precipitation_weather WHERE 1=1";
  var parmas = [];

  if (selectedYear) {
    query += " AND year = ?";
    parmas.push(selectedYear);
  }

  if (selectedCity) {
    query += "AND city = ?";
    parmas.push(selectedCity);
  }

  console.log("최종 쿼리문", query);
  connection.query(query, parmas, function (err, result) {
    if (err) {
      console.log("데이터 조회 실패...", err);
      res.status(500).json({
        error: "데이터 조회 실패"
      });
    } else {
      res.json(result); //console.log("조회된 강수량 데이터:", result);
    }
  });
});
app.get("/api/yearWeather", function (req, res) {
  var selectedYear = req.query.year;
  var selectedCity = req.query.city;
  console.log("선택된 연도:", selectedYear, "선택된 도시:", selectedCity);
  var query = "SELECT city, year, Va_lst_11 FROM year_temper_precipi_weather WHERE 1=1";
  var params = [];

  if (selectedYear) {
    query += " AND year = ?";
    params.push(selectedYear);
  }

  if (selectedCity) {
    query += " AND city = ?";
    params.push(selectedCity);
  }

  console.log("최종 쿼리문:", query);
  connection.query(query, params, function (err, result) {
    if (err) {
      console.log("데이터 조회 실패...", err);
      res.status(500).json({
        error: "데이터 조회 실패"
      });
    } else {
      res.json(result);
    }
  });
}); // 서버 실행

app.listen(PORT, function () {
  console.log("\uBC31\uC5D4\uB4DC \uC11C\uBC84 \uC2E4\uD589 \uC911: http://localhost:".concat(PORT));
});