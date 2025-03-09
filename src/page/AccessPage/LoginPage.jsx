import axios from 'axios'
import { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../../slice/authSlice';
import { useNavigate } from 'react-router-dom';
const { VITE_API_BASE_URL } = import.meta.env;
//TODO 頁面跳轉註冊＋忘記密碼設定
//TODO 清空表單

const LoginPage = ({ show, handleClose, handleShowSignupModal }) => {
    LoginPage.propTypes = {
        show: PropTypes.bool.isRequired, 
        handleClose: PropTypes.func.isRequired,
        handleShowSignupModal: PropTypes.func.isRequired,
    };
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthorized } = useSelector(state => state.auth);
    const [isForgot, setIsForgot] = useState(false);
    const [resetEmail, setResetEmail] = useState({ email: "" });
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [formErrors, setFormErrors] = useState({});
    const [validated, setValidated] = useState(false);

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

    const loginHandle = async (event) => {
        event.preventDefault();
        
        // 設置表單已嘗試驗證
        setValidated(true);
        
        // 執行表單驗證
        if (!validateForm()) {
            return;
        }
        const result = await dispatch(login(formData));  // 等待登入完成
        if (result.payload.token) { // 確保登入成功才關閉 modal
            setFormData({ email: "", password: "" });
            handleClose();
        }
    };
        
    const forgotPasswordHandle = () => {
        setIsForgot(true);
        setFormData({ email: "", password: "" });
        setFormErrors({});
    }
    
    const returnLoginHandle = () => {
        setIsForgot(false);
        setResetEmail({ email: "" });
        setFormErrors({});
    }

    const forgotPassword = async(event) => {
        event.preventDefault();
        let newFormErrors = {};
        
        if (!formData.email || !emailRegex.test(formData.email)) {
            newFormErrors.email = '請輸入有效的 Email 格式';
            setFormErrors(newFormErrors);
            return;
        }

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
            setResetEmail({ email: "" });
            alert(forgotPwRes.data.message); 

        }catch(error){
            alert(error)
            console.log('error in login', error.response?.data || error.message);
        }
    }
    
    const guideToSignupHandle = () =>{
        handleShowSignupModal();
        handleClose();
    }
    if (!show) return null; // 不顯示時直接返回null

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    // 驗證表單
    const validateForm = () => {
        let formIsValid = true;
        let newFormErrors = {};
        
        if (!formData.email || !emailRegex.test(formData.email)) {
            newFormErrors.email = '請輸入有效的 Email 格式';
            formIsValid = false;
        }
        
        if (!formData.password || !passwordRegex.test(formData.password)) {
            newFormErrors.password = '密碼需至少 8 個字元，並包含字母與數字';
            formIsValid = false;
        }
        
        setFormErrors(newFormErrors);
        return formIsValid;
    };

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
                    <div className="d-none d-lg-flex col-md-4 ps-5" style={{ marginTop: '25vh' }}>
                        <div className="h1 fw-bold mb-3 text-dark">歡迎回來！</div>
                        <div className="fs-3 fw-normal mb-4 text-dark">立即探索更多精彩內容</div>
                        <div className="d-flex flex-column">
                            <div className="h6 fw-light mb-3">還沒有帳戶嗎？</div>
                            <a onClick={guideToSignupHandle} href="#" className="h6 text-primary fw-bold mb-0">立即註冊</a>
                        </div>
                    </div>
                    
                    {/* 右側區域 */}
                    {isForgot ? (
                         <div className="col-md-4 d-flex align-items-center h-100 position-relative">
                         <div className="card shadow-lg rounded-4 border-0 w-100 bg-white login-card mx-5">
                             <div className="card-body">
                                <form id="signupForm" noValidate onSubmit={forgotPassword}>
                                    <button type="button" className="btn-close login-btn-close" 
                                    onClick={()=>{
                                        handleClose();
                                        setResetEmail({ email: "" });
                                        setFormErrors({});
                                    }} 
                                        aria-label="Close">
                                    </button>
                                    <h5 className="card-title fs-6 fw-normal mb-5">重新設定您的密碼</h5>
                                    <p className='fw-light mb-3'> 輸入註冊使用的 email，我們將寄送設定連結給您。</p>
                                    <div className="form-floating mb-5">
                                        <input 
                                        type="email" 
                                        className={`form-control border-0 ${validated && formErrors.email ? "is-invalid" : ""}`}
                                        id="resetEmail"
                                        name="email"
                                        value={resetEmail.email}
                                        placeholder="name@example.com"
                                        onChange={resetEmailInputChange}
                                        />
                                        <label htmlFor="resetEmail">Email address</label>
                                        <div className="invalid-feedback">{formErrors.email}</div>
                                    </div>
                                    <div className="d-grid">
                                        <button type="submit" className="btn btn-primary py-3 mb-5">送出</button>
                                    </div>
                                 </form>
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
                                <form id="signupForm" noValidate onSubmit={loginHandle}>
                                    <button type="button" className="btn-close login-btn-close" 
                                    onClick={()=>{
                                        handleClose();
                                        setFormData({ email: "", password: ""});
                                        setFormErrors({});
                                    }} 
                                        aria-label="Close">
                                    </button>
                                    <h5 className="card-title fs-5 fw-normal mb-10">登入帳戶</h5>
                                    <div className="form-floating mb-10">
                                        <input 
                                        type="email" 
                                        className={`form-control border-0 ${validated && formErrors.email ? "is-invalid" : ""}`}
                                        id="loginEmail"
                                        name="email"
                                        value={formData.email}
                                        placeholder="name@example.com"
                                        onChange={formInputChange}
                                        />
                                        <label htmlFor="loginEmail">Email address</label>
                                        <div className="invalid-feedback">{formErrors.email}</div>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <input 
                                        type="password" 
                                        className={`form-control border-0 ${validated && formErrors.password ? "is-invalid" : ""}`}
                                        id="loginPassword"
                                        name="password"
                                        value={formData.password} 
                                        placeholder="Password"
                                        onChange={formInputChange}
                                        />
                                        <label htmlFor="loginPassword">Password</label>
                                        <div className="invalid-feedback">{formErrors.password}</div>
                                    </div>
                                    <div className="d-flex justify-content-end mb-10">
                                        <a onClick={forgotPasswordHandle} href="#" className="text-gray small">忘記密碼</a>
                                    </div>
                                    <div className="d-grid">
                                        <button type="submit" className="btn btn-primary py-3 mb-10">登入</button>
                                    </div>
                                </form>
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