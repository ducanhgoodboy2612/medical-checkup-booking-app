import { Component } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";

// import "../assets/css/style_category.css";
import { Link, useParams } from "react-router-dom";
import { getPaged_Doctor } from "../services/home.service";
import { getSchedules, getScheduleById, getDoctor, booking, getAppointment, getClinicInfo } from "../services/booking.services";
import { getNotification, getSpecialty } from "../services/home.service";
import "../assets/style/main.css";

type DataParams = {
    scheduleId: string;
};

interface Appointment {
    id: string;
    name: string;
    doctorId: number;
    clinicName: string;
    time: string;
    dateBooking: string;
    status: number
}

// async function loadDoctorInfo(doctorId: number) {
//     let doctor = await getDoctor({
//         id: doctorId,
//     });
//     return doctor;
// }


const Notification = function () {
    const [error, setError] = useState<string | null>(null);
    const [showError, setShowError] = useState(false);
    const { scheduleId } = useParams<DataParams>();
    const [appointment, setAppointment] = useState<Appointment[]>([]);
    const [schedule, setSchedule] = useState<{ [key: string]: any }>({});

    const [doctorInfo, setDoctorInfo] = useState<{ [key: string]: any }>({});
    const [clinicInfo, setClinicInfo] = useState<{ [key: string]: any }>({});

    const [showDetails, setShowDetails] = useState(false);

    const toggleDetails = () => setShowDetails(!showDetails);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        criteriaMode: "all",
    });
    const navigate = useNavigate();

    //const [notifications, setNotifications] = useState([]);
    const [notifications, setNotifications] = useState<any[]>([]); 
    async function loadDoctorInfo(doctorId: any) {
        let doctorInfo = await getDoctor({
            id: doctorId,
        });
        return doctorInfo;
    }

    async function loadSpecInfo(specializationId: number): Promise<any> {
        let specInfo = await getSpecialty({
            id: 1,
        });
        return specInfo;
    }

    async function loadNotification(email: string) {
        let items = await getNotification({ patient_email: email });

        if (items.length > 0) {
            // Tạo một mảng promises để đợi tất cả các yêu cầu API loadDoctorInfo hoàn thành
            const notificationsWithDoctors = await Promise.all(
                items.map(async (notification: any) => {
                    const doctorInfo = await loadDoctorInfo(notification.doctorId);
                    
                    console.log("doctorInfo", doctorInfo);
                    const specInfo = await loadSpecInfo(doctorInfo.specialtyId);
                    return {
                        ...notification,  
                        doctorInfo: {
                            ...doctorInfo,
                            specialty_name: specInfo.name 
                        }
                    };
                })
            );
            console.log("notificationsWithDoctors", notificationsWithDoctors);
            setNotifications(notificationsWithDoctors);
        }
    }

    useEffect(() => {
        const user = localStorage.getItem('user');
        const parsedUser = user ? JSON.parse(user) : null;
        if (!parsedUser) {
            navigate('/login');
        }

        loadNotification(parsedUser.email);
    }, []);


    useEffect(() => {
        if (error) {
            setShowError(true);
            const timer = setTimeout(() => {
                setShowError(false);
                setError(null); 
            }, 3000);

            return () => clearTimeout(timer); 
        }
    }, [error]);
    return (
        <div className="container my-5">
            {showError && error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            <div className="noti-row notification-container">
                <h3 className="text-center title-h">Thông báo</h3>
                <p className="dismiss text-right d-flex justify-content-end mr-3">
                    <a id="dismiss-all" href="#">
                        Xóa tất cả
                    </a>
                </p>
                    {/* {notifications.map((notification, index) => (
                    <div className="noti-card notification-card notification-reminder">
                        <div className="noti-card-body">
                            <table>
                                <tbody>
                                    <tr>
                                        <td style={{ width: "70%" }}>
                                            <div className="noti-card-title" >
                                                    Bạn có lịch hẹn khám lại chuyên khoa {notification.doctorInfo?.specialty_name || 'Unknown'} với bác sĩ <strong>{notification.doctorInfo?.name || 'No doctor info'}</strong>
                                            </div>
                                        </td>
                                        <td style={{ width: "30%" }}>
                                            <a href="#" className="btn btn-success px-3 mx-2" style={{fontSize: 16}}
                                                    onClick={() => {
                                                        // Navigate to the Doctor page with the doctor's name as a query parameter
                                                        navigate(`/doctors-specialty/${notification.doctorInfo?.specializationId}?name=${encodeURIComponent(notification.doctorInfo?.name || 'No doctor info')}`);
                                                    }}>
                                                Đặt lịch
                                            </a>
                                                <a href="#" className="btn btn-warning dismiss-notification px-3" style={{ fontSize: 16 }}>
                                                Xóa
                                            </a>
                                        </td>
                                    </tr>

                                    
                                </tbody>
                            </table>
                        </div>
                    </div>
                    ))} */}


                {notifications.map((notification, index) => {
                    

                    return (
                        <div key={index} className="noti-card notification-card notification-reminder">
                            <div className="noti-card-body">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td style={{ width: "70%" }}>
                                                <div className="noti-card-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <span>
                                                        Bạn có lịch hẹn khám lại chuyên khoa {notification.doctorInfo?.specialty_name || 'Unknown'} với bác sĩ <strong>{notification.doctorInfo?.name || 'No doctor info'}</strong>
                                                    </span>
                                                    <span
                                                        style={{ cursor: 'pointer', marginLeft: '10px' }}
                                                        onClick={toggleDetails}
                                                    >
                                                        <i className="fas fa-info-circle"></i> {/* Font Awesome icon */}
                                                    </span>
                                                </div>

                                                {showDetails && (
                                                    <div className="patient-details" style={{ marginTop: '10px', paddingLeft: '10px' }}>
                                                        <p><strong>Họ tên:</strong> {notification.patientName}</p>
                                                        <p><strong>Năm sinh:</strong> {notification.patient_YearOfBirth || 'N/A'}</p>
                                                        <p><strong>SĐT:</strong> {notification.patientPhone}</p>
                                                        <p><strong>Ngày khám gần nhất:</strong> {new Date(notification.createdAt).toLocaleString()}</p>
                                                    </div>
                                                )}
                                            </td>

                                            <td style={{ width: "30%" }}>
                                                <a href="#" className="btn btn-success px-3 mx-2" style={{ fontSize: 16 }}
                                                    onClick={() => {
                                                        // Navigate to the Doctor page with the doctor's name as a query parameter
                                                        navigate(`/doctors-specialty/${notification.doctorInfo?.specializationId}?name=${encodeURIComponent(notification.doctorInfo?.name || 'No doctor info')}`);
                                                    }}>
                                                    Đặt lịch
                                                </a>
                                                <a href="#" className="btn btn-warning dismiss-notification px-3" style={{ fontSize: 16 }}>
                                                    Xóa
                                                </a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    );
                })}


                <div className="noti-card notification-card notification-warning">
                    <div className="noti-card-body">
                        <table>
                            <tbody>
                                <tr>
                                    <td style={{ width: "70%" }}>
                                        <div className="noti-card-title">
                                            Cập nhật thông tin cá nhân của bạn
                                        </div>
                                    </td>
                                    <td style={{ width: "30%" }}>
                                        <a href="#" className="btn btn-primary px-3 mx-2">
                                            View
                                        </a>
                                        <a href="#" className="btn btn-danger dismiss-notification px-3">
                                            Dismiss
                                        </a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* <div className="card notification-card notification-danger">
                    <div className="card-body">
                        <table>
                            <tbody>
                                <tr>
                                    <td style={{ width: "70%" }}>
                                        <div className="card-title">
                                            Insufficient budget to create '<b>Clothing</b>' budget category
                                        </div>
                                    </td>
                                    <td style={{ width: "30%" }}>
                                        <a href="#" className="btn btn-primary">
                                            View
                                        </a>
                                        <a href="#" className="btn btn-danger dismiss-notification">
                                            Dismiss
                                        </a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="card notification-card notification-reminder">
                    <div className="card-body">
                        <table>
                            <tbody>
                                <tr>
                                    <td style={{ width: "70%" }}>
                                        <div className="card-title">
                                            You have <b>2</b> upcoming payment(s) this week
                                        </div>
                                    </td>
                                    <td style={{ width: "30%" }}>
                                        <a href="#" className="btn btn-primary">
                                            View
                                        </a>
                                        <a href="#" className="btn btn-danger dismiss-notification">
                                            Dismiss
                                        </a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div> */}
            </div>
        </div>


    );

}
export default Notification;