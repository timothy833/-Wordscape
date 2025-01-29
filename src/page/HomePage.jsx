import "./HomePage"

const HomePage = () => {
  return(
    <>
      <span class="badge bg-primary">按鈕</span>
      <input type="button" className="btn btn-sm btn-primary" value="按鈕" />
      <input type="button" className="btn btn-sm btn-outline-primary" value="按鈕" />
      <h2 className="text-primary">我是標題</h2>
    </>
  )
}

export default HomePage;