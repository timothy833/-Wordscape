import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from 'axios';
const { VITE_API_BASE_URL } = import.meta.env;
//待確認

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      alert("無效的重設密碼連結");
      navigate("/"); // 若沒有 token，導回登入頁
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
        const url = `${VITE_API_BASE_URL}/users/reset-password`;
        const data = {
            "token": token,
            "password": newPassword,  
          }

        const resetPwRes = await axios.post(url, data, {
                headers: {
                "Content-Type": "application/json"
                }
            }
        );
        
        alert("密碼重設成功！");
        navigate("/"); 

    }catch(error){
        console.log('error in reset password', error.response?.data || error.message);
    }
  };

  return (
    <div>
      <h2>重設密碼</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="輸入新密碼"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit">設定新密碼</button>
      </form>
    </div>
  );
};

export default ResetPassword;
