import { Component } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useParams } from "react-router-dom";
import { getSchedules, getScheduleById, getDoctor, booking, getAppointment, getClinicInfo } from "../../services/booking.services";
import { updatePatientStatus, getPatientInfo, createMedicalRecord, getAllStatuses, getMedicalRecord } from "../../services/doctor.services";
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

interface FormData {
    height?: number | null;
    weight?: number | null;
    heartRate?: number | null;
    temperature?: number | null;
    generalConclusion?: string;
    diseaseProgressStatus?: number | null;
}

interface Record {
    createdAt: string; // Assuming CreatedAt is a string, adjust as necessary
    height?: number; // Assuming Height is a number, adjust type as necessary
    weight?: number; // Same for Weight
    heartRate?: number; // Same for HeartRate
    temperature?: number; // Same for Temperature
    generalConclusion?: string; // Same for GeneralConclusion
    diseaseProgressStatus?: number; // Same for DiseaseProgressStatus
}

type RecordList = Record[];
const Medical_Record = function () {
    const { patientId } = useParams<DataParams>();
    const [error, setError] = useState<string | null>(null);
    const [showError, setShowError] = useState(false);
    // const [statuses, setStatuses] = useState(["Đã khỏi", "Không thay đổi", "Tiến triển tốt", "Tiến triển xấu"]);
    
    const [statuses, setStatuses] = useState([
        { id: 6, name: "Đã khỏi" },
        { id: 7, name: "Không thay đổi" },
        { id: 8, name: "Tiến triển tốt" },
        { id: 9, name: "Tiến triển xấu" }
    ]);

    const [selectedStatus, setSelectedStatus] = useState('');
    const [listRecord, setListRecord] = useState<RecordList>([]);

    const [formData, setFormData] = useState<FormData>({
        height: null,
        weight: null,
        heartRate: null,
        temperature: null,
        generalConclusion: '',
        diseaseProgressStatus: null
    });
    const [patientInfo, setPatientInfo] = useState<PatientInfo>();
    const [images, setImages] = useState([]);
    const [selectedCreatedAt, setSelectedCreatedAt] = useState('');

    const navigate = useNavigate();
    const [selectedAppointments, setSelectedAppointments] = useState<number[]>([]);

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

        async function loadRecord() {
            let item = await getMedicalRecord({
                patientId: patientId,
                doctorId: 0
            });
            setListRecord(item)
            console.log("reco  ", item)

        }
       
        loadRecord();
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

    const handleInputChange = (e: any) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    


    // const handleImageUpload = (event: any) => {
    //     const files = Array.from(event.target.files);
    //     const fileUrls = files.map(file => URL.createObjectURL(file));
    //     setImages(prevImages => [...prevImages, ...fileUrls]);
    // };

    const handleRemoveImage = (indexToRemove: any) => {
        setImages(prevImages => prevImages.filter((_, index) => index !== indexToRemove));
    };

    

    const handleDateChange = (e: any) => {
        const selectedDate = e.target.value.split('T')[0]; 
        setSelectedCreatedAt(selectedDate);

        const selectedRecord = listRecord.find((record: any) =>
            record.createdAt && record.createdAt.includes(selectedDate) 
        );

        if (selectedRecord) { 
            setFormData({
                height: selectedRecord.height ?? null, // Use null for non-existing values
                weight: selectedRecord.weight ?? null,
                heartRate: selectedRecord.heartRate ?? null,
                temperature: selectedRecord.temperature ?? null,
                generalConclusion: selectedRecord.generalConclusion ?? '',
                diseaseProgressStatus: selectedRecord.diseaseProgressStatus ?? null
            });
        } else {
            setFormData({}); 
        }
    };

    return (
        <div className="container px-4 mt-5 mb-5">
            <nav className="nav nav-borders">
                <Link to={"/doctor/patient-checkup/" + patientId} className=" mx-3">
                    Thông tin chung
                </Link>
                <Link to={"/doctor/patient-medical-record/" + patientId} className=" mx-3">
                    Bệnh án
                </Link>
                <a
                    className="nav-link"
                    href="https://www.bootdey.com/snippets/view/bs5-profile-security-page"
                    target="__blank"
                >
                    Security
                </a>
                <a
                    className="nav-link"
                    href="https://www.bootdey.com/snippets/view/bs5-edit-notifications-page"
                    target="__blank"
                >
                    Notifications
                </a>
            </nav>
            <hr className="mt-0 mb-4" />
            <div className="row">
                <div className="col-xl-4">
                    <div className="info-card mb-4 mb-xl-0">
                        <div className="card-header">Profile Picture</div>
                        <div className="card-body text-center">
                            {/* Profile picture image*/}
                            <img
                                className="img-account-profile rounded-circle mb-2"
                                src="/images/examination.png"
                                style={{width: '120%'}}
                                alt=""
                            />
                            {/* Profile picture help block*/}
                            <div className="small font-italic text-muted mb-4">
                                JPG or PNG no larger than 5 MB
                            </div>
                            {/* Profile picture upload button*/}
                            <button className="btn btn-primary" type="button">
                                Upload new image
                            </button>
                        </div>
                    </div>
                   
                </div>
                <div className="col-xl-8">
                    {/* Account details card*/}
                    <div className="card mb-4">
                        <div className="card-header">Bệnh án</div>
                        <div className="card-body" style={{ backgroundColor: "#5ABFAB"}}>
                            <div className="popup-content col-lg-12 px-5">
                                <h3>Bệnh án</h3>
                                <form>
                                    <div className="row">
                                            
                                            <select
                                                id="createdAt"
                                                value={selectedCreatedAt}
                                                onChange={handleDateChange}
                                                className="col-lg-5 mx-3"
                                                style={{ height: 40 }}
                                            >
                                                <option value="" disabled>Chọn ngày</option>
                                                {listRecord?.map((record: any) => (
                                                    <option key={record.Id} value={new Date(record.createdAt).toISOString().split('T')[0]}>
                                                        {new Date(record.createdAt).toISOString().split('T')[0]}
                                                    </option>
                                                ))}
                                            </select>
                                    </div>

                                    <div className="row mt-3">
                                        <div className="col-lg-5 mx-3 ">
                                            <label htmlFor="height" className="col-lg-12">Chiều cao (cm)</label>
                                            <input
                                                id="height"
                                                type="text"
                                                name="height"
                                                value={formData.height?.toString() || ''}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div className="col-lg-5 mx-3">
                                            <label htmlFor="weight" className="col-lg-12">Cân nặng (kg)</label>
                                            <input
                                                id="weight"
                                                type="text"
                                                name="weight"
                                                value={formData.weight?.toString() || ''}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-lg-5 mx-3">
                                            <label htmlFor="heartRate" className="col-lg-12">Nhịp tim</label>
                                            <input
                                                id="heartRate"
                                                type="text"
                                                name="heartRate"
                                                value={formData.heartRate?.toString() || ''}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div className="col-lg-5 mx-3">
                                            <label htmlFor="temperature" className="col-lg-12">Nhiệt độ</label>
                                            <input
                                                id="temperature"
                                                type="text"
                                                name="temperature"
                                                value={formData.temperature?.toString() || ''}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    {/* <div className="row">
                                        <div className="col-lg-12 mx-3">
                                            <label htmlFor="generalConclusion" className="col-lg-12">Kết luận chung</label>
                                            <textarea
                                                id="generalConclusion"
                                                name="generalConclusion"
                                                className="col-lg-10"
                                                value={formData.generalConclusion?.toString() || ''}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div> */}

                                    <div className="row">
                                        <div className="col-lg-5 mx-3">
                                            <label htmlFor="diseaseProgressStatus" className="col-lg-12">Tình trạng bệnhhhh</label>
                                            <select
                                                id="diseaseProgressStatus"
                                                name="diseaseProgressStatus"
                                                value={formData.diseaseProgressStatus?.toString() || ''}
                                                onChange={handleInputChange}
                                                style={{ height: 43 }}
                                            >
                                                <option value="" disabled>Chọn tình trạng bệnh</option>
                                                {/* {statuses
                                                    .filter((status) => status.id >= 6 && status.id <= 9)
                                                    .map((status) => (
                                                        <option key={status.id} value={status.id}>
                                                            {status.name}
                                                        </option>
                                                    ))} */}
                                            </select>
                                        </div>
                                    </div>

                                    <button type="submit" className="btn btn-primary mt-3">Dữ liệu ảnh</button>
                                </form>


                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Popup modal */}
           

            <ToastContainer />
        </div>


    );

}
export default Medical_Record;
