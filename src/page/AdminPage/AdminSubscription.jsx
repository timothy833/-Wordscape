import CurrentSubscriptionCard from "../../component/SubscriptionCard/CurrentSubscriptionCard";
import SubscriptionHistoryCard from "../../component/SubscriptionCard/SubscriptionHistoryCard";

const AdminSubscription = () => {
  return (
    <>
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
    </>
  );
};

export default AdminSubscription;