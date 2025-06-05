import { Component } from "react";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
// import "../assets/header.css";
import "../assets/style/bootstrap-icons.css";
import "../assets/style/bootstrap.min.css";
import "../assets/style/templatemo-kind-heart-charity.css";

interface User {
    avatar: string;
    name: string;
    // các thuộc tính khác
}


const Header = function () {
    const location = useLocation();
    const [selectedItem, setSelectedItem] = useState<string>(location.pathname);
    const [role, setRole] = useState(0)
    const [avatar, setAvatar] = useState("")
    const [user, setUser] = useState<User>();
    const handleClick = (path: string) => {
        setSelectedItem(path);
    };
    const baseUrl = 'https://localhost:44384/uploads/';

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (user) {
            //const parsedUser = JSON.parse(user);
            // if (parsedUser.roleId == 2) {
            //     setRole(2);
            // }
            setRole(user.roleId);
            var img = 'https://localhost:44384' + user?.avatar;
            setAvatar(img);
            console.log("img   ", img)
            setUser(user);
        } else {

        }
    }, []);

    return (
        <>
            <header className="site-header">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 col-12 d-flex flex-wrap">
                            <p className="d-flex me-4 mb-0">
                                <i className="bi-geo-alt me-2" />
                                Akershusstranda 20, 0150 Oslo, Norway
                            </p>
                            <p className="d-flex mb-0">
                                <i className="bi-envelope me-2" />
                                <a href="mailto:info@company.com">info@company.com</a>
                            </p>
                        </div>
                        <div className="col-lg-3 col-12 ms-auto d-lg-block d-none">
                            <ul className="social-icon">
                                <li className="social-icon-item">
                                    <a href="#" className="social-icon-link bi-twitter" />
                                </li>
                                <li className="social-icon-item">
                                    <a href="#" className="social-icon-link bi-facebook" />
                                </li>
                                <li className="social-icon-item">
                                    <a href="#" className="social-icon-link bi-instagram" />
                                </li>
                                <li className="social-icon-item">
                                    <a href="#" className="social-icon-link bi-youtube" />
                                </li>
                                <li className="social-icon-item">
                                    <a href="#" className="social-icon-link bi-whatsapp" />
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </header>

            {role == 2 && (
                <nav className="navbar navbar-expand-lg bg-light shadow-lg">
                    <div className="container">
                        <a className="navbar-brand" href="index.html">
                            <img
                                src="/images/logo.png"
                                className="logo img-fluid"
                                alt="Kind Heart Charity"
                            />


                            <span>
                                Medlatec Booking
                                <small>Đặt khám trực tuyến</small>
                            </span>
                        </a>
                        <button
                            className="navbar-toggler"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#navbarNav"
                            aria-controls="navbarNav"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon" />
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav ms-auto d-flex align-items-center">
                                <li className="nav-item">
                                    <Link to={"/"}>
                                        <a className="nav-link click-scroll" href="#top">
                                            Trang chủ
                                        </a>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to={"/specialties"}>
                                        <a className="nav-link click-scroll" href="#section_2">
                                            Chuyên khoa
                                        </a>
                                    </Link>
                                </li>
                                <li>
                                    <Link to={"/doctor/your-appointment"}>
                                        <a className="dropdown-item" href="news.html">
                                            Phiếu khám
                                        </a>
                                    </Link>
                                </li>
                                <li>
                                    <Link to={"/doctor/schedul-checking"}>
                                        <a className="dropdown-item" href="news-detail.html">
                                            QL Lịch khám
                                        </a>
                                    </Link>
                                </li>


                                {/* <li className="nav-item dropdown">
                                    <a
                                        className="nav-link click-scroll dropdown-toggle"
                                        href="#section_5"
                                        id="navbarLightDropdownMenuLink"
                                        role="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        Phiếu khám
                                    </a>
                                    <ul
                                        className="dropdown-menu dropdown-menu-light"
                                        aria-labelledby="navbarLightDropdownMenuLink"
                                    >
                                        <li>
                                            <Link to={"/doctor/your-appointment"}>
                                                <a className="dropdown-item" href="news.html">
                                                    Khám lần đầu
                                                </a>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to={"/doctor/your-appointment"}>
                                                <p className="dropdown-item" >
                                                    Khám lại
                                                </p>
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                                <li className="nav-item dropdown">
                                    <a
                                        className="nav-link click-scroll dropdown-toggle"
                                        href="#section_5"
                                        id="navbarLightDropdownMenuLink"
                                        role="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        Quản lý
                                    </a>
                                    <ul
                                        className="dropdown-menu dropdown-menu-light"
                                        aria-labelledby="navbarLightDropdownMenuLink"
                                    >
                                        <li>
                                            <a className="dropdown-item" href="news.html">
                                                Bệnh nhân
                                            </a>
                                        </li>
                                        <li>
                                            <Link to={"/doctor/schedul-checking"}>
                                                <a className="dropdown-item" href="news-detail.html">
                                                    Lịch khám
                                                </a>
                                            </Link>
                                        </li>
                                    </ul>
                                </li> */}
                                <li className="nav-item">
                                    <a className="nav-link click-scroll" href="#section_6">
                                        Liên hệ
                                    </a>
                                </li>
                                
                                <li className="nav-item dropdown" style={{ marginLeft: '20px' }}>
                                    <a
                                        className="click-scroll dropdown-toggle"
                                        href="#"
                                        id="navbarLightDropdownMenuLink"
                                        role="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        {!user && (
                                            <i className="fas fa-user" style={{ fontSize: '24px' }}></i>
                                        )}
                                        {user && (
                                            <img
                                                src={`https://localhost:44393${user?.avatar || ''}`}
                                                alt="Doctor Avatar"
                                                className="rounded-circle"
                                                style={{
                                                    width: '45px',
                                                    height: '45px',
                                                    objectFit: 'cover',
                                                }}
                                            />
                                        )}

                                        {/* <img
                                            src={`https://localhost:44384${user?.avatar || ''}`}
                                            //alt={`Upload ${index}`}
                                            style={{ width: '200px', height: 'auto', border: '1px solid #ddd' }}
                                        /> */}


                                    </a>

                                    <ul
                                        className="dropdown-menu dropdown-menu-light"
                                        aria-labelledby="navbarLightDropdownMenuLink"
                                    >
                                        <li>
                                            <a className="dropdown-item" href="news.html">
                                                Thông tin người dùng
                                            </a>
                                        </li>
                                        <li>
                                            <Link to={"/login"}>
                                                <a className="dropdown-item" href="news-detail.html">
                                                    Đăng xuất
                                                </a>
                                            </Link>
                                        </li>
                                    </ul>
                                </li>

                            </ul>
                        </div>
                    </div>
                </nav>
            )

            }

            {(role == 4 || role == null || role == 1) && (
                <nav className="navbar navbar-expand-lg bg-light shadow-lg">
                    <div className="container">
                        <a className="navbar-brand" href="index.html">
                            <img
                                src="/images/logo.png"
                                className="logo img-fluid"
                                alt="Kind Heart Charity"
                            />
                            <span>
                                Medlatec Booking
                                <small>Đặt khám trực tuyến</small>
                            </span>
                        </a>
                        <button
                            className="navbar-toggler"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#navbarNav"
                            aria-controls="navbarNav"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon" />
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav ms-auto">
                                <li className="nav-item">
                                    <Link to={"/"}>
                                        <a className="nav-link click-scroll" href="#top">
                                            Trang chủ
                                        </a>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to={"/specialties"}>
                                        <a className="nav-link click-scroll" href="#section_2">
                                            Chuyên khoa
                                        </a>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to={"/clinics"}>
                                        <a className="nav-link click-scroll" href="#section_3">
                                            Cơ sở y tế
                                        </a>
                                    </Link>
                                </li>
                                {/* <li className="nav-item">
                                    <a className="nav-link click-scroll" href="#section_3">
                                        Lịch đã đặt
                                    </a>
                                </li> */}

                                <li className="nav-item dropdown">
                                    <a
                                        className="nav-link click-scroll dropdown-toggle"
                                        href="#section_5"
                                        id="navbarLightDropdownMenuLink"
                                        role="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        Thông tin
                                    </a>
                                    <ul
                                        className="dropdown-menu dropdown-menu-light"
                                        aria-labelledby="navbarLightDropdownMenuLink"
                                    >
                                        <li>
                                            <Link to={"/appointment"}>
                                                <a className="dropdown-item" href="news.html">
                                                    Lịch khám đã đặt
                                                </a>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to={"/medical-records"}>
                                                <a className="dropdown-item" href="news-detail.html">
                                                    Hồ sơ bệnh án
                                                </a>
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link click-scroll" href="#section_6">
                                        Liên hệ
                                    </a>
                                </li>
                                <li className="nav-item ms-3">
                                    <Link
                                        className="nav-link custom-btn custom-border-btn btn"
                                        to="/booking/multi-department"
                                    >
                                        Khám đa khoa
                                    </Link>
                                </li>

                                <li className="nav-item dropdown" style={{ marginLeft: '20px' }}>
                                    <a
                                        className="click-scroll dropdown-toggle"
                                        href="#"
                                        id="navbarLightDropdownMenuLink"
                                        role="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        {!user && (
                                            <i className="fas fa-user" style={{ fontSize: '24px' }}></i>
                                        )}
                                        {user && (
                                            <img
                                                src={`https://localhost:44393${user?.avatar || ''}`}
                                                alt="Doctor Avatar"
                                                className="rounded-circle"
                                                style={{
                                                    width: '45px',
                                                    height: '45px',
                                                    objectFit: 'cover',
                                                }}
                                            />
                                        )}

                                        {/* <img
                                            src={`https://localhost:44384${user?.avatar || ''}`}
                                            //alt={`Upload ${index}`}
                                            style={{ width: '200px', height: 'auto', border: '1px solid #ddd' }}
                                        /> */}


                                    </a>

                                    <ul
                                        className="dropdown-menu dropdown-menu-light"
                                        aria-labelledby="navbarLightDropdownMenuLink"
                                        style={{marginRight: '250px'}}
                                    >
                                        <li>
                                            <Link to={"/user-info"}>
                                            <a className="dropdown-item" href="news.html">
                                                TT người dùng
                                            </a>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to={"/notification"}>
                                                <a className="dropdown-item" href="news.html">
                                                    Thông báo
                                                </a>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to={"/login"}>
                                                <a className="dropdown-item" href="news-detail.html">
                                                    Đăng xuất
                                                </a>
                                            </Link>
                                        </li>
                                    </ul>
                                </li>

                            </ul>
                        </div>
                    </div>
                </nav>
            )

            }

        </>
    );

}
export default Header;