CREATE DATABASE IF NOT EXISTS weatherDB;

USE weatherDB;

CREATE TABLE IF NOT EXISTS month_weather (
  id INT(1) AUTO_INCREMENT PRIMARY KEY,
  city varchar(50) not null,
  year smallint not null,
  month smallint not null,
  taavg decimal(3,3) not null,
  tamax decimal(3,3) not null,
  tamin decimal(3,3) not null,
  avghm smallint not null,
  rnDay decimal(3,3) not null,
  maxRnDay decimal(3,3) not null,
  tmRnDay tinyint not null
);
