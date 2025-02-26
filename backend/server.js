import express from "express";
import cors from "cors";
import mysql from "mysql2";

const app = express();
const PORT = 5000;

// cors 설정 -> 이게 리엑트에서 api 호출 가능하게 함
app.use(cors());
// app.use(express.json());

// mysql 연결
const connection = mysql.createConnection({
    host: "mysql-db",
    user: "weather",
    password: "1q2w3e",
    database: "weatherDB"
});

connection.connect((err) => {
    if (err) {
        console.log("DB 연결 실패...", err);
        return;
    }
    console.log("DB 연결 성공!");
});

// 데이터 조회 api
app.get("/api/temperature", (req, res) => {
    const selectedYear = req.query.year; // 요청에서 year 파라미터 가져오기
    console.log("선택된 연도:", selectedYear);
    let query = `SELECT year, month, city, taavg, tamax, tamin, avghm FROM month_temperature_weather`;

    if (selectedYear) {
        query += ` WHERE year = ?`;
    }

    connection.query(query, selectedYear ? [selectedYear] : [], (err, result) => {
        if (err) {
            console.log("데이터 조회 실패...", err);
            res.status(500).json({ error: "데이터 조회 실패" });
        } else {
            res.json(result);
            //console.log("조회된 데이터:",result);
        }
    });
});
app.get("/api/precipitation", (req, res) => {
    const selectedYear = req.query.year; // 요청에서 year 파라미터 가져오기
    const selectedCity = req.query.city;
    console.log("선택된 도시:", selectedCity);
    let query = `SELECT city, year, month, rnDay, maxRnDay, tmRnDay FROM month_precipitation_weather WHERE 1=1`;

    let parmas = [];

    if (selectedYear) {
        query += ` AND year = ?`;
        parmas.push(selectedYear);
    }

    if (selectedCity) {
        query += `AND city = ?`;
        parmas.push(selectedCity);
    }
    console.log("최종 쿼리문",query);
    connection.query(query, parmas, (err, result) => {
        if (err) {
            console.log("데이터 조회 실패...", err);
            res.status(500).json({ error: "데이터 조회 실패" });
        } else {
            res.json(result);
            //console.log("조회된 강수량 데이터:", result);
        }
    });
});

app.get("/api/yearWeather", (req, res) => {
    const selectedYear = req.query.year;
    const selectedCity = req.query.city;
    
    console.log("선택된 연도:", selectedYear, "선택된 도시:", selectedCity);

    let query = `SELECT city, year, Va_lst_11 FROM year_temper_precipi_weather WHERE 1=1`;
    let params = [];

    if (selectedYear) {
        query += ` AND year = ?`;
        params.push(selectedYear);
    }

    if (selectedCity) {
        query += ` AND city = ?`;
        params.push(selectedCity);
    }

    console.log("최종 쿼리문:", query);

    connection.query(query, params, (err, result) => {
        if (err) {
            console.log("데이터 조회 실패...", err);
            res.status(500).json({ error: "데이터 조회 실패" });
        } else {
            res.json(result);
        }
    });
});


// 서버 실행
app.listen(PORT, () => {
    console.log(`백엔드 서버 실행 중: http://localhost:${PORT}`);
});