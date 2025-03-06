import { Dropdown } from "bootstrap";
import logo from "../../assets/images/logo.svg";
import logo_sm from "../../assets/images/logo-sm.svg";
import avatar from "../../assets/images/avatar-1.png";
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
// import axios from 'axios';
import SignupPage from "../../page/AccessPage/SignupPage";
import LoginPage from "../../page/AccessPage/LoginPage";
const { VITE_API_BASE_URL } = import.meta.env;

const Navbar = () => {
  const navigate = useNavigate();
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleShowSignupModal = () => setShowSignupModal(true);
  const handleCloseSignupModal = () => setShowSignupModal(false);
  const handleShowLoginModal = () => setShowLoginModal(true);
  const handleCloseLoginModal = () => setShowLoginModal(false);

  // 檢查cookie中是否存在WS_token
  const checkToken = () => {
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('WS_token='));

    if (tokenCookie) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  const logout = async () => {
    document.cookie = "WS_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    alert('登出成功');
    checkToken();
    navigate("/");
    //   try{
    //     const url = `${VITE_API_BASE_URL}/users/logout`;
    //     const resetPwRes = await axios.post(url);

    //     console.log('logout',resetPwRes);

    // }catch(error){
    //     console.log('error in reset password', error.response?.data || error.message);
    // }
  };

  return (
    <section className="pt-19 pt-lg-20 ">
      <div className="fixed-top bg-light shadow-sm">
        <div className="container">
          <div className=" navbar d-flex justify-content-between align-items-center">
            <a href="#">
              <picture>
                <source
                  media="(min-width: 992px)"
                  srcSet={logo}
                  width="180px"
                  height="auto"
                />
                <img
                  src={logo_sm}
                  alt="wordspace-logo"
                  width="60px"
                  height="auto"
                />
              </picture>
            </a>

            {/* 使用者選單-PC */}
            <div className="d-none d-lg-flex align-items-center gap-4">
              {/* 搜尋欄和文章列表*/}
              <div className="d-none d-lg-flex align-items-center gap-4">
                <div className="input-group input-group-sm align-items-center">
                  <span className="material-symbols-outlined searchbar-icon text-gray fs-6">
                    search
                  </span>
                  <input
                    type="text"
                    className="search-bar form-control ps-11 fs-8 rounded"
                    placeholder="搜尋..."
                  />
                </div>
                <a className="text-nowrap" href="#">
                  文章列表
                </a>

                {/* 根據登入狀態顯示 */}
                {!isLoggedIn ? (
                  // 未登入狀態：顯示註冊和登入按鈕
                  <div className="btn-group">
                    <button className="btn btn-register btn-primary rounded-pill px-5 pe-8"
                      onClick={handleShowSignupModal}>註冊</button>
                    <button className="btn btn-login btn-primary rounded-pill px-5 ps-8"
                      onClick={handleShowLoginModal}>登入</button>
                  </div>
                ) : (
                  // 已登入狀態：顯示用戶資訊
                  <div className="d-flex ms-3">
                    <img className="avatar me-2" src={avatar} alt="" />
                    <div className="dropdown my-auto">
                      <a
                        id="dropdownUserMenu"
                        className="d-flex"
                        data-bs-toggle="dropdown"
                        href="#"
                      >
                        super123
                        <span className="material-symbols-outlined ms-2">
                          keyboard_arrow_down
                        </span>
                      </a>
                      <ul
                        className="dropdown-menu homepage-dropdown text-center border-1 border-primary-subtle"
                        aria-labelledby="dropdownUserMenu"
                      >
                        <li>
                          <a className="dropdown-item py-3 px-5" href="#">
                            追蹤部落格
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item py-3 px-5" href="/#/admin">
                            會員中心
                          </a>
                        </li>
                        <li>
                          <a onClick={logout} className="dropdown-item py-3 px-5" href="#">
                            登出
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div
            className="collapse homepage-collapse position-absolute bg-light start-0 w-100 z-3 d-lg-none"
            id="collapseUserMenu"
          >
            {/* 使用者選單-mobile */}
            <div className="d-lg-none">
              <a
                className="me-4"
                data-bs-toggle="collapse"
                href="#collapseSearch"
                aria-expanded="false"
                aria-controls="collapseSearch"
              >
                <span className="material-symbols-outlined text-primary fs-2">
                  search
                </span>
              </a>
              <a
                data-bs-toggle="collapse"
                href="#collapseUserMenu"
                aria-expanded="false"
                aria-controls="collapseUserMenu"
              >
                <span className="material-symbols-outlined text-primary fs-2">
                  menu
                </span>
              </a>
            </div>

            <div
              className="collapse homepage-collapse position-absolute bg-light start-0 w-100 z-3 d-lg-none"
              id="collapseUserMenu"
            >
              <ul
                className="text-center list-unstyled mb-0"
                aria-labelledby="dropdownUserMenu"
              >
                <li>
                  <a className="py-2 px-5" href="#">
                    文章列表
                  </a>
                </li>

                {/* 根據登入狀態顯示不同的選項 */}
                {isLoggedIn ? (
                  // 已登入狀態
                  <>
                    <li>
                      <a
                        className="d-flex justify-content-between justify-content-sm-center gap-20 align-items-center py-5 px-3 border-top border-bottom border-gray_light"
                        href="#"
                      >
                        <span>
                          <img className="avatar me-2" src={avatar} alt="" />
                          super123
                        </span>
                        <span className="material-symbols-outlined fs-5 fw-light">
                          arrow_forward_ios
                        </span>
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item py-2 px-5" href="#">
                        追蹤部落格
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item py-2 px-5" href="/#/admin">
                        會員中心
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item py-2 px-5" href="#">
                        登出
                      </a>
                    </li>
                  </>
                ) : (
                  // 未登入狀態
                  <>
                    <li>
                      <button onClick={handleShowLoginModal}
                        className="dropdown-item py-2 px-5" href="#">
                        登入
                      </button>
                    </li>
                    <li>
                      <button onClick={handleShowSignupModal}
                        className="dropdown-item py-2 px-5" href="#">
                        註冊
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* mobile-search-list */}
            <div
              className="collapse homepage-collapse position-absolute bg-light start-0 w-100 z-3 d-lg-none  border-top"
              id="collapseSearch"
            >
              <div className="container">
                <ul
                  className="text-left list-unstyled mb-0"
                  aria-labelledby="dropdownUserMenu"
                >
                  <li className="input-group input-group-sm py-3">
                    <span className="material-symbols-outlined searchbar-icon text-gray fs-6">
                      search
                    </span>
                    <input
                      type="text"
                      className="search-bar form-control fs-8 ps-11 w-100"
                      placeholder="搜尋..."
                    />
                  </li>
                  <li>
                    <a className="dropdown-item py-1 px-3 text-gray" href="#">
                      熱門關鍵字
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item py-2 px-3" href="#">
                      拾字間
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item py-2 px-3" href="#">
                      專注閱讀
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item py-2 px-3" href="#">
                      閱讀體驗
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <ul>
              <li>
                <a className="py-2 px-5" href="#">
                  文章列表
                </a>
              </li>

              {/* 根據登入狀態顯示不同的選項 */}
              {isLoggedIn ? (
                // 已登入狀態
                <>
                  <li>
                    <a
                      className="d-flex justify-content-between justify-content-sm-center gap-20 align-items-center py-5 px-3 border-top border-bottom border-gray_light"
                      href="#"
                    >
                      <span>
                        <img className="avatar me-2" src={avatar} alt="" />
                        super123
                      </span>
                      <span className="material-symbols-outlined fs-5 fw-light">
                        arrow_forward_ios
                      </span>
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item py-2 px-5" href="#">
                      追蹤部落格
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item py-2 px-5" href="/#/admin">
                      會員中心
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item py-2 px-5" href="#">
                      登出
                    </a>
                  </li>
                </>
              ) : (
                // 未登入狀態
                <>
                  <li>
                    <button onClick={handleShowLoginModal}
                      className="dropdown-item py-2 px-5" href="#">
                      登入
                    </button>
                  </li>
                  <li>
                    <button onClick={handleShowSignupModal}
                      className="dropdown-item py-2 px-5" href="#">
                      註冊
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* mobile-search-list */}
          <div
            className="collapse homepage-collapse position-absolute bg-light start-0 w-100 z-3 d-lg-none  border-top"
            id="collapseSearch"
          >
            <div className="container">
              <ul
                className="text-left list-unstyled mb-0"
                aria-labelledby="dropdownUserMenu"
              >
                <li className="input-group input-group-sm py-3">
                  <span className="material-symbols-outlined searchbar-icon text-gray fs-6">
                    search
                  </span>
                  <input
                    type="text"
                    className="search-bar form-control fs-8 ps-11 w-100"
                    placeholder="搜尋..."
                  />
                </li>
                <li>
                  <a className="dropdown-item py-1 px-3 text-gray" href="#">
                    熱門關鍵字
                  </a>
                </li>
                <li>
                  <a className="dropdown-item py-2 px-3" href="#">
                    拾字間
                  </a>
                </li>
                <li>
                  <a className="dropdown-item py-2 px-3" href="#">
                    專注閱讀
                  </a>
                </li>
                <li>
                  <a className="dropdown-item py-2 px-3" href="#">
                    閱讀體驗
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* Modal */}
      <LoginPage checkToken={checkToken} show={showLoginModal} handleClose={handleCloseLoginModal} />
      <SignupPage show={showSignupModal} handleClose={handleCloseSignupModal} />
    </section>
  );
};

export default Navbar;