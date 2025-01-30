import "./Header.scss";
import { Dropdown } from "bootstrap";
import logo from "../assets/images/logo.svg";
import avatar from "../assets/images/avatar-1.png";

const Header = () => {
  
  return (
    <div className="container">
      <div className="d-flex justify-content-between">
        <a href="#">
          <img src={logo} alt="wordspace-logo" width="192px" height="auto" />
        </a>
        <div className="d-flex justify-content-between align-items-center gap-7">
          <div className="input-group input-group-sm align-items-center">
            <span className="material-symbols-outlined searchbar-icon text-gray fs-5">search</span>
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
            <img className="avatar" src={avatar} alt="" />
            <div className="dropdown my-auto">
              <a
                id="dropdownUserMenu"
                className="d-flex ms-2"
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
      </div>
    </div>
  );
};

export default Header;
