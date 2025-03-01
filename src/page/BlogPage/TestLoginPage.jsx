import { useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

console.log("✅ API_BASE_URL:", API_BASE_URL); // 測試是否成功讀取


const TestLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API_BASE_URL}/users/login`, {
        email,
        password,
      });
      console.log(res);
      const token = res.data.token;
      console.log(token);
      let expiresDate = new Date();
      expiresDate.setTime(expiresDate.getTime() + (7 * 24 * 60 * 60 * 1000)); // 設定 7 天後過期

      document.cookie = `Wordscape=${token}; expires=${expiresDate.toUTCString()}; path=/; `;
    } catch (err) {
      console.log(err);
      setError("登入失敗，請檢查帳號密碼");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card p-4">
            <h3 className="text-center">登入</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">密碼</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                登入
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestLoginPage;
