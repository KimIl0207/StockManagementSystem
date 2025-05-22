# 📦 재고 관리 시스템

React + Flask 기반의 웹 애플리케이션으로, 제품 재고를 등록·관리하고 JSON 또는 Excel 파일로 업로드/저장할 수 있습니다.

---

## 🧩 기술 스택

- **Frontend**: React (Create React App)
- **Backend**: Flask (Python)
- **데이터 저장**: JSON 파일 (`stock.json`)
- **Excel 지원**: pandas + openpyxl

---

## ✅ 주요 기능

### 📋 제품 재고 등록
- 제품 이름과 수량 입력 → 엔터 또는 버튼으로 등록
- 등록된 재고는 날짜별로 기록됨
- UI에서 즉시 확인 가능

### 📂 파일 업로드
- `.json` 또는 `.xlsx` 파일 업로드
- 업로드된 데이터는 UI에 바로 반영됨
- JSON: `{ "제품명": [{ "date": "YYYY-MM-DD", "count": 수량 }] }`
- Excel: `제품`, `수량` 열로 구성된 시트

### 💾 재고 저장
- `JSON에 저장` 버튼 클릭 시 서버에 현재 상태 저장
- Flask 서버가 `stock.json` 파일로 기록

### 📥 Excel 다운로드
- UI에서 `엑셀로 다운로드` 버튼 클릭 시
- 현재 재고 내역을 날짜별 열로 구성된 Excel 파일로 다운로드

---

## 🧪 개발 환경 실행법

### 🔧 1. 프론트엔드

```bash
cd client
npm install
npm start
