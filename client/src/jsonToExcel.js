import * as XLSX from "xlsx";
import PRODUCT_ORDER from "./sortSettings";

function jsonToExcel(jsonData, fileName) {
  // 날짜 수집
  const allDates = new Set();
  Object.values(jsonData).forEach(records => {
    records.forEach(record => allDates.add(record.date));
  });
  const sortedDates = Array.from(allDates).sort();

  const header = ['재고명', ...sortedDates];

  // 정해진 순서대로 데이터 생성
  const dataArray = PRODUCT_ORDER
    .filter(name => jsonData[name]) // stock.json에 있는 항목만
    .map(name => {
      const row = { '재고명': name };
      const records = jsonData[name];
      sortedDates.forEach(date => {
        const match = records.find(r => r.date === date);
        row[date] = match ? match.count : '';
      });
      return row;
    });

  const worksheet = XLSX.utils.json_to_sheet(dataArray, { header });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "재고기록");

  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}

export default jsonToExcel;