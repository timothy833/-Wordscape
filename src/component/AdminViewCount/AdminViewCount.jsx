import dayjs from "dayjs";


const AdminViewCount = ({article}) => {
  return (
    <>
      <li key={article.id} className="d-md-grid d-flex justify-content-between mb-5">
        <div>
          <p className="clickCount_body-title mb-2">{article.title}</p>
          <p className="text-gray d-md-none">{dayjs(article.created_at).format("YYYY-MM-DD")}</p>
        </div>
        <p className="text-gray d-none d-md-block">{dayjs(article.created_at).format("YYYY-MM-DD")}</p>
        <p>{article.views_count.toLocaleString()}</p>
      </li>
    </>
  )
}

export default AdminViewCount;