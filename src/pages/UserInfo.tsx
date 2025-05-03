import { Component } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
// import "../assets/css/style_category.css";
import { Link, useParams } from "react-router-dom";
import { getPaged_Doctor, getPaged_Spec, getPaged_Clinic, getTop_Doctor, getNotification } from "../services/home.service";
import { booking, getDoctor } from "../services/booking.services";
import "../assets/style/templatemo-kind-heart-charity.css"; 
import { getUserbyId } from "../services/user.services";
const UserInfo = function() {
    const [spec, setSpec] = useState([]);
    const [spec2, setSpec2] = useState([]);
    const [clinics, setClinics] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [user, setUser] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        avatar: "",
        gender: "",
        isActive: true
    });
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
            console.log("name  ", parsedUser.name);
            //alert(JSON.parse(user))
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
        loadClinic();
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
            <div className="container">
                <div className="info-main-body">
                    {/* Breadcrumb */}
                    <nav aria-label="breadcrumb" className="main-breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <a href="index.html">Home</a>
                            </li>
                            <li className="breadcrumb-item">
                                <a href="javascript:void(0)">User</a>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">
                                User Profile
                            </li>
                        </ol>
                    </nav>
                    {/* /Breadcrumb */}
                    <div className="row gutters-sm">
                        <div className="col-md-4 mb-3">
                            <div className="card">
                                <div className="info-card-body">
                                    <div className="d-flex flex-column align-items-center text-center">
                                        <img
                                            src="https://bootdey.com/img/Content/avatar/avatar7.png"
                                            alt="Admin"
                                            className="rounded-circle"
                                            width={150}
                                        />
                                        <div className="mt-3">
                                            <h4>{user.name}</h4>
                                            <p className="text-secondary mb-1">{user.isActive === true ? "Active" : user.isActive === false ? "Inactive" : "N/A"}</p>
                                            <p className="text-muted font-size-sm">
                                                Bay Area, San Francisco, CA
                                            </p>
                                            <button className="btn btn-primary">Đổi ảnh đại diện</button>
                                            {/* <button className="btn btn-outline-primary">Message</button> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                        <div className="col-md-8">
                            <div className="info-card mb-3 px-5">
                                <div className="info-card-body ">
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <h6 className="mb-0">Full Name</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">{user.name || "N/A"}</div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <h6 className="mb-0">Email</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">{user.email || "N/A"}</div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <h6 className="mb-0">Phone</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">{user.phone || "N/A"}</div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <h6 className="mb-0">Address</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">{user.address || "N/A"}</div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <h6 className="mb-0">Gender</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">
                                            {user.gender === "male" ? "Nam" : user.gender === "female" ? "Nữ" : "N/A"}
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <a className="btn btn-info" href="#edit-profile">
                                                Edit
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>

        );
    
}
export default UserInfo;