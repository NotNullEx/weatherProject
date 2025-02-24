# 1. Node.js 이미지 사용
FROM node:18

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. 패키지 파일 복사 후 의존성 설치
COPY package*.json ./
RUN npm install

# 4. wait-for-it.sh 스크립트 다운로드
RUN curl -sS https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh > /wait-for-it.sh && chmod +x /wait-for-it.sh

# 5. 소스 코드 복사
COPY . .

# 6. 서버 실행
CMD /wait-for-it.sh mysql-db:3306 -- npm start
