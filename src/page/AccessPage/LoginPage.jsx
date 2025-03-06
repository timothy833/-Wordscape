import { useState } from 'react'
import axios from 'axios'
const { VITE_API_BASE_URL } = import.meta.env;
//TODO 頁面跳轉註冊＋忘記密碼設定
//TODO 清空表單

const LoginPage = ({ checkToken, show, handleClose }) => {
    const [isForgot, setIsForgot] = useState(false);
    const [resetEmail, setResetEmail] = useState({ email: "" });
    const [formData, setFormData] = useState({ email: "", password: "" });

    const resetEmailInputChange = (e) => {
        const { name, value } = e.target;
        setResetEmail({
                ...resetEmail,
                [name]: value,
            });
        };

    const formInputChange = (e) => {
        const { name, value } = e.target;
            setFormData({
                ...formData,
                [name]: value,
            });
        };
    const loginHandle = async() => {
        try{
            const url = `${VITE_API_BASE_URL}/users/login`;
            const data = {
                "email": formData.email,
                "password": formData.password,
              }
            const loginRes = await axios.post(url, data, {
                headers: {
                "Content-Type": "application/json"
                }
            });
            const { token } = loginRes.data; 
            // 設置7天後過期
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 1);
            // 儲存 token
            document.cookie = `WS_token=${token}; expires=${expiryDate.toUTCString()};path=/; secure; SameSite=Strict`;
            //將token存入axios中header代入預設值（每次發送都會使用此值）
            axios.defaults.headers.common.Authorization = `${token}`;
            
            console.log("login",loginRes);
            handleClose();
            checkToken();
            alert('登入成功'); 
        }catch(error){
            alert(error)
            console.log('error in login', error.response?.data || error.message);
        }
    }
    const forgotPasswordHandle = () => {
        setIsForgot(true);
    }
    const returnLoginHandle = () => {
        setIsForgot(false);
    }

    const forgotPassword = async() => {
        try{
            const url = `${VITE_API_BASE_URL}/users/forgot-password`;
            const data = {
                "email": resetEmail.email,
                "password": "securepassword",
              }
            const forgotPwRes = await axios.post(url, data, {
                headers: {
                "Content-Type": "application/json"
                }
            });
            
            console.log("forgot password",forgotPwRes);
            alert(forgotPwRes.data.message); 

        }catch(error){
            alert(error)
            console.log('error in login', error.response?.data || error.message);
        }
    }
    
    if (!show) return null; // 不顯示時直接返回null

    return (
        <div 
        className="position-fixed top-0 start-0 w-100 h-100" 
        style={{ 
            zIndex: 1050, 
            backgroundColor: 'white',
            overflow: 'auto'
        }}>
        <div className="login vh-100 position-relative">
            <div className="container-fluid h-100">
                <div className="row h-100 w-100 justify-content-center">
                    {/* 左側區域 */}
                    <div className="col-md-4 ps-5" style={{ marginTop: '25vh' }}>
                        <div className="h1 fw-bold mb-3 text-dark">歡迎回來！</div>
                        <div className="fs-3 fw-normal mb-4 text-dark">立即探索更多精彩內容</div>
                        <div className="d-flex flex-column">
                            <div className="h6 fw-light mb-3">還沒有帳戶嗎？</div>
                            <a href="#" className="h6 text-primary fw-bold mb-0">立即註冊</a>
                        </div>
                    </div>
                    
                    {/* 右側區域 */}
                    {isForgot ? (
                         <div className="col-md-4 d-flex align-items-center h-100 position-relative">
                         <div className="card shadow-lg rounded-4 border-0 w-100 bg-white login-card mx-5">
                             <div className="card-body">
                                 <button type="button" className="btn-close login-btn-close" onClick={handleClose} aria-label="Close"></button>
                                 <h5 className="card-title fs-6 fw-normal mb-5">重新設定您的密碼</h5>
                                 <p className='fw-light mb-3'> 輸入註冊使用的 email，我們將寄送設定連結給您。</p>
                                 <div className="form-floating mb-5">
                                     <input 
                                     type="email" 
                                     className="form-control border-0" 
                                     id="resetEmail"
                                     name="email"
                                     value={resetEmail.email}
                                     placeholder="name@example.com"
                                     onChange={resetEmailInputChange}
                                     />
                                     <label htmlFor="resetEmail">Email address</label>
                                 </div>
                                 <div className="d-grid">
                                     <button onClick={forgotPassword} type="button" className="btn btn-primary py-3 mb-5">送出</button>
                                 </div>
                                 <div className="text-center my-5">
                                     <a onClick={returnLoginHandle} href='#' className="text-gray small">返回</a>
                                 </div>
                             </div>
                         </div>
                     </div>
                    ):(
                    <div className="col-md-4 d-flex align-items-center h-100 position-relative">
                        <div className="card shadow-lg rounded-4 border-0 w-100 bg-white login-card mx-5">
                            <div className="card-body">
                                <button type="button" className="btn-close login-btn-close" onClick={handleClose} aria-label="Close"></button>
                                <h5 className="card-title fs-5 fw-normal mb-10">登入帳戶</h5>
                                <div className="form-floating mb-10">
                                    <input 
                                    type="email" 
                                    className="form-control border-0" 
                                    id="loginEmail"
                                    name="email"
                                    value={formData.email}
                                    placeholder="name@example.com"
                                    onChange={formInputChange}
                                    />
                                    <label htmlFor="loginEmail">Email address</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input 
                                    type="password" 
                                    className="form-control border-0" 
                                    id="loginPassword"
                                    name="password"
                                    value={formData.password} 
                                    placeholder="Password"
                                    onChange={formInputChange}
                                    />
                                    <label htmlFor="loginPassword">Password</label>
                                </div>
                                <div className="d-flex justify-content-end mb-10">
                                    <a onClick={forgotPasswordHandle} href="#" className="text-gray small">忘記密碼</a>
                                </div>
                                <div className="d-grid">
                                    <button onClick={loginHandle} type="button" className="btn btn-primary py-3 mb-10">登入</button>
                                </div>
                                <div className="text-center my-5">
                                    <span className="text-gray fw-light">或以其他平台登入</span>
                                </div>
                                <div className="d-flex justify-content-center gap-5">
                                    <a href="#" target="_blank">
                                    <img src="/src/assets/images/AccessPage/Facebook-icon.png" width="40px" height="40px" alt="facebook-login" />
                                    </a>
                                    <a href="#" target="_blank">
                                        <img src="/src/assets/images/AccessPage/Apple-icon.png" width="40px" height="40px" alt="apple-login" />
                                    </a>
                                    <a href="#" target="_blank">
                                        <img src="/src/assets/images/AccessPage/Google-icon.png" width="40px" height="40px" alt="google-login" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                </div>
            </div>
            <div className="pattern-container">
            </div>
        </div>
        </div>
    );
};

export default LoginPage;