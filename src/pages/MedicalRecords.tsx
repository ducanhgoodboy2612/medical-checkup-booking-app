import React, { useEffect, useState } from "react";
import { getAppointment } from "../services/booking.services";
import { updatePatientStatus } from "../services/doctor.services";
import { useNavigate } from 'react-router-dom';

type AppointmentType = {
    appointment: {
        id: number;
        name: string;
        phone: string;
        dateBooking: string;
        timeBooking: string;
        statusId: number;
    };
    doctor_info: {
        name: string;
    };
    clinic_branch: {
        name: string;
        phone: string;
    };
};


const Medical_Records = function () {
    const [appointments, setAppointments] = useState<AppointmentType[]>([]);
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

    const [showModal, setShowModal] = useState(false);

    const [emailUser, setEmailUser] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem('user');
        const parsedUser = user ? JSON.parse(user) : null;
        // if (!parsedUser) {
        //     navigate('/login');
        // }
        //setEmailUser("admin@gmail.com");
        loadAppointment("admin@gmail.com");
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

        setAppointments(updatedApp)
        //  setAppointment(app)

    }

    const handleAppointmentClick = async (name: string, phone: string) => {
        try {
            const encodedName = encodeURIComponent(name);
            const encodedPhone = encodeURIComponent(phone);

            const response = await fetch(
                `https://localhost:44393/api/MedicalRecord/get-records-by-patient?name=${encodedName}&phone=${encodedPhone}`
            );

            if (!response.ok) throw new Error("Lỗi khi gọi API");

            const data = await response.json();
            console.log("Medical records:", data);

            setSelectedAppointment({
                //patient: { name, phone },
                diagnosis: data.map((record: any) => ({
                    height: record.height,
                    weight: record.weight,
                    temperature: record.temperature,
                    heartRate: record.heartRate,
                    summary: record.generalConclusion,
                    diseaseStatus: record.diseaseProgressStatus,
                    danger: record.heartRate > 120 ? "Cảnh báo cao" : "Bình thường",
                    images: [] // cập nhật nếu có
                }))
            });
            setShowModal(true);


        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
        }
    };



    const handleCardClick = (appointment: any) => {
        setSelectedAppointment(appointment);
        setShowModal(true);
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Lịch hẹn khám bệnh</h2>
            <div className="row">
                {appointments.map((x) => (
                    <div className="col-md-3 mb-4" key={x.appointment.id}>
                        <div
                            className="appointment-card p-3 bg-white"
                            style={{
                                transition: "all 0.3s ease-in-out",
                                cursor: "pointer",
                                height: "200px",
                                border: "1px solid rgb(49, 122, 195)",
                            }}
                            onClick={() => handleAppointmentClick(x.appointment.name, x.appointment.phone)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.border = "2px solid #0d6efd";
                                e.currentTarget.style.transform = "scale(1.03)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.border = "1px solid rgb(95, 158, 221)";
                                e.currentTarget.style.transform = "scale(1)";
                            }}
                        >
                            <div className="d-flex align-items-start mb-2">
                                <img src="/images/icons/patient.png" alt="icon" width={40} height={40} className="me-2" />
                                <div>
                                    <div className="fw-normal" style={{ color: '#5ABFAB', fontSize: '24px'}}>{x.appointment.name}</div>
                                    <div className="text-muted" style={{ fontSize: "0.9rem" }}>
                                        {x.appointment.dateBooking} - {x.appointment.timeBooking}
                                    </div>
                                </div>
                            </div>
                            <div className="text-muted">
                                <strong>Bác sĩ:</strong> {x.doctor_info.name}
                            </div>
                            {/* <div className="text-muted">
                                <strong>Phòng khám:</strong> {x.clinic_branch.name}
                            </div>
                            <div className="text-muted">
                                <strong>Điện thoại:</strong> {x.clinic_branch.phone}
                            </div> */}
                        </div>
                    </div>
                ))}
            </div>

            {showModal && selectedAppointment && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <div className="popup-header">
                            <h4>Thông tin bệnh án</h4>
                            <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <div className="popup-body">
                            {selectedAppointment?.diagnosis?.length > 0 ? (
                                selectedAppointment.diagnosis.map((diag: any, idx: number) => (
                                    <div key={idx} className="mb-3 border rounded p-2">
                                        <p><strong>Chiều cao:</strong> {diag.height} cm</p>
                                        <p><strong>Cân nặng:</strong> {diag.weight} kg</p>
                                        <p><strong>Nhiệt độ:</strong> {diag.temperature} °C</p>
                                        <p><strong>Nhịp tim:</strong> {diag.heartRate} bpm</p>
                                        <p><strong>Kết luận:</strong> {diag.summary}</p>
                                        <p><strong>Tình trạng bệnh:</strong> {diag.diseaseStatus}</p>
                                        <p><strong>Nguy hiểm:</strong> {diag.danger}</p>
                                        {diag.images?.map((img: string, i: number) => (
                                            <img key={i} src={img} alt={`img-${i}`} width={100} className="me-2 mb-2" />
                                        ))}
                                    </div>
                                ))
                            ) : (
                                <p>Không có thông tin bệnh án.</p>
                            )}

                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Medical_Records;
