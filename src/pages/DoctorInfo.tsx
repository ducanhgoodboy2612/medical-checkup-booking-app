import { Component } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
// import "../assets/css/style_category.css";
import { Link, useParams } from "react-router-dom";
import { getSchedules, getScheduleById, getDoctor } from "../services/booking.services";
import "../assets/style/doctor-info.css"; 

type DataParams = {
    doctorId: string;
};

interface Schedule {
    // Các thuộc tính của Schedule
    date: string;
    time: string;
    // Thêm các thuộc tính khác nếu cần
}

// Interface để đại diện cho dữ liệu bác sĩ
interface DoctorInfo {
    id: number;
    doctorId: number;
    clinicId: number;
    specializationId: number;
    infoHtml?: string;
    keyInfo?: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    gender: string;
}

const DoctorInfo = function () {
    const { doctorId } = useParams<DataParams>();
    const [scheduleData, setScheduleData] = useState([]);
    const [schedules, setSchedules] = useState<Schedule[] | null>(null);
    const [selectedDate, setSelectedDate] = useState("");

    const [doctorInfo, setDoctorInfo] = useState<DoctorInfo | null>(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        async function loadDoctor() {
            let item = await getDoctor({
                id: 2,
            });
            
            setDoctorInfo(item);
            console.log("doctorInfo", item);
        }

        loadDoctor();
    }, []);

    const handleDateChange = async (date: string) => {
        setSelectedDate(date);  
        try {
            const schedule = await getSchedules({ doctorId: 2, date }); 
            setSchedules(schedule);  
        } catch (error: any) {
            console.error('Error fetching schedules:', error);
        }
    };

    const getNext7Days = () => {
        const today = new Date();
        const days = [];
        for (let i = 1; i <= 7; i++) {
            const nextDay = new Date(today);
            nextDay.setDate(today.getDate() + i);

            const dayName = nextDay.toLocaleDateString('vi-VN', { weekday: 'long' });
            const dayNumber = nextDay.getDate();
            const month = nextDay.getMonth() + 1; // Tháng bắt đầu từ 0 nên phải cộng thêm 1
            const year = nextDay.getFullYear();

            const text = `${dayName.charAt(0).toUpperCase() + dayName.slice(1)} - ${dayNumber}/${month}`;
            const value = nextDay.toDateString();

            days.push({ text, value });
        }
        return days;
    };

   
    const days = getNext7Days();

    return (
        <div className="container my-5">
            {/* Breadcrumb */}
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <a href="#">Bác sĩ chuyên khoa</a>
                    </li>
                    <li className="breadcrumb-item">
                        <a href="#">spec ...</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                        Tiến sĩ, Bác sĩ {doctorInfo?.name}
                    </li>
                </ol>
            </nav>
            {/* Doctor Info */}
            <div className="row">
                <div className="col-md-2">
                    <img
                        src="\images\doctors\bs_DotHue.jpg"
                        alt="Doctor Image"
                        className="img-fluid rounded-circle"
                    />
                </div>
                <div className="col-md-10">
                    <h3>Tiến sĩ, Bác sĩ {doctorInfo?.name}</h3>
                    <p>
                        <span dangerouslySetInnerHTML={{ __html: doctorInfo?.keyInfo || ''  }} />
                    </p>
                    <ul>
                        <li>
                            Nguyên Trưởng khoa Nội tiết - Đái tháo đường, Bệnh viện Bạch Mai
                        </li>
                        <li>Phó chủ tịch Hội Nội tiết và Đái tháo đường Việt Nam</li>
                    </ul>
                    <p>
                        <i className="bi bi-geo-alt-fill" /> Hà Nội
                    </p>
                    <div className="mt-3">
                        <button className="btn btn-primary">Thích</button>
                        <button className="btn btn-secondary">Chia sẻ</button>
                    </div>
                </div>
            </div>
            {/* Appointment Schedule */}
            <div className="my-4">
                <h4>LỊCH KHÁM</h4>
                <div className="mb-2">
                    <select
                        className="form-select mb-3"
                        value={selectedDate} 
                        onChange={(e) => handleDateChange(e.target.value)}
                    >
                        {days.map((day, index) => (
                            <option key={index} value={day.value}>
                                {day.text}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="d-flex justify-content-start">
                    {schedules?.map((schedule: Schedule, index: number) => (
                        <button key={index} className="btn btn-outline-primary mx-1">
                            {schedule.time}
                        </button>
                    ))}
                </div>
            </div>
            {/* Clinic Info */}
            <div className="my-4">
                <h4>Địa chỉ khám</h4>
                <p>
                    Bệnh viện Đa khoa Bảo Sơn 2<br />
                    52 Nguyễn Chí Thanh, Đống Đa, Hà Nội
                </p>
                <p>
                    <strong>Giá khám:</strong> 300.000đ <a href="#">Xem chi tiết</a>
                </p>
                <p>
                    <a href="#">Loại bảo hiểm áp dụng. Xem chi tiết</a>
                </p>
            </div>
            {/* Treatment Information */}
            <div className="my-4">
                <h4>Khám và điều trị</h4>
                <p>Khám và điều trị bệnh lý đái tháo đường:</p>
                <ul>
                    <li>Tăng huyết áp</li>
                    <li>Rối loạn mỡ máu</li>
                    <li>Biến chứng tim mạch</li>
                    <li>Biến chứng não</li>
                    <li>Biến chứng nhiễm trùng</li>
                </ul>
            </div>
        </div>


    );

}
export default DoctorInfo;