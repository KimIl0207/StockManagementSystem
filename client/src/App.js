import { useEffect } from 'react';
import { useState } from 'react';
import './App.css';
import Home from './Home';
import Manageproduct from './Manageproduct';
import Managestock from './Managestock';
import jsonToExcel from './jsonToExcel';

function App() {
  const [stockList, setStockList] = useState({});
  const [stock, setStock] = useState({ name: "", count: 0 });
  const [page, setPage] = useState("home");

  useEffect(() => {
    fetch('http://localhost:5000/stock')
      .then(res => res.json())
      .then(data => setStockList(data));
  }, []);

  const updateStock = async (name, count) => {
    const res = await fetch("http://localhost:5000/stock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, count })
    });
    const result = await res.json();
    console.log(result);

    const updatedStockList = await fetch('http://localhost:5000/stock').then(res => res.json());
    setStockList(updatedStockList);
    setStock({ name: "", count: 0 });
  };

  const deleteStock = async (name) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    const res = await fetch(`http://localhost:5000/stock/${encodeURIComponent(name)}`, {
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

    const res = await fetch("https://<render-url>/upload", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    console.log(result);

    if (result.data) {
      const today = new Date().toISOString().split('T')[0];

      if (Array.isArray(result.data)) {
        const newStock = {};
        for (const item of result.data) {
          if (item.제품 && item.수량 !== undefined) {
            newStock[item.제품] = [{ date: today, count: item.수량 }];
          }
        }
        setStockList(prev => ({ ...prev, ...newStock }));
      }

      else if (typeof result.data === 'object') {
        setStockList(prev => ({ ...prev, ...result.data }));
      }
    }
  };

  const saveToJson = async () => {
    const res = await fetch("https://<render-url>/save", {
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
