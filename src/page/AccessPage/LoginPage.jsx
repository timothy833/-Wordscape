import axios from 'axios'
import { useState, useEffect } from 'react'
const { VITE_API_BASE_URL } = import.meta.env;
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../../slice/authSlice';
import { useNavigate } from 'react-router-dom';
//TODO 頁面跳轉註冊＋忘記密碼設定
//TODO 清空表單

const LoginPage = ({ show, handleClose }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthorized } = useSelector(state => state.auth);
    const [isForgot, setIsForgot] = useState(false);
    const [resetEmail, setResetEmail] = useState({ email: "" });
    const [formData, setFormData] = useState({ email: "", password: "" });

    useEffect(() => {
        if (isAuthorized) {
          navigate('/');
        }
        return () => {
          if (error) dispatch(clearError());
        };
      }, [isAuthorized, navigate, error, dispatch]);

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

    const loginHandle = async () => {
        const result = await dispatch(login(formData));  // 等待登入完成
        if (result.payload.token) { // 確保登入成功才關閉 modal
            handleClose();
        }
    };
        
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