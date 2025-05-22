

function Home({setPage}) {
    return (
      <div className="App">
        <div className="header">
          <h1>Stock List</h1>
          <h2>제품 재고 관리</h2>
          <h3>재고 관리 시스템</h3>
          <button className='menuButton' onClick={() => setPage("home")}>홈</button>
          <button className='menuButton' onClick={() => setPage("manageproduct")}>제품 등록</button>
          <button className='menuButton' onClick={() => setPage("managestock")}>재고 관리</button>
        </div>
        <div className='body'>
          <h2>환영합니다!</h2>
          <p>재고 관리 프로그램입니다.</p>
          <h3>기능</h3>
          <ul>
            <li>제품 등록: 제품 이름과 개수를 입력하여 재고를 등록하세요.</li>
            <li>재고 관리: 등록된 제품의 재고를 관리하세요.</li>
            <li>재고 목록 초기화: Clear List 버튼을 클릭하여 재고 목록을 초기화하세요.</li>
            <li>홈: 홈 버튼을 클릭하여 홈으로 돌아가세요.</li>
          </ul>
          <h2>사용방법</h2>
          <ul>
            <li>제품 등록: 제품 이름과 개수를 입력하고 Enter를 누르세요.</li>
            <li>재고 관리: 제품 이름을 클릭하여 삭제하세요.</li>
            <li>재고 목록 초기화: Clear List 버튼을 클릭하세요.</li>
            <li>홈: 홈 버튼을 클릭하여 홈으로 돌아가세요.</li>
          </ul>
        </div>
      </div>
    );
}

export default Home;