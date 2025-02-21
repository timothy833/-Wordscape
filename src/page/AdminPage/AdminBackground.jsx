import Navbar from "../../component/Navbar/Navbar";
import Footer from "../../component/Footer/Footer";
import AdminPcSidebar from "../../component/AdminPcSidebar/AdminPcSidebar";
import AdminMobileHeader from "../../component/AdminMobileHeader/AdminMobileHeader";

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
                  <p className="mb-2">目前訂閱人數</p>
                  <div className="d-flex align-items-center mb-5">
                    <p className="me-5">1,184,013</p>
                    <span className="text-data_font text-gray me-1">本月減少 15,382 訂閱數</span>
                    <span class="material-symbols-sharp text-primary">
                      trending_down
                    </span>
                  </div>
                  <p className="mb-2">文章總點閱量</p>
                  <div className="d-flex align-items-center mb-5">
                    <p className="me-5">983,293,012</p>
                    <span className="text-data_font text-gray me-1">本月增加 5,382 點閱數</span>
                    <span class="material-symbols-sharp text-primary">
                      trending_up
                    </span>
                  </div>
                  <p className="mb-2">總收益金額</p>
                  <div className="d-flex align-items-center mb-5">
                    <p className="me-5">$1,562,098</p>
                    <span className="text-data_font text-gray me-1">本月收益為 32,000</span>
                  </div>
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