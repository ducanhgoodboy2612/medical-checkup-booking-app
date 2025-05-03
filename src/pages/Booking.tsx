import { Component } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
// import "../assets/css/style_category.css";
import { Link, useParams } from "react-router-dom";
import { getPaged_Doctor } from "../services/home.service";
import { getSchedules, getScheduleById, getDoctor, booking } from "../services/booking.services";
import { toast, ToastContainer } from 'react-toastify';


import "../assets/style/doctor-info.css"; 

type DataParams = {
    scheduleId: string;
};

interface Schedule {
    date: string;
    time: string;
    doctorId: number;
}

interface DoctorInfo {
    id: number;
    doctorId: number;
    clinicId: number;
    specializationId: number;
    infoHtml?: string;
    keyInfo?: string;
    name: string;
    userEmail: string;
    userPhone: string;
    userAvatar: string;
    userGender: string;
    avatar: string;
}

const Booking = function () {
    const { scheduleId } = useParams<DataParams>();
    const [scheduleData, setScheduleData] = useState([]);
    const [schedule, setSchedule] = useState<Schedule | null>(null);
    const [patients, setPatients] = useState<any[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [curUser, setCurUser] = useState<any>(null);
    //const { setValue } = useForm();

    useEffect(() => {

        const storedPatients = JSON.parse(localStorage.getItem('patient_info') || '[]');
        setPatients(storedPatients);
    }, []);

    const [doctorInfo, setDoctorInfo] = useState<DoctorInfo | null>(null);
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        criteriaMode: "all",
    });

    useEffect(() => {
        const user = localStorage.getItem('user');
        const parsedUser = user ? JSON.parse(user) : null;
        setCurUser(parsedUser)
        async function loadDoctor() {
            let item = await getScheduleById({
                scheduleId: scheduleId,

            });

            let doctor = await getDoctor({
                id: item.doctorId,

            }); 
            setDoctorInfo(doctor)
            setSchedule(item);
            console.log("sche   ", item)
            console.log("doc   ", doctor)
        }


        loadDoctor();
    }, []);

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const daysOfWeek = [
            "Chủ Nhật",
            "Thứ 2",
            "Thứ 3",
            "Thứ 4",
            "Thứ 5",
            "Thứ 6",
            "Thứ 7",
        ];
        const dayOfWeek = daysOfWeek[date.getDay()];

        const formattedDate = new Intl.DateTimeFormat("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }).format(date);

        return `${dayOfWeek} - ${formattedDate}`;
    };

    // async function booking_appointment() {
    //     let res = await booking({
    //         data: obj
    //     });
    // }

    const onSubmit = async (data: any) => {
        let obj: any = {};
        obj.statusId = 3;

        obj.name = data.fullName;
        obj.phone = data.phoneNumber;
        obj.gender = data.gender;
        obj.year = data.dob;
        obj.Address = data.address;
        obj.email = data.email;
        obj.description = data.reason;
        obj.dateBooking = schedule?.date;
        obj.timeBooking = schedule?.time;
        obj.emailBooking = curUser?.email;
        obj.doctorId = schedule?.doctorId;

        try {
            let res = await booking(obj);
            toast.success("Đặt lịch thành công", {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } catch (error) {
            toast.error('Đã xảy ra lỗi. Vui lòng thử lại.');
        }
    }

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedPhone = event.target.value;
        const patient = patients.find(p => p.phone === selectedPhone);
        //setSelectedPatient(patient);
        setValue('fullName', "nammo");
        //alert(JSON.stringify(patient))

        // Nếu tìm thấy bệnh nhân, fill dữ liệu vào form
        if (patient) {
            setValue('fullName', patient.name);
            setValue('phoneNumber', patient.phone);
            setValue('gender', patient.gender);
            setValue('dob', patient.year);
            setValue('email', patient.email);
            setValue('address', patient.Address);
            setValue('reason', patient.description);
        }
    };

    return (
        <div className="p-3" style={{ backgroundColor: '#F2F2F2' }}>
        <div className="container mt-5" >

            <div className="card-info mb-5 mt-3">
                <div className="card-body">
                    {/* Doctor Information */}
                    <div className="row">
                        <div className="col-md-2 text-center">
                            <img
                                src={`https://localhost:44384${doctorInfo?.avatar}`}
                                className="img-fluid rounded-circle"
                                alt="Doctor Image"
                                style={{width: 120}}
                            />
                        </div>
                        <div className="col-md-10">
                            {doctorInfo && (
                                <>
                                    <h3>{doctorInfo.name}</h3>
                                    <p>{schedule?.time} - {formatDate(schedule?.date || '')}</p>
                                </>
                            )}
                        </div>
                    </div>
                    <hr />
                    <div className="row  px-5" style={{margin: '0px auto', backgroundColor: "white"}}>
                        
                        <div className="booking-info col-lg-8 col-md-8 d-flex flex-column align-items-center" >


                                <div className="row my-3" style={{ width: '100%' }}>
                                <div className="col">
                                    <label htmlFor="patientSelect" className="form-label">Bệnh nhân đặt khám đa khoa:</label>
                                    <select id="patientSelect" className="form-select" onChange={handleSelectChange}>
                                        <option value="">-- Chọn bệnh nhân --</option>
                                        {patients.map((patient, index) => (
                                            <option key={index} value={patient.phone}>
                                                {patient.name} - {patient.phone}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            {/* Booking Form */}
                            <form  onSubmit={handleSubmit(onSubmit)} method="post">
                                
                                <div className="mb-3">
                                    <label htmlFor="fullName">
                                        Họ và tên: <span>*</span>
                                        {errors.fullName && (
                                            <span style={{ color: 'red' }}>{(errors as any).fullName.message}</span>
                                        )}
                                    </label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        className="form-control"
                                        {...register('fullName', {
                                            required: 'Họ và tên là bắt buộc',
                                            minLength: {
                                                value: 3,
                                                message: 'Tên phải dài ít nhất 3 ký tự',
                                            },
                                        })}
                                    />
                                </div>
                                <div className="mb-3">
                                        <label className="form-label">Giới tính<span>*</span>
                                            {errors.fullName && (
                                                <span style={{ color: 'red' }}>{(errors as any).fullName.message}</span>
                                            )}
                                            </label>
                                    <br />
                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            id="genderMale"
                                            value="male"
                                            {...register('gender', { required: 'Giới tính là bắt buộc' })}
                                        />
                                        <label className="form-check-label" htmlFor="genderMale">
                                            Nam
                                        </label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            id="genderFemale"
                                            value="female"
                                            {...register('gender', { required: 'Giới tính là bắt buộc' })}
                                        />
                                        <label className="form-check-label" htmlFor="genderFemale">
                                            Nữ
                                        </label>
                                    </div>
                                    {errors.gender && <span style={{ color: 'red' }}>{(errors as any).gender.message}</span>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="phoneNumber" className="form-label">
                                        Số điện thoại: <span>*</span>
                                        {errors.phoneNumber && (
                                            <span style={{ color: 'red' }}>{(errors as any).phoneNumber.message}</span>
                                        )}
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="phoneNumber"
                                        placeholder="Số điện thoại"
                                        {...register('phoneNumber', {
                                            required: 'Số điện thoại là bắt buộc',
                                            pattern: {
                                                value: /^[0-9]{10}$/,
                                                message: 'Số điện thoại không hợp lệ',
                                            },
                                        })}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">
                                        Địa chỉ email: 
                                        {errors.email && (
                                            <span style={{ color: 'red' }}>{(errors as any).email.message}</span>
                                        )}
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        placeholder="Email"
                                        defaultValue={curUser?.email || ''}
                                        {...register('email', { required: 'Địa chỉ email là bắt buộc' })}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="dob" className="form-label">
                                        Ngày sinh (bắt buộc): <span>*</span>
                                        {errors.dob && (
                                            <span style={{ color: 'red' }}>{(errors as any).dob.message}</span>
                                        )}
                                    </label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="dob"
                                        {...register('dob', { required: 'Năm sinh là bắt buộc' })}
                                    />
                                </div>
                                
                                {/* <div className="mb-3">
                                    <label htmlFor="city" className="form-label">
                                        Thành phố: <span>*</span>
                                        {errors.city && (
                                            <span style={{ color: 'red' }}>{(errors as any).city.message}</span>
                                        )}
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="city"
                                        placeholder="Thành phố"
                                        style={{ width: 400 }}
                                        {...register('city', { required: 'Thành phố là bắt buộc' })}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="district" className="form-label">
                                        Quận: <span>*</span>
                                        {errors.district && (
                                            <span style={{ color: 'red' }}>{(errors as any).district.message}</span>
                                        )}
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="district"
                                        placeholder="Quận"
                                        style={{ width: 400 }}
                                        {...register('district', { required: 'Quận là bắt buộc' })}
                                    />
                                </div> */}

                                <div className="mb-3">
                                    <label htmlFor="address" className="form-label">
                                        Địa chỉ: <span>*</span>
                                        {errors.address && (
                                            <span style={{ color: 'red' }}>{(errors as any).address.message}</span>
                                        )}
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="address"
                                        placeholder="Địa chỉ"
                                        style={{ width: 400 }}
                                        {...register('address', { required: 'Địa chỉ là bắt buộc' })}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="reason" className="form-label">
                                        Lý do khám: <span>*</span>
                                        {errors.reason && (
                                            <span style={{ color: 'red' }}>{(errors as any).reason.message}</span>
                                        )}
                                    </label>
                                    <textarea
                                        className="form-control"
                                        id="reason"
                                        rows={3}
                                        {...register('reason', { required: 'Lý do khám là bắt buộc' })}
                                    />
                                </div>
                                {/* Payment Section */}
                                
                                    <button type="submit" className="btn btn-primary">Đặt khám</button>
                            </form>
                        </div>
                        <div className="col-lg-4" style={{ paddingTop: '30px' }}>
                            <h4>Dịch vụ toàn diện</h4>
                                <div className="service-item">
                                    <img src="/images/causes/dv1.jpg" alt="icon" />
                                    <span className="service-title">Khám Chuyên khoa</span>
                                </div>
                                <div className="service-item">
                                <img src="/images/causes/dv2.jpg" alt="icon" />
                                    <span className="service-title">Khám tổng quát</span>
                                </div>
                                <div className="service-item">
                                <img src="/images/causes/dv3.jpg" alt="icon" />
                                    <span className="service-title">Sức khỏe tinh thần</span>
                                </div>
                                <div className="service-item">
                                <img src="/images/causes/dv4.jpg" alt="icon" />
                                    <span className="service-title">Gói Phẫu thuật</span>
                                </div>
                            <div className="service-item">
                                <img src="/images/causes/dv5.jpg" alt="icon" />
                                <span className="service-title">Bài Test sức khỏe</span>
                            </div>
                            <div>
                                <h5>Hình thức thanh toán</h5>
                                <div className="form-check">
                                    {/* <input
                                        className="form-check-input"
                                        type="radio"
                                        name="paymentMethod"
                                        id="paymentAfter"
                                    /> */}
                                    <label className="form-check-label" htmlFor="paymentAfter">
                                        Thanh toán sau tại cơ sở y tế
                                    </label>
                                </div>
                                {/* Pricing Summary */}
                                <div className="mt-4 p-3 bg-light border rounded">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <p>
                                                Giá khám:
                                            </p>
                                            <p>
                                                Phí đặt lịch:
                                            </p>
                                            <p>
                                                Tổng cộng:
                                            </p>
                                        </div>

                                        <div className="col-md-6" style={{ textAlign: 'right' }}>
                                            <p>
                                                <strong>300.000đ</strong>
                                            </p>
                                            <p>
                                                <strong>Miễn phí</strong>
                                            </p>
                                            <p>
                                                <strong>300.000đ</strong>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />


        </div>
        </div>                                
    );

}
export default Booking;