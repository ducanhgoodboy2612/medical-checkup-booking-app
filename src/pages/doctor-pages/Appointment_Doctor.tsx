import { Component } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { message } from 'antd';

// import "../assets/css/style_category.css";
import { Link, useParams } from "react-router-dom";
import { getSchedules, getScheduleById, getDoctor, booking, getAppointment, getClinicInfo } from "../../services/booking.services";
import { updatePatientStatus } from "../../services/doctor.services";

import { FaEdit } from 'react-icons/fa';

const Appointment_Doctor = function () {
    const [error, setError] = useState<string | null>(null);
    const [showError, setShowError] = useState(false);
    const [appointment, setAppointment] = useState<any[]>([]);

    const navigate = useNavigate();
    const [selectedAppointments, setSelectedAppointments] = useState<number[]>([]);

    const handleCheckboxChange = (id: number) => {
        if (selectedAppointments.includes(id)) {
            setSelectedAppointments(selectedAppointments.filter((appointmentId) => appointmentId !== id));
        } else {
            setSelectedAppointments([...selectedAppointments, id]);
        }
    };  

    const handleUpdateStatus = async (newStatus: number) => {
        //onUpdateStatus(selectedAppointments, newStatus);
        console.log(selectedAppointments);
        
        for (const appointmentId of selectedAppointments) {
            try {
                let item = await updatePatientStatus({
                    patientId: appointmentId, 
                    statusId: newStatus 
                });
                console.log(`Updated patient ${appointmentId} with status ${newStatus}`);
            } catch (error) {
                console.error(`Failed to update patient ${appointmentId}:`, error);
            }
        }
        setSelectedAppointments([]); 
        window.location.reload();
    };


    useEffect(() => {
        const user = localStorage.getItem('user');
        const parsedUser = user ? JSON.parse(user) : null;
        if (!parsedUser || parsedUser.roleId != 2) {
            message.error('Vui lòng đăng nhập để xem thông tin!');
            navigate('/login');
        }

        async function loadAppointment() {
            let app = await getAppointment({
                doctorId: parsedUser.id,

            });
            setAppointment(app);
            console.log("app  ", app);

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

            // setAppointment(updatedApp)

            // await loadAllDoctorInfo2(app);
            // await loadClinicsInfo2(app);
            
        }
        


        loadAppointment();
        // console.log("app", appointment)
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
        <div className="container mt-5 table-container">
            <h2 className="text-center mb-4">Appointment Table</h2>
            <table className="table table-hover table-striped">
                <thead>
                    <tr>
                        <th scope="col">
                            <input
                                type="checkbox"
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setSelectedAppointments(appointment.map((a) => a.id)); // Chọn tất cả nếu check ở đầu
                                    } else {
                                        setSelectedAppointments([]); 
                                    }
                                }}
                            />
                        </th>
                        <th scope="col">ID</th>
                        <th scope="col">Trạng thái</th>
                        <th scope="col">Tên BN</th>
                        <th scope="col">GT</th>
                        <th scope="col">Ngày sinh</th>
                        <th scope="col">Ngày đặt</th>
                        <th scope="col">Giờ đặt</th>
                        <th scope="col">Description</th>
                        <th scope="col">Edit</th>
                    </tr>
                </thead>
                <tbody>
                    
                    {/* {appointment && appointment.length > 0 ? (
                        appointment.filter(app => (app.statusId !== 5 && app.statusId !== 4)) 
                            .map((app, index) => (
                            <tr key={index}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedAppointments.includes(app.id)}
                                        onChange={() => handleCheckboxChange(app.id)}
                                    />
                                </td>
                                <td>{app.id}</td>
                                    <td> {app.statusId >= 1 && app.statusId <= 5 ? (
                                        <button
                                            className={
                                                app.statusId === 1 ? "btn btn-success" :
                                                    app.statusId === 2 ? "btn btn-warning" :
                                                        app.statusId === 3 ? "btn btn-info" :
                                                            "btn btn-secondary"  
                                            }
                                        >
                                            {app.statusId === 1 && "Đã XN"}
                                            {app.statusId === 2 && "Hủy"}
                                            {app.statusId === 3 && "Chờ XN"}
                                            {app.statusId === 4 && "NEW"}
                                            {app.statusId === 5 && "DONE"}
                                        </button>
                                    ) : (
                                        <span>{app.statusId}</span>  // Nếu không thuộc khoảng từ 1 đến 5, hiển thị bình thường
                                    )}
                                    </td>
                                <td>{app.name}</td>
                                <td>{app.gender}</td>
                                <td>{app.year}</td>
                                <td>{app.dateBooking}</td>
                                <td>{app.timeBooking}</td>
                                
                                <td>{app.description}</td>
                                    <td>
                                        <Link to={`/doctor/patient-checkup/${app.id}`}>
                                            <FaEdit style={{ cursor: 'pointer' }} />
                                        </Link>
                                    </td>
                            </tr>
                        ))
                    ) : (
                        <tr className="mt-5">
                            <td colSpan={12} className="text-center">
                                No appointments found.
                            </td>
                        </tr>
                    )} */}

                    {appointment && appointment.length > 0 ? (
                        appointment
                            .filter(item => item.appointment.statusId !== 5 && item.appointment.statusId !== 4)
                            .map((item, index) => {
                                const app = item.appointment;
                                return (
                                    <tr key={index}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedAppointments.includes(app.id)}
                                                onChange={() => handleCheckboxChange(app.id)}
                                            />
                                        </td>
                                        <td>{app.id}</td>
                                        <td>
                                            {app.statusId >= 1 && app.statusId <= 5 ? (
                                                <button
                                                    className={
                                                        app.statusId === 1
                                                            ? "btn btn-success"
                                                            : app.statusId === 2
                                                                ? "btn btn-warning"
                                                                : app.statusId === 3
                                                                    ? "btn btn-info"
                                                                    : "btn btn-secondary"
                                                    }
                                                >
                                                    {app.statusId === 1 && "Đã XN"}
                                                    {app.statusId === 2 && "Hủy"}
                                                    {app.statusId === 3 && "Chờ XN"}
                                                    {app.statusId === 4 && "NEW"}
                                                    {app.statusId === 5 && "DONE"}
                                                </button>
                                            ) : (
                                                <span>{app.statusId}</span>
                                            )}
                                        </td>
                                        <td>{app.name}</td>
                                        <td>{app.gender}</td>
                                        <td>{app.yearOfBirth}</td>
                                        <td>{app.dateBooking}</td>
                                        <td>{app.timeBooking}</td>
                                        <td>{app.description}</td>
                                        <td>
                                            <Link to={`/doctor/patient-checkup/${app.id}`}>
                                                <FaEdit style={{ cursor: 'pointer' }} />
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })
                    ) : (
                        <tr className="mt-5">
                            <td colSpan={12} className="text-center">
                                No appointments found.
                            </td>
                        </tr>
                    )}

                </tbody>
            </table>

            {selectedAppointments.length > 0 && (
                <div className="mt-3">
                    <button
                        className="btn btn-success mr-3"
                        style={{marginRight: 20}}
                        onClick={() => handleUpdateStatus(1)} // Xác nhận statusId = 1
                    >
                        Xác nhận
                    </button>
                    <button
                        className="btn btn-danger"
                        onClick={() => handleUpdateStatus(2)} // Hủy lịch statusId = 2
                    >
                        Hủy lịch
                    </button>
                </div>
            )}
        </div>

    );

}
export default Appointment_Doctor;