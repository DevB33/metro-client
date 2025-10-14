# 1️⃣ Node.js 베이스 이미지 선택
FROM node:22-bookworm-slim

# 2️⃣ 작업 디렉토리 생성
WORKDIR /app

# 3️⃣ 패키지 복사 및 설치
COPY package*.json ./
RUN npm install --legacy-peer-deps

# 4️⃣ 전체 소스 복사
COPY . .

# 5️⃣ 빌드
RUN npm run build

# 6️⃣ 포트 지정 (Next.js 기본 포트 3000)
EXPOSE 3000

# 7️⃣ 실행
CMD ["npm", "start"]
