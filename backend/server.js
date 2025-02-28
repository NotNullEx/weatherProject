import express from "express";
import cors from "cors";
import mysql from "mysql2";
import { readFile } from 'fs/promises';
const url = JSON.parse(await readFile(new URL('../weatherProject/src/jsx/json/url.json', import.meta.url)));

const app = express();
const PORT = 21182;

// cors 설정 -> 이게 리엑트에서 api 호출 가능하게 함
app.use(cors());

// mysql 연결
const connection = mysql.createConnection({
    host: "localhost",
    user: "c21st18",
    password: "MJfqebtKqcW6KV27",
    database: "c21st18"
});

connection.connect((err) => {
    if (err) {
        return;
    }
    console.log("DB 연결 성공!");
});

// 데이터 조회 api
app.get("/api/temperature", (req, res) => {
    const selectedYear = req.query.year;
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
        }
    });
});

app.get("/api/precipitation", (req, res) => {
    const selectedYear = req.query.year;
    const selectedCity = req.query.city;
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
    console.log("최종 쿼리문", query);
    connection.query(query, parmas, (err, result) => {
        if (err) {
            res.status(500).json({ error: "데이터 조회 실패" });
        } else {
            res.json(result);
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
            res.status(500).json({ error: "데이터 조회 실패" });
        } else {
            res.json(result);
        }
    });
});

app.get("/api/dayWeather", (req, res) => {
    const selectedYear = req.query.year;
    const selectedCity = req.query.city;
    const selectedMonth = req.query.month;
    const selectedDay = req.query.day;
    let query = `SELECT city, year, month, day, ta_max, ta_min, rn_day, hm FROM day_weather WHERE 1=1`;
    let params = [];
    if (selectedYear) {
        query += ` AND year = ?`;
        params.push(selectedYear);
    }
    if (selectedMonth) {
        query += ` AND month =? `;
        params.push(selectedMonth);
    }
    if (selectedCity) {
        query += `AND city = ?`;
        params.push(selectedCity);
    }
    if (selectedDay) {
        query += `AND day = ?`;
        params.push(selectedDay);
    }

    connection.query(query, params, (err, result) => {
        if (err) {
            res.status(500).json({ error: "데이터 조회 실패" });
        } else {
            res.json(result);
        }
    });
});

// 서버 실행
app.listen(PORT, () => {
    console.log(`백엔드 서버 실행 중: ${url.host2}${PORT}`);
});