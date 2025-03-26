import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUserInfo } from "../../slice/authSlice";
import { useForm } from "react-hook-form";
const { VITE_API_BASE_URL } = import.meta.env;
import Swal from "sweetalert2";
import { alertMsgForAdminInfo } from "../../utils/alertMsg";
import { alertMsgForAdminError } from "../../utils/alertMsg";
import { alertMsgForVerify } from "../../utils/alertMsg";
import LoadingSpinner from '../../component/LoadingSpinner/LoadingSpinner';
import { logError } from "../../utils/sentryHelper";


const AdminInfo = () => {
  const [isLoading,setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { id, token} = useSelector(state => state.auth);
  const [previewImage, setPreviewImage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const { register, handleSubmit, setValue, watch,formState:{errors} } = useForm({
    mode:'onChange',
    defaultValues: {
      username: "",
      email: "",
      phone: "",
      gender: "",
      bio: "",
      profile_picture: "",
    }
  });
  useEffect(() => {
    (async () => {
      if (!token) {
        Swal.fire(alertMsgForVerify);
        return;
      };
      try {
        setIsLoading(true);
        const res = await axios.get(`${VITE_API_BASE_URL}/users/${id}`);
        if (res.data.birthday) {
          const date = new Date(res.data.birthday);
          const year = date.getUTCFullYear();
          const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
          const day = date.getUTCDate().toString().padStart(2, "0");
          setValue("year", year);
          setValue("month", month);
          setValue("day", day);
        }
        setValue("username", res.data.username);
        setValue("email", res.data.email);
        setValue("phone", res.data.phone);
        setValue("gender", res.data.gender);
        setValue("bio", res.data.bio);
        setValue("profile_picture", res.data.profile_picture || "");

        setPreviewImage(res.data.profile_picture || "https://raw.githubusercontent.com/wfox5510/wordSapce-imgRepo/695229fa8c60c474d3d9dc0d60b25f9539ac74d9/default-avatar.svg");
      } catch (error) {
        logError(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id,setValue,token]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
    setValue("profile_picture", "");
  };

  const handleImageUrlChange = (e) => {
    const imageUrl = e.target.value;
    setPreviewImage(imageUrl);
    setSelectedFile(null);
    setValue("profile_picture", imageUrl);
  };


  const onSubmit = async (data) => {
    if (!token) {
      Swal.fire(alertMsgForVerify);
      return;
    }

    try {
      setIsLoading(true);
      let profileImageUrl = data.profile_picture;
      if (selectedFile) {
        const formData = new FormData();
        formData.append("profile_picture", selectedFile);

        const uploadRes = await axios.patch(`${VITE_API_BASE_URL}/users/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        profileImageUrl = uploadRes.data.user.profile_picture;
      }
      const updatedUser = {
        username: data.username,
        email: data.email,
        phone: data.phone,
        gender: data.gender,
        birthday: `${data.year}-${data.month}-${data.day}T00:00:00.000Z`,
        bio: data.bio,
        profile_picture: profileImageUrl,
      };

      await axios.patch(`${VITE_API_BASE_URL}/users/${id}`, updatedUser, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire(alertMsgForAdminInfo);
      dispatch(updateUserInfo({ username: data.username, userAvatar: profileImageUrl }));
    } catch (error) {
      Swal.fire(alertMsgForAdminError);
      logError(error);
    }finally{
      setIsLoading(false);
    }
  };
  return (
    <>
    {isLoading && <LoadingSpinner />}
      <h1 className="fs-4 fs-md-1 text-primary fw-bold mb-5">會員資訊</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row mb-5 d-flex flex-column-reverse flex-md-row">
          <div className="col-md-8">
            <div className="mb-5 admin-form_group">
              <label htmlFor="username" className="form-label mb-2">姓名</label>
              <input type="text" className="form-control py-3" id="username" placeholder="姓名" {...register("username")} />
            </div>
            <div className="mb-5 admin-form_group">
              <label htmlFor="email" className="form-label mb-2">電子郵件</label>
              <div><input type="email" className="form-control py-3" id="email" placeholder="email" {...register("email",{
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Email格式不符"
                }
              })} />
            <div className="text-danger mt-1">{errors.email ? errors.email.message : ""}</div>
              </div>
            </div>
            <div className="mb-5 admin-form_group">
              <label htmlFor="phone" className="form-label mb-2">手機號碼</label>
              <div>
              <input type="text" className="form-control py-3" id="phone" placeholder="電話" {...register("phone",{
                pattern: {
                  value: /^\d+$/,
                  message: "請輸入正確號碼"
                }
              })} />
              <div className="text-danger mt-1">{errors.phone ? errors.phone.message : ""}</div>
              </div>
            </div>
            <div className="admin-form_group py-md-3 mb-5">
              <p className="mb-md-0 mb-2">性別</p>
              <div className="d-flex gap-5 mb-md-0">
                {["男", "女", "其他"].map((gender) => (
                  <div className="form-check" key={gender}>
                    <input className="form-check-input border-gray admin-form_checked"
                      type="radio" name="gender" value={gender}
                      {...register("gender")} />
                    <label className="form-check-label">{gender}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="col-md-4 d-flex flex-column align-items-center mb-5 mb-md-0">
            <p className="mb-3 fw-bold">個人照片</p>
            <img
              src={previewImage}
              alt="profile"
              className="rounded-circle border"
              style={{ width: "150px", height: "150px", objectFit: "cover" }}
            />
            <div className="mt-3">
              <button type="button" className="btn btn-primary btn-click" onClick={() => fileInputRef.current.click()}>
                上傳圖片
                <input
                  type="file"
                  ref={fileInputRef}
                  className="d-none"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </button>
            </div>
            <p className="my-3">或貼上圖片網址</p>
            <input
              type="text"
              className="form-control w-50"
              placeholder="輸入圖片網址"
              {...register("profile_picture")}
              value={watch("profile_picture")}
              onChange={handleImageUrlChange} />
          </div>
        </div>
        <div className="admin-form_group mb-5">
          <p className="mb-md-0 mb-2">生日</p>
          <div className="admin-form_birthday d-flex gap-3 w-md-100">
            <select className="form-select py-3" {...register("year")}>
              {[...Array(100)].map((_, i) => {
                const year = 1926 + i;
                return <option key={year} value={year}>{year}</option>;
              })}
            </select>
            <select className="form-select py-3" {...register("month")}>
              {[...Array(12)].map((_, i) => {
                const month = (i + 1).toString().padStart(2, "0"); // 01, 02, ..., 12
                return <option key={month} value={month}>{month}</option>;
              })}
            </select>
            <select className="form-select py-3" {...register("day")}>
              {[...Array(31)].map((_, i) => {
                const day = (i + 1).toString().padStart(2, "0"); // 01, 02, ..., 31
                return <option key={day} value={day}>{day}</option>;
              })}
            </select>
          </div>
        </div>
        <div className="mb-5 admin-form_group mb-5 pb-5 border-bottom border-gray-light">
          <label htmlFor="bio" className="form-label mb-2">個人介紹</label>
          <input type="text" className="form-control py-3" id="bio" placeholder="個人介紹" {...register("bio")} />
        </div>
        <div className="admin-form_group mb-5 py-md-3">
          <p className="mb-5 mb-md-0">付款方式</p>
          <div className="d-md-flex gap-md-5">
            <div className="form-check mb-5 mb-md-0">
              <input className="form-check-input border-gray admin-form_checked" type="radio" name="admin-form_pay" id="admin-form_pay" defaultChecked />
              <label className="form-check-label" htmlFor="admin-form_pay">
                VISA <span className="ms-1 text-gray">**** **** **** 1234</span>
              </label>
            </div>
            <a href="#" className="d-flex link-gray"><span className="material-symbols-sharp rotate-45 me-1">
              close
            </span>新增信用卡</a>
          </div>
        </div>

        <div className="admin-form_group mb-5 py-md-3">
          <p className="mb-5 mb-md-0">收款帳戶</p>
          <div className="d-md-flex gap-md-5">
            <div className="form-check mb-5 mb-md-0">
              <input className="form-check-input border-gray admin-form_checked" type="radio" name="admin-form_receive" id="admin-form_receive" defaultChecked />
              <label className="form-check-label" htmlFor="admin-form_receive">
                彰化銀行 - 王小明
              </label>
            </div>
            <a href="#" className="d-flex link-gray"><span className="material-symbols-sharp rotate-45 me-1">
              close
            </span>新增收款帳戶</a>
          </div>
        </div>
        <button type="submit" className="btn btn-primary btn-lg mt-5 btn-click rounded-2">儲存資料</button>
      </form>
    </>
  );
};

export default AdminInfo;