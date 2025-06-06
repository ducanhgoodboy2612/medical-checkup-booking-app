import { Component } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
// import "../assets/css/style_category.css";
import { Link, useParams } from "react-router-dom";
import { getPaged_Doctor, getPaged_Spec, getPaged_Clinic, getTop_Doctor } from "../../services/home.service";

const Home_Doctor = function () {
    const [spec, setSpec] = useState([]);
    const [spec2, setSpec2] = useState([]);
    const [clinics, setClinics] = useState([]);
    const [doctors, setDoctors] = useState([]);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(4);
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            const parsedUser = JSON.parse(user);
            if (parsedUser.roleId !== 2) {
                navigate('/doctor'); 
            }
        } else {
            navigate('/doctor'); 
        }

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
                pageSize: 4,
            });
            setSpec2(items);
        }

        async function loadDoctor() {
            let items = await getTop_Doctor({
                page: page,
                pageSize: pageSize,
            });
            setDoctors(items);
            console.log("doctor  >>>", items);

        }

        async function loadClinic() {
            let items = await getPaged_Clinic({
                page: page,
                pageSize: 8,

                // key_name: "He",
                // address: "US"
            });
            setClinics(items.data);

        }

        //loadData();
        loadSpec1();
        loadSpec2();
        loadClinic();
        loadDoctor();
    }, []);
    // componentDidMount() {
    //     handleScrollAndContentLoad();
    // }

    return (
        <>
           
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
                                                <h1>be a Kind Heart</h1>
                                                <p>Professional charity theme based on Bootstrap 5.2.2</p>
                                            </div>
                                        </div>
                                        <div className="carousel-item">
                                            <img
                                                src="images/slide/volunteer-selecting-organizing-clothes-donations-charity.jpg"
                                                className="carousel-image img-fluid"
                                                alt="..."
                                            />
                                            <div className="carousel-caption d-flex flex-column justify-content-end">
                                                <h1>Non-profit</h1>
                                                <p>You can support us to grow more</p>
                                            </div>
                                        </div>
                                        <div className="carousel-item">
                                            <img
                                                src="images/slide/medium-shot-people-collecting-donations.jpg"
                                                className="carousel-image img-fluid"
                                                alt="..."
                                            />
                                            <div className="carousel-caption d-flex flex-column justify-content-end">
                                                <h1>Humanity</h1>
                                                <p>Please tell your friends about our website</p>
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
                                <h2 className="mb-5">Welcome to Kind Heart Charity</h2>
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
                                            Become a <strong>doctor</strong>
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
                                    <h2 className="mb-2">Our Story</h2>
                                    <h5 className="mb-3">
                                        Kind Heart Charity, Non-Profit Organization
                                    </h5>
                                    <p className="mb-0">
                                        This is a Bootstrap 5.2.2 CSS template for charity organization
                                        websites. You can feel free to use it. Please tell your friends
                                        about TemplateMo website. Thank you. HTML CSS files updated on
                                        20 Oct 2022.
                                    </p>
                                </div>
                                <div className="row">
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
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* chuyen khoa */}
                <div className="container my-5">
                    <div id="productCarousel" className="carousel slide" data-bs-ride="carousel" data-bs-interval="2000">
                        <div className="carousel-inner">
                            <div className="carousel-item active">
                                <div className="row">

                                    {spec.map((x: any) => (
                                        <div className="col-md-3">
                                            <div className="card">
                                                <Link to={"/doctors-specialty/" + x.id} title="Product">

                                                    <img
                                                        src={`images/${x.image}`}
                                                        className="card-img-top"
                                                        alt="Product 1"
                                                    />
                                                    <div className="card-body">
                                                        <h5 className="card-title">{x.name}</h5>
                                                        <p className="card-text">Description of product 1.</p>
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
                                                    src={`images/${x.image}`}
                                                    className="card-img-top"
                                                    alt="Product 1"
                                                />
                                                <div className="card-body">
                                                    <h5 className="card-title">{x.image}</h5>
                                                    <p className="card-text">Description of product 1.</p>
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
                <section className="section-padding">
                    <div className="container">
                        <div className="row justify-content-center pb-5">
                            <div className="col-md-12 heading-section text-center ftco-animate">
                                {/* <span className="subheading">Kết nối</span> */}
                                <h2 className="mb-4">Cơ sở Y tế</h2>
                                <p style={{ fontSize: '30px' }}>
                                    Cho đến nay, chúng tôi đã có sự tham gia của hơn 50 bệnh viện và cơ sở y tế trên cả nước
                                </p>
                            </div>
                        </div>
                        <div className="row">

                            {clinics.map((x: any) => (
                                <div className="col-md-3">
                                    <div
                                        className="project img shadow ftco-animate d-flex justify-content-center align-items-center"
                                        style={{
                                            backgroundImage: `url(images/clinics/${x.image})`, backgroundSize: 'cover',
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
                </section>

                <section className="cta-section section-padding section-bg">
                    <div className="container">
                        <div className="row justify-content-center align-items-center">
                            <div className="col-lg-5 col-12 ms-auto">
                                <h2 className="mb-0">
                                    Make an impact. <br /> Save lives.
                                </h2>
                            </div>
                            <div className="col-lg-5 col-12">
                                <a href="#" className="me-4">
                                    Make a donation
                                </a>
                                <a href="#section_4" className="custom-btn btn smoothscroll">
                                    Become a volunteer
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
                                {/* <span className="subheading">Kết nối</span> */}
                                <h2 className="mb-4">Bác sĩ đầu ngành</h2>
                                <p style={{ fontSize: '30px' }}>
                                    Trên tất cả các chuyên khoa
                                </p>
                            </div>
                        </div>
                        <div className="row">
                            {doctors.map((x: any) => (

                                <div className="col-md-12 col-lg-3 mb-4 mb-lg-0">
                                    <div className="card">
                                        <div className="d-flex justify-content-between p-3">
                                            <p className="lead mb-0">Today's Combo Offer</p>
                                            <div
                                                className="bg-info rounded-circle d-flex align-items-center justify-content-center shadow-1-strong"
                                                style={{ width: 35, height: 35 }}
                                            >
                                                <p className="text-white mb-0 small">x4</p>
                                            </div>
                                        </div>
                                        <img
                                            src="images/doctors/bs_DotHue.jpg"
                                            className="card-img-top"
                                            alt="Laptop"
                                        />
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between">
                                                <p className="small">
                                                    <a href="#!" className="text-muted">
                                                        Laptops
                                                    </a>
                                                </p>
                                                <p className="small text-danger">
                                                    <s>$1099</s>
                                                </p>
                                            </div>
                                            <div className="d-flex justify-content-between mb-3">
                                                <h5 className="mb-0">{x.name}</h5>
                                                <h5 className="text-dark mb-0">$999</h5>
                                            </div>
                                            <div className="d-flex justify-content-between mb-2">
                                                <p className="text-muted mb-0">
                                                    Available: <span className="fw-bold">6</span>
                                                </p>
                                                <div className="ms-auto text-warning">
                                                    <i className="fa fa-star" />
                                                    <i className="fa fa-star" />
                                                    <i className="fa fa-star" />
                                                    <i className="fa fa-star" />
                                                    <i className="fa fa-star" />
                                                </div>
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
                                    <h2 className="mb-0">Sandy Chan</h2>
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
                <section className="volunteer-section section-padding" id="section_4">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6 col-12">
                                <h2 className="text-white mb-4">Volunteer</h2>
                                <form
                                    className="custom-form volunteer-form mb-5 mb-lg-0"
                                    action="#"
                                    method="post"
                                    role="form"
                                >
                                    <h3 className="mb-4">Become a volunteer today</h3>
                                    <div className="row">
                                        <div className="col-lg-6 col-12">
                                            <input
                                                type="text"
                                                name="volunteer-name"
                                                id="volunteer-name"
                                                className="form-control"
                                                placeholder="Jack Doe"
                                            />
                                        </div>
                                        <div className="col-lg-6 col-12">
                                            <input
                                                type="email"
                                                name="volunteer-email"
                                                id="volunteer-email"
                                                pattern="[^ @]*@[^ @]*"
                                                className="form-control"
                                                placeholder="Jackdoe@gmail.com"
                                            />
                                        </div>
                                        <div className="col-lg-6 col-12">
                                            <input
                                                type="text"
                                                name="volunteer-subject"
                                                id="volunteer-subject"
                                                className="form-control"
                                                placeholder="Subject"
                                            />
                                        </div>
                                        <div className="col-lg-6 col-12">
                                            <div className="input-group input-group-file">
                                                <input
                                                    type="file"
                                                    className="form-control"
                                                    id="inputGroupFile02"
                                                />
                                                <label
                                                    className="input-group-text"
                                                    htmlFor="inputGroupFile02"
                                                >
                                                    Upload your CV
                                                </label>
                                                <i className="bi-cloud-arrow-up ms-auto" />
                                            </div>
                                        </div>
                                    </div>
                                    <textarea
                                        name="volunteer-message"
                                        rows={3}
                                        className="form-control"
                                        id="volunteer-message"
                                        placeholder="Comment (Optional)"
                                        defaultValue={""}
                                    />
                                    <button type="submit" className="form-control">
                                        Submit
                                    </button>
                                </form>
                            </div>
                            <div className="col-lg-6 col-12">
                                <img
                                    src="images/smiling-casual-woman-dressed-volunteer-t-shirt-with-badge.jpg"
                                    className="volunteer-image img-fluid"
                                    alt=""
                                />
                                <div className="custom-block-body text-center">
                                    <h4 className="text-white mt-lg-3 mb-lg-3">About Volunteering</h4>
                                    <p className="text-white">
                                        Lorem Ipsum dolor sit amet, consectetur adipsicing kengan omeg
                                        kohm tokito Professional charity theme based
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="news-section section-padding" id="section_5">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12 col-12 mb-5">
                                <h2>Latest News</h2>
                            </div>
                            <div className="col-lg-7 col-12">
                                <div className="news-block">
                                    <div className="news-block-top">
                                        <a href="news-detail.html">
                                            <img
                                                src="images/news/medium-shot-volunteers-with-clothing-donations.jpg"
                                                className="news-image img-fluid"
                                                alt=""
                                            />
                                        </a>
                                        <div className="news-category-block">
                                            <a href="#" className="category-block-link">
                                                Lifestyle,
                                            </a>
                                            <a href="#" className="category-block-link">
                                                Clothing Donation
                                            </a>
                                        </div>
                                    </div>
                                    <div className="news-block-info">
                                        <div className="d-flex mt-2">
                                            <div className="news-block-date">
                                                <p>
                                                    <i className="bi-calendar4 custom-icon me-1" />
                                                    October 12, 2036
                                                </p>
                                            </div>
                                            <div className="news-block-author mx-5">
                                                <p>
                                                    <i className="bi-person custom-icon me-1" />
                                                    By Admin
                                                </p>
                                            </div>
                                            <div className="news-block-comment">
                                                <p>
                                                    <i className="bi-chat-left custom-icon me-1" />
                                                    32 Comments
                                                </p>
                                            </div>
                                        </div>
                                        <div className="news-block-title mb-2">
                                            <h4>
                                                <a
                                                    href="news-detail.html"
                                                    className="news-block-title-link"
                                                >
                                                    Clothing donation to urban area
                                                </a>
                                            </h4>
                                        </div>
                                        <div className="news-block-body">
                                            <p>
                                                Lorem Ipsum dolor sit amet, consectetur adipsicing kengan
                                                omeg kohm tokito Professional charity theme based on
                                                Bootstrap
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="news-block mt-3">
                                    <div className="news-block-top">
                                        <a href="news-detail.html">
                                            <img
                                                src="images/news/medium-shot-people-collecting-foodstuff.jpg"
                                                className="news-image img-fluid"
                                                alt=""
                                            />
                                        </a>
                                        <div className="news-category-block">
                                            <a href="#" className="category-block-link">
                                                Food,
                                            </a>
                                            <a href="#" className="category-block-link">
                                                Donation,
                                            </a>
                                            <a href="#" className="category-block-link">
                                                Caring
                                            </a>
                                        </div>
                                    </div>
                                    <div className="news-block-info">
                                        <div className="d-flex mt-2">
                                            <div className="news-block-date">
                                                <p>
                                                    <i className="bi-calendar4 custom-icon me-1" />
                                                    October 20, 2036
                                                </p>
                                            </div>
                                            <div className="news-block-author mx-5">
                                                <p>
                                                    <i className="bi-person custom-icon me-1" />
                                                    By Admin
                                                </p>
                                            </div>
                                            <div className="news-block-comment">
                                                <p>
                                                    <i className="bi-chat-left custom-icon me-1" />
                                                    35 Comments
                                                </p>
                                            </div>
                                        </div>
                                        <div className="news-block-title mb-2">
                                            <h4>
                                                <a
                                                    href="news-detail.html"
                                                    className="news-block-title-link"
                                                >
                                                    Food donation area
                                                </a>
                                            </h4>
                                        </div>
                                        <div className="news-block-body">
                                            <p>
                                                Sed leo nisl, posuere at molestie ac, suscipit auctor
                                                mauris. Etiam quis metus elementum, tempor risus vel,
                                                condimentum orci
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-12 mx-auto">
                                <form
                                    className="custom-form search-form"
                                    action="#"
                                    method="get"
                                    role="form"
                                >
                                    <input
                                        name="search"
                                        type="search"
                                        className="form-control"
                                        id="search"
                                        placeholder="Search"
                                        aria-label="Search"
                                    />
                                    <button type="submit" className="form-control">
                                        <i className="bi-search" />
                                    </button>
                                </form>
                                <h5 className="mt-5 mb-3">Recent news</h5>
                                <div className="news-block news-block-two-col d-flex mt-4">
                                    <div className="news-block-two-col-image-wrap">
                                        <a href="news-detail.html">
                                            <img
                                                src="images/news/africa-humanitarian-aid-doctor.jpg"
                                                className="news-image img-fluid"
                                                alt=""
                                            />
                                        </a>
                                    </div>
                                    <div className="news-block-two-col-info">
                                        <div className="news-block-title mb-2">
                                            <h6>
                                                <a
                                                    href="news-detail.html"
                                                    className="news-block-title-link"
                                                >
                                                    Food donation area
                                                </a>
                                            </h6>
                                        </div>
                                        <div className="news-block-date">
                                            <p>
                                                <i className="bi-calendar4 custom-icon me-1" />
                                                October 16, 2036
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="news-block news-block-two-col d-flex mt-4">
                                    <div className="news-block-two-col-image-wrap">
                                        <a href="news-detail.html">
                                            <img
                                                src="images/news/close-up-happy-people-working-together.jpg"
                                                className="news-image img-fluid"
                                                alt=""
                                            />
                                        </a>
                                    </div>
                                    <div className="news-block-two-col-info">
                                        <div className="news-block-title mb-2">
                                            <h6>
                                                <a
                                                    href="news-detail.html"
                                                    className="news-block-title-link"
                                                >
                                                    Volunteering Clean
                                                </a>
                                            </h6>
                                        </div>
                                        <div className="news-block-date">
                                            <p>
                                                <i className="bi-calendar4 custom-icon me-1" />
                                                October 24, 2036
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="category-block d-flex flex-column">
                                    <h5 className="mb-3">Categories</h5>
                                    <a href="#" className="category-block-link">
                                        Drinking water
                                        <span className="badge">20</span>
                                    </a>
                                    <a href="#" className="category-block-link">
                                        Food Donation
                                        <span className="badge">30</span>
                                    </a>
                                    <a href="#" className="category-block-link">
                                        Children Education
                                        <span className="badge">10</span>
                                    </a>
                                    <a href="#" className="category-block-link">
                                        Poverty Development
                                        <span className="badge">15</span>
                                    </a>
                                    <a href="#" className="category-block-link">
                                        Clothing Donation
                                        <span className="badge">20</span>
                                    </a>
                                </div>
                                <div className="tags-block">
                                    <h5 className="mb-3">Tags</h5>
                                    <a href="#" className="tags-block-link">
                                        Donation
                                    </a>
                                    <a href="#" className="tags-block-link">
                                        Clothing
                                    </a>
                                    <a href="#" className="tags-block-link">
                                        Food
                                    </a>
                                    <a href="#" className="tags-block-link">
                                        Children
                                    </a>
                                    <a href="#" className="tags-block-link">
                                        Education
                                    </a>
                                    <a href="#" className="tags-block-link">
                                        Poverty
                                    </a>
                                    <a href="#" className="tags-block-link">
                                        Clean Water
                                    </a>
                                </div>
                                <form
                                    className="custom-form subscribe-form"
                                    action="#"
                                    method="get"
                                    role="form"
                                >
                                    <h5 className="mb-4">Newsletter Form</h5>
                                    <input
                                        type="email"
                                        name="subscribe-email"
                                        id="subscribe-email"
                                        pattern="[^ @]*@[^ @]*"
                                        className="form-control"
                                        placeholder="Email Address"
                                    />
                                    <div className="col-lg-12 col-12">
                                        <button type="submit" className="form-control">
                                            Subscribe
                                        </button>
                                    </div>
                                </form>
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
                                    <h2>Get in touch</h2>
                                    <div className="contact-image-wrap d-flex flex-wrap">
                                        <img
                                            src="images/avatar/pretty-blonde-woman-wearing-white-t-shirt.jpg"
                                            className="img-fluid avatar-image"
                                            alt=""
                                        />
                                        <div className="d-flex flex-column justify-content-center ms-3">
                                            <p className="mb-0">Clara Barton</p>
                                            <p className="mb-0">
                                                <strong>HR &amp; Office Manager</strong>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="contact-info">
                                        <h5 className="mb-3">Contact Infomation</h5>
                                        <p className="d-flex mb-2">
                                            <i className="bi-geo-alt me-2" />
                                            Akershusstranda 20, 0150 Oslo, Norway
                                        </p>
                                        <p className="d-flex mb-2">
                                            <i className="bi-telephone me-2" />
                                            <a href="tel: 120-240-9600">120-240-9600</a>
                                        </p>
                                        <p className="d-flex">
                                            <i className="bi-envelope me-2" />
                                            <a href="mailto:info@yourgmail.com">donate@charity.org</a>
                                        </p>
                                        <a href="#" className="custom-btn btn mt-3">
                                            Get Direction
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
                                    <h2>Contact form</h2>
                                    <p className="mb-4">
                                        Or, you can just send an email:
                                        <a href="#">info@charity.org</a>
                                    </p>
                                    <div className="row">
                                        <div className="col-lg-6 col-md-6 col-12">
                                            <input
                                                type="text"
                                                name="first-name"
                                                id="first-name"
                                                className="form-control"
                                                placeholder="Jack"
                                            />
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-12">
                                            <input
                                                type="text"
                                                name="last-name"
                                                id="last-name"
                                                className="form-control"
                                                placeholder="Doe"
                                            />
                                        </div>
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        pattern="[^ @]*@[^ @]*"
                                        className="form-control"
                                        placeholder="Jackdoe@gmail.com"
                                    />
                                    <textarea
                                        name="message"
                                        rows={5}
                                        className="form-control"
                                        id="message"
                                        placeholder="What can we help you?"
                                        defaultValue={""}
                                    />
                                    <button type="submit" className="form-control">
                                        Send Message
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
export default Home_Doctor;