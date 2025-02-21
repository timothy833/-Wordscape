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
          <div className="row">
            <div className="col-md-3 d-none d-md-block">
              <aside className="admin-pc_nav admin_wrap py-10 px-5 rounded-3 border border-gray_light">
                <div className="d-flex align-items-center flex-column border-bottom border-gray_light mb-5">
                  <img className="admin-avatar mb-2" src={avatar} alt="avatar" />
                  <p className="mb-2">super123</p>
                  <p className="text-primary mb-5">編輯個人主頁</p>
                </div>
                <ul className="list-unstyled d-flex flex-column admin-header_nav mb-6 gap-2 align-items-center">
                  <li className="py-2"><a href="#" className="link-primary">會員資訊</a></li>
                  <li className="py-2"><a href="#" className="link-gray">我的收藏</a></li>
                  <li className="py-2"><a href="#" className="link-gray">訂閱紀錄</a></li>
                  <li><a href="#" className="link-gray">管理後臺</a></li>
                </ul>
              </aside>
            </div>
            <div className="col-md-9">
              <div className="admin_wrap py-10 px-5 rounded-3 border border-gray_light">
                <div className="admin-mobile-header d-md-none">
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
                <h1 className="fs-4 fs-md-1 text-primary fw-bold mb-5">會員資訊</h1>
                <form>
                  <div className="mb-5 admin-form_group">
                    <label htmlFor="name" className="form-label mb-2">姓名</label>
                    <input type="text" className="form-control py-3" id="name" placeholder="快樂小豬" defaultValue="快樂小豬" />
                  </div>
                  <div className="mb-5 admin-form_group">
                    <label htmlFor="email" className="form-label mb-2">電子郵件</label>
                    <input type="email" className="form-control py-3" id="email" placeholder="piggy@gmail.com" defaultValue="piggy@gmail.com" />
                  </div>
                  <div className="mb-5 admin-form_group">
                    <label htmlFor="phone" className="form-label mb-2">手機號碼</label>
                    <input type="number" className="form-control py-3" id="phone" placeholder="0912345678" defaultValue="0912345678" />
                  </div>
                  <div className="admin-form_group py-md-3 mb-5">
                    <p className="mb-md-0 mb-2">性別</p>
                    <div className="d-flex gap-5 mb-md-0">
                      <div className="form-check">
                        <input className="form-check-input border-gray admin-form_checked" type="radio" name="admin-form_sex" id="admin-form_sex-m" defaultChecked />
                        <label className="form-check-label" htmlFor="admin-form_sex-m">
                          男
                        </label>
                      </div>
                      <div className="form-check">
                        <input className="form-check-input border-gray admin-form_checked" type="radio" name="admin-form_sex" id="admin-form_sex-f" />
                        <label className="form-check-label" htmlFor="admin-form_sex-f">
                          女
                        </label>
                      </div>
                      <div className="form-check">
                        <input className="form-check-input border-gray admin-form_checked" type="radio" name="admin-form_sex" id="admin-form_sex-else" />
                        <label className="form-check-label" htmlFor="admin-form_sex-else">
                          其他
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="admin-form_group mb-5 pb-5 border-bottom border-gray-light">
                    <p className="mb-md-0 mb-2">生日</p>
                    <div className="admin-form_birthday d-flex gap-3 w-md-100">
                      <select className="form-select py-3" defaultValue="1990">
                        <option value="1990">1990</option>
                        <option value="1991">1991</option>
                        <option value="1992">1992</option>
                      </select>
                      <select className="form-select py-3" defaultValue="01">
                        <option value="01">01</option>
                        <option value="02">02</option>
                        <option value="03">03</option>
                      </select>
                      <select className="form-select py-3" defaultValue="24">
                        <option value="24">24</option>
                        <option value="25">25</option>
                        <option value="26">26</option>
                      </select>
                    </div>
                  </div>
                  <div className="admin-form_group mb-5 py-md-3">
                    <p className="mb-5 mb-md-0">付款方式</p>
                    <div className="d-md-flex gap-md-5">
                      <div className="form-check mb-5 mb-md-0">
                        <input className="form-check-input border-gray admin-form_checked" type="radio" name="admin-form_pay" id="admin-form_pay" defaultChecked />
                        <label className="form-check-label" htmlFor="admin-form_pay">
                          VISA <span className="ms-1 text-gray">**** **** **** 1234</span>
                        </label>
                      </div>
                      <a href="#" className="d-flex link-gray"><span className="material-symbols-sharp rotate-45 me-1">
                        close
                      </span>新增信用卡</a>
                    </div>
                  </div>

                  <div className="admin-form_group mb-5 py-md-3">
                    <p className="mb-5 mb-md-0">收款帳戶</p>
                    <div className="d-md-flex gap-md-5">
                      <div className="form-check mb-5 mb-md-0">
                        <input className="form-check-input border-gray admin-form_checked" type="radio" name="admin-form_receive" id="admin-form_receive" defaultChecked />
                        <label className="form-check-label" htmlFor="admin-form_receive">
                          彰化銀行 - 王小明
                        </label>
                      </div>
                      <a href="#" className="d-flex link-gray"><span className="material-symbols-sharp rotate-45 me-1">
                        close
                      </span>新增收款帳戶</a>
                    </div>
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