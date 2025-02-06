import { Dropdown } from "bootstrap";
import logo from "../../assets/images/logo.svg";
import logo_sm from "../../assets/images/logo-sm.svg";
import avatar from "../../assets/images/avatar-1.png";

const Navbar = () => {
  return (
    <section className="pt-19 pt-lg-20">
      <div className="fixed-top bg-light">
        <div className="container navbar d-flex justify-content-between align-items-center">
          <a href="#">
            <picture>
              <source
                media="(min-width: 992px)"
                srcSet={logo}
                width="192px"
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
          <div className="d-none d-lg-flex justify-content-between align-items-center gap-7">
            <div className="input-group input-group-sm align-items-center">
              <span className="material-symbols-outlined searchbar-icon text-gray fs-6">
                search
              </span>
              <input
                type="text"
                className="search-bar form-control ps-11"
                placeholder="搜尋..."
              />
            </div>
            <a className="text-nowrap" href="#">
              文章列表
            </a>
            <div className="d-flex">
              <img className="avatar me-2" src={avatar} alt="" />
              <div className="dropdown my-auto">
                <a
                  id="dropdownUserMenu"
                  className="d-flex"
                  data-bs-toggle="dropdown"
                  data-bs-offset="-60,38"
                  href="#"
                >
                  super123
                  <span className="material-symbols-outlined ms-2">
                    keyboard_arrow_down
                  </span>
                </a>
                <ul
                  className="dropdown-menu text-center py-3"
                  aria-labelledby="dropdownUserMenu"
                >
                  <li>
                    <a className="dropdown-item py-2 px-5" href="#">
                      追蹤部落格
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item py-2 px-5" href="#">
                      會員中心
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item py-2 px-5" href="#">
                      登出
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
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
            <div
              className="collapse position-absolute bg-light w-100 start-0 z-3"
              id="collapseUserMenu"
            >
              <ul
                className="text-center list-unstyled py-3"
                aria-labelledby="dropdownUserMenu"
              >
                <li>
                  <a
                    className="d-flex justify-content-between justify-content-sm-center gap-20 align-items-center py-5 px-3  border-top border-bottom border-gray_light"
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
                    文章列表
                  </a>
                </li>
                <li>
                  <a className="dropdown-item py-2 px-5" href="#">
                    追蹤部落格
                  </a>
                </li>
                <li>
                  <a className="dropdown-item py-2 px-5" href="#">
                    會員中心
                  </a>
                </li>
                <li>
                  <a className="dropdown-item py-2 px-5" href="#">
                    登出
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Navbar;
