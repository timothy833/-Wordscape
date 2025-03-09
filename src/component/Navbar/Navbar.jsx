import { Dropdown, Collapse } from "bootstrap";
import logo from "../../assets/images/logo.svg";
import logo_sm from "../../assets/images/logo-sm.svg";
import avatar from "../../assets/images/avatar-1.png";

import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../slice/authSlice';
import { Link } from 'react-router-dom';
import SignupPage from "../../page/AccessPage/SignupPage";
import LoginPage from "../../page/AccessPage/LoginPage";

//手機版collapse需點擊按鈕和列表以外的地方關閉

const Navbar = () => {
  const dispatch = useDispatch();
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  const handleShowSignupModal = () => setShowSignupModal(true);
  const handleCloseSignupModal = () => setShowSignupModal(false);
  const handleShowLoginModal = () => setShowLoginModal(true);
  const handleCloseLoginModal = () => setShowLoginModal(false);
  
  const { isAuthorized, username } = useSelector(state => state.auth);
  
  const logoutHandle = () => {
     dispatch(logout());
     console.log("logout",isAuthorized);
  };

  useEffect(() => {
    // if (isAuthorized === false) {
  //     // 登出成功後跳轉到首頁
      // window.location.href = '/';  // 或者使用 React Router 的 navigate
    // }
  console.log(isAuthorized);
  }, [isAuthorized]);

  // Collapse
  useEffect(() => {
    const handleDocumentClick = (e) => {
      const isSearchCollapse = document.getElementById('collapseSearch');
      const isUserCollapse = document.getElementById('collapseUserMenu');
      
      if (isSearchCollapse?.classList.contains('show') && 
          !e.target.closest('#collapseSearch') && 
          !e.target.closest('[data-bs-target="#collapseSearch"]')) {
        new Collapse(isSearchCollapse).hide()
      }
      
      if (isUserCollapse?.classList.contains('show') && 
          !e.target.closest('#collapseUserMenu') && 
          !e.target.closest('[data-bs-target="#collapseUserMenu"]')) {
        new Collapse(isUserCollapse).hide()
      }
    }
  
    document.addEventListener('click', handleDocumentClick)
    return () => document.removeEventListener('click', handleDocumentClick)
  }, [])

  // Search
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      console.log('搜尋:', searchQuery);
      if(searchQuery==""){
        alert("請輸入搜尋文字")
      }else{

    }
      // 執行搜尋邏輯
    }
  };
  

  return (
    <section className="pt-19 pt-lg-20 ">
      <div className="fixed-top bg-light shadow-sm">
        <div className="container">
          <div className=" navbar d-flex justify-content-between align-items-center">
            <Link to="/">
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
            </Link>

            {/* 使用者選單-PC */}
            <div className="d-none d-lg-flex align-items-center gap-4">
              <div className="d-none d-lg-flex align-items-center gap-4">
                <div className="input-group input-group-sm align-items-center">
                  <span className="material-symbols-outlined searchbar-icon text-gray fs-6">
                    search
                  </span>
                  <input
                    type="text"
                    className="search-bar form-control ps-11 fs-8 rounded"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="搜尋..."
                  />
                </div>
                <Link to="/articleList" className="text-nowrap border-0 bg-light">文章列表</Link>

                {/* 根據登入狀態顯示 */}
                {!isAuthorized ? (
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
                        {username}
                        <span className="material-symbols-outlined ms-2">
                          keyboard_arrow_down
                        </span>
                      </a>
                      <ul
                        className="dropdown-menu homepage-dropdown text-center border-1 border-primary-subtle"
                        aria-labelledby="dropdownUserMenu"
                      >
                        <li>
                          <Link to="/blogpage" className="dropdown-item py-3 px-5">我的部落格</Link>
                        </li>
                        <li>
                          <Link to="/admin" className="dropdown-item py-3 px-5">會員中心</Link>
                        </li>
                        <li>
                          <button onClick={logoutHandle} className="dropdown-item py-3 px-5">
                            登出
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>

          {/* 使用者選單-mobile */}
          <div className="d-lg-none">
            <a
              className="me-4"
              data-bs-toggle="collapse"
              href="#collapseSearch"
              role="button"
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
              role="button"
              aria-expanded="false"
              aria-controls="collapseUserMenu"
            >
              <span className="material-symbols-outlined text-primary fs-2">
                menu
              </span>
            </a>
            
          </div>
          </div>
        </div>{/* container-end */}

        {/* search-list */}
        <div
          className="collapse homepage-collapse bg-light w-100 z-3 d-lg-none  border-top"
          id="collapseSearch"
          style={{ position: 'fixed', top: '56px' }}
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
        {/*menu-list*/}
        <div
            className="collapse homepage-collapse bg-light w-100 z-3 d-lg-none"
            id="collapseUserMenu"
            style={{ position: 'fixed', top: '56px' }}
        >
          <ul 
          className="text-center list-unstyled mb-0"
          aria-labelledby="dropdownUserMenu"
          >
            
            {/* 根據登入狀態顯示不同的選項 */}
            {isAuthorized ? (
              // 已登入狀態
              <>
                <li>
                  <div className="d-flex justify-content-center align-items-center border-top border-bottom border-gray_light py-3">
                    <img className="avatar me-3" src={avatar} alt="" />
                    <p className="m-0">{username}</p>
                  </div>
                </li>
                <li>
                  <Link to="/articleList" className="dropdown-item py-2 px-5">文章列表</Link>
                </li>
                <li>
                  <Link to="/blogpage" className="dropdown-item py-2 px-5">我的部落格</Link>
                </li>
                <li>
                  <Link to="/admin" className="dropdown-item py-2 px-5">會員中心</Link>
                </li>
                <li>
                  <button onClick={logoutHandle} className="dropdown-item py-2 px-5" href="#">
                    登出
                  </button>
                </li>
              </>
            ) : (
              // 未登入狀態
              <>
                <li>
                  <Link to="/articleList" className="dropdown-item py-2 px-5">文章列表</Link>
                </li>
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


      </div>
      {/* Modal */}
      <LoginPage show={showLoginModal} handleClose={handleCloseLoginModal} handleShowSignupModal={handleShowSignupModal}/>
      <SignupPage show={showSignupModal} handleClose={handleCloseSignupModal} handleShowLoginModal={handleShowLoginModal} />
    </section>
  );
};

export default Navbar;