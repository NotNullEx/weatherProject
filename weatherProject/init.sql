SET NAMES utf8mb4;
SET character_set_client = utf8mb4;
SET character_set_connection = utf8mb4;
SET character_set_results = utf8mb4;

CREATE DATABASE IF NOT EXISTS weatherDB;

USE weatherDB;
ALTER DATABASE weatherDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS month_temperature_weather (
  id INT(1) AUTO_INCREMENT PRIMARY KEY,
  city varchar(50) null,
  year smallint null,
  month smallint null,
  taavg float null,   -- 기온 평균
  tamax float null,   -- 기온 최고
  tamin float null,   -- 기온 최저
  avghm smallint null -- 평균 상대 습도
);

create table if not exists month_precipitation_weather(
  id int(1) auto_increment primary key,
  city varchar(50) null,
  year smallint null,
  month smallint null,
  rnDay float null,    -- 강수량 총량
  maxRnDay float null, -- 1일 최다 강수량
  tmRnDay tinyint null -- 1일 최다 강수량이 나타난 날
);

create table if not exists year_temper_precipi_weather(
  id int(1) auto_increment primary key,
  city varchar(50) null,
  year smallint null,
  Va_lst_11 int null,   -- 강수량 총량
  Va_lst_13 bigint null,   -- 1일 최다 강수량
  Va_lst_14 int null, -- 1일 최다 강수량이 나타난 날
  Va_lst_03 int null,   -- 평균 기온
  Va_lst_05 int null,   -- 최고 평균 기온
  Va_lst_06 int null,   -- 최고 기온
  Va_lst_07 int null, -- 최고 기온이 나타난 날
  Va_lst_09 int null,   -- 최저 기온
  Va_lst_10 int null  -- 최저 기온이 나타난 날
);

ALTER TABLE month_temperature_weather CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE month_precipitation_weather CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE year_temper_precipi_weather CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;