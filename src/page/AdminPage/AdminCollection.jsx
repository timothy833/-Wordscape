import Navbar from "../../component/Navbar/Navbar";
import Footer from "../../component/Footer/Footer";
import AdminPcSidebar from "../../component/AdminPcSidebar/AdminPcSidebar";
import AdminMobileHeader from "../../component/AdminMobileHeader/AdminMobileHeader";
import Admin_ArticleCard from "../../component/AdminArticleCard/Admin_ArticleCard";

const AdminCollection = () => {
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
                <h1 className="fs-4 fs-md-1 text-primary fw-bold mb-5">我的收藏</h1>
                <Admin_ArticleCard />
                <Admin_ArticleCard />
                <Admin_ArticleCard />
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
};

export default AdminCollection;