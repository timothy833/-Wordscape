import { Outlet, NavLink,Link } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminLayout = () => {
  const { id, username,  userAvatar } = useSelector(state => state.auth);
  return (
    <>
      <main className="bg-secondary py-10">
        <div className="container">
          <div className="row">
            <div className="col-md-3 d-none d-md-block">
              <aside className="admin-pc_nav admin_wrap py-10 px-5 rounded-3 border border-gray_light">
                <div className="d-flex align-items-center flex-column border-bottom border-gray_light mb-5">
                  <img className="admin-avatar mb-2 rounded-circle" src={userAvatar || "https://raw.githubusercontent.com/wfox5510/wordSapce-imgRepo/695229fa8c60c474d3d9dc0d60b25f9539ac74d9/default-avatar.svg"} alt="avatar" />
                  <p className="mb-2">{username}</p>
                  <Link to={`/blog/${id}`} className="text-primary mb-5">編輯個人主頁</Link>
                </div>
                <nav className="list-unstyled d-flex flex-column admin-layout_nav mb-6 gap-2 align-items-center">
                  <NavLink to="info" className={({ isActive }) => `py-2 link-gray ${isActive ? "adminLinkActive" : ""}`}>會員資訊</NavLink>
                  <NavLink to="collection" className={({ isActive }) => `py-2 link-gray ${isActive ? "adminLinkActive" : ""}`}>我的收藏</NavLink>
                  <NavLink to="subscription" className={({ isActive }) => `py-2 link-gray ${isActive ? "adminLinkActive" : ""}`}>收款紀錄</NavLink>
                  <NavLink to="background" className={({ isActive }) => `py-2 link-gray ${isActive ? "adminLinkActive" : ""}`}>管理後臺</NavLink>
                </nav>
              </aside>
            </div>
            <div className="col-md-9">
              <div className="admin_wrap pt-10 pb-5 px-5 rounded-3 border border-gray_light">
                <div className="admin-mobile-header d-md-none">
                  <div className="d-flex align-items-center flex-column border-bottom border-gray_light mb-5">
                    <img className="admin-avatar mb-2 rounded-circle" src={userAvatar || "https://raw.githubusercontent.com/wfox5510/wordSapce-imgRepo/695229fa8c60c474d3d9dc0d60b25f9539ac74d9/default-avatar.svg"} alt="avatar" />
                    <p className="mb-2">{username}</p>
                    <Link to={`/blog/${id}`} className="text-primary mb-5">編輯個人主頁</Link>
                  </div>
                  <nav className="list-unstyled d-flex justify-content-between admin-layout_nav mb-6">
                    <NavLink to="info" className={({ isActive }) => `pb-1 link-gray ${isActive ? "adminLinkActive" : ""}`}>會員資訊</NavLink>
                    <NavLink to="collection" className={({ isActive }) => `pb-1 link-gray ${isActive ? "adminLinkActive" : ""}`}>我的收藏</NavLink>
                    <NavLink to="subscription" className={({ isActive }) => `pb-1 link-gray ${isActive ? "adminLinkActive" : ""}`}>收款紀錄</NavLink>
                    <NavLink to="background" className={({ isActive }) => `pb-1 link-gray ${isActive ? "adminLinkActive" : ""}`}>管理後臺</NavLink>
                  </nav>
                </div>
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default AdminLayout;