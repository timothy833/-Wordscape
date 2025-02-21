import avatar from "../../assets/images/avatar-1.png";


const AdminMobileHeader = () => {
  return (
    <>
      <div className="admin-mobile-header d-md-none">
        <div className="d-flex align-items-center flex-column border-bottom border-gray_light mb-5">
          <img className="admin-avatar mb-2" src={avatar} alt="avatar" />
          <p className="mb-2">super123</p>
          <p className="text-primary mb-5">編輯個人主頁</p>
        </div>
        <ul className="list-unstyled d-flex justify-content-between admin-mobile-header_nav mb-6">
          <li><a href="#" className="pb-1 link-gray active">會員資訊</a></li>
          <li><a href="#" className="pb-1 link-gray">我的收藏</a></li>
          <li><a href="#" className="pb-1 link-gray">訂閱紀錄</a></li>
          <li><a href="#" className="pb-1 link-gray">管理後臺</a></li>
        </ul>
      </div>
    </>
  );
};

export default AdminMobileHeader;