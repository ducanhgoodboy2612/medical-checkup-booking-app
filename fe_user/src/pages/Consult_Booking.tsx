import { Component } from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getPaged_Doctor, getPaged_Spec, getAllTitle } from "../services/home.service";
import { getSchedules, getScheduleById, getDoctor, booking } from "../services/booking.services";
import { toast, ToastContainer } from 'react-toastify';


import "../assets/style/doctor-info.css";

type DataParams = {
    scheduleId: string;
};

interface Schedule {
    id: number;
    date: string;
    time: string;
    doctorId: number;
    clinicName: string;
    clinicAdd: string;
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
    bookingPrice: number;
    titleId: number;
}

type CartItem = {
    doctorId: string;
    doctorName: string;
    title: string;
    date: string;
    time: string;
    scheduleId: number;
    bookingPrice: number;
};

const Consult_Booking = function () {
    const { scheduleId } = useParams<DataParams>();
    const [scheduleData, setScheduleData] = useState([]);
    const [schedule, setSchedule] = useState<Schedule | null>(null);
    const [patients, setPatients] = useState<any[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [curUser, setCurUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    //const { setValue } = useForm();
    const [inputMode, setInputMode] = useState("manual"); // 'manual' hoặc 'auto'
    const navigate = useNavigate();

    const [specialties, setSpecialties] = useState([]);
    const [selectedSpecialty, setSelectedSpecialty] = useState<number | null>(null);
    const [doctors, setDoctors] = useState<DoctorInfo[]>([]);
    const [keyword, setKeyword] = useState(''); // For doctor name search
    const [listTitle, setListTitle] = useState<any[]>([]); // To store titles
    const [selectedTitleId, setSelectedTitleId] = useState<number>(0); // For selected title
    const [schedules, setSchedules] = useState<{ [key: number]: Schedule[] }>({});
    const [selectedDates, setSelectedDates] = useState<Record<number, string>>({});


    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        const savedCart = localStorage.getItem('multi-spec-doctors');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // ...

    const handleInputModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const mode = event.target.value;
        setInputMode(mode);

        if (mode === "auto") {
            const userFromStorage = localStorage.getItem("user");
            if (userFromStorage) {
                const user = JSON.parse(userFromStorage);
                setValue("fullName", user.fullName || user.name || "");
                setValue("phoneNumber", user.phone || "");
                setValue("gender", user.gender || "");
                setValue("dob", user.year || "");
                setValue("email", user.email || "");
                setValue("address", user.address || "");
                setValue("reason", ""); // Có thể để trống
            } else {
                toast.warning("Vui lòng đăng nhập để sử dụng tính năng này");
                navigate("/login");
            }
        }
    };

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
        // Get current user from localStorage or your auth service
        const userFromStorage = localStorage.getItem('user');
        if (userFromStorage) {
            setCurUser(JSON.parse(userFromStorage));
        }
        const loadScheduleData = async () => {
            setIsLoading(true);

            try {
                if (scheduleId) {
                    // If scheduleId is in params, fetch from API
                    const fetchedSchedule = await getScheduleById(scheduleId);
                    setSchedule(fetchedSchedule);
                    if (fetchedSchedule?.doctorId) {
                        const fetchedDoctor = await getDoctor({ id: fetchedSchedule.doctorId });
                        setDoctorInfo(fetchedDoctor);
                    }
                }
                console.log("schedule", schedule)
            } catch (error) {
                toast.error('Đã xảy ra lỗi khi tải thông tin lịch khám.');
            } finally {
                setIsLoading(false);
            }
        };

        loadScheduleData();
    }, [scheduleId]);

    useEffect(() => {
        const fetchSpecialties = async () => {
            try {
                const response = await getPaged_Spec({ page: 1, pageSize: 100, keyword: '' });
                const fetchedSpecialties = response || [];
                setSpecialties(fetchedSpecialties);
                console.log('Specialties:', fetchedSpecialties);
                if (fetchedSpecialties.length > 0) {
                    setSelectedSpecialty(fetchedSpecialties[0].id); // Automatically select the first specialty
                }
            } catch (error) {
                console.error('Error fetching specialties:', error);
            }
        };

        const loadTitles = async () => {
            try {
                const titles = await getAllTitle();
                setListTitle([{ id: 0, name: "Tất cả chức danh" }, ...titles]); // Add an option for all titles
            } catch (error) {
                console.error('Error fetching titles:', error);
            }
        };

        fetchSpecialties();
        loadTitles();
    }, []);

    const fetchDoctors = async () => {
        setDoctors([]);
        if (selectedSpecialty) {
            try {
                const params: any = {
                    page: 1,
                    pageSize: 10,
                    SpecialtyId: selectedSpecialty,
                    name: keyword, // Add keyword for name search
                };
                if (selectedTitleId !== 0) {
                    params.titleId = selectedTitleId; // Add titleId if selected
                }
                const items = await getPaged_Doctor(params);
                setDoctors(items.data || []); // Ensure items.data is not undefined


                const days = getNext7Days();

                if (items.data) {
                    items.data.forEach((doctor: any) => {
                        let selectedDate = selectedDates[doctor.doctorId] || days[0].value; // Chọn ngày đầu tiên nếu chưa có ngày nào được chọn
                        handleDateChange(doctor.doctorId, selectedDate); // Gọi handleDateChange để cập nhật ngày đã chọn
                    });
                }
            } catch (error) {
                console.error('Error fetching doctors:', error);
                setDoctors([]); // Clear data on error
            }
        } else {
            setDoctors([]); // Clear data if no specialty is selected
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, [selectedSpecialty, keyword, selectedTitleId]);

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

    const onSubmit = async (data: any) => {
        let bookingRequests: any[] = [];

        if (scheduleId) {
            const fetchedSchedule = await getScheduleById(scheduleId);
            if (fetchedSchedule) {
                bookingRequests.push({
                    statusId: 3,
                    name: data.fullName,
                    phone: data.phoneNumber,
                    gender: data.gender,
                    year: data.dob,
                    Address: data.address,
                    email: data.email,
                    description: data.reason,
                    dateBooking: fetchedSchedule.date,
                    timeBooking: fetchedSchedule.time,
                    emailBooking: curUser?.email,
                    doctorId: fetchedSchedule.doctorId,
                });
            }
        } else {
            const cartFromStorage = localStorage.getItem('multi-spec-doctors');
            if (!cartFromStorage) {
                toast.error('Không tìm thấy lịch khám đã chọn.');
                return;
            }

            const cartItems: any[] = JSON.parse(cartFromStorage);
            console.log("cartItems", cartItems)

            bookingRequests = cartItems.map(item => {
                return {
                    statusId: 3,
                    name: data.fullName,
                    phone: data.phoneNumber,
                    gender: data.gender,
                    year: data.dob,
                    Address: data.address,
                    email: data.email,
                    description: data.reason,
                    dateBooking: item.date,
                    timeBooking: item.time,
                    emailBooking: curUser?.email,
                    doctorId: item.doctorId,
                };
            });
        }


        try {
            for (const bookingData of bookingRequests) {
                await booking(bookingData);
            }

            toast.success("Đặt lịch thành công", {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            if (!scheduleId) {
                localStorage.removeItem('multi-spec-doctors');
                setCartItems([]);
            }

        } catch (error) {
            toast.error('Đã xảy ra lỗi. Vui lòng thử lại.');
        }

    };

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedPhone = event.target.value;
        const patient = patients.find(p => p.phone === selectedPhone);
        //setSelectedPatient(patient);
        setValue('fullName', "nammo");
        //alert(JSON.stringify(patient))

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

    const handleDateChange = (doctorId: number, date: string) => {
        setSelectedDates(prevDates => ({
            ...prevDates,
            [doctorId]: date,
        }));

        loadSchedulesForDoctor(doctorId, date);
        //console.log("... ", schedules);
    };

    const loadSchedulesForDoctor = async (doctorId: number, date: string) => {
        try {
            const schedule = await getSchedules({ doctorId, date });
            console.log(schedule);
            if (schedule != null) {
                setSchedules(prevSchedules => ({
                    ...prevSchedules,
                    [doctorId]: schedule.length > 0 ? schedule : null,
                }));
            }
            else {
                setSchedules(prevSchedules => ({
                    ...prevSchedules,
                    [doctorId]: schedule,
                }));
            }

        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                return { [doctorId]: null };
            }
            console.error('Error fetching schedules:', error);
            return null;
            console.error('Error fetching schedules:', error);
        }
    };

    const days = getNext7Days();

    const titles: { [key: number]: string } = {
        1: "",
        2: "Thạc sĩ",
        3: "Phó Tiến sĩ",
        4: "Tiến sĩ",
        5: "Giáo sư",
        6: "Phó Giáo sư",
        7: "Phó Giáo sư, Tiến sĩ"
    };

    const handleAddToCart = (doctor: DoctorInfo, schedule: Schedule) => {
        const cartItem: CartItem = {
            doctorId: doctor.doctorId.toString(),
            doctorName: doctor.name,
            title: titles[doctor.titleId],
            date: schedule.date,
            time: schedule.time,
            scheduleId: schedule.id,
            bookingPrice: doctor.bookingPrice
        };

        // Check if this doctor already exists in cart
        let updatedCart: CartItem[] = [];

        const existingItemIndex = cartItems.findIndex(item => item.doctorId === cartItem.doctorId);

        if (existingItemIndex >= 0) {
            updatedCart = [...cartItems];
            updatedCart[existingItemIndex] = cartItem;
        } else {
            updatedCart = [...cartItems, cartItem];
        }
        console.log('edit cart:', updatedCart);
        setCartItems(updatedCart);
        localStorage.setItem('multi-spec-doctors', JSON.stringify(updatedCart));
    };

    const removeFromCart = (doctorId: string) => {
        const updatedCart = cartItems.filter(item => item.doctorId !== doctorId);
        setCartItems(updatedCart);
        localStorage.setItem('multi-spec-doctors', JSON.stringify(updatedCart));
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
                                    style={{ width: 120 }}
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
                        <div className="row  px-5" style={{ margin: '0px auto', backgroundColor: "white" }}>

                            <div className="booking-info col-lg-8 col-md-8 d-flex flex-column align-items-center" >


                                {/* Booking Form */}
                                <h4>Thông tin đặt khám</h4>

                                <div className="mb-3">

                                    <div>
                                        <input
                                            type="radio"
                                            name="inputMode"
                                            value="manual"
                                            checked={inputMode === "manual"}
                                            onChange={handleInputModeChange}
                                        /> Nhập thông tin thủ công
                                    </div>
                                    <div>
                                        <input
                                            type="radio"
                                            name="inputMode"
                                            value="auto"
                                            checked={inputMode === "auto"}
                                            onChange={handleInputModeChange}
                                        /> Tự động điền bằng thông tin đăng nhập
                                    </div>
                                </div>
                                <form onSubmit={handleSubmit(onSubmit)} method="post">
                                    <div className="mb-3">
                                        <label htmlFor="patientSelect" className="form-label">
                                            Chọn chuyên khoa:
                                        </label>
                                        
                                        <select
                                            className="form-select me-2"
                                            value={selectedSpecialty ?? ""}
                                            onChange={(e) => setSelectedSpecialty(Number(e.target.value))}
                                            style={{ width: '200px' }}
                                        >
                                            {specialties.map((opt: any) => (
                                                <option key={opt.id} value={opt.id}>
                                                    {opt.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
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
export default Consult_Booking;
