import { Collapse } from "bootstrap";
import logo from "../../assets/images/logo.svg";

import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout, fetchUserAvatar } from '../../slice/authSlice';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import SignupPage from "../../page/AccessPage/SignupPage";
import LoginPage from "../../page/AccessPage/LoginPage";
import LoadingSpinner from '../../component/LoadingSpinner/LoadingSpinner';
import Swal from "sweetalert2";

// import { debounce } from 'lodash'; // lodash 提供 debounce 方便控制延遲

//手機版collapse需點擊按鈕和列表以外的地方關閉

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleShowSignupModal = () => setShowSignupModal(true);
  const handleCloseSignupModal = () => setShowSignupModal(false);
  const handleShowLoginModal = () => setShowLoginModal(true);
  const handleCloseLoginModal = () => setShowLoginModal(false);

  const { loading, isAuthorized, username, id, userAvatar } = useSelector(state => state.auth);
  const [ isLoading, setIsLoading ] = useState(false);

  // useEffect(()=>{
  //   setIsLoading(loading);
  //   toggleLoading(isLoading);
  // },[]);


  useEffect(()=>{
    if ( loading === true ){
      setIsLoading(true);
    }else{
      setIsLoading(false);
    }
  },[loading])

  const logoutHandle = () => {
    dispatch(logout());
    //console.log("logout", isAuthorized);
  };

  // 監聽登入狀態變化
  useEffect(() => {
    if (isAuthorized && !userAvatar) {
      dispatch(fetchUserAvatar());
    }
  }, [isAuthorized, userAvatar, dispatch]);

  useEffect(() => {
    // 需要登入才能訪問的路徑列表
    const protectedRoutes = ['/admin',`/blog/${id}`];

    // 檢查當前路徑是否需要登入權限
    const currentPath = location.pathname;
    const isProtectedRoute = protectedRoutes.some(route =>
      currentPath === route || currentPath.startsWith(`${route}/`)
    );

    // 僅在保護路徑且未登入時跳轉
    if (isAuthorized === false && isProtectedRoute) {
      navigate("/"); // 跳轉到首頁
      window.scrollTo(0, 0);

      Swal.fire({
        title: "請先登入以訪問此頁面!",
        icon: "warning",
        confirmButtonColor: "#E77605",
        confirmButtonText: "確認"
      });
    }
  }, [isAuthorized, navigate, location]);

  // Collapse
  const searchCollapseRef = useRef(null);
  const userCollapseRef = useRef(null);

  useEffect(() => {
    const handleDocumentClick = (e) => {
      // Close search collapse if click is outside
      if (
        searchCollapseRef.current?.classList.contains('show') &&
        !e.target.closest('#collapseSearch') &&
        !e.target.closest('[data-bs-target="#collapseSearch"]')
      ) {
        const searchCollapseInstance = new Collapse(searchCollapseRef.current);
        searchCollapseInstance.hide();
      }
  
      // Close user menu collapse if click is outside
      if (
        userCollapseRef.current?.classList.contains('show') &&
        !e.target.closest('#collapseUserMenu') &&
        !e.target.closest('[data-bs-target="#collapseUserMenu"]')
      ) {
        const userCollapseInstance = new Collapse(userCollapseRef.current);
        userCollapseInstance.hide();
      }
    };
  
    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, []);
  

  useEffect(() => {
    const dropdownLinks = document.querySelectorAll('.dropdown-item');
    dropdownLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (userCollapseRef.current?.classList.contains('show')) {
          const userCollapseInstance = new Collapse(userCollapseRef.current);
          userCollapseInstance.hide();
        }
      });
    });
  
    return () => {
      dropdownLinks.forEach(link => {
        link.removeEventListener('click', () => {});
      });
    };
  }, []);
  



  // Search
  const [searchQuery, setSearchQuery] = useState('');
  
  // >>>主要按送出後才會搜尋因此先關閉
  // 使用 debounce 限制請求頻率，提升效能
  // useEffect(() => {
  // const delayedSearch = debounce((searchQuery) => {
  //     if (searchQuery.trim()) {
  //         navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
  //     }
  // }, 300); 

  // delayedSearch();

  // return delayedSearch.cancel;
  // }, [searchQuery]);

  const handleKeyDown = async(e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      //console.log('搜尋:', searchQuery);
      if (searchQuery === "") {
        Swal.fire({
          text:"請輸入搜尋文字",
          icon: "info",
          timer: 1500,
          showConfirmButton: false,
        });
        return;
      }
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  
  // function toggleLoading(isLoading) {     
  //   document.getElementById("loadingScreen").style.display = isLoading ? "flex" : "none";
  // }
  
  return (
    <>
    { isLoading && <LoadingSpinner/>}
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
                  src={logo}
                  alt="wordspace-logo"
                  width="150px"
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
                <Link to="/articleList" className="nav-text-btn text-nowrap bg-light">文章列表</Link>

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
                    <img className="avatar me-2 rounded-circle" src={userAvatar || "https://raw.githubusercontent.com/wfox5510/wordSapce-imgRepo/695229fa8c60c474d3d9dc0d60b25f9539ac74d9/default-avatar.svg"} alt="" />
                    <div className="dropdown my-auto">
                      <a
                        id="dropdownUserMenu"
                        className="d-flex"
                        data-bs-toggle="dropdown"
                        href="#"
                      >
                        <p className="nav-username text-nowrap">{username}</p>
                        <span className="material-symbols-outlined ms-2">
                          keyboard_arrow_down
                        </span>
                      </a>
                      <ul
                        className="dropdown-menu homepage-dropdown text-center border-1 border-primary-subtle"
                        aria-labelledby="dropdownUserMenu"
                      >
                        <li>
                          <Link to={`/blog/${id}`} className="dropdown-item py-3 px-5">我的部落格</Link>
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
              {/* Search Icon */}
              <a
                className="me-4"
                data-bs-toggle="collapse"
                href="#collapseSearch"
                role="button"
                aria-expanded="false"
                aria-controls="collapseSearch"
              >
                <span className="material-symbols-outlined text-primary fs-4">
                  search
                </span>
              </a>

              {/* Menu Icon */}
              <a
                data-bs-toggle="collapse"
                href="#collapseUserMenu"
                role="button"
                aria-expanded="false"
                aria-controls="collapseUserMenu"
              >
                <span className="material-symbols-outlined text-primary fs-3">
                  menu
                </span>
              </a>
            </div>

          </div>
        </div>{/* container-end */}

        {/* Search Collapse */}
        <div
          ref={searchCollapseRef}
          className="collapse homepage-collapse bg-light w-100 z-3 d-lg-none border-top"
          id="collapseSearch"
          style={{ position: 'fixed', top: '56px' }}
        >
          <div className="container">
            <ul className="text-left list-unstyled mb-0">
              <li className="input-group input-group-sm py-3">
                <span className="material-symbols-outlined searchbar-icon text-gray fs-6">
                  search
                </span>
                <input
                  type="text"
                  className="search-bar form-control fs-8 ps-11 w-100 rounded"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="搜尋..."
                />
              </li>
              {/* Example Items */}
              <li><a className="dropdown-item py-1 px-3 text-gray" href="#">熱門關鍵字</a></li>
              <li><a className="dropdown-item py-2 px-3" href="#">拾字間</a></li>
            </ul>
          </div>
        </div>

        {/* User Menu Collapse */}
        <div
          ref={userCollapseRef}
          className="collapse homepage-collapse bg-light w-100 z-3 d-lg-none"
          id="collapseUserMenu"
          style={{ position: 'fixed', top: '56px' }}
        >
          <ul className="text-center list-unstyled mb-0">
            {isAuthorized ? (
              <>
                <li>
                  <div className="d-flex justify-content-center align-items-center border-top border-bottom border-gray_light py-3">
                    <img
                      className="avatar me-3 rounded-circle"
                      src={userAvatar || "https://raw.githubusercontent.com/wfox5510/wordSapce-imgRepo/695229fa8c60c474d3d9dc0d60b25f9539ac74d9/default-avatar.svg"}
                      alt=""
                    />
                    <p className="m-0 nav-username">{username}</p>
                  </div>
                </li>
                <li><Link to="/articleList" className="dropdown-item py-2 px-5">文章列表</Link></li>
                <li><Link to={`/blog/${id}`} className="dropdown-item py-2 px-5">我的部落格</Link></li>
                <li><Link to="/admin" className="dropdown-item py-2 px-5">會員中心</Link></li>
                <li><button onClick={logoutHandle} className="dropdown-item py-2 px-5">登出</button></li>
              </>
            ) : (
              <>
                <li><Link to="/articleList" className="dropdown-item py-2 px-5">文章列表</Link></li>
                <li><button onClick={handleShowLoginModal} className="dropdown-item py-2 px-5">登入</button></li>
                <li><button onClick={handleShowSignupModal} className="dropdown-item py-2 px-5">註冊</button></li>
              </>
            )}
          </ul>
        </div>

      </div>
      {/* Modal */}
      <LoginPage show={showLoginModal} handleClose={handleCloseLoginModal} handleShowSignupModal={handleShowSignupModal} />
      <SignupPage show={showSignupModal} handleClose={handleCloseSignupModal} handleShowLoginModal={handleShowLoginModal} />

      {/* <div id="loadingScreen">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(255,255,255,0.5)",
            zIndex: 999
          }}
        >
          <div className="spinner-border text-secondary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div> */}
    </section>
    </>
  );
};

export default Navbar;