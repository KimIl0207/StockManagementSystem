import { useEffect } from 'react';
import { useState } from 'react';
import './App.css';
import Home from './Home';
import Manageproduct from './Manageproduct';
import Managestock from './Managestock';
import jsonToExcel from './jsonToExcel';

const API_BASE_URL = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

function App() {
  const [stockList, setStockList] = useState({});
  const [stock, setStock] = useState({ name: "", count: 0 });
  const [page, setPage] = useState("home");

  useEffect(() => {
    fetch(`${API_BASE_URL}/stock`)
      .then(res => res.json())
      .then(data => setStockList(data));
  }, []);

  const updateStock = async (name, count) => {
    const res = await fetch(`${API_BASE_URL}/stock`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, count })
    });
    const result = await res.json();
    console.log(result);

    const updatedStockList = await fetch(`${API_BASE_URL}/stock`).then(res => res.json());
    setStockList(updatedStockList);
    setStock({ name: "", count: 0 });
  };

  const deleteStock = async (name) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    const res = await fetch(`${API_BASE_URL}/stock/${encodeURIComponent(name)}`, {
      method: "DELETE"
    });
    const result = await res.json();
    console.log(result);

    setStockList(prev => {
      const newStock = { ...prev };
      delete newStock[name];
      return newStock;
    });
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${process.env.REACT_APP_API_BASE}/upload`, {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    console.log(result);

    if (!result.data) return;

    // Excel 응답: [ { 재고명, 재고량, 날짜 } ]
    if (Array.isArray(result.data)) {
      const newStock = {};

      result.data.forEach((item) => {
        const name = item.재고명 || item.제품 || item.name;
        const count = item.재고량 || item.수량 || item.count;
        const date = item.날짜 || item.date || new Date().toISOString().split("T")[0];

        if (!name || count === undefined) return;

        if (!newStock[name]) newStock[name] = [];
        newStock[name].push({ date, count });
      });

      // 병합 반영
      setStockList((prev) => {
        const merged = { ...prev };
        for (const name in newStock) {
          merged[name] = [...(merged[name] || []), ...newStock[name]];
        }
        return merged;
      });
    }

    // JSON 구조일 경우: 바로 병합
    else if (typeof result.data === "object") {
      setStockList((prev) => {
        const merged = { ...prev };
        for (const name in result.data) {
          merged[name] = [...(merged[name] || []), ...result.data[name]];
        }
        return merged;
      });
    }
  };



  const saveToJson = async () => {
    const res = await fetch(`${API_BASE_URL}/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(stockList),
    });

    const result = await res.json();
    console.log(result.message); // 저장 성공 여부
  };

  if (!stockList) {
    return <div>Loading...</div>;
  }

  if (page === "home") return <Home setPage={setPage} />
  if (page === "manageproduct") return <Manageproduct setPage={setPage} />
  if (page === "managestock") return <Managestock setPage={setPage} stockList={stockList} setStockList={setStockList} stock={stock} setStock={setStock} updateStock={updateStock} deleteStock={deleteStock} jsonToExcel={jsonToExcel} uploadFile={uploadFile} saveToJson={saveToJson} />
}

export default App;
