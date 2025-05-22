import { useRef } from "react";
import PRODUCT_ORDER from "./sortSettings";

function Managestock({ setPage, stockList, setStockList, stock, setStock, updateStock, deleteStock, jsonToExcel, uploadFile, saveToJson }) {
    const stockName = useRef();
    const stockCount = useRef();
    return (
        <div className="App">
            <div className="header">
                <h1>Stock List</h1>
                <h2>재고 관리</h2>
                <h3>재고 등록</h3>
                <button className='menuButton' onClick={() => setPage("home")}>홈</button>
                <button className='menuButton' onClick={() => setPage("manageproduct")}>제품 등록</button>
                <button className='menuButton' onClick={() => setPage("managestock")}>재고 관리</button>
            </div>
            <div className='body'>
                <input
                    id="stockName"
                    ref={stockName}
                    type="text"
                    value={stock.name}
                    onChange={(e) => setStock({ ...stock, name: e.target.value })}
                    placeholder="Stock Name"
                />
                <input
                    id="stockCount"
                    ref={stockCount}
                    type="number"
                    value={stock.count}
                    onChange={(e) => setStock({ ...stock, count: Number(e.target.value) })}
                    placeholder="Stock Count"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            updateStock(stock.name, stock.count);
                            stockName.current.focus();
                        }
                    }
                    }
                />
                <button onClick={() => updateStock(stock.name, stock.count)}>제품 추가</button>
                <input
                    type="file"
                    onChange={(e) => uploadFile(e.target.files[0])}
                />
                <button onClick={saveToJson}>JSON으로 저장</button>
                <table>
                    <thead>
                        <tr>
                            <th>재고명</th>
                            {Array.from(
                                new Set(
                                    Object.values(stockList).flatMap(records =>
                                        records.map(record => record.date)
                                    )
                                )
                            )
                                .sort()
                                .map(date => (
                                    <th key={date}>{date}</th>
                                ))}
                            <th>삭제</th>
                        </tr>
                    </thead>
                    <tbody>
                        {PRODUCT_ORDER
                            .filter(name => stockList[name])
                            .map(name => {
                                const records = stockList[name];
                                const recordMap = Object.fromEntries(
                                    records.map(record => [record.date, record.count])
                                );

                                return (
                                    <tr key={name}>
                                        <td>{name}</td>
                                        {dates.map((date) => (
                                            <td
                                                key={date}
                                                onClick={() => {
                                                    const current = recordMap[date] ?? "";
                                                    const newCount = prompt(`${name} (${date})의 수량을 입력하세요:`, current);
                                                    if (newCount !== null && !isNaN(newCount)) {
                                                        const updated = [...records];
                                                        const index = updated.findIndex(r => r.date === date);
                                                        if (index !== -1) {
                                                            updated[index].count = Number(newCount);
                                                        } else {
                                                            updated.push({ date, count: Number(newCount) });
                                                        }

                                                        setStockList(prev => ({
                                                            ...prev,
                                                            [name]: updated
                                                        }));
                                                    }
                                                }}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                {recordMap[date] ?? ""}
                                            </td>
                                        ))}
                                        <td>
                                            <span className="delButton" onClick={() => deleteStock(name)}>삭제</span>
                                        </td>
                                    </tr>
                                );
                            })}

                    </tbody>
                </table>

                <button onClick={() => jsonToExcel(stockList, '재고목록')}>엑셀로 다운로드</button>
            </div>
        </div>
    )
}

export default Managestock;