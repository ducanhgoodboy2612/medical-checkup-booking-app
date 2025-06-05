import { Component } from "react";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
// import "../assets/css/style_category.css";
import { Link, useParams } from "react-router-dom";

import { login } from "../services/user.services";


const Login = function () {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState([]);
  const navigate = useNavigate();

  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  console.log("from", from);
  useEffect(() => {
    localStorage.removeItem('user');
  }, []);

  const handleLogin = async () => {

    setLoading(true);
    setError('');
    try {
      const response = await login({ email, password });
      //alert(JSON.stringify(response));
      localStorage.setItem('user', JSON.stringify(response));
      setUser(response);
      console.log("user", response);
      if (response.roleId == 2)
        navigate("/doctor");
      else
        navigate(from, { replace: true });
      //alert('Chào mừng bạn quay lại, ' + data.username)


    } catch (error) {
      console.error('Login failed', error);
      setError('Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="vh-100">
      <div className="container mt-5">
        <div className="col-lg-8 mx-auto">
          <div className="row">
            <div className="col-sm-6 text-black">
              <div className="px-5 ms-xl-4">
                <h1 className="fw-normal mb-3 pb-3" style={{ letterSpacing: 1 }}>
                  <strong>Đăng nhập</strong>
                </h1>
                {/* <span className="h1 fw-bold mb-0">Logo</span> */}
              </div>
              <div className="d-flex align-items-center h-custom-2 px-5 ms-xl-4 mt-5 pt-5 pt-xl-0 mt-xl-n5">
                <form style={{ width: "23rem" }}>
                  <div className="d-flex mb-3 flex-row align-items-center justify-content-center justify-content-lg-start">
                    {/* <p className="lead fw-normal mb-0 me-3">Đăng nhập với</p> */}
                    <button
                      type="button"
                      data-mdb-button-init=""
                      data-mdb-ripple-init=""
                      className="btn btn-success btn-floating mx-1"
                    >
                      <i className="fab fa-facebook-f" />
                    </button>
                    <button
                      type="button"
                      data-mdb-button-init=""
                      data-mdb-ripple-init=""
                      className="btn btn-success btn-floating mx-1"
                    >
                      <i className="fab fa-twitter" />
                    </button>
                    <button
                      type="button"
                      data-mdb-button-init=""
                      data-mdb-ripple-init=""
                      className="btn btn-success btn-floating mx-1"
                    >
                      <i className="fab fa-google"></i>

                    </button>
                  </div>


                  <label className="form-label" htmlFor="form2Example28">
                    Email
                  </label>
                  <div data-mdb-input-init="" className="form-outline mb-4">
                    <input
                      type="email"
                      id="form2Example18"
                      className="form-control form-control-lg"
                      placeholder="Nhập email của bạn ..."
                      style={{ fontSize: 16 }}

                      onChange={(e) => setEmail(e.target.value)}
                    />

                  </div>
                  <label className="form-label" htmlFor="form2Example28">
                    Mật khẩu
                  </label>
                  <div data-mdb-input-init="" className="form-outline mb-4">
                    <input
                      type="password"
                      id="form2Example28"
                      className="form-control form-control-lg"
                      placeholder="Nhập mật khẩu ..."
                      style={{ fontSize: 16 }}
                      onChange={(e) => setPassword(e.target.value)}
                    />

                  </div>
                  <div className="pt-1 mb-4">
                    <button
                      data-mdb-button-init=""
                      data-mdb-ripple-init=""
                      className="btn  btn-lg btn-block"
                      type="button"
                      onClick={handleLogin} disabled={loading}
                      style={{ fontSize: 18, backgroundColor: '#5ABFAA', color: 'white' }}
                    >
                      {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>
                    {error && <p className="error-message">{error}</p>}
                  </div>
                  <p className="small mb-2 pb-lg-2">
                    <a className="text-muted" href="#!">
                      Quên mật khẩu?
                    </a>
                  </p>
                  <p>
                    Chưa có tài khoản?{" "}
                    <Link to={'/register'} className="link-info">
                      Đăng kí ngay
                    </Link>
                  </p>
                </form>
              </div>
            </div>
            <div className="col-sm-6 px-0 d-none d-sm-block">
              <img
                src="/images/doctor-login.jpg"
                alt="Login image"
                style={{ height: 500, width: '100%' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>



  );

}
export default Login;