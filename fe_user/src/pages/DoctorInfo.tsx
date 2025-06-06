import { Component } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
// import "../assets/css/style_category.css";
import { Link, useParams } from "react-router-dom";
import { getSchedules, getScheduleById, getDoctor } from "../services/booking.services";
import { getCommentsByDoctorId, postComment } from "../services/user.services"; // Assuming user.services handles comments
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
interface ClinicBranch {
    clinicName: string;
    clinicAddress: string;
    // Add other properties if needed
}

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
    titleName: string;
    clinicBranch?: ClinicBranch;
    bookingPrice: number;
}

const DoctorInfo = function () {
    const { doctorId } = useParams<DataParams>();
    const [scheduleData, setScheduleData] = useState([]);
    const [schedules, setSchedules] = useState<Schedule[] | null>(null);
    const [selectedDate, setSelectedDate] = useState("");

interface Comment {
    id: number;
    userId: number;
    doctorId: number;
    content: string;
    createdDate: string;
    userName: string;
    userEmail: string;
    userAvatar: string;
}

    const [doctorInfo, setDoctorInfo] = useState<DoctorInfo | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loadingComments, setLoadingComments] = useState(true);
    const [errorComments, setErrorComments] = useState<string | null>(null);
    const [newCommentContent, setNewCommentContent] = useState("");
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

    const loadComments = async () => {
        if (!doctorId) return;
        setLoadingComments(true);
        setErrorComments(null);
        try {
            const fetchedComments = await getCommentsByDoctorId(parseInt(doctorId));
            setComments(fetchedComments);
        } catch (error) {
            console.error("Error fetching comments:", error);
            setErrorComments("Failed to load comments.");
        } finally {
            setLoadingComments(false);
        }
    };

    useEffect(() => {
        loadComments();
    }, [doctorId]);

    const handlePostComment = async () => {
        if (!newCommentContent.trim()) {
            alert("Comment content cannot be empty.");
            return;
        }

        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = user.id;

        if (!userId) {
            alert("You need to be logged in to post a comment.");
            return;
        }

        if (!doctorId) {
            alert("Doctor ID is not available.");
            return;
        }

        try {
            await postComment({
                userId: userId,
                doctorId: parseInt(doctorId),
                content: newCommentContent,
                status: true,
            });
            setNewCommentContent("");
            loadComments(); // Refresh comments after posting
        } catch (error) {
            console.error("Error posting comment:", error);
            alert("Failed to post comment.");
        }
    };

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
                    <h3>{doctorInfo?.titleName} {doctorInfo?.name}</h3>
                    {/* <p>
                        <span dangerouslySetInnerHTML={{ __html: doctorInfo?.keyInfo || ''  }} />
                    </p> */}
                    <ul>
                        <li>
                            {doctorInfo?.keyInfo}
                        </li>
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
                <h4 style={{ color: "green" }}>
                    Giá khám: {doctorInfo?.bookingPrice} VNĐ
                </h4>
                <br />

                <h4>Địa chỉ khám</h4>
                <p>
                    {doctorInfo?.clinicBranch?.clinicName}<br />
                    {doctorInfo?.clinicBranch?.clinicAddress}
                </p>
                
                
            </div>
            {/* Treatment Information */}

            <div dangerouslySetInnerHTML={{ __html: doctorInfo?.infoHtml || '' }} />


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

            {/* Comment Section */}
            <div className="my-4">
                <h4>Bình luận</h4>

                {/* Comment Form */}
                <div className="row justify-content-start">
                    <div className="col-18 col-md-8 col-lg-8">
                        <form className="comment-card card-sm">
                            <div className="card-body row no-gutters align-items-center">
                                <div className="col-auto">
                                    <i className="fas fa-search h4 text-body" />
                                </div>
                                {/*end of col*/}
                                <div className="col">
                                    <input
                                        className="form-control form-control-lg border-0 form-control-borderless"
                                        type="search"
                                        placeholder="Thêm bình luận ..."
                                        value={newCommentContent}
                                        onChange={(e) => setNewCommentContent(e.target.value)}
                                        style={{ fontSize: "16px" }}
                                    />
                                </div>
                                {/*end of col*/}
                                <div className="col-auto">
                                    <button className="btn btn-lg btn-success" onClick={handlePostComment} type="submit" style={{ fontSize: "16px" }}>
                                        Đăng bình luận
                                    </button>
                                </div>
                                {/*end of col*/}
                            </div>
                        </form>
                    </div>
                    {/*end of col*/}
                </div>

                {loadingComments && <p>Loading comments...</p>}
                {errorComments && <p className="text-danger">{errorComments}</p>}
                {!loadingComments && !errorComments && comments.length === 0 && (
                    <p>No comments yet.</p>
                )}
                {!loadingComments && !errorComments && comments.length > 0 && (
                    <div className="row d-flex justify-content-start">
                        <div className="col-md-11 col-lg-10 col-xl-9">
                            {comments.map((comment) => (
                                <div key={comment.id} className="d-flex flex-start">
                                    <img
                                        className="rounded-circle shadow-1-strong me-3"
                                        src={`https://localhost:44393${comment.userAvatar}`}
                                        alt="avatar"
                                        width={45}
                                        height={45}
                                    />
                                    <div className="comment-card w-100">
                                        <div className="card-body p-4">
                                            <div className="">
                                                <h6>{comment.userName}</h6>
                                                <p className="small">{new Date(comment.createdDate).toLocaleDateString()}</p>
                                                <p>{comment.content}</p>
                                                
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

        </div>


    );

}
export default DoctorInfo;
