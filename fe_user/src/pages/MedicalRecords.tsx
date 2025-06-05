import React, { useEffect, useState } from "react";
import { getAppointment } from "../services/booking.services";
import { updatePatientStatus } from "../services/doctor.services";
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
const html2pdf = require("html2pdf.js");



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

    const [statuses, setStatuses] = useState([
        { id: 6, name: "Đã khỏi" },
        { id: 7, name: "Không thay đổi" },
        { id: 8, name: "Tiến triển tốt" },
        { id: 9, name: "Tiến triển xấu" }
    ]);

    const [emailUser, setEmailUser] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        console.log("Medical_Records component mounted");
        const user = localStorage.getItem('user');
        const parsedUser = user ? JSON.parse(user) : null;
        if (!parsedUser) {
            navigate('/login');
        }
        console.log("parsedUser", parsedUser.email);
        //loadAppointment("admin@gmail.com");

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

        setAppointments(updatedApp)
        //  setAppointment(app)

    }

    // const handleAppointmentClick = async (patientId: number) => {
    //     try {

    //         const response = await fetch(
    //             `https://localhost:44393/api/MedicalRecord/get-record-by-id?patientId=${patientId}`,
    //         );

    //         if (!response.ok) throw new Error("Lỗi khi gọi API");

    //         const data = await response.json();
    //         console.log("Medical records:", data);

    //         setSelectedAppointment({
    //             //patient: { name, phone },
    //             diagnosis: data.map((record: any) => ({
    //                 id: record.id,
    //                 height: record.height,
    //                 weight: record.weight,
    //                 temperature: record.temperature,
    //                 heartRate: record.heartRate,
    //                 summary: record.generalConclusion,
    //                 diseaseStatus: record.diseaseProgressStatus,
    //                 danger: record.heartRate > 120 ? "Cảnh báo cao" : "Bình thường",
    //                 imageUrlsJson: record.imageUrlsJson // cập nhật nếu có
    //             }))

                
    //         });
    //         setShowModal(true);


    //     } catch (error) {
    //         console.error("Lỗi khi gọi API:", error);
    //     }
    // };

    const handleAppointmentClick = async (appointment: any) => {
        try {
            const patientId = appointment.appointment.id;

            const response = await fetch(
                `https://localhost:44393/api/MedicalRecord/get-record-by-id?patientId=${patientId}`,
            );

            if (!response.ok) throw new Error("Lỗi khi gọi API");

            const data = await response.json();
            console.log("Medical records:", data);

            setSelectedAppointment({
                patientInfo: {
                    name: appointment.appointment.name,
                    phone: appointment.appointment.phone,
                    email: appointment.appointment.email,
                    dateBooking: appointment.appointment.dateBooking,
                    gender: appointment.appointment.gender,
                    yearOfBirth: appointment.appointment.yearOfBirth,
                },
                diagnosis: data.map((record: any) => ({
                    id: record.id,
                    height: record.height,
                    weight: record.weight,
                    temperature: record.temperature,
                    heartRate: record.heartRate,
                    summary: record.generalConclusion,
                    diseaseStatus: record.diseaseProgressStatus,
                    reExaminationDate: record.reExaminationDate,
                    imageUrlsJson: record.imageUrlsJson
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

    const pdfRef = useRef(null);

    // const handleDownloadPDF = () => {
    //     const element = pdfRef.current;
    //     if (!element) return;

    //     const opt = {
    //         margin: 0.3,
    //         filename: `medical-record-${selectedAppointment?.id || 'record'}.pdf`,
    //         image: { type: 'jpeg', quality: 0.98 },
    //         html2canvas: { scale: 2 },
    //         jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    //     };

    //     html2pdf().set(opt).from(element).save();
    // };

    const handleDownloadPDF = () => {
        const element = pdfRef.current as HTMLDivElement | null;

        if (!element) return;

        // Đợi tất cả ảnh bên trong element tải xong
        const images = element.querySelectorAll('img');
        const promises = Array.from(images).map(img => {
            return new Promise<void>((resolve) => {
                if (img.complete) {
                    resolve();
                } else {
                    img.onload = () => resolve();
                    img.onerror = () => resolve(); // vẫn resolve nếu lỗi để tránh kẹt
                }
            });
        });

        Promise.all(promises).then(() => {
            html2pdf()
                .set({
                    margin: 0.5,
                    filename: 'medical-record.pdf',
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2 },
                    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
                })
                .from(element)
                .save();
        });
    };
    

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Hồ sơ khám bệnh</h2>
            <div className="row">
                {appointments.filter(x => x.appointment.statusId === 5).map((x) => (
                    <div className="col-md-3 mb-4" key={x.appointment.id}>
                        <div
                            className="appointment-card p-3 bg-white"
                            style={{
                                transition: "all 0.3s ease-in-out",
                                cursor: "pointer",
                                height: "200px",
                                border: "1px solid rgb(49, 122, 195)",
                            }}
                            //onClick={() => handleAppointmentClick(x.appointment.id)}

                            onClick={() => handleAppointmentClick(x)}

                        
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
                                <img src="/images/icons/patient_2.png" alt="icon" width={40} height={40} className="me-2" />
                                <div>
                                    <div className="fw-normal" style={{ color: '#5ABFAB', fontSize: '24px' }}>{x.appointment.name}</div>
                                    <div className="text-muted" style={{ fontSize: "0.9rem" }}>
                                        {x.appointment.dateBooking} - {x.appointment.timeBooking}
                                    </div>
                                </div>
                            </div>
                            <div className="text-muted">
                                <strong>Bác sĩ:</strong> {x.doctor_info?.name}
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
                    <div className="col-xl-6">
                        {/* Account details card*/}
                        <div className="medical-card mb-4">
                            {/* <div className="card-header">Bệnh án</div> */}
                            <div className="card-body">
                                <div className="popup-content col-md-12" ref={pdfRef}>
                                    <div className="popup-header" style={{ position: 'relative' }}>
                                        <h4>Thông tin bệnh án</h4>
                                        <button onClick={handleDownloadPDF} style={{ marginBottom: '10px', padding: '8px 16px', background: '#5459AC', color: 'white', border: 'none', borderRadius: '5px' }}>
                                            Xuất PDFf
                                        </button>

                                        <button className="close-btn" onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '10px', right: '10px', border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                                    </div>
                                    <div className="popup-body" style={{ overflowY: 'auto', maxHeight: '80vh' }}>

                                        
                                            <div className="patient-info mb-4 p-3 border rounded" style={{ background: '#f9f9f9' }}>
                                                <h5 style={{ color: '#5459AC' }}>Thông tin bệnh nhân</h5>
                                                <p><strong>Họ tên:</strong> {selectedAppointment?.patientInfo?.name}</p>
                                                <p><strong>Giới tính:</strong> {selectedAppointment?.patientInfo?.gender == 'male' ? 'Nam': 'Nữ'}</p>
                                                <p><strong>Năm sinh:</strong> {selectedAppointment?.patientInfo?.yearOfBirth}</p>
                                                <p><strong>Ngày khám:</strong> {new Date(selectedAppointment?.patientInfo?.dateBooking).toLocaleDateString()}</p>
                                                <p><strong>SĐT:</strong> {selectedAppointment?.patientInfo?.phone}</p>

                                            </div>

                                            {selectedAppointment?.diagnosis?.length > 0 && selectedAppointment.diagnosis.map((diag: any, idx: number) => {
                                                let imageUrls: string[] = [];
                                                try {
                                                    imageUrls = JSON.parse(diag.imageUrlsJson || '[]');
                                                } catch (e) {
                                                    console.error("Invalid imageUrlsJson", e);
                                                }

                                                return (
                                                    <div key={idx} className="mb-3 border rounded p-2" style={{marginTop: '230px'}}>
                                                        <div className="row">
                                                            {/* Thông tin chẩn đoán */}
                                                            <div className="col-md-12">
                                                                <h5 style={{ color: '#5459AC' }}>Số bệnh án #{diag.id}</h5>
                                                                <table className="table table-bordered">
                                                                    <thead style={{ backgroundColor: '#5459AC' }}>
                                                                        <tr>
                                                                            <th>Chiều cao (cm)</th>
                                                                            <th>Cân nặng (kg)</th>
                                                                            <th>Nhiệt độ (°C)</th>
                                                                            <th>Nhịp tim (bpm)</th>
                                                                            <th>Kết luận</th>
                                                                            <th>Tình trạng</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        <tr>
                                                                            <td>{diag.height}</td>
                                                                            <td>{diag.weight}</td>
                                                                            <td>{diag.temperature}</td>
                                                                            <td>{diag.heartRate}</td>
                                                                            <td>{diag.summary}</td>
                                                                            <td>{statuses.find(status => status.id === diag.diseaseStatus)?.name || "Chưa xác định"}</td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                                <p><strong>Ngày khám lại:</strong> {diag.reExaminationDate}</p>
                                                            </div>

                                                            {/* Hình ảnh liên quan */}
                                                            {imageUrls.length > 0 && (
                                                                <div className="col-md-12 mt-3">
                                                                    <h6 style={{ color: '#5459AC' }}>Ảnh đính kèm:</h6>
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {imageUrls.map((url, i) => (
                                                                            <img
                                                                                key={i}
                                                                                src={`https://localhost:44393/${url}`}
                                                                                alt={`Diagnosis Image ${i + 1}`}
                                                                                className="object-cover border rounded"
                                                                                style={{ width: '400px', height: 'auto' }}
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}

                                        {/* {selectedAppointment?.diagnosis?.length > 0 && (
                                            selectedAppointment.diagnosis.map((diag: any, idx: number) => {
                                                // Parse image URLs safely
                                                let imageUrls: string[] = [];
                                                try {
                                                    console.log("diag.imageUrlsJson", diag.imageUrlsJson);
                                                    imageUrls = JSON.parse(diag.imageUrlsJson || '[]');
                                                } catch (e) {
                                                    console.error("Invalid imageUrlsJson", e);
                                                }

                                                return (
                                                    <div key={idx} className="mb-3 border rounded p-2">
                                                        <div className="row">
                                                            <div className="col-md-4">

                                                                <p style={{ fontSize: '17px', color: '#5459AC' }}>Id: {diag.id}</p>
                                                                <p style={{ fontSize: '18px', color: '#5459AC' }}>Chiều cao: {diag.height} cm</p>
                                                                <p style={{ fontSize: '18px', color: '#5459AC' }}>Cân nặng: {diag.weight} kg</p>
                                                                <p style={{ fontSize: '18px', color: '#5459AC' }}>Nhiệt độ: {diag.temperature} °C</p>
                                                                <p style={{ fontSize: '18px', color: '#5459AC' }}>Nhịp tim: {diag.heartRate} bpm</p>
                                                                <p style={{ fontSize: '18px', color: '#5459AC' }}>Kết luận: {diag.summary}</p>
                                                                <p style={{ fontSize: '18px', color: '#5459AC' }}>
                                                                    <strong>Tình trạng bệnh:</strong>{" "}
                                                                    {
                                                                        statuses.find(status => status.id === diag.diseaseStatus)?.name
                                                                        || "Chưa xác định"
                                                                    }
                                                                </p>

                                                                
                                                            </div>
                                                            <div className="col-md-8 px-2" style={{ border: '1px solid #5459AC', borderRadius: '8px' } }>
                                                                {imageUrls.length > 0 && (
                                                                    <div className="flex flex-wrap gap-2 mt-2 p-2">
                                                                        {imageUrls.map((url, i) => (
                                                                            <img
                                                                                key={i}
                                                                                src={`https://localhost:44393/${url}`} 
                                                                                alt={`Diagnosis Image ${i + 1}`}
                                                                                className="h-32 object-cover border rounded"
                                                                                style={{width: '400px'}}
                                                                            />
                                                                            
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                 
                                                        
                                                    </div>
                                                );
                                            })
                                        )} */}


                                     

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            )}

        </div>
    );
};

export default Medical_Records;
