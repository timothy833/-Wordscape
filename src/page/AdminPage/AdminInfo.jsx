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
                    <label htmlFor="name" className="form-label mb-2">姓名</label>
                    <input type="text" className="form-control py-3" id="name" placeholder="快樂小豬" />
                  </div>
                  <div className="mb-5">
                    <label htmlFor="email" className="form-label mb-2">電子郵件</label>
                    <input type="email" className="form-control py-3" id="email" placeholder="piggy@gmail.com" />
                  </div>
                  <div className="mb-5">
                    <label htmlFor="phone" className="form-label mb-2">手機號碼</label>
                    <input type="number" className="form-control py-3" id="phone" placeholder="0912345678" />
                  </div>
                  <label className="form-label mb-2">性別</label>
                  <div className="d-flex gap-5 mb-5">
                    <div className="form-check">
                      <input className="form-check-input border-gray admin-form_checked" type="radio" name="admin-form_sex" id="admin-form_sex" />
                      <label className="form-check-label" htmlFor="admin-form_sex">
                        男
                      </label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input border-gray admin-form_checked" type="radio" name="admin-form_sex" id="admin-form_sex" />
                      <label className="form-check-label" htmlFor="admin-form_sex">
                        女
                      </label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input border-gray admin-form_checked" type="radio" name="admin-form_sex" id="admin-form_sex" />
                      <label className="form-check-label" htmlFor="admin-form_sex">
                        其他
                      </label>
                    </div>
                  </div>
                  <label className="form-label mb-2">生日</label>
                  <div className="d-flex gap-3 border-bottom border-gray-light pb-5 mb-5">
                    <select className="form-select py-3 mb-3" defaultValue="1990">
                      <option value="1990">1990</option>
                      <option value="1991">1991</option>
                      <option value="1992">1992</option>
                    </select>
                    <select className="form-select py-3 mb-3" defaultValue="01">
                      <option value="01">01</option>
                      <option value="02">02</option>
                      <option value="03">03</option>
                    </select>
                    <select className="form-select py-3 mb-3" defaultValue="24">
                      <option value="24">24</option>
                      <option value="25">25</option>
                      <option value="26">26</option>
                    </select>
                  </div>
                  <label className="form-label mb-5">付款方式</label>
                  <div className="mb-5">
                    <div className="form-check mb-5">
                      <input className="form-check-input border-gray admin-form_checked" type="radio" name="admin-form_pay" id="admin-form_pay" defaultChecked />
                      <label className="form-check-label" htmlFor="admin-form_pay">
                        VISA <span className="ms-1 text-gray">**** **** **** 1234</span>
                      </label>
                    </div>
                    <a href="#" className="d-flex link-gray"><span class="material-symbols-sharp rotate-45 me-1">
                      close
                    </span>新增信用卡</a>
                  </div>
                  <label className="form-label mb-5">收款帳戶</label>
                  <div className="mb-5">
                    <div className="form-check mb-5">
                      <input className="form-check-input border-gray admin-form_checked" type="radio" name="admin-form_receive" id="admin-form_receive" defaultChecked />
                      <label className="form-check-label" htmlFor="admin-form_receive">
                        彰化銀行 - 王小明</label>
                    </div>
                    <a href="#" className="d-flex link-gray"><span class="material-symbols-sharp rotate-45 me-1">
                      close
                    </span>新增收款帳戶</a>
                  </div>
                  <button type="submit" className="btn btn-primary btn-lg mt-5">儲存資料</button>
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