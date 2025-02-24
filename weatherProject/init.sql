CREATE DATABASE IF NOT EXISTS weatherDB;

USE weatherDB;

CREATE TABLE IF NOT EXISTS month_weather (
  id INT(1) AUTO_INCREMENT PRIMARY KEY,
  city varchar(50) not null,
  year smallint not null,
  month smallint not null,
  taavg float not null,
  tamax float not null,
  tamin float not null,
  avghm smallint not null,
  rnDay float not null,
  maxRnDay float not null,
  tmRnDay tinyint not null
);
