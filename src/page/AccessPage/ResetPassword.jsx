import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from 'axios';
const { VITE_API_BASE_URL } = import.meta.env;
import Swal from "sweetalert2";
import { logError } from "../../utils/sentryHelper";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [formData, setFormData] = useState({ password: "", confirmPassword:"" });
  const [formErrors, setFormErrors] = useState({});
  const [validated, setValidated] = useState(false);
  const Resettoken = searchParams.get("token");
  

  useEffect(() => {
    if (!Resettoken) {
      // navigate("/"); // 若沒有 token，導回登入頁 
      Swal.fire({
        title: "無效的重設密碼連結",
        icon: "error",
        timer: 1500,
      });
    }
  }, [Resettoken, navigate]);
  
  const formInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
        ...formData,
        [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newFormErrors = {};
    let formIsValid = true;

    // 驗證密碼
    if (!formData.password) {
      newFormErrors.password = '密碼為必填項';
      formIsValid = false;
    } else if (formData.password.length < 8) {
      newFormErrors.password = '密碼長度至少為8個字元';
      formIsValid = false;
    }
    
    // 驗證確認密碼
    if (!formData.confirmPassword) {
      newFormErrors.confirmPassword = '確認密碼為必填項';
      formIsValid = false;
    } else if (formData.password !== formData.confirmPassword) {
    newFormErrors.confirmPassword = '密碼與確認密碼不符';
    formIsValid = false;
  }
  
  setFormErrors(newFormErrors);
  setValidated(true);
  
  if (!formIsValid) {
    return;
  }

    try{
        const url = `${VITE_API_BASE_URL}/users/reset-password`;
        const data = {
            "token": Resettoken,
            "newPassword": formData.password,  
          }

        await axios.post(url, data, {
                headers: {
                "Content-Type": "application/json"
                }
            }
        );
        
        Swal.fire({
          title: "密碼重設成功！",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        navigate("/"); 

    }catch(error){
      logError('error in reset password', error.response?.data || error.message);
    }
  };

  return (
    <div className="container">
      <div className="d-flex align-items-center position-relative">
        <div className="card rounded-4 border-0 py-5" style={{ height: '550px'}}>
          <div className="card-body">

            <form noValidate onSubmit={handleSubmit}>
              <div className="col-md-3 mx-auto d-flex flex-column align-items-start gap-2">
                <div className="text-dark fs-3 fw-bold ">重設密碼</div>
                <p className='fw-light'>請輸入您的新密碼</p>
                  <div className="form-floating w-100 mb-2">
                    <input 
                        type="password" 
                        className={`form-control border-0 ${validated && formErrors.password ? "is-invalid" : ""}`}
                        id="signPassword" 
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={formInputChange}
                        required
                        />
                    <label htmlFor="signPassword">Password</label>
                    <div className="invalid-feedback">{formErrors.password}</div>
                </div>
                <div className="form-floating mb-5 w-100">
                    <input 
                        type="password" 
                        className={`form-control border-0 ${validated && formErrors.confirmPassword ? "is-invalid" : ""}`}
                        id="signConfirmPassword" 
                        name="confirmPassword"
                        placeholder="Password"
                        value={formData.confirmPassword}
                        onChange={formInputChange}
                        required
                        />
                    <label htmlFor="signConfirmPassword">Confirm Password</label>
                    <div className="invalid-feedback">{formErrors.confirmPassword}</div>
                </div>
                <div className="d-block mb-5 w-100">
                  <button type="submit" className="btn btn-primary py-3 w-100 btn-click">設定新密碼</button>
                </div>
              </div>
            </form>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
