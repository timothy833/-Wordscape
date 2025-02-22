import Navbar from "../../component/Navbar/Navbar";
import Footer from "../../component/Footer/Footer";
import AdminPcSidebar from "../../component/AdminPcSidebar/AdminPcSidebar";
import AdminMobileHeader from "../../component/AdminMobileHeader/AdminMobileHeader";
import AdminRevenueChart from "../../component/AdminRevenueChart/AdminRevenueChart";

const AdminBackground = () => {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="bg-secondary py-10">
        <div className="container">
          <div className="row">
            <AdminPcSidebar />
            <div className="col-md-9">
              <div className="admin_wrap py-10 px-5 rounded-3 border border-gray_light">
                <AdminMobileHeader />
                <h1 className="fs-4 fs-md-1 text-primary fw-bold mb-5">管理後臺</h1>
                <div className="admin-background_textData">
                  <div className="d-md-flex gap-6">
                    <p className="mb-2 admin-background_textData-title">目前訂閱人數</p>
                    <div className="d-flex align-items-center mb-5 ">
                      <p className="me-5">1,184,013</p>
                      <span className="text-data_font text-gray me-1">本月減少 15,382 訂閱數</span>
                      <span className="material-symbols-sharp text-primary">
                        trending_down
                      </span>
                    </div>
                  </div>
                  <div className="d-md-flex gap-6">
                    <p className="mb-2 admin-background_textData-title">文章總點閱量</p>
                    <div className="d-flex align-items-center mb-5">
                      <p className="me-5">983,293,012</p>
                      <span className="text-data_font text-gray me-1">本月增加 5,382 點閱數</span>
                      <span className="material-symbols-sharp text-primary">
                        trending_up
                      </span>
                    </div>
                  </div>
                  <div className="d-md-flex gap-6">
                    <p className="mb-2 admin-background_textData-title">總收益金額</p>
                    <div className="d-flex align-items-center mb-5">
                      <p className="me-5">$1,562,098</p>
                      <span className="text-data_font text-gray me-1">本月收益為 32,000</span>
                    </div>
                  </div>
                </div>
                <div className="admin_background_dashboard pb-5 pb-md-15 mb-10 border-bottom border-gray_light">
                  <div className="row align-items-stretch">
                    <div className="col-xxl-4 col-lg-5 col-md-12 d-flex flex-column">
                      <div className="card border-gray_light mb-5">
                        <div className="card-body text-center py-5">
                          <div className="d-flex gap-3 align-items-center mb-5">
                            <select className="form-select admin-background_dashboardSelect py-1" defaultValue="12月">
                              <option value="12月">12月</option>
                              <option value="11月">11月</option>
                              <option value="10月">10月</option>
                            </select>
                            <h5 className="card-title fs-8 text-gray">月總點閱量</h5>
                          </div>
                          <p className="fs-7 text-primary fw-bolder">10,078次</p>
                        </div>
                      </div>
                      <div className="card border-gray_light mb-5 mb-lg-0">
                        <div className="card-body text-center py-5">
                          <div className="d-flex gap-3 align-items-center mb-5">
                            <select className="form-select admin-background_dashboardSelect py-1" defaultValue="12月">
                              <option value="12月">12月</option>
                              <option value="11月">11月</option>
                              <option value="10月">10月</option>
                            </select>
                            <h5 className="card-title fs-8 text-gray">月最多點閱文章</h5>
                          </div>
                          <p className="fs-7 text-primary fw-bolder mb-5">2,234次</p>
                          <div className="d-flex">
                            <p className="me-2 text-gray">文章：</p>
                            <p className="text-primary admin-background_dashboard-articleTitle">提升專注力的五個簡單方法</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xxl-8 col-lg-7 col-md-12 d-flex flex-column">
                      <div className="card border-gray_light">
                        <div className="card-body text-center py-5">
                          <div className="d-flex gap-3 align-items-center mb-5">
                            <select className="form-select admin-background_dashboardSelect py-1" defaultValue="2024">
                              <option value="2024">2024</option>
                              <option value="2023">2023</option>
                              <option value="2022">2022</option>
                            </select>
                            <h5 className="card-title fs-8 text-gray">營收數據</h5>
                          </div>
                          <div className="chart-wrapper">
                            <AdminRevenueChart />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <h2 className="text-primary fs-5 mb-5">所有文章點閱量</h2>
                <div className="admin-background_clickCount p-5 rounded-3 border border-gray_light">
                  <div className="clickCount_header d-flex justify-content-between d-md-grid mb-5">
                    <div className="d-flex">
                      <p className="text-gray d-md-none">標題/</p>
                      <p className="text-gray d-none d-md-block">標題</p>
                      <div className="d-flex d-md-none">
                        <p>日期</p>
                        <span className="material-symbols-sharp">
                          swap_vert
                        </span>
                      </div>
                    </div>
                    <div className="d-none d-md-flex">
                      <p>日期</p>
                      <span className="material-symbols-sharp">
                        swap_vert
                      </span>
                    </div>
                    <div className="d-flex">
                      <p className="text-gray">觀看量</p>
                      <span className="text-gray material-symbols-sharp">
                        swap_vert
                      </span>
                    </div>
                  </div>
                  <ul className="clickCount_body list-unstyled">
                    <li className="d-md-grid d-flex justify-content-between mb-5">
                      <div>
                        <p className="clickCount_body-title mb-2">提升專注力的五個簡單方法，讓你事半功倍</p>
                        <p className="text-gray d-md-none">2024-01-01</p>
                      </div>
                      <p className="text-gray d-none d-md-block">2024-01-01</p>
                      <p>12K</p>
                    </li>
                    <li className="d-md-grid d-flex justify-content-between mb-5">
                      <div>
                        <p className="clickCount_body-title mb-2">提升專注力的五個簡單方法，讓你事半功倍</p>
                        <p className="text-gray d-md-none">2024-01-01</p>
                      </div>
                      <p className="text-gray d-none d-md-block">2024-01-01</p>
                      <p>12K</p>
                    </li>
                    <li className="d-md-grid d-flex justify-content-between mb-5">
                      <div>
                        <p className="clickCount_body-title mb-2">提升專注力的五個簡單方法，讓你事半功倍</p>
                        <p className="text-gray d-md-none">2024-01-01</p>
                      </div>
                      <p className="text-gray d-none d-md-block">2024-01-01</p>
                      <p>12K</p>
                    </li>
                    <li className="d-md-grid d-flex justify-content-between mb-5">
                      <div>
                        <p className="clickCount_body-title mb-2">提升專注力的五個簡單方法，讓你事半功倍</p>
                        <p className="text-gray d-md-none">2024-01-01</p>
                      </div>
                      <p className="text-gray d-none d-md-block">2024-01-01</p>
                      <p>12K</p>
                    </li>
                    <li className="d-md-grid d-flex justify-content-between mb-5">
                      <div>
                        <p className="clickCount_body-title mb-2">提升專注力的五個簡單方法，讓你事半功倍</p>
                        <p className="text-gray d-md-none">2024-01-01</p>
                      </div>
                      <p className="text-gray d-none d-md-block">2024-01-01</p>
                      <p>12K</p>
                    </li>
                    <li className="d-md-grid d-flex justify-content-between mb-5">
                      <div>
                        <p className="clickCount_body-title mb-2">提升專注力的五個簡單方法，讓你事半功倍</p>
                        <p className="text-gray d-md-none">2024-01-01</p>
                      </div>
                      <p className="text-gray d-none d-md-block">2024-01-01</p>
                      <p>12K</p>
                    </li>
                    <li className="d-md-grid d-flex justify-content-between mb-5">
                      <div>
                        <p className="clickCount_body-title mb-2">提升專注力的五個簡單方法，讓你事半功倍</p>
                        <p className="text-gray d-md-none">2024-01-01</p>
                      </div>
                      <p className="text-gray d-none d-md-block">2024-01-01</p>
                      <p>12K</p>
                    </li>
                    <li className="d-md-grid d-flex justify-content-between mb-5">
                      <div>
                        <p className="clickCount_body-title mb-2">提升專注力的五個簡單方法，讓你事半功倍</p>
                        <p className="text-gray d-md-none">2024-01-01</p>
                      </div>
                      <p className="text-gray d-none d-md-block">2024-01-01</p>
                      <p>12K</p>
                    </li>
                    <li className="d-md-grid d-flex justify-content-between mb-5">
                      <div>
                        <p className="clickCount_body-title mb-2">提升專注力的五個簡單方法，讓你事半功倍</p>
                        <p className="text-gray d-md-none">2024-01-01</p>
                      </div>
                      <p className="text-gray d-none d-md-block">2024-01-01</p>
                      <p>12K</p>
                    </li>
                    <li className="d-md-grid d-flex justify-content-between mb-5">
                      <div>
                        <p className="clickCount_body-title mb-2">提升專注力的五個簡單方法，讓你事半功倍</p>
                        <p className="text-gray d-md-none">2024-01-01</p>
                      </div>
                      <p className="text-gray d-none d-md-block">2024-01-01</p>
                      <p>12K</p>
                    </li>
                  </ul>
                  <ul className="admin-background_pagination list-unstyled d-flex justify-content-center gap-5">
                    <li className="text-primary">1</li>
                    <li>2</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
};

export default AdminBackground;