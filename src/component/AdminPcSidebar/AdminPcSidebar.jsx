import avatar from "../../assets/images/avatar-1.png";

const AdminPcSidebar = () => {
  return (
    <>
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
    </>
  );
};

export default AdminPcSidebar;