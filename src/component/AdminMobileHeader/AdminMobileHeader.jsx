import { NavLink } from "react-router-dom";

import avatar from "../../assets/images/avatar-1.png";


const AdminMobileHeader = () => {
  const adminLinkActive = ({ isActive }) => (isActive ? "adminLinkActive" : "");
  return (
    <>
      <div className="admin-mobile-header d-md-none">
        <div className="d-flex align-items-center flex-column border-bottom border-gray_light mb-5">
          <img className="admin-avatar mb-2" src={avatar} alt="avatar" />
          <p className="mb-2">super123</p>
          <p className="text-primary mb-5">編輯個人主頁</p>
        </div>
        <nav className="list-unstyled d-flex justify-content-between admin-mobile-header_nav mb-6">
          <NavLink to="info" className={({ isActive }) => `pb-1 link-gray ${isActive ? "adminLinkActive" : ""}`}>會員資訊</NavLink>
          <NavLink to="collection" className={({ isActive }) => `pb-1 link-gray ${isActive ? "adminLinkActive" : ""}`}>我的收藏</NavLink>
          <NavLink to="subscription" className={({ isActive }) => `pb-1 link-gray ${isActive ? "adminLinkActive" : ""}`}>訂閱紀錄</NavLink>
          <NavLink to="background" className={({ isActive }) => `pb-1 link-gray ${isActive ? "adminLinkActive" : ""}`}>管理後臺</NavLink>
        </nav>
      </div>
    </>
  );
};

export default AdminMobileHeader;