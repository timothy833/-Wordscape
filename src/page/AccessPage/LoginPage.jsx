const { VITE_API_BASE_URL } = import.meta.env;
import axios from 'axios'
import PropTypes from 'prop-types';
import LoadingSpinner from '../../component/LoadingSpinner/LoadingSpinner';
import Swal from "sweetalert2";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react'
import { login, clearError } from '../../slice/authSlice';
import { logError } from '../../utils/sentryHelper';

const LoginPage = ({ show, handleClose, handleShowSignupModal }) => {
    LoginPage.propTypes = {
        show: PropTypes.bool.isRequired, 
        handleClose: PropTypes.func.isRequired,
        handleShowSignupModal: PropTypes.func.isRequired,
    };
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { error, isAuthorized } = useSelector(state => state.auth);
    const [isForgot, setIsForgot] = useState(false);
    const [resetEmail, setResetEmail] = useState({ email: "" });
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [formErrors, setFormErrors] = useState({});
    const [validated, setValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isAuthorized) {
            handleClose();
        }
        return () => {
          if (error) dispatch(clearError());
        };
      }, [isAuthorized, navigate, error, dispatch]);


    useEffect(()=>{
        if (!show) {
            setTimeout(() => {
                setIsForgot(false);
              }, 1000);
        }
    },[show]);

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

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    const forgotPassword = async(event) => {
        event.preventDefault();
        let newFormErrors = {};
        let formIsValid = true;
        
        if (!resetEmail.email || !emailRegex.test(resetEmail.email)) {
            newFormErrors.email = '請輸入有效的 Email 格式';
            formIsValid = false;
            setFormErrors(newFormErrors);
            return formIsValid;
        }

        try{
            setIsLoading(true);
            const url = `${VITE_API_BASE_URL}/users/forgot-password`;
            const data = {
                "email": resetEmail.email,
                "password": "securepassword",
              }
            await axios.post(url, data, {
                headers: {
                "Content-Type": "application/json"
                }
            });
            
            //console.log("forgot password",forgotPwRes);
            setResetEmail({ email: "" });
           
            handleClose();
            Swal.fire({
                title: "請檢查Email 以重設密碼",
                icon: "info",
                confirmButtonColor: "#E77605",
                confirmButtonText: "確認"
            });

        }catch(error){
            Swal.fire({
                title: error,
                icon: "error",
                confirmButtonColor: "#E77605",
                confirmButtonText: "確認"
              });
              logError('error in login', error.response?.data || error.message);
        }finally{
            setIsLoading(false);
        }
    }
    
    const guideToSignupHandle = () =>{
        setIsForgot(false);
        handleShowSignupModal();
        handleClose();
    }

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
        <>
        { isLoading && <LoadingSpinner/>}
        <div className={`access-modal-container ${show ? "show" : ""} w-100 h-100`}>
            <div 
            className="access-modal-content h-100">
                <div className="login position-relative h-100">
                    <div className="container-fluid h-100">
                        <div className="row h-100 w-100 justify-content-center">
                            {/* 左側區域 */}
                            <div className="d-none flex-column  d-lg-flex col-md-4 ps-5" style={{ marginTop: '25vh' }}>
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
                                        <form id="loginForm" noValidate onSubmit={forgotPassword}>
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
                                                <button type="submit" className="btn btn-primary py-3 mb-5 btn-click">送出</button>
                                            </div>
                                        </form>
                                        <div className="text-center my-5">
                                            <a onClick={returnLoginHandle} href='#' className="text-gray small btn-click">返回</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            ):(
                            <div className="col-md-4 d-flex align-items-center h-100 position-relative">
                                <div className="card shadow-lg rounded-4 border-0 w-100 bg-white login-card mx-5">
                                    <div className="card-body">
                                        <form id="loginForm-mobile" noValidate onSubmit={loginHandle}>
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
                                                <button type="submit" className="btn btn-primary py-3 mb-10 btn-click">登入</button>
                                            </div>
                                        </form>
                                        <div className="text-center my-5">
                                            <span className="text-gray fw-light">或以其他平台登入</span>
                                        </div>
                                        <div className="d-flex justify-content-center gap-5">
                                            <a style={{cursor: 'pointer'}}>
                                            <img src="https://github.com/timothy833/-Wordscape/blob/main/src/assets/images/AccessPage/Facebook-icon.png?raw=true" width="40px" height="40px" alt="facebook-login"/>
                                            </a>
                                            <a style={{cursor: 'pointer'}}>
                                                <img src="https://github.com/timothy833/-Wordscape/blob/main/src/assets/images/AccessPage/apple-icon.png?raw=true" width="40px" height="40px" alt="apple-login" />
                                            </a>
                                            <a style={{cursor: 'pointer'}}>
                                                <img src="https://github.com/timothy833/-Wordscape/blob/main/src/assets/images/AccessPage/google-icon.png?raw=true" width="40px" height="40px" alt="google-login" />
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
        </div>
        </>
    );
};

export default LoginPage;