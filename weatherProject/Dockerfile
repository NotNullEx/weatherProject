# 1. Node.js 이미지 사용
FROM node:18

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. 패키지 파일 복사 후 의존성 설치
COPY package*.json ./
RUN npm install

# 4. 소스 코드 복사
COPY . ./

EXPOSE 3000

# 5. TypeScript 컴파일
RUN npm run build

# 6. 서버 실행
CMD [ "npm", "start" ]