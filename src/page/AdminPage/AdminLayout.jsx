import { Outlet } from "react-router-dom";

import Navbar from "../../component/Navbar/Navbar";
import Footer from "../../component/Footer/Footer";

import AdminPcSidebar from "../../component/AdminPcSidebar/AdminPcSidebar";
import AdminMobileHeader from "../../component/AdminMobileHeader/AdminMobileHeader";

const AdminLayout = () => {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="bg-secondary py-10">
        <div className="container">
          <div className="row">
            <AdminPcSidebar />
            <div className="col-md-9">
              <div className="admin_wrap pt-10 pb-5 px-5 rounded-3 border border-gray_light">
                <AdminMobileHeader />
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AdminLayout;