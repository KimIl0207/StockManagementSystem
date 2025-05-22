function Manageproduct({setPage}) {
  

  return(
    <div className="App">
      <div className="header">
        <h1>Stock List</h1>
        <h2>제품 관리</h2>
        <h3>제품 관리</h3>
        <button className='menuButton' onClick={() => setPage("home")}>홈</button>
        <button className='menuButton' onClick={() => setPage("manageproduct")}>제품 등록</button>
        <button className='menuButton' onClick={() => setPage("managestock")}>재고 관리</button>
      </div>
      <div className='body'>
        <h2>제품 관리 페이지입니다.</h2>
      </div>
    </div>
  )
}

export default Manageproduct;