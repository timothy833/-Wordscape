import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
const { VITE_API_BASE_URL } = import.meta.env;
import Admin_ArticleCard from "../../component/AdminArticleCard/Admin_ArticleCard";
import Swal from "sweetalert2";
import { alertMsgForVerify } from "../../utils/alertMsg";
import LoadingSpinner from '../../component/LoadingSpinner/LoadingSpinner';
import { logError } from "../../utils/sentryHelper";
import ArticlePagination from "../../component/ArticlePagination/ArticlePagination";

const AdminCollection = () => {
  const { token } = useSelector(state => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [collectionData, setCollectionData] = useState([]);
  useEffect(() => {
    (async () => {
      if (!token) {
        Swal.fire(alertMsgForVerify);
        return;
      };
      try {
        setIsLoading(true);
        const res = await axios.get(`${VITE_API_BASE_URL}/posts/favorites`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCollectionData(res.data.data);
      } catch (error) {
        logError(error);
      } finally {
        setIsLoading(false);
      };
    })();
  }, [token]);
  return (
    <>
      {isLoading && <LoadingSpinner />}
      <h1 className="fs-4 fs-md-1 text-primary fw-bold mb-5">我的收藏</h1>
      {collectionData.length === 0 ? (
        <h3 className="mt-3 text-gray">目前沒有收藏的文章</h3>
      ) : (
        <>
          {collectionData
            .slice((currentPage - 1) * 10, currentPage * 10)
            .map((item) => {
              return (
                <Admin_ArticleCard
                  key={item.id}
                  collectionData={item}
                  setCollectionData={setCollectionData}
                  collectionDataList={collectionData}
                  setCurrentPage={setCurrentPage}
                />
              )
            })
          }

          <ArticlePagination
            totalItems={collectionData.length}
            itemsPerPage={10}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
            className="hot-article-pagination justify-content-center gap-2 mb-0"
          />
        </>
      )}
    </>
  );
};

export default AdminCollection;