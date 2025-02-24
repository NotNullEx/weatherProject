CREATE DATABASE IF NOT EXISTS weatherDB;

USE weatherDB;

CREATE TABLE IF NOT EXISTS month_temperature_weather (
  id INT(1) AUTO_INCREMENT PRIMARY KEY,
  city varchar(50) not null,
  year smallint not null,
  month smallint not null,
  taavg float not null,   -- 기온 평균
  tamax float not null,   -- 기온 최고
  tamin float not null,   -- 기온 최저
  avghm smallint not null -- 평균 상대 습도
);

create table if not exists month_precipitation_weather(
  id int(1) auto_increment primary key,
  city varchar(50) not null,
  year smallint not null,
  rnDay float not null,    -- 강수량 총량
  maxRnDay float not null, -- 1일 최다 강수량
  tmRnDay tinyint not null -- 1일 최다 강수량이 나타난 날
);

create table if not exists year_temper_precipi_weather(
  id int(1) auto_increment primary key,
  city varchar(50) not null,
  year smallint not null,
  Va_lst_11 float not null,   -- 강수량 총량
  Va_lst_13 float not null,   -- 1일 최다 강수량
  Va_lst_14 tinyint not null, -- 1일 최다 강수량이 나타난 날
  Va_lst_03 float not null,   -- 평균 기온
  Va_lst_05 float not null,   -- 최고 평균 기온
  Va_lst_06 float not null,   -- 최고 기온
  Va_lst_07 tinyint not null, -- 최고 기온이 나타난 날
  Va_lst_09 float not null,   -- 최저 기온
  Va_lst_10 tinyint not null  -- 최저 기온이 나타난 날
);