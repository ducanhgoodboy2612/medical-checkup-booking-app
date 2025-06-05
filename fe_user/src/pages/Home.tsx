import { Component } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
// import "../assets/css/style_category.css";
import { Link, useParams } from "react-router-dom";
import { getPaged_Doctor, getPaged_Spec, getPaged_Clinic, getTop_Doctor, getNotification } from "../services/home.service";
import { getDoctor } from "../services/booking.services";
import "../assets/style/templatemo-kind-heart-charity.css"; 

const Home = function() {
    const [spec, setSpec] = useState([]);
    const [spec2, setSpec2] = useState([]);
    const [clinics, setClinics] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [user, setUser] = useState([]);
    const [notification, setNotification] = useState([]);
    const [doctorInfo, setDoctorInfo] = useState<any>(null);


    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(4);

    const [currentNotificationIndex, setCurrentNotificationIndex] = useState(0);
    const [showModal, setShowModal] = useState(false);

    async function loadDoctorInfo(doctorId: any) {
        let doctorInfo = await getDoctor({
            id: doctorId,
        });
        return doctorInfo;
    }

    async function loadNotification(email: string) {
        let items = await getNotification({ patient_email: email });

        // lấy thông tin bác sĩ đầu tiên
        if (items.length > 0) {
            const firstNotification = items[0];
            const doctorInfo = await loadDoctorInfo(firstNotification.doctorId);
            console.log("doctorinf  >>>", doctorInfo);

            setDoctorInfo(doctorInfo);
            setNotification(items);
        }

        
    }


    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            const parsedUser = JSON.parse(user);
            // if (parsedUser.roleId == 2) {
            //     setRole(2);
            // }
            setUser(parsedUser);

            loadNotification(parsedUser.email);
        } else {

        }

        
    }, [])

    useEffect(() => {
       
        async function loadSpec1() {
            let items = await getPaged_Spec({
                page: page,
                pageSize: pageSize,
            });
            setSpec(items);

        }

        async function loadSpec2() {
            let items = await getPaged_Spec({
                page: 2,
                pageSize: pageSize,
            });
            setSpec2(items);
            console.log("spec :", items)

        }

        async function loadDoctor() {
            let items = await getTop_Doctor({
                page: page,
                pageSize: pageSize,
            });
            setDoctors(items);
            console.log("doc :", items)

        }

        async function loadClinic() {
            let items = await getPaged_Clinic({
                page: page,
                pageSize: 8,
                
                // key_name: "He",
                // address: "US"
            });
            setClinics(items.data);
            console.log("clin   ", items)
        }

        //loadData();
        loadSpec1();
        loadSpec2();
        //loadClinic();
        loadDoctor();
    }, []);
    
    function handleCloseModal() {
        const nextIndex = currentNotificationIndex + 1;
        if (nextIndex < notification.length) {
            // Nếu còn thông báo tiếp theo, hiển thị modal tiếp theo
            const nextNotification: any = notification[nextIndex];
            loadDoctorInfo(nextNotification.doctorId).then(doctorInfo => {
                setDoctorInfo(doctorInfo);
                setCurrentNotificationIndex(nextIndex);
            });
        } else {
            // Nếu hết thông báo, ẩn modal
            setShowModal(false);
        }
    }

    // Hiển thị modal khi có ít nhất một thông báo
    useEffect(() => {
        if (notification.length > 0) {
            setShowModal(true);
        }
    }, [notification]);
   
        return (
            <>
                {/* <nav className="navbar navbar-expand-lg bg-light shadow-lg">
                    <div className="container">
                        <a className="navbar-brand" href="index.html">
                            <img
                                src="images/logo.png"
                                className="logo img-fluid"
                                alt="Kind Heart Charity"
                            />
                            <span>
                                Kind Heart Charity
                                <small>Non-profit Organization</small>
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
                                    <a className="nav-link click-scroll" href="#top">
                                        Home
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link click-scroll" href="#section_2">
                                        About
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link click-scroll" href="#section_3">
                                        Causes
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link click-scroll" href="#section_4">
                                        Volunteer
                                    </a>
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
                                        News
                                    </a>
                                    <ul
                                        className="dropdown-menu dropdown-menu-light"
                                        aria-labelledby="navbarLightDropdownMenuLink"
                                    >
                                        <li>
                                            <a className="dropdown-item" href="news.html">
                                                News Listing
                                            </a>
                                        </li>
                                        <li>
                                            <a className="dropdown-item" href="news-detail.html">
                                                News Detail
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link click-scroll" href="#section_6">
                                        Contact
                                    </a>
                                </li>
                                <li className="nav-item ms-3">
                                    <a
                                        className="nav-link custom-btn custom-border-btn btn"
                                        href="donate.html"
                                    >
                                        Donate
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav> */}
                <main>
  
                    <section className="hero-section hero-section-full-height">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-lg-12 col-12 p-0">
                                    <div
                                        id="hero-slide"
                                        className="carousel carousel-fade slide"
                                        data-bs-ride="carousel"
                                    >
                                        <div className="carousel-inner">
                                            <div className="carousel-item active">
                                                <img
                                                    src="images/slide/volunteer-helping-with-donation-box.jpg"
                                                    className="carousel-image img-fluid"
                                                    alt="..."
                                                />
                                                <div className="carousel-caption d-flex flex-column justify-content-end">
                                                    <h1>Chất lượng Y tế</h1>
                                                    <p>Kết nối với các bác sĩ hàng đầu và hệ thống y tế hiện đại</p>
                                                </div>
                                            </div>
                                            <div className="carousel-item">
                                                <img
                                                    src="images/banner1.jpg"
                                                    className="carousel-image img-fluid"
                                                    alt="..."
                                                />
                                                <div className="carousel-caption d-flex flex-column justify-content-end">
                                                    <h1>An tâm đặt khám</h1>
                                                    <p>Luôn sẵn sàng tiếp đón 24/7 </p>
                                                </div>
                                            </div>
                                            <div className="carousel-item">
                                                <img
                                                    src="images/banner3.jpg"
                                                    className="carousel-image img-fluid"
                                                    alt="..."
                                                />
                                                <div className="carousel-caption d-flex flex-column justify-content-end">
                                                    <h1>Cơ sở hiện đại</h1>
                                                    <p>Không gian và dịch vụ y tế hiện đại, thoải mái</p>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            className="carousel-control-prev"
                                            type="button"
                                            data-bs-target="#hero-slide"
                                            data-bs-slide="prev"
                                        >
                                            <span
                                                className="carousel-control-prev-icon"
                                                aria-hidden="true"
                                            />
                                            <span className="visually-hidden">Previous</span>
                                        </button>
                                        <button
                                            className="carousel-control-next"
                                            type="button"
                                            data-bs-target="#hero-slide"
                                            data-bs-slide="next"
                                        >
                                            <span
                                                className="carousel-control-next-icon"
                                                aria-hidden="true"
                                            />
                                            <span className="visually-hidden">Next</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>


                  

                    <section className="section-padding">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-10 col-12 text-center mx-auto">
                                    <h2 className="mb-5 text-success">Hệ thống đặt lịch khám bệnh MedlatecBooking</h2>
                                </div>
                                <div className="col-lg-3 col-md-6 col-12 mb-4 mb-lg-0">
                                    <div className="featured-block d-flex justify-content-center align-items-center">
                                        <a href="donate.html" className="d-block">
                                            <img
                                                src="images/icons/hands.png"
                                                className="featured-block-image img-fluid"
                                                alt=""
                                            />
                                            <p className="featured-block-text">
                                                Become a <strong>volunteer</strong>
                                            </p>
                                        </a>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-6 col-12 mb-4 mb-lg-0 mb-md-4">
                                    <div className="featured-block d-flex justify-content-center align-items-center">
                                        <a href="donate.html" className="d-block">
                                            <img
                                                src="images/icons/heart.png"
                                                className="featured-block-image img-fluid"
                                                alt=""
                                            />
                                            <p className="featured-block-text">
                                                <strong>Caring</strong> Earth
                                            </p>
                                        </a>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-6 col-12 mb-4 mb-lg-0 mb-md-4">
                                    <div className="featured-block d-flex justify-content-center align-items-center">
                                        <a href="donate.html" className="d-block">
                                            <img
                                                src="images/icons/receive.png"
                                                className="featured-block-image img-fluid"
                                                alt=""
                                            />
                                            <p className="featured-block-text">
                                                Make a <strong>Donation</strong>
                                            </p>
                                        </a>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-6 col-12 mb-4 mb-lg-0">
                                    <div className="featured-block d-flex justify-content-center align-items-center">
                                        <a href="donate.html" className="d-block">
                                            <img
                                                src="images/icons/scholarship.png"
                                                className="featured-block-image img-fluid"
                                                alt=""
                                            />
                                            <p className="featured-block-text">
                                                <strong>Scholarship</strong> Program
                                            </p>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="section-padding section-bg" id="section_2">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-6 col-12 mb-5 mb-lg-0">
                                    <img
                                        src="images/group-people-volunteering-foodbank-poor-people.jpg"
                                        className="custom-text-box-image img-fluid"
                                        alt=""
                                    />
                                </div>
                                <div className="col-lg-6 col-12">
                                    <div className="custom-text-box">
                                        <h2 className="mb-2">MedlatecBooking</h2>
                                        <h5 className="mb-3">
                                            Hệ thống đặt lịch khám bệnh trực tuyến
                                        </h5>
                                        <p className="mb-0">
                                            Kết nối bệnh nhân với các bác sĩ hàng đầu và bệnh viện uy tín trên khắp Việt Nam. 
                                            Chúng tôi cung cấp thông tin chi tiết về chuyên môn của bác sĩ, các dịch vụ y tế, và đánh giá từ bệnh nhân khác để đảm bảo lựa chọn tốt nhất và và tối ưu hóa trải nghiệm chăm sóc sức khỏe.
                                            Đặc biệt, tất cả dịch vụ đặt lịch đều hoàn toàn miễn phí.
                                        </p>
                                    </div>
                                    {/* <div className="row">
                                        <div className="col-lg-6 col-md-6 col-12">
                                            <div className="custom-text-box mb-lg-0">
                                                <h5 className="mb-3">Our Mission</h5>
                                                <p>
                                                    Sed leo nisl, posuere at molestie ac, suscipit auctor quis
                                                    metus
                                                </p>
                                                <ul className="custom-list mt-2">
                                                    <li className="custom-list-item d-flex">
                                                        <i className="bi-check custom-text-box-icon me-2" />
                                                        Charity Theme
                                                    </li>
                                                    <li className="custom-list-item d-flex">
                                                        <i className="bi-check custom-text-box-icon me-2" />
                                                        Semantic HTML
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-12">
                                            <div className="custom-text-box d-flex flex-wrap d-lg-block mb-lg-0">
                                                <div className="counter-thumb">
                                                    <div className="d-flex">
                                                        <span
                                                            className="counter-number"
                                                            data-from={1}
                                                            data-to={2009}
                                                            data-speed={1000}
                                                        />
                                                        <span className="counter-number-text" />
                                                    </div>
                                                    <span className="counter-text">Founded</span>
                                                </div>
                                                <div className="counter-thumb mt-4">
                                                    <div className="d-flex">
                                                        <span
                                                            className="counter-number"
                                                            data-from={1}
                                                            data-to={120}
                                                            data-speed={1000}
                                                        />
                                                        <span className="counter-number-text">B</span>
                                                    </div>
                                                    <span className="counter-text">Donations</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* notification */}
                    {notification != null ? ( 
                    <div
                        className={`modal fade ${showModal ? 'show' : ''}`}
                        id="exampleModalCenter"
                        tabIndex={-1}
                        role="dialog"
                        aria-labelledby="exampleModalCenterTitle"
                        aria-hidden={!showModal}
                        style={{ display: showModal ? 'block' : 'none' }}
                    >
                        <div className="modal-dialog modal-md  modal-dialog-centered" role="document">
                            <div className="modal-content rounded-0">
                                <div className="modal-body py-0">
                                    <div className="d-block main-content">
                                        <img
                                            src="/images/notice_pic.jpg"
                                            alt="Image"
                                            className="img-fluid"
                                            style={{ backgroundColor: "#b2fcff" }}
                                        />
                                        <div className="content-text p-4">
                                            <h2>Thông báo</h2>
                                            <p style={{fontSize: 25, color: 'green'}}>Bạn có {notification.length} lịch hẹn khám lại.</p>

                                            <div className="d-flex justify-content-end">
                                                <div className="ml-auto">
                                                    
                                                    <button onClick={handleCloseModal} className="btn btn-light px-4 mx-3" data-dismiss="modal">
                                                        Đóng
                                                    </button>
                                                    <a href="#" className="btn btn-primary px-4">
                                                        Xem chi tiết
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> 
                    ) : null}

                    {/* chuyen khoa */}
                    <div className="container my-5 text-center">
                        <h2 className="mb-4">Chuyên khoa</h2>
                        <div id="productCarousel" className="carousel slide" data-bs-ride="carousel" data-bs-interval="2000">
                            <div className="carousel-inner">
                                <div className="carousel-item active">
                                    <div className="row">

                                        {spec.map((x: any) => (
                                            <div className="col-md-3">
                                                <div className="card">
                                                    <Link to={"/doctors-specialty/" + x.id}>
                                                        
                                                        <img
                                                            src={`images/spec/${x.image}`}
                                                            className="card-img-top"
                                                            alt="Product 1"
                                                        />
                                                        <div className="card-body">
                                                            <h5 className="card-title">{x.name}</h5>
                                                        </div>
                                                    </Link>

                                                </div>
                                            </div>
                                        ))}

                                    </div>
                                </div>
                                <div className="carousel-item">
                                    <div className="row">
                                        {spec2.map((x: any) => (
                                            <div className="col-md-3">
                                                <div className="card">
                                                    <img
                                                        src={`images/spec/${x.image}`}
                                                        className="card-img-top"
                                                        alt="Product 1"
                                                    />
                                                    <div className="card-body">
                                                        <h5 className="card-title">{x.name}</h5>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                    </div>
                                </div>
                            </div>
                            <button
                                className="carousel-control-prev"
                                type="button"
                                data-bs-target="#productCarousel"
                                data-bs-slide="prev"
                            >
                                <span className="carousel-control-prev-icon" aria-hidden="true" />
                                <span className="visually-hidden">Previous</span>
                            </button>
                            <button
                                className="carousel-control-next"
                                type="button"
                                data-bs-target="#productCarousel"
                                data-bs-slide="next"
                            >
                                <span className="carousel-control-next-icon" aria-hidden="true" />
                                <span className="visually-hidden">Next</span>
                            </button>
                        </div>
                    </div>

                    {/* co so y te */}
                    {/* <section className="section-padding">
                        <div className="container">
                            <div className="row justify-content-center pb-5">
                                <div className="col-md-12 heading-section text-center ftco-animate">
                                    
                                    <h2 className="mb-4">Cơ sở Y tế</h2>
                                    <p style={{fontSize: '30px'}}>
                                        Cho đến nay, chúng tôi đã có sự tham gia của hơn 50 bệnh viện và cơ sở y tế trên cả nước
                                    </p>
                                </div>
                            </div>
                            <div className="row">

                                {clinics.map((x: any) => (
                                            //<img src={`https://localhost:44384${x.image}`}></img>

                                    <div className="col-md-3">
                                        <div
                                            className="project img shadow ftco-animate d-flex justify-content-center align-items-center"
                                            style={{
                                                backgroundImage: `url(https://localhost:44384${x.image})`, backgroundSize: 'cover',
                                                backgroundRepeat: 'no-repeat',
                                                backgroundPosition: 'center',
                                            }}
                                        >
                                            <div className="overlay" />
                                            <div className="text text-center p-4">
                                                <h3>
                                                    <a href="#">{x.name}</a>
                                                </h3>
                                                <span>{x.address}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                            </div>
                        </div>
                    </section> */}

                    <section className="cta-section section-padding section-bg">
                        <div className="container">
                            <div className="row justify-content-center align-items-center">
                                <div className="col-lg-5 col-12 ms-auto">
                                    <h2 className="mb-0">
                                        Bác sĩ đầu ngành <br /> Trên tất cả các chuyên khoa
                                    </h2>
                                </div>
                                <div className="col-lg-5 col-12">
                                    <a href="#" className="me-4">
                                        Đặt lịch ngay
                                    </a>
                                    <a href="#section_4" className="custom-btn btn smoothscroll">
                                        Khám đa khoa
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>
                    
                    {/* bac si*/}

                   
                    <section style={{ backgroundColor: "rgb(252 248 248)", marginTop: 50 }}>
                        <div className="container py-5">
                            <div className="row justify-content-center pb-5">
                                <div className="col-md-12 heading-section text-center ftco-animate">
                                    
                                    <h2 className="mb-4">Bác sĩ hàng đầu</h2>
                                    <p style={{ fontSize: '30px' }}>
                                        Trên tất cả các chuyên khoa
                                    </p>
                                </div>
                            </div>
                            <div className="row">
                                {doctors.map((x: any) => (

                                    <div className="col-md-12 col-lg-3 mb-4 mb-lg-0">
                                        <div className="card border-0 shadow p-2">
                                            {/* <div className="d-flex justify-content-between p-3">
                                                <p className="lead mb-0">Today's Combo Offer</p>
                                                <div
                                                    className="bg-info rounded-circle d-flex align-items-center justify-content-center shadow-1-strong"
                                                    style={{ width: 35, height: 35 }}
                                                >
                                                    <p className="text-white mb-0 small">x4</p>
                                                </div>
                                            </div> */}
                                            <img
                                                src={`https://localhost:44393${x.avatar}`}
                                                className="card-img-top"
                                                alt="Laptop"
                                            />
                                            <div className="card-body">
                                                <div className="d-flex justify-content-between">
                                                    <p className="small">
                                                        <a href="#!" className="text-muted">
                                                            {x.specialtyName}
                                                        </a>
                                                    </p>
                                                    
                                                </div>
                                                <div className="d-flex justify-content-between mb-3">
                                                    <h5 className="mb-0">BS {x.name}</h5>
                                                    {/* <h5 className="text-dark mb-0">{x.specialtyName}</h5> */}
                                                </div>
                                                
                                            </div>
                                        </div>
                                    </div>
                                ))}
                              
                            </div>
                        </div>
                    </section>

                    <section className="about-section section-padding">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-6 col-md-5 col-12">
                                    <img
                                        src="images/portrait-volunteer-who-organized-donations-charity.jpg"
                                        className="about-image ms-lg-auto bg-light shadow-lg img-fluid"
                                        alt=""
                                    />
                                </div>
                                <div className="col-lg-5 col-md-7 col-12">
                                    <div className="custom-text-block">
                                        <h2 className="mb-0">Nguyễn Thị Linh</h2>
                                        <p className="text-muted mb-lg-4 mb-md-4">Co-Founding Partner</p>
                                        <p>
                                            Lorem Ipsum dolor sit amet, consectetur adipsicing kengan omeg
                                            kohm tokito Professional charity theme based
                                        </p>
                                        <p>
                                            You are not allowed to redistribute this template ZIP file on
                                            any other template collection website. Please contact TemplateMo
                                            for more information.
                                        </p>
                                        <ul className="social-icon mt-4">
                                            <li className="social-icon-item">
                                                <a href="#" className="social-icon-link bi-twitter" />
                                            </li>
                                            <li className="social-icon-item">
                                                <a href="#" className="social-icon-link bi-facebook" />
                                            </li>
                                            <li className="social-icon-item">
                                                <a href="#" className="social-icon-link bi-instagram" />
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                  
                    <section className="section-padding" id="section_3">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-12 col-12 text-center mb-4">
                                    <h2>Our Causes</h2>
                                </div>
                                <div className="col-lg-4 col-md-6 col-12 mb-4 mb-lg-0">
                                    <div className="custom-block-wrap">
                                        <img
                                            src="images/causes/group-african-kids-paying-attention-class.jpg"
                                            className="custom-block-image img-fluid"
                                            alt=""
                                        />
                                        <div className="custom-block">
                                            <div className="custom-block-body">
                                                <h5 className="mb-3">Children Education</h5>
                                                <p>
                                                    Lorem Ipsum dolor sit amet, consectetur adipsicing kengan
                                                    omeg kohm tokito
                                                </p>
                                                <div className="progress mt-4">
                                                    <div
                                                        className="progress-bar w-75"
                                                        role="progressbar"
                                                        aria-valuenow={75}
                                                        aria-valuemin={0}
                                                        aria-valuemax={100}
                                                    />
                                                </div>
                                                <div className="d-flex align-items-center my-2">
                                                    <p className="mb-0">
                                                        <strong>Raised:</strong>
                                                        $18,500
                                                    </p>
                                                    <p className="ms-auto mb-0">
                                                        <strong>Goal:</strong>
                                                        $32,000
                                                    </p>
                                                </div>
                                            </div>
                                            <a href="donate.html" className="custom-btn btn">
                                                Donate now
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6 col-12 mb-4 mb-lg-0">
                                    <div className="custom-block-wrap">
                                        <img
                                            src="images/causes/poor-child-landfill-looks-forward-with-hope.jpg"
                                            className="custom-block-image img-fluid"
                                            alt=""
                                        />
                                        <div className="custom-block">
                                            <div className="custom-block-body">
                                                <h5 className="mb-3">Poverty Development</h5>
                                                <p>
                                                    Sed leo nisl, posuere at molestie ac, suscipit auctor
                                                    mauris. Etiam quis metus tempor
                                                </p>
                                                <div className="progress mt-4">
                                                    <div
                                                        className="progress-bar w-50"
                                                        role="progressbar"
                                                        aria-valuenow={50}
                                                        aria-valuemin={0}
                                                        aria-valuemax={100}
                                                    />
                                                </div>
                                                <div className="d-flex align-items-center my-2">
                                                    <p className="mb-0">
                                                        <strong>Raised:</strong>
                                                        $27,600
                                                    </p>
                                                    <p className="ms-auto mb-0">
                                                        <strong>Goal:</strong>
                                                        $60,000
                                                    </p>
                                                </div>
                                            </div>
                                            <a href="donate.html" className="custom-btn btn">
                                                Donate now
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6 col-12">
                                    <div className="custom-block-wrap">
                                        <img
                                            src="images/causes/african-woman-pouring-water-recipient-outdoors.jpg"
                                            className="custom-block-image img-fluid"
                                            alt=""
                                        />
                                        <div className="custom-block">
                                            <div className="custom-block-body">
                                                <h5 className="mb-3">Supply drinking water</h5>
                                                <p>
                                                    Orci varius natoque penatibus et magnis dis parturient
                                                    montes, nascetur ridiculus
                                                </p>
                                                <div className="progress mt-4">
                                                    <div
                                                        className="progress-bar w-100"
                                                        role="progressbar"
                                                        aria-valuenow={100}
                                                        aria-valuemin={0}
                                                        aria-valuemax={100}
                                                    />
                                                </div>
                                                <div className="d-flex align-items-center my-2">
                                                    <p className="mb-0">
                                                        <strong>Raised:</strong>
                                                        $84,600
                                                    </p>
                                                    <p className="ms-auto mb-0">
                                                        <strong>Goal:</strong>
                                                        $100,000
                                                    </p>
                                                </div>
                                            </div>
                                            <a href="donate.html" className="custom-btn btn">
                                                Donate now
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                   
                    <section className="testimonial-section section-padding section-bg">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-8 col-12 mx-auto">
                                    <h2 className="mb-lg-3">Happy Customers</h2>
                                    <div
                                        id="testimonial-carousel"
                                        className="carousel carousel-fade slide"
                                        data-bs-ride="carousel"
                                    >
                                        <div className="carousel-inner">
                                            <div className="carousel-item active">
                                                <div className="carousel-caption">
                                                    <h4 className="carousel-title">
                                                        Lorem Ipsum dolor sit amet, consectetur adipsicing kengan
                                                        omeg kohm tokito charity theme
                                                    </h4>
                                                    <small className="carousel-name">
                                                        <span className="carousel-name-title">Maria</span>, Boss
                                                    </small>
                                                </div>
                                            </div>
                                            <div className="carousel-item">
                                                <div className="carousel-caption">
                                                    <h4 className="carousel-title">
                                                        Sed leo nisl, posuere at molestie ac, suscipit auctor
                                                        mauris quis metus tempor orci
                                                    </h4>
                                                    <small className="carousel-name">
                                                        <span className="carousel-name-title">Thomas</span>,
                                                        Partner
                                                    </small>
                                                </div>
                                            </div>
                                            <div className="carousel-item">
                                                <div className="carousel-caption">
                                                    <h4 className="carousel-title">
                                                        Lorem Ipsum dolor sit amet, consectetur adipsicing kengan
                                                        omeg kohm tokito charity theme
                                                    </h4>
                                                    <small className="carousel-name">
                                                        <span className="carousel-name-title">Jane</span>, Advisor
                                                    </small>
                                                </div>
                                            </div>
                                            <div className="carousel-item">
                                                <div className="carousel-caption">
                                                    <h4 className="carousel-title">
                                                        Sed leo nisl, posuere at molestie ac, suscipit auctor
                                                        mauris quis metus tempor orci
                                                    </h4>
                                                    <small className="carousel-name">
                                                        <span className="carousel-name-title">Bob</span>,
                                                        Entreprenuer
                                                    </small>
                                                </div>
                                            </div>
                                            <ol className="carousel-indicators">
                                                <li
                                                    data-bs-target="#testimonial-carousel"
                                                    data-bs-slide-to={0}
                                                    className="active"
                                                >
                                                    <img
                                                        src="images/avatar/portrait-beautiful-young-woman-standing-grey-wall.jpg"
                                                        className="img-fluid rounded-circle avatar-image"
                                                        alt="avatar"
                                                    />
                                                </li>
                                                <li
                                                    data-bs-target="#testimonial-carousel"
                                                    data-bs-slide-to={1}
                                                    className=""
                                                >
                                                    <img
                                                        src="images/avatar/portrait-young-redhead-bearded-male.jpg"
                                                        className="img-fluid rounded-circle avatar-image"
                                                        alt="avatar"
                                                    />
                                                </li>
                                                <li
                                                    data-bs-target="#testimonial-carousel"
                                                    data-bs-slide-to={2}
                                                    className=""
                                                >
                                                    <img
                                                        src="images/avatar/pretty-blonde-woman-wearing-white-t-shirt.jpg"
                                                        className="img-fluid rounded-circle avatar-image"
                                                        alt="avatar"
                                                    />
                                                </li>
                                                <li
                                                    data-bs-target="#testimonial-carousel"
                                                    data-bs-slide-to={3}
                                                    className=""
                                                >
                                                    <img
                                                        src="images/avatar/studio-portrait-emotional-happy-funny.jpg"
                                                        className="img-fluid rounded-circle avatar-image"
                                                        alt="avatar"
                                                    />
                                                </li>
                                            </ol>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="contact-section section-padding" id="section_6">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-4 col-12 ms-auto mb-5 mb-lg-0">
                                    <div className="contact-info-wrap">
                                        <h2>Bạn cần hỗ trợ ?</h2>
                                        <div className="contact-image-wrap d-flex flex-wrap">
                                            <img
                                                src="images/avatar/pretty-blonde-woman-wearing-white-t-shirt.jpg"
                                                className="img-fluid avatar-image"
                                                alt=""
                                            />
                                            <div className="d-flex flex-column justify-content-center ms-3">
                                                <p className="mb-0">Nguyễn Minh Hạnh</p>
                                                <p className="mb-0">
                                                    <strong>Hỗ trợ viên</strong>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="contact-info">
                                            <h5 className="mb-3">Thông tin liên hệ</h5>
                                            <p className="d-flex mb-2">
                                                <i className="bi-geo-alt me-2" />
                                                136 Phố Wall, Cầu Giấy, Hà Nội
                                            </p>
                                            <p className="d-flex mb-2">
                                                <i className="bi-telephone me-2" />
                                                <a href="tel: 120-240-9600">120-240-9600</a>
                                            </p>
                                            <p className="d-flex">
                                                <i className="bi-envelope me-2" />
                                                <a href="mailto:info@yourgmail.com">medilife-booking@gmail.com</a>
                                            </p>
                                            <a href="#" className="custom-btn btn mt-3">
                                                Gửi Email
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-5 col-12 mx-auto">
                                    <form
                                        className="custom-form contact-form"
                                        action="#"
                                        method="post"
                                        role="form"
                                    >
                                        <h2>Tư vấn sức khỏe online</h2>
                                        <p className="mb-4">
                                        </p>
                                        <div className="row">
                                            <div className="col-lg-6 col-md-6 col-12">
                                                <input
                                                    type="text"
                                                    name="first-name"
                                                    id="first-name"
                                                    className="form-control"
                                                    placeholder="Họ"
                                                />
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-12">
                                                <input
                                                    type="text"
                                                    name="last-name"
                                                    id="last-name"
                                                    className="form-control"
                                                    placeholder="Tên"
                                                />
                                            </div>
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            pattern="[^ @]*@[^ @]*"
                                            className="form-control"
                                            placeholder="Số điện thoại"
                                        />
                                        <textarea
                                            name="message"
                                            rows={5}
                                            className="form-control"
                                            id="message"
                                            placeholder="Chúng tôi có thể giúp gì cho bạn?"
                                            defaultValue={""}
                                        />
                                        <button type="submit" className="form-control">
                                            Gửi
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </>


        );
    
}
export default Home;