import { Component } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";

// import "../assets/css/style_category.css";
import { Link, useParams } from "react-router-dom";
import { getPaged_Doctor } from "../services/home.service";
import { getSchedules, getScheduleById, getDoctor, booking, getAppointment, getClinicInfo } from "../services/booking.services";
import { getSpecbyId } from "../services/detail.services";
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

async function loadDoctorInfo(doctorId: number) {
    let doctor = await getDoctor({
        id: doctorId,
    });
    return doctor;
}

const Doctor_Cart = function () {
    const [error, setError] = useState<string | null>(null);
    const [showError, setShowError] = useState(false);
    const { scheduleId } = useParams<DataParams>();
    const [appointment, setAppointment] = useState<Appointment[]>([]);
    const [schedule, setSchedule] = useState<{ [key: string]: any }>({});
    const [selectedDoctors, setSelectedDoctors] = useState([]);
    const [specInfo, set_specInfo] = useState<{ [key: string]: any }>({});


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

    async function loadSelectedDoctor() {
        const selectedDoctors = localStorage.getItem('cart');

        if (selectedDoctors) {
            const doctorsData = JSON.parse(selectedDoctors);

            setSelectedDoctors(doctorsData)
            console.log("doccart   ", doctorsData)
            const newSpecInfo = { ...specInfo };

            for (const doctor of doctorsData) {
                try {
                    const specialization = await getSpecbyId({ id: doctor.specializationId });
                    newSpecInfo[doctor.doctorId] = specialization;
                } catch (error) {
                    console.error(`Failed to load specialization for doctorId ${doctor.doctorId}`, error);
                }
            }
            set_specInfo(newSpecInfo);
            //setSelectedDoctors(doctorsWithSpecs);
        } else {
            alert("no thing")
            setSelectedDoctors([])

        }
        // await loadAllDoctorInfo2(app);
        // await loadClinicsInfo2(app);

    }
    useEffect(() => {
        const user = localStorage.getItem('user');
        const parsedUser = user ? JSON.parse(user) : null;
        if (!parsedUser) {
            navigate('/login');
        }

        



        loadSelectedDoctor();
    }, []);

    const loadAllDoctorInfo2 = async (appointments: Appointment[]) => {
        const doctorInfoMap: { [key: string]: any } = {};
        try {
            for (let x of appointments) {
                const doctor = await loadDoctorInfo(x.doctorId);
                doctorInfoMap[x.id] = doctor;
            }
            setDoctorInfo(doctorInfoMap);
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
                console.log("sche  ", schedule)
                const clinic = await getClinicInfo({
                    id: schedule[0].clinicId,
                });

                if (!clinic) {
                    throw new Error(`Clinic not found for appointment id: ${x.id}`);
                }

                clinicInfoMap[x.id] = clinic;
            }

            setClinicInfo(clinicInfoMap);
            console.log("cliIn  ", clinicInfoMap);
        } catch (err: any) {
            setError('Có lỗi xảy ra khi tải dữ liệu.'); // Cập nhật lỗi vào state
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
                return 'NEW';
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
                return 'primary'; // Màu xanh dương cho NEW
            case 5:
                return 'secondary'; // Màu xám cho DONE
            default:
                return 'light'; // Màu mặc định cho các giá trị không xác định
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
        <div className="container mt-5 mb-5">
            {showError && error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            <h3 className="mb-4">Lịch hẹn đã đặt</h3>
            <div className="row">
                <div className="col-md-3 col-lq-0">
                    <img src="/images/green-hos.jpg" style={{width: '100%'}}/>
                </div>
                <div className="col-md-9">
                    {selectedDoctors && selectedDoctors.length > 0 ? (
                        selectedDoctors.map((x: any) => (
                            <div className="appointment-card p-3" style={{ fontSize: 50 }}>
                                <div className="row">
                                    <div className="col-md-2 text-center">
                                        <img
                                            src="images/doctor-icon.png"
                                            className="doctor-icon rounded-circle"
                                            alt="Doctor Image"
                                        />
                                        <p className="mt-2">KHÁM</p>
                                       

                                    </div>
                                    <div className="col-md-6 appoint-info">
                                        <p>
                                            <strong>Tên bệnh nhân:</strong> {x.name}
                                        </p>
                                        <p>
                                            <strong>Chuyên môn:</strong> {specInfo[x.doctorId]?.name || 'Không xác định'}
                                        </p>
                                        {/* <p>
                                            <strong>Bác sĩ:</strong>{" "}
                                            <a href="#">{doctorInfo[x.id]
                                                ? `Tiến sĩ, Bác sĩ chuyên khoa II ${doctorInfo[x.id].userName}`
                                                : "Đang tải..."}</a>
                                        </p> */}
                                        <p>
                                            <strong>Nơi khám:</strong>{" "}
                                            {clinicInfo[x.id] ? clinicInfo[x.id].name : "Đang tải..."}
                                        </p>
                                       

                                    </div>
                                    <div className="col-md-4 text-end">
                                        <p className="appointment-time">
                                            <i className="bi bi-clock" /> {x.timeBooking}
                                        </p>
                                        <p className="appointment-date">
                                            <i className="bi bi-calendar" /> {x.dateBooking}
                                        </p>
                                        <button className="btn btn-warning appoint-btn w-40">Xóa</button>
                                       
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p style={{ marginBottom: 200 }}>Bạn chưa đặt lịch khám nào.</p>
                    )}
                </div>
            </div>
           

        </div>


    );

}
export default Doctor_Cart;