import { useEffect, useState,Fragment } from "react";
import { useSelector } from "react-redux";

import axios from "axios";
const { VITE_API_BASE_URL } = import.meta.env;
import dayjs from "dayjs";
import LoadingSpinner from '../../component/LoadingSpinner/LoadingSpinner';
import AdminRevenueChart from "../../component/AdminRevenueChart/AdminRevenueChart";
import AdminViewCount from "../../component/AdminViewCount/AdminViewCount";
import { logError } from "../../utils/sentryHelper";

const AdminBackground = () => {
  const [isLoading,setIsLoading] = useState(false);
  const {id,token } = useSelector(state => state.auth);

  const [followers, setFollowers] = useState(0); // 訂閱人數
  const [totalViews, setTotalViews] = useState([]);  // 總點閱量
  const [revenue, setRevenue] = useState([]) //總收益

  // 上下月比較數據
  const [monthlySubscribers, setMonthlySubscribers] = useState(0);
  const [monthlyViewsChange, setMonthlyViewsChange] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);


  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        //console.log("驗證錯誤，請重新登入");
        return;
      }

      const currentMonth = dayjs().format("MM");
      const lastMonth = dayjs().subtract(1, "month").format("MM");


      try {
        setIsLoading(true);
        const [followersRes, viewsRes, revenueRes] = await Promise.all([
          axios.get(`${VITE_API_BASE_URL}/subscriptions/followers`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${VITE_API_BASE_URL}/posts/user/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }).catch((error) => {
            if (error.response && error.response.data.message === "文章不存在") {
              return { data: { data: [] } };
            }
            throw error;
          }),
          axios.get(`${VITE_API_BASE_URL}/payments/received`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        // 上月訂閱
        setMonthlySubscribers(followersRes.data.data.length - (followersRes.data.last_month || 0));

        // 上月點閱
        const thisMonthViews = viewsRes.data.data
          .filter(article => dayjs(article.created_at).format("MM") === currentMonth)
          .reduce((acc, article) => acc + (article.views_count || 0), 0);

        const lastMonthViews = viewsRes.data.data
          .filter(article => dayjs(article.created_at).format("MM") === lastMonth)
          .reduce((acc, article) => acc + (article.views_count || 0), 0);

        setMonthlyViewsChange(thisMonthViews - lastMonthViews);

        // 本月收益
        const thisMonthRevenue = revenueRes.data.data.filter(item =>
          dayjs(item.created_at).format("MM") === currentMonth
        ).reduce((acc, item) => acc + parseFloat(item.amount), 0);
        setMonthlyRevenue(thisMonthRevenue);

        setFollowers(followersRes.data.data.length);
        setTotalViews(viewsRes.data.data || []);
        setRevenue(revenueRes.data.data || []);

      } catch (error) {
        logError(error);

      } finally {
        setIsLoading(false);
      };
    };
    fetchData();
  }, [id, token])

  // 下拉選單數據
  const [monthlyViews, setMonthlyViews] = useState(0); // 月總點閱量
  const [topArticle, setTopArticle] = useState(null);  // 月最多量
  const [selectedMonthForTotalViews, setSelectedMonthForTotalViews] = useState(dayjs().format("MM"));
  const [selectedMonthForTopArticle, setSelectedMonthForTopArticle] = useState(dayjs().format("MM"));

  // 計算某月總點閱量
  useEffect(() => {
    if (!totalViews.length) {
      setMonthlyViews(0);
      return;
    }
    // 依據下拉選單內容過濾
    const filteredArticles = totalViews.filter(article =>
      dayjs(article.created_at).format("MM") === selectedMonthForTotalViews
    );

    // 計算當月總點閱數
    const monthlyTotal = filteredArticles.reduce((acc, article) => acc + (article.views_count || 0), 0);
    setMonthlyViews(monthlyTotal);
  }, [selectedMonthForTotalViews, totalViews]);

  // 計算當月最多點閱文章
  useEffect(() => {
    if (!totalViews.length) {
      setTopArticle(null);
      return;
    }

    // 依據下拉選單內容過濾
    const filteredArticles = totalViews.filter(article =>
      dayjs(article.created_at).format("MM") === selectedMonthForTopArticle
    );

    // 找出最多點閱的文章
    if (filteredArticles.length > 0) {
      const top = filteredArticles.reduce((max, article) =>
        article.views_count > max.views_count ? article : max,
        filteredArticles[0]
      );
      setTopArticle(top);
    } else {
      setTopArticle(null);
    }
  }, [selectedMonthForTopArticle, totalViews]);


  // 總收益計算
  const [totalRevenue, setTotalRevenue] = useState(0);
  useEffect(() => {
    if (!revenue.length) {
      setTotalRevenue(0);
      return;
    }

    // 加總所有金額
    const total = revenue.reduce((acc, item) => acc + parseFloat(item.amount), 0);
    setTotalRevenue(total);
  }, [revenue]);


  // 圖表年份選擇
  const [selectedYear, setSelectedYear] = useState(dayjs().format("YYYY")); // 預設當前年份
  const [filteredRevenueData, setFilteredRevenueData] = useState(Array(12).fill(0));

  useEffect(() => {
    if (!revenue.length) {
      setFilteredRevenueData(Array(12).fill(0));
      return;
    }

    const monthlyRevenue = Array(12).fill(0);

    revenue.forEach(item => {
      const itemYear = dayjs(item.created_at).format("YYYY");
      const itemMonthIndex = parseInt(dayjs(item.created_at).format("MM"), 10) - 1;
      if (itemYear === selectedYear) {
        monthlyRevenue[itemMonthIndex] += parseFloat(item.amount);
      }
    });
    setFilteredRevenueData(monthlyRevenue);
  }, [revenue, selectedYear]);


  // 所有文章點閱量
  const [articleList, setArticleList] = useState([]); // 文章清單
  const [sortBy, setSortBy] = useState(""); // 預設按照日期排序
  const [sortOrder, setSortOrder] = useState("desc"); // 預設降序
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 10; // 每頁顯示 10 筆

  // 取得文章
  useEffect(() => {
    if (!totalViews.length) {
      setArticleList([]);
      return;
    }
    setArticleList([...totalViews]);
  }, [totalViews]);

  // 文章排序
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const sortedArticles = [...articleList].sort((a, b) => {
    if (sortBy === "date") {
      return sortOrder === "asc"
        ? new Date(a.created_at) - new Date(b.created_at)
        : new Date(b.created_at) - new Date(a.created_at);
    } else if (sortBy === "views") {
      return sortOrder === "asc" ? a.views_count - b.views_count : b.views_count - a.views_count;
    }
    return 0;
  });

  // 文章分頁
  const currentArticles = sortedArticles.slice((currentPage - 1) * articlesPerPage, currentPage * articlesPerPage);


  return (
    <>
    {isLoading && <LoadingSpinner />}
      <h1 className="fs-4 fs-md-1 text-primary fw-bold mb-5">管理後臺</h1>
      <div className="admin-background_textData">
        <div className="d-md-flex gap-6">
          <p className="mb-2 admin-background_textData-title">目前訂閱人數</p>
          <div className="d-flex align-items-center mb-5 ">
            <p className="me-5">{followers.toLocaleString()}</p>
            <span className="text-data_font text-gray me-1">{monthlySubscribers >= 0 ? "本月增加" : "本月減少"} {Math.abs(monthlySubscribers).toLocaleString()} 訂閱數</span>
            <span className={`material-symbols-sharp ${monthlySubscribers >= 0 ? "text-primary" : "text-danger"}`}>
              {monthlySubscribers >= 0 ? "trending_up" : "trending_down"}
            </span>
          </div>
        </div>
        <div className="d-md-flex gap-6">
          <p className="mb-2 admin-background_textData-title">文章總點閱量</p>
          <div className="d-flex align-items-center mb-5">
            <p className="me-5">{totalViews.reduce((acc, article) => acc + (article.views_count || 0), 0).toLocaleString()}</p>
            <span className="text-data_font text-gray me-1">{monthlyViewsChange >= 0 ? "本月增加" : "本月減少"} {Math.abs(monthlyViewsChange).toLocaleString()} 點閱數</span>
            <span className={`material-symbols-sharp ${monthlyViewsChange >= 0 ? "text-primary" : "text-danger"}`}>
              {monthlyViewsChange >= 0 ? "trending_up" : "trending_down"}
            </span>
          </div>
        </div>
        <div className="d-md-flex gap-6">
          <p className="mb-2 admin-background_textData-title">總收益金額</p>
          <div className="d-flex align-items-center mb-5">
            <p className="me-5">${totalRevenue.toLocaleString()}</p>
            <span className="text-data_font text-gray me-1">本月收益為 ${monthlyRevenue.toLocaleString()}</span>
          </div>
        </div>
      </div>
      <div className="admin_background_dashboard pb-5 pb-md-15 mb-10 border-bottom border-gray_light">
        <div className="row align-items-stretch">
          <div className="col-xxl-4 col-lg-5 col-md-12 d-flex flex-column">
            <div className="card border-gray_light mb-5">
              <div className="card-body text-center py-5">
                <div className="d-flex gap-3 align-items-center mb-5">
                  <select
                    className="form-select admin-background_dashboardSelect py-1"
                    value={selectedMonthForTotalViews}
                    onChange={(e) => setSelectedMonthForTotalViews(e.target.value)}
                  >
                    {Array.from({ length: 12 }).map((_, i) => {
                      const month = dayjs().month(i).format("MM");
                      return <option key={month} value={month}>{month}</option>;
                    })}
                  </select>
                  <h5 className="card-title fs-8 text-gray">月總點閱量</h5>
                </div>
                <p className="fs-7 text-primary fw-bolder">{monthlyViews.toLocaleString()} 次</p>
              </div>
            </div>
            <div className="card border-gray_light mb-5 mb-lg-0">
              <div className="card-body text-center py-5">
                <div className="d-flex gap-3 align-items-center mb-5">
                  <select
                    className="form-select admin-background_dashboardSelect py-1"
                    value={selectedMonthForTopArticle}
                    onChange={(e) => setSelectedMonthForTopArticle(e.target.value)}
                  >
                    {Array.from({ length: 12 }).map((_, i) => {
                      const month = dayjs().month(i).format("MM");
                      return <option key={month} value={month}>{month}</option>;
                    })}
                  </select>
                  <h5 className="card-title fs-8 text-gray">月最多點閱文章</h5>
                </div>
                {topArticle ? (
                  <>
                    <p className="fs-7 text-primary fw-bolder mb-5">{topArticle.views_count.toLocaleString()} 次</p>
                    <div className="d-flex">
                      <p className="me-2 text-gray">文章：</p>
                      <p className="text-primary admin-background_dashboard-articleTitle">{topArticle.title}</p>
                    </div>
                  </>
                ) : (
                  <p className="text-gray">無資料</p>
                )}
              </div>
            </div>
          </div>
          <div className="col-xxl-8 col-lg-7 col-md-12 d-flex flex-column">
            <div className="card border-gray_light">
              <div className="card-body text-center py-5">
                <div className="d-flex gap-3 align-items-center mb-5">
                  <select
                    className="form-select admin-background_dashboardSelect py-1"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                  </select>
                  <h5 className="card-title fs-8 text-gray">營收數據</h5>
                </div>
                <div className="chart-wrapper">
                  <AdminRevenueChart revenueData={filteredRevenueData} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <h2 className="text-primary fs-5 mb-5">所有文章點閱量</h2>
      <div className="admin-background_clickCount p-5 rounded-3 border border-gray_light">
        <div className="clickCount_header d-flex justify-content-between d-md-grid mb-5">
          <div className="d-flex">
            <p className="text-gray d-md-none">標題/</p>
            <p className="text-gray d-none d-md-block">標題</p>
            <div className="d-flex d-md-none align-items-center" onClick={() => handleSort("date")}>
              <p className={`me-2 ${sortBy === "date" ? "" : "text-gray"}`}>日期</p>
              <span style={{ cursor: "pointer" }} className={`material-symbols-outlined ${sortBy === "date" ? "" : "text-gray"}`}>
                {sortBy === "date" ? (sortOrder === "asc" ? "arrow_upward_alt" : "arrow_downward_alt") : "swap_vert"}
              </span>
            </div>
          </div>
          <div className="d-md-flex d-none align-items-center" onClick={() => handleSort("date")}>
            <p className={`me-2 ${sortBy === "date" ? "" : "text-gray"}`}>日期</p>
            <span style={{ cursor: "pointer" }} className={`material-symbols-outlined ${sortBy === "date" ? "" : "text-gray"}`}>
              {sortBy === "date" ? (sortOrder === "asc" ? "arrow_upward_alt" : "arrow_downward_alt") : "swap_vert"}
            </span>
          </div>
          <div className="d-flex align-items-center" onClick={() => handleSort("views")}>
            <p className={`me-2 ${sortBy === "views" ? "" : "text-gray"}`}>觀看量</p>
            <span style={{ cursor: "pointer" }} className={`material-symbols-outlined ${sortBy === "views" ? "" : "text-gray"}`}>
              {sortBy === "views" ? (sortOrder === "asc" ? "arrow_upward_alt" : "arrow_downward_alt") : "swap_vert"}
            </span>
          </div>
        </div>

        <ul className="clickCount_body list-unstyled">
          {currentArticles.length > 0 ? (
            currentArticles
            .map((article) => (
              <AdminViewCount key={article.id} article={article} />
            ))
          ) : (
            <p className="text-gray">目前沒有文章</p>
          )}
        </ul>
        {/* 分頁按鈕 */}
         <nav aria-label="Page navigation">
                    <ul className="hot-article-pagination pagination justify-content-center gap-2 mb-0">
                      <li className="page-item">
                        <a
                          className={`page-link material-symbols-outlined p-0 ps-1 pt-1 rounded-1 ${currentPage === 1 && "disabled"
                            }`}
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(currentPage - 1);
                          }}
                        >
                          arrow_back_ios
                        </a>
                      </li>
                      {Array.from({
                        length: Math.ceil(sortedArticles.length / 10),
                      }).map((item, index) => {
                        const totalPage = Math.ceil(sortedArticles.length / 10);
                        if (currentPage - index - 1 <= 2 && currentPage - index - 1 >= -2)
                          return (
                            <li className="page-item" key={index}>
                              <a
                                className={`page-link rounded-1 p-0 ${currentPage === index + 1 && "active"
                                  }`}
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setCurrentPage(index + 1);
                                }}
                              >
                                {index + 1}
                              </a>
                            </li>
                          );
                        else if (currentPage < totalPage - 2 && index + 1 === totalPage)
                          return (
                            <Fragment key={index}>
                              <li className="page-item">
                                <a
                                  className={`page-link rounded-1 p-0`}
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                  }}
                                >
                                  ...
                                </a>
                              </li>
                              <li className="page-item">
                                <a
                                  className={`page-link rounded-1 p-0 ${currentPage === index + 1 && "active"
                                    }`}
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setCurrentPage(index + 1);
                                  }}
                                >
                                  {index + 1}
                                </a>
                              </li>
                            </Fragment>
                          );
                        else if (currentPage > 3 && index === 0)
                          return (
                            <Fragment key={index}>
                              <li className="page-item">
                                <a
                                  className={`page-link rounded-1 p-0 ${currentPage === index + 1 && "active"
                                    }`}
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setCurrentPage(index + 1);
                                  }}
                                >
                                  {index + 1}
                                </a>
                              </li>
                              <li className="page-item">
                                <a
                                  className={`page-link rounded-1 p-0`}
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                  }}
                                >
                                  ...
                                </a>
                              </li>
                            </Fragment>
                          );
                      })}
                      <li className="page-item">
                        <a
                          className={`page-link material-symbols-outlined rounded-1 p-0 ${currentPage === Math.ceil(sortedArticles.length / 10) &&
                            "disabled"
                            }`}
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(currentPage + 1);
                          }}
                        >
                          arrow_forward_ios
                        </a>
                      </li>
                    </ul>
                  </nav>
      </div>
    </>
  );
};

export default AdminBackground;