import { Component } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";

// import "../assets/css/style_category.css";
import { Link, useParams } from "react-router-dom";
import { getPaged_Doctor } from "../services/home.service";
import { getSchedules, getScheduleById, getDoctor, booking, getAppointment, getClinicInfo, cancelAppointment } from "../services/booking.services";
import { deleteAppointment } from "../services/home.service";
import { updatePatientStatus } from "../services/doctor.services";
import "../assets/style/main.css";
import { message } from "antd";

import dayjs from 'dayjs';
import 'dayjs/locale/vi';
dayjs.locale('vi');


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

async function loadDoctorInfo(doctorId: number) {
    let doctor = await getDoctor({
        id: doctorId,
    });
    return doctor;
}

const Appointment = function () {
    const [error, setError] = useState<string | null>(null);
    const [showError, setShowError] = useState(false);
    const [emailUser, setEmailUser] = useState(false);
    const { scheduleId } = useParams<DataParams>();
    const [appointment, setAppointment] = useState<Appointment[]>([]);
    const [schedule, setSchedule] = useState<{ [key: string]: any }>({});

    const [doctorInfo, setDoctorInfo] = useState<{ [key: string]: any }>({});
    const [clinicInfo, setClinicInfo] = useState<{ [key: string]: any }>({});
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        criteriaMode: "all",
    });
    const navigate = useNavigate();


    useEffect(() => {
        const user = localStorage.getItem('user');
        const parsedUser = user ? JSON.parse(user) : null;
        if (!parsedUser) {
            navigate('/login');
        }
        setEmailUser(parsedUser.email);
        loadAppointment(parsedUser.email);
    }, []);

    async function loadAppointment(email: any) {
        //alert("parsedUser.email   " + email)
        let app = await getAppointment({
            email: email,

        });
        console.log("app  ", app)
        const currentDate = new Date();

        const promises = app.map(async (item: any) => {
            if (new Date(item.dateBooking) < currentDate) {
                await updatePatientStatus({
                    patientId: item.id,
                    statusId: 4,
                });
                item.statusId = 4;
            }
            return item;
        });

        const updatedApp = await Promise.all(promises);

        setAppointment(updatedApp)
        //  setAppointment(app)
        console.log("app  ", app)

        // await loadAllDoctorInfo2(app);
        // await loadClinicsInfo2(app);
        // const schedule = await getSchedules({ doctorId: app.doctorId, date: app.dateBooking });
        // if (schedule && schedule.length > 0) {
        //     const clinicId = schedule[0].clinicId;
        // }

        //alert("doctor " + doctor)
    }

    const loadAllDoctorInfo2 = async (appointments: Appointment[]) => {
        const doctorInfoMap: { [key: string]: any } = {};
        try {
            for (let x of appointments) {
                const doctor = await loadDoctorInfo(x.doctorId);
                doctorInfoMap[x.id] = doctor;
            }
            setDoctorInfo(doctorInfoMap);
            console.log("doctorInfo", doctorInfoMap);
        }
        catch (err: any) {
            setError('Có lỗi xảy ra khi tải dữ liệu.');
        }

    };

    const loadClinicsInfo2 = async (appointments: Appointment[]) => {
        const clinicInfoMap: { [key: string]: any } = {};
        try {
            for (let x of appointments) {  
                const schedule = await getSchedules({
                    doctorId: x.doctorId,
                    date: x.dateBooking,
                });
                clinicInfoMap[x.id] = schedule;
            }

            setClinicInfo(clinicInfoMap);
            //alert("cliIn  "+ JSON.stringify(clinicInfoMap));
        } catch (err: any) {
            setError('Có lỗi xảy ra khi tải dữ liệu.'); 
        }

    };

    const getStatusName = (statusId: number) => {
        switch (statusId) {
            case 1:
                return 'Đã xác nhận';
            case 2:
                return 'Đã hủy';
            case 3:
                return 'Chờ xác nhận';
            case 4:
                return 'Đã hủy';
            case 5:
                return 'Đã khám';
            default:
                return 'UNKNOWN';
        }
    };

    const getButtonClass = (statusId: number) => {
        switch (statusId) {
            case 1:
                return 'success'; // Màu xanh lá cho SUCCESS
            case 2:
                return 'danger';  // Màu đỏ cho FAILED
            case 3:
                return 'warning'; // Màu vàng cho PENDING
            case 4:
                return 'danger'; // Màu xanh dương cho NEW
            case 5:
                return 'secondary'; // Màu xám cho DONE
            default:
                return 'light'; // Màu mặc định cho các giá trị không xác định
        }
    };

    const handleDeleteAppointment = async (id: number) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa lịch hẹn này?")) {
            try {
                await deleteAppointment(id); 
                loadAppointment(emailUser);
                message.success("Đã xóa phiếu khám!");
            } catch (error: any) {
                message.error("Có lỗi xảy ra.");
            }
        }
    };

    const handleCancelAppointment = async (id: number) => {
        if (window.confirm("Bạn có chắc chắn muốn hủy lịch hẹn này?")) {
            try {
                await cancelAppointment(id);
                loadAppointment(emailUser);
                message.success("Đã hủy phiếu khám!");
            } catch (error: any) {
                message.error("Có lỗi xảy ra.");
            }
        }
    };

    


    // useEffect(() => {
    //     const loadAllDoctorInfo = async () => {
    //         const doctorInfoMap: { [key: string]: any } = {};
    //         for (let x of appointment) {
    //             const doctor = await loadDoctorInfo(x.doctorId);
    //             //alert(doctor)
    //             doctorInfoMap[x.id] = doctor; // Lưu thông tin bác sĩ vào object với key là appointment.id
    //         }
    //         setDoctorInfo(doctorInfoMap); 

    //     };
    //     const loadClinicsInfo = async () => {
    //         const clinicInfoMap: { [key: string]: any } = {};

    //         for (let x of appointment) {
    //             const schedule = await getSchedules({
    //                 doctorId: x.doctorId,
    //                 date: x.date
    //             });
    //             console.log(JSON.stringify(schedule))
    //             const clinic = await getClinicInfo({
    //                 id: 2
    //             });
    //             console.log("cl  "+ JSON.stringify(clinic))

    //             clinicInfoMap[x.id] = clinic;
    //             }
    //         setClinicInfo(clinicInfoMap);
    //         console.log("cliIn  ", clinicInfoMap)

    //     };
    //     // loadAllDoctorInfo(); 
    //     // loadClinicsInfo();
    // }, [appointment]);

    // useEffect(() => {
    //     if (error) {
    //         setShowError(true);
    //         const timer = setTimeout(() => {
    //             setShowError(false);
    //             setError(null); 
    //         }, 3000);

    //         return () => clearTimeout(timer); 
    //     }
    // }, [error]);
    return (
        <div className="container mt-5">
            {showError && error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            <h3 className="mb-4">Lịch hẹn đã đặt</h3>
            <div className="row">
                {/* <div className="col-md-4 text-center">
                    <img
                        src="images/tree-cop.jpg"
                        style={{width: '100%'}}
                    />
                    <img
                        src="images/green-hos.jpg"
                        style={{ width: '100%', marginTop: 30 }}
                    />


                </div> */}
                <div className="col-md-8" style={{ margin: "0px auto" }}>
                    {appointment && appointment.length > 0 ? (
                        appointment.map((x: any) => (
                            <div key={x.appointment.id} className="appointment-card p-3 position-relative" style={{ fontSize: 18 }}>
                                <div className="row">
                                    <div className="col-md-2 text-center">
                                        <img
                                            src="images/icons/calendar.png"
                                            className="doctor-icon rounded-circle"
                                            alt="Doctor Image"
                                        />
                                        <p className="mt-2">KHÁM</p>
                                        <button
                                            className={`btn btn-${getButtonClass(x.appointment.statusId)}`}
                                        >
                                            {getStatusName(x.appointment.statusId)}
                                        </button>
                                    </div>
                                    <div className="col-md-6 appoint-info">
                                        <p><strong>Tên bệnh nhân:</strong> {x.appointment.name}</p>
                                        <p>
                                            <strong>Bác sĩ:</strong>{" "}
                                            {x.doctor_info
                                                ? `${x.doctor_info.titleName} ${x.doctor_info.name}`
                                                : "Đang tải..."}
                                        </p>
                                        <p>
                                            <strong>Nơi khám:</strong>{" "}
                                            {x.clinic_branch
                                                ? `${x.clinic_branch.clinicName}${x.clinic_branch.clinicAddress ? `, ${x.clinic_branch.clinicAddress}` : ""}`
                                                : "Đang tải..."}
                                        </p>
                                        <p><strong>Lý do khám:</strong> {x.appointment.description}</p>
                                    </div>
                                    <div className="col-md-4 text-end">
                                        <button
                                            className="btn btn-danger position-absolute"
                                            style={{ top: '10px', right: '10px' }}
                                            onClick={() => handleDeleteAppointment(x.appointment.id)}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                        <p className="appointment-time mt-5">
                                            <i className="bi bi-clock" /> {x.appointment.timeBooking}
                                        </p>
                                        <p className="appointment-date">
                                            <i className="bi bi-calendar" /> {dayjs(x.appointment.dateBooking).format('DD/MM/YYYY')}
                                        </p>
                                        {/* <button
                                            className="btn btn-warning appoint-btn w-30"
                                            disabled={x.appointment.statusId !== 3}
                                            onClick={() => handleCancelAppointment(x.appointment.id)}
                                        >
                                            Hủy lịch hẹn
                                        </button> */}

                                        <button
                                            className="btn btn-warning appoint-btn w-30"
                                            disabled={x.appointment.statusId !== 3}
                                            onClick={() => {
                                                if (window.confirm("Bạn có chắc chắn muốn hủy lịch hẹn này?")) {
                                                    handleCancelAppointment(x.appointment.id)
                                                }
                                            }}

                                        >
                                            Hủy lich hẹn
                                        </button>


                                        <p>
                                            <a href="#" className="text-muted">Hướng dẫn đi khám</a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p style={{ marginBottom: 200 }}>Bạn chưa đặt lịch khám nào.</p>
                    )}
                </div>

                {/* <div className="col-md-8">
                    {appointment && appointment.length > 0 ? (
                        appointment.map((x: any) => (
                            <div className="appointment-card p-3 position-relative" style={{ fontSize: 50 }}>
                                <div className="row">
                                    <div className="col-md-2 text-center">
                                        <img
                                            src="images/doctor-icon.png"
                                            className="doctor-icon rounded-circle"
                                            alt="Doctor Image"
                                        />
                                        <p className="mt-2">KHÁM</p>
                                        <button
                                            className={`btn btn-${getButtonClass(x.statusId)}`}
                                        >
                                            {getStatusName(x.statusId)}
                                        </button>

                                    </div>
                                    <div className="col-md-6 appoint-info">
                                        <p>
                                            <strong>Tên bệnh nhân:</strong> {x.name}
                                        </p>
                                        <p>
                                            <strong>Bác sĩ:</strong>{" "}
                                            <a href="#">{doctorInfo[x.id]
                                                ? `Tiến sĩ, Bác sĩ chuyên khoa II ${x.doctor_info?.name}`
                                                : "Đang tải..."}</a>
                                        </p>
                                        <p>
                                            <strong>Nơi khám:</strong>{" "}
                                            {clinicInfo[x.id]?.[0]
                                                ? `${clinicInfo[x.id][0].clinicName}${clinicInfo[x.id][0].clinicAdd ? `, ${clinicInfo[x.id][0].clinicAdd}` : ""}`
                                                : "Đang tải..."}

                                        </p>
                                        <p>
                                            <strong>Lý do khám: </strong>{x.description}
                                        </p>


                                    </div>
                                    <div className="col-md-4 text-end">
                                        <button
                                            className="btn btn-danger position-absolute"
                                            style={{ top: '10px', right: '10px' }}
                                            onClick={() => handleDeleteAppointment(x.id)}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                        <p className="appointment-time mt-5">
                                            <i className="bi bi-clock" /> {x.timeBooking}
                                        </p>
                                        <p className="appointment-date">
                                            <i className="bi bi-calendar" /> {x.dateBooking}
                                        </p>
                                        <button className="btn btn-warning appoint-btn w-30"
                                            disabled={x.statusId !== 3}>Hủy lịch hẹn</button>
                                        <p>
                                            <a href="#" className="text-muted">
                                                Hướng dẫn đi khám
                                            </a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p style={{ marginBottom: 200 }}>Bạn chưa đặt lịch khám nào.</p>
                    )}

                </div> */}
            </div>
           

        </div>


    );

}
export default Appointment;