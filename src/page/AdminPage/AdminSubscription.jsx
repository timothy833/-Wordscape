import SubscriptionHistoryCard from "../../component/SubscriptionCard/SubscriptionHistoryCard";
import axios from "axios";
import { useEffect, useState } from "react";
import LoadingSpinner from '../../component/LoadingSpinner/LoadingSpinner';
import { logError } from "../../utils/sentryHelper";
import ArticlePagination from "../../component/ArticlePagination/ArticlePagination";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AdminSubscription = () => {
  const [isLoading,setIsLoading] = useState(false);
  const [paymentReceivedData, setPaymentReceivedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const getPaymentReceivedData = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${API_BASE_URL}/payments/received`);
      setPaymentReceivedData(res.data.data);
    } catch (error) {
      logError(error);
    }finally{
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getPaymentReceivedData();
  }, []);
  return (
    <>
     {isLoading && <LoadingSpinner />}
      <div className="d-none d-md-flex justify-content-between align-items-center">
        <h1 className="fs-4 fs-md-1 text-primary fw-bold mb-5 mb-md-10">
          收款紀錄
        </h1>
        <a style={{cursor:"pointer"}} className="link-primary-hover">
          問題回報
        </a>
      </div>

      <div className="subscription-history">
        {paymentReceivedData
          .slice((currentPage - 1) * 10 , currentPage * 10)
          .map((paymentReceivedDataItem) => {
            return (
              <SubscriptionHistoryCard
                key={paymentReceivedDataItem.id}
                payerId={paymentReceivedDataItem.user_id}
                paymentDate={paymentReceivedDataItem.created_at}
                amount={paymentReceivedDataItem.amount}
              />
            );
          })}
        <div className="text-center my-5 pt-1 d-md-none">
          <a href="#" className="link-primary-hover">
            問題回報
          </a>
        </div>
      </div>
      <ArticlePagination
        totalItems={paymentReceivedData.length}
        itemsPerPage={10}
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page)}
        className="hot-article-pagination"
      />
    </>
  );
};

export default AdminSubscription;
