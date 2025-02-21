import Navbar from "../../component/Navbar/Navbar";
import Footer from "../../component/Footer/Footer";

import avatar from "../../assets/images/avatar-1.png";


const AdminInfo = () => {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="bg-secondary py-10">
        <div className="container">
          <div className="admin_wrap py-10 px-5 rounded-3 border border-gray_light">
            <div className="row">
              <div className="col-md-9">
                <div className="admin-mobile-header">
                  <div className="d-flex align-items-center flex-column border-bottom border-gray_light mb-5">
                    <img className="admin-avatar mb-2" src={avatar} alt="avatar" />
                    <p className="mb-2">super123</p>
                    <p className="text-primary mb-5">編輯個人主頁</p>
                  </div>
                  <ul className="list-unstyled d-flex justify-content-between admin-mobile-header_nav mb-6">
                    <li><a href="#" className="pb-1 link-primary fw-bolder">會員資訊</a></li>
                    <li><a href="#" className="pb-1 link-gray">我的收藏</a></li>
                    <li><a href="#" className="pb-1 link-gray">訂閱紀錄</a></li>
                    <li><a href="#" className="pb-1 link-gray">管理後臺</a></li>
                  </ul>
                </div>
                <h1 className="fs-4 text-primary fw-bold mb-5">姓名</h1>
                <form>
                  <div className="mb-5">
                    <label htmlFor="name" className="form-label mb-4">姓名</label>
                    <input type="text" className="form-control py-3" id="name" placeholder="快樂小豬" />
                  </div>
                  <div className="mb-5">
                    <label htmlFor="email" className="form-label mb-4">電子郵件</label>
                    <input type="email" className="form-control py-3" id="email" placeholder="piggy@gmail.com" />
                  </div>
                  <div className="mb-5">
                    <label htmlFor="phone" className="form-label mb-4">手機號碼</label>
                    <input type="number" className="form-control py-3" id="phone" placeholder="0912345678" />
                  </div>

                  <div class="form-check">
                    <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
                    <label class="form-check-label" for="flexRadioDefault1">
                      Default radio
                    </label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" checked />
                    <label class="form-check-label" for="flexRadioDefault2">
                      Default checked radio
                    </label>
                  </div>

                  <button type="submit" className="btn btn-primary">Submit</button>
                </form>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
};

export default AdminInfo;