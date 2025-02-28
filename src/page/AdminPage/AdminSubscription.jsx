import Navbar from "../../component/Navbar/Navbar";
import Footer from "../../component/Footer/Footer";
import AdminPcSidebar from "../../component/AdminPcSidebar/AdminPcSidebar";
import AdminMobileHeader from "../../component/AdminMobileHeader/AdminMobileHeader";
import CurrentSubscriptionCard from "../../component/SubscriptionCard/CurrentSubscriptionCard";
import SubscriptionHistoryCard from "../../component/SubscriptionCard/SubscriptionHistoryCard";

const AdminSubscription = () => {
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
                <div className="d-none d-md-flex justify-content-between align-items-center">
                  <h1 className="fs-4 fs-md-1 text-primary fw-bold mb-5 mb-md-10">訂閱紀錄</h1>
                  <a href="#" className="link-primary-hover">問題回報</a>
                </div>
                <div className="current-subscription border-bottom border-gray_light mb-5">
                  <p className="mb-5">目前訂閱</p>
                  <CurrentSubscriptionCard />
                  <CurrentSubscriptionCard />
                  <CurrentSubscriptionCard />
                </div>
                <div className="subscription-history">
                  <p className="mb-5">訂閱紀錄</p>
                  <SubscriptionHistoryCard />
                  <SubscriptionHistoryCard />
                  <SubscriptionHistoryCard />
                  <div className="text-center my-5 pt-1 d-md-none">
                    <a href="#" className="link-primary-hover">問題回報</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
};

export default AdminSubscription;