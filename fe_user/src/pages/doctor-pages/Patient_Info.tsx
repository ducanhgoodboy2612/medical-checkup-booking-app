import { Component } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useParams } from "react-router-dom";
import { getSchedules, getScheduleById, getDoctor, booking, getAppointment, getClinicInfo } from "../../services/booking.services";
import { updatePatientStatus, getPatientInfo, createMedicalRecord, getAllStatuses, uploadMedicalRecordImages } from "../../services/doctor.services";
import "../../assets/style/templatemo-kind-heart-charity.css";
interface Status {
    id: string;
    name: string;
}
type DataParams = {
    patientId: string;
};

interface PatientInfo {
    id: string;
    doctorId: string;
    statusId: string;
    name: string;
    phone: string;
    dateBooking: string;
    timeBooking: string;
    email: string;
    gender: string;
    year: string;
    address: string;
    description: string;
}

const PatientInfo = function () {
    const { patientId } = useParams<DataParams>();
    const [error, setError] = useState<string | null>(null);
    const [showError, setShowError] = useState(false);

    const [statuses, setStatuses] = useState([
        { id: 6, name: "Đã khỏi" },
        { id: 7, name: "Không thay đổi" },
        { id: 8, name: "Tiến triển tốt" },
        { id: 9, name: "Tiến triển xấu" }
    ]);
    // const [statuses, setStatuses] = useState(["Đã khỏi", "Không thay đổi", "Tiến triển tốt", "Tiến triển xấu"]);
    const [selectedStatus, setSelectedStatus] = useState(0);
    const [patientInfo, setPatientInfo] = useState<PatientInfo>({
        id: '',
        doctorId: '',
        statusId: '',
        name: '',
        phone: '',
        dateBooking: '',
        timeBooking: '',
        email: '',
        gender: '',
        year: '',
        address: '',
        description: ''
    });
    const [images, setImages] = useState<File[]>([]);


    const navigate = useNavigate();
    const [selectedAppointments, setSelectedAppointments] = useState<number[]>([]);

    const handleCheckboxChange = (id: number) => {
        if (selectedAppointments.includes(id)) {
            setSelectedAppointments(selectedAppointments.filter((appointmentId) => appointmentId !== id));
        } else {
            setSelectedAppointments([...selectedAppointments, id]);
        }
    };


    useEffect(() => {
        const user = localStorage.getItem('user');
        const parsedUser = user ? JSON.parse(user) : null;
        if (!parsedUser || parsedUser.roleId != 2) {
            navigate('/login');
        }
        async function loadPatientInfo() {
            let item = await getPatientInfo({
                id: patientId,
            });
            setPatientInfo(item)

            // let s = await getAllStatuses();
            // setStatuses(s);
        }


        loadPatientInfo();
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

    const [showPopup, setShowPopup] = useState(false);

    const [formData, setFormData] = useState({
        patientId: '',
        height: '',
        weight: '',
        heartRate: '',
        temperature: '',
        generalConclusion: '',
        diseaseProgressStatus: 1,
        reExaminationDate: '' as string | null,
        imageUrlsJson: "string",
        imageUrls: [
            "string"
        ]
    });

    const handleInputChange = (e: any) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        formData.patientId = patientId || '';
        formData.reExaminationDate = formData.reExaminationDate == '' ? null : formData.reExaminationDate;
        //formData.diseaseProgressStatus = selectedStatus;
        try {
            const createdRecord = await createMedicalRecord(formData);
            const medicalRecordId = createdRecord?.id; 

            alert("images.length: " + images.length);
            alert("medicalRecordId: " + medicalRecordId);
            if (images.length > 0 && medicalRecordId) {
                alert("Uploading images...");
                const upload_response =  await uploadMedicalRecordImages(medicalRecordId, images);
                console.log("Upload response:", upload_response);
            }

            await updatePatientStatus({
                patientId: patientId,
                statusId: 5
            });
            toast.success("Thêm bệnh án thành công", {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } catch (error) {
            toast.error("Có lỗi xảy ra. Vui lòng thử lại", {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            console.error('Lỗi khi lưu lịch:', error);
        }
        console.log('Form submitted', formData);
        setShowPopup(false);
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        setImages(prevImages => [...prevImages, ...files]);
    };

    const handleRemoveImage = (indexToRemove: number) => {
        setImages(prevImages => prevImages.filter((_, index) => index !== indexToRemove));
    };

    const handleChange = (event: any) => {
        setSelectedStatus(event.target.value);
    };

    return (
        <div className="container px-4 mt-5 mb-5">
            <nav className="nav nav-borders">
                <Link to={"/doctor/patient-checkup/" + patientId} className=" mx-3">
                    Thông tin chung
                </Link>
                {/* <Link to={"/doctor/patient-medical-record/" + patientId} className=" mx-3">
                    Bệnh án
                </Link> */}
               
            </nav>
            <hr className="mt-0 mb-4" />
            <div className="row">
                <div className="col-xl-4">
                    <div className="info-card mb-4 mb-xl-0">
                        <div className="card-header">Profile Picture</div>
                        <div className="card-body text-center" >
                            {/* Profile picture image*/}
                            <img
                                className="img-account-profile rounded-circle mb-2"
                                src="/images/examination.png"
                                style={{ width: '100%' }}
                                alt=""
                            />
                            
                        </div>
                    </div>

                </div>
                <div className="col-xl-8">
                    {/* Account details card*/}
                    <div className="card mb-4">
                        <div className="card-header">Thông tin chung</div>
                        <div className="card-body" style={{ backgroundColor: "#3ABEF9" }}>
                            <form className="form-card p-5" onSubmit={(e) => e.preventDefault()} style={{ backgroundColor: "white" }}>
                                <div className="row justify-content-between text-left">

                                    <div className="form-group col-sm-6 flex-column d-flex">
                                        <label className="form-control-label">Họ tên </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            placeholder="Enter your name"
                                            value={patientInfo.name || ''}
                                            readOnly
                                            className="patient-info"
                                        />
                                    </div>
                                </div>
                                <div className="row justify-content-between text-left">
                                    <div className="form-group col-sm-6 flex-column d-flex">
                                        <label className="form-control-label">Giới tính </label>
                                        <input
                                            type="text"
                                            id="gender"
                                            name="gender"
                                            placeholder="Enter your gender"
                                            value={
                                                patientInfo.gender === "male"
                                                    ? "Nam"
                                                    : patientInfo.gender === "female"
                                                        ? "Nữ"
                                                        : ""
                                            }
                                            readOnly
                                            className="patient-info"
                                        />
                                    </div>
                                    <div className="form-group col-sm-6 flex-column d-flex">
                                        <label className="form-control-label">Ngày sinh </label>
                                        <input
                                            type="text"
                                            id="year"
                                            name="year"
                                            placeholder="Enter your year"
                                            value={patientInfo.year || ''}
                                            readOnly
                                            className="patient-info"
                                        />
                                    </div>
                                </div>
                                <div className="row justify-content-between text-left">
                                    <div className="form-group col-sm-6 flex-column d-flex">
                                        <label className="form-control-label">Số điện thoại </label>
                                        <input
                                            type="text"
                                            id="phone"
                                            name="phone"
                                            placeholder="Enter your phone number"
                                            value={patientInfo.phone || ''}
                                            readOnly
                                            className="patient-info"
                                        />
                                    </div>
                                    <div className="form-group col-sm-6 flex-column d-flex">
                                        <label className="form-control-label">Email đặt khám </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            placeholder="Enter your email"
                                            value={patientInfo.email || ''}
                                            readOnly
                                            className="patient-info"
                                        />
                                    </div>

                                </div>
                                {/* <div className="row justify-content-between text-left">
                                    <div className="form-group col-sm-6 flex-column d-flex">
                                        <label className="form-control-label">Ngày đặt </label>
                                        <input
                                            type="date"
                                            id="dateBooking"
                                            name="dateBooking"
                                            placeholder="Enter booking date"
                                            value={patientInfo.dateBooking || ''}
                                            readOnly
                                            className="patient-info"
                                        />
                                    </div>
                                    <div className="form-group col-sm-6 flex-column d-flex">
                                        <label className="form-control-label">Giờ đặt </label>
                                        <input
                                            type="time"
                                            id="timeBooking"
                                            name="timeBooking"
                                            placeholder="Enter booking time"
                                            value={patientInfo.timeBooking || ''}
                                            readOnly
                                            className="patient-info"
                                        />
                                    </div>
                                  
                                </div> */}

                                <div className="row justify-content-between text-left">
                                    <div className="form-group col-sm-6 flex-column d-flex">
                                        <label className="form-control-label">Địa chỉ </label>
                                        <input
                                            type="text"
                                            id="address"
                                            name="address"
                                            placeholder="Enter your address"
                                            value={patientInfo.address || ''}
                                            readOnly
                                            className="patient-info"
                                        />
                                    </div>
                                </div>
                                <div className="row justify-content-between text-left">
                                    <div className="form-group col-12 flex-column d-flex">
                                        <label className="form-control-label">Lý do khám </label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            placeholder="Enter description"
                                            value={patientInfo.description || ''}
                                            readOnly
                                            className="patient-info"
                                        />
                                    </div>
                                </div>
                                <div className="row justify-content-end">
                                    <div className="form-group col-sm-6 d-flex justify-content-end">
                                        <button type="submit" className="btn-block btn-success" onClick={() => setShowPopup(true)} style={{ backgroundColor: "#007bff", color: "#fff", border: 0, height: 35 }}>Thêm bệnh án</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Record Popup modal */}
            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-content col-lg-8 px-5">
                        <h3>Thêm bệnh án</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <input
                                    type="text"
                                    name="height"
                                    placeholder="Chiều cao (cm)"
                                    className="col-lg-4 mx-3"
                                    value={formData.height}
                                    onChange={handleInputChange}
                                />
                                <input
                                    type="text"
                                    name="weight"
                                    placeholder="Cân nặng (kg)"
                                    className="col-lg-4"
                                    value={formData.weight}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="row">
                                <input
                                    type="text"
                                    name="heartRate"
                                    className="col-lg-4 mx-3"
                                    placeholder="Nhịp tim (bpm)"
                                    value={formData.heartRate}
                                    onChange={handleInputChange}
                                />
                                <input
                                    type="text"
                                    name="temperature"
                                    className="col-lg-4"
                                    placeholder="Nhiệt độ (C)"
                                    value={formData.temperature}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <textarea
                                name="generalConclusion"
                                className="col-lg-10"
                                placeholder="Kết luận chung"
                                value={formData.generalConclusion}
                                onChange={handleInputChange}
                            />

                            <div className="row">

                                {/* <select
                                    name="diseaseProgressStatus"
                                    className="col-lg-4 mx-3"
                                    value={formData.diseaseProgressStatus}
                                    onChange={handleInputChange}
                                    style={{height: 43}}
                                >
                                    <option value="" disabled>Chọn tình trạng bệnh</option>
                                    {statuses.filter((status: any) => status.id >=6 && status.id <=9)
                                    .map((status: any) => (
                                        <option key={status.id} value={status.id}>
                                            {status.name}
                                        </option>
                                    ))}

                                    
                                </select> */}

                                <select
                                    name="diseaseProgressStatus"
                                    className="col-lg-4 mx-3"
                                    value={selectedStatus}
                                    onChange={(e) => {
                                        const statusId = Number(e.target.value); // Chuyển giá trị sang number
                                        setSelectedStatus(statusId); // Cập nhật selectedStatus
                                        setFormData({
                                            ...formData,
                                            diseaseProgressStatus: statusId, // Gán giá trị vào formData
                                        });
                                    }}
                                    style={{ height: 43 }}
                                >
                                    <option value="" disabled>Chọn tình trạng bệnh</option>
                                    {statuses
                                        .filter((status: any) => status.id >= 6 && status.id <= 9)
                                        .map((status: any) => (
                                            <option key={status.id} value={status.id}>
                                                {status.name}
                                            </option>
                                        ))}
                                </select>

                                <select
                                    name="reExamination"
                                    className="col-lg-4"
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        let newDate = null;

                                        if (value === "Không") {
                                            newDate = null;
                                        } else {
                                            const monthsToAdd = parseInt(value, 10);
                                            const currentDate = new Date();
                                            currentDate.setMonth(currentDate.getMonth() + monthsToAdd);
                                            newDate = currentDate.toISOString().split("T")[0]; // Định dạng ngày thành YYYY-MM-DD
                                        }

                                        setFormData({
                                            ...formData,
                                            reExaminationDate: newDate || ""
                                        });
                                    }}
                                >
                                    <option value="" disabled>Khám lại</option>
                                    <option value="Không">Không</option>
                                    <option value="3">3 tháng</option>
                                    <option value="6">6 tháng</option>
                                    <option value="9">9 tháng</option>
                                    <option value="12">12 tháng</option>
                                </select>
                            </div>

                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                            />

                            {/* Hiển thị ảnh đã thêm */}
                            <div className="image-list">
                                {images.map((image, index) => (
                                    <div key={index} className="image-item">
                                        <img src={URL.createObjectURL(image)} alt={`uploaded-img-${index}`} className="uploaded-img" />
                                        <button type="button" onClick={() => handleRemoveImage(index)}>Xóa</button>
                                    </div>
                                ))}
                            </div>

                            <button type="submit" className="btn btn-primary">Submit</button>
                            <button type="button" onClick={() => setShowPopup(false)} className="btn btn-secondary">Close</button>
                        </form>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>


    );

}
export default PatientInfo;
