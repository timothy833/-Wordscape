import { Outlet, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import avatar from "../../../assets/images/avatar-1.png";
import { useEffect, useState } from "react";
import axios from "axios";
const { VITE_API_BASE_URL } = import.meta.env;


const AdminLayout = () => {
  const { isAuthorized, id, username, token } = useSelector(state => state.auth);
  const [userInfo, setUserInfo] = useState({ username: "", profile_picture: "" })
  const fetchUserInfo = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${VITE_API_BASE_URL}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserInfo({
        username: res.data.username,
        profile_picture: res.data.profile_picture || "",
      });
    } catch (error) {
      console.error("無法取得使用者資訊", error);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);
  const adminLinkActive = ({ isActive }) => (isActive ? "adminLinkActive" : "");
  return (
    <>
      <main className="bg-secondary py-10">
        <div className="container">
          <div className="row">
            <div className="col-md-3 d-none d-md-block">
              <aside className="admin-pc_nav admin_wrap py-10 px-5 rounded-3 border border-gray_light">
                <div className="d-flex align-items-center flex-column border-bottom border-gray_light mb-5">
                  <img className="admin-avatar mb-2 rounded-circle" src={userInfo.profile_picture} alt="avatar" />
                  <p className="mb-2">{userInfo.username}</p>
                  <p className="text-primary mb-5">編輯個人主頁</p>
                </div>
                <nav className="list-unstyled d-flex flex-column admin-layout_nav mb-6 gap-2 align-items-center">
                  <NavLink to="info" className={({ isActive }) => `py-2 link-gray ${isActive ? "adminLinkActive" : ""}`}>會員資訊</NavLink>
                  <NavLink to="collection" className={({ isActive }) => `py-2 link-gray ${isActive ? "adminLinkActive" : ""}`}>我的收藏</NavLink>
                  <NavLink to="subscription" className={({ isActive }) => `py-2 link-gray ${isActive ? "adminLinkActive" : ""}`}>訂閱紀錄</NavLink>
                  <NavLink to="background" className={({ isActive }) => `py-2 link-gray ${isActive ? "adminLinkActive" : ""}`}>管理後臺</NavLink>
                </nav>
              </aside>
            </div>
            <div className="col-md-9">
              <div className="admin_wrap pt-10 pb-5 px-5 rounded-3 border border-gray_light">
                <div className="admin-mobile-header d-md-none">
                  <div className="d-flex align-items-center flex-column border-bottom border-gray_light mb-5">
                    <img className="admin-avatar mb-2" src={avatar} alt="avatar" />
                    <p className="mb-2">super123</p>
                    <p className="text-primary mb-5">編輯個人主頁</p>
                  </div>
                  <nav className="list-unstyled d-flex justify-content-between admin-layout_nav mb-6">
                    <NavLink to="info" className={({ isActive }) => `pb-1 link-gray ${isActive ? "adminLinkActive" : ""}`}>會員資訊</NavLink>
                    <NavLink to="collection" className={({ isActive }) => `pb-1 link-gray ${isActive ? "adminLinkActive" : ""}`}>我的收藏</NavLink>
                    <NavLink to="subscription" className={({ isActive }) => `pb-1 link-gray ${isActive ? "adminLinkActive" : ""}`}>訂閱紀錄</NavLink>
                    <NavLink to="background" className={({ isActive }) => `pb-1 link-gray ${isActive ? "adminLinkActive" : ""}`}>管理後臺</NavLink>
                  </nav>
                </div>
                <Outlet context={{ fetchUserInfo }} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default AdminLayout;