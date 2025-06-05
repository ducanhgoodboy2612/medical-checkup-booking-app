import { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { Link, useParams } from "react-router-dom";
import ReactPaginate from "react-paginate";

import { getPaged_Doctor, getLocation, getAllTitle } from "../services/home.service";
import { getSchedules } from "../services/booking.services";
import "../assets/style/bootstrap.min.css";
import "../assets/style/doctor-info.css"; 
import { addToCart } from "../utils/doctor_info_cart";

type DataParams = {
    id: string;

};

interface Schedule {
    clinicBranchName: string;
    id: number
    date: string;
    time: string;
    clinicName: string;
    clinicAdd: string;
    sumBooking: number;
    maxBooking: number;
}

interface Doctor {
    doctorId: number;
}
const Doctor = function () {
    const { id } = useParams<DataParams>();
    const [data, setDatas] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const location = useLocation();
    const [schedules, setSchedules] = useState<{ [key: number]: Schedule[] }>({});
    const [selectedDates, setSelectedDates] = useState<Record<number, string>>({});

    const [listProvince, setListProvince] = useState([]);
    const [listTitle, setListTitle] = useState([]);
    const [selecteProvince, setSelecteProvince] = useState('');
    const [selecteTitle, setSelecteTitle] = useState(0); 
    const [keyword, setKeyword] = useState('');
    const [priceSort, setPriceSort] = useState(0);
    const navigate = useNavigate();

    const changeInputValue = (e: any) => {
        setPageSize(+e.target.value);
    };
    const handlePageClick = (event: any) => {
        setPage(event.selected + 1);
    };

    async function loadLocation() {
        let items = await getLocation({
            keyword: ""
        });
        setListProvince(items);
    }

    async function loadTitle() {
        let items = await getAllTitle();
        setListTitle(items);
        console.log("tit  ", items)
    }

    async function handleSearch() {
        navigate(`/doctors-specialty/${id}?name=${keyword}`);

        console.log("key  ", keyword)
        console.log("tit  ", selecteTitle)
        console.log("loc  ", selecteProvince)
        let items = await getPaged_Doctor({
            page: page,
            pageSize: pageSize,
            SpecialtyId: id,
            name: keyword,
            titleId: selecteTitle,
            address: selecteProvince,
            priceSorted: priceSort
        });
        setDatas(items.data);
        setPageCount(Math.ceil(items.totalItems / pageSize));
        const days = getNext7Days();

        items.data.forEach((doctor: Doctor) => {
            let selectedDate = selectedDates[doctor.doctorId] || days[0].value; // Chọn ngày đầu tiên nếu chưa có ngày nào được chọn
            handleDateChange(doctor.doctorId, selectedDate); // Gọi handleDateChange để cập nhật ngày đã chọn
        });


        // console.log("key  ", keyword)
        // console.log("tit  ", selecteTitle)
        // console.log("loc  ", selecteProvince)
        // let items = await getPaged_Doctor({
        //     page: page,
        //     pageSize: pageSize,
        //     specializationId: id,
        //     name: keyword,
        //     titleId: selecteTitle,
        //     address: selecteProvince,
        //     priceSorted: priceSort
        // });
        // setDatas(items.data);
        // setPageCount(Math.ceil(items.totalItems / pageSize));
        // const days = getNext7Days();

        // items.data.forEach((doctor: Doctor) => {
        //     let selectedDate = selectedDates[doctor.doctorId] || days[0].value; // Chọn ngày đầu tiên nếu chưa có ngày nào được chọn
        //     handleDateChange(doctor.doctorId, selectedDate); // Gọi handleDateChange để cập nhật ngày đã chọn
        // });
    }

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const keywordParam = searchParams.get('name');
        if (keywordParam) {
            setKeyword(keywordParam);
        }
    }, [location.search]);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const keywordParam = searchParams.get('name');
        async function loadDoctor() {
            setDatas([]);
            let items = await getPaged_Doctor({
                page: page,
                pageSize: pageSize,
                SpecialtyId: id,
                name: keywordParam,
                
            });
            setDatas(items.data);
            console.log("data  ", items.data)

            setPageCount(Math.ceil(items.totalItems / pageSize));
            const days = getNext7Days(); 

            items.data.forEach((doctor: Doctor) => {
                let selectedDate = selectedDates[doctor.doctorId] || days[0].value; // Chọn ngày đầu tiên nếu chưa có ngày nào được chọn
                handleDateChange(doctor.doctorId, selectedDate); // Gọi handleDateChange để cập nhật ngày đã chọn
            });
            
        }

       
        loadDoctor();
        loadTitle();
        // alert("data  " + JSON.stringify(data))
    }, [page, pageSize]);
    
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

            console.log("maxBooking", schedule.maxBooking);
            console.log("sumBooking", schedule.sumBooking);
            if(schedule != null){
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

    return (
        
        <div className="container mt-5 py-5 " style={{ minWidth: 1300 }} >

            
            <div className="row">
                <div className="col-md-10 p-4 mb-3" style={{ margin: '0px auto', backgroundColor: '#FDFAD9', borderRadius: 10}}>
                    <div className="row g-2">
                        <div className="col-md-2 d-flex flex-column align-items-center">
                            <img src="/images/spec/tim-mach.png" alt="description" className="img-fluid mb-2" />
                            <h4 className="text-center">Cơ Xương Khớp</h4>
                        </div>
                        <div className="col-md-10 px-5">
                            <h5>Bác sĩ Cơ Xương Khớp giỏi </h5>
                            <p>Danh sách các bác sĩ uy tín đầu ngành Cơ Xương Khớp tại Việt Nam:</p>
                            <ul className="list-group list-group-flush">
                                <li>
                                    Các chuyên gia có quá trình đào tạo bài bản, nhiều kinh nghiệm
                                </li>
                                <li>
                                    Các giáo sư, phó giáo sư đang trực tiếp nghiên cứu và giảng dạy tại Đại học Y khoa Hà Nội
                                </li>
                                <li>
                                    Các bác sĩ đã, đang công tác tại các bệnh viện hàng đầu Khoa Cơ Xương Khớp
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>

                <div className="row col-md-10 mt-4" style={{margin: '0px auto'}}>

                    {/* <div className="col-md-3 text-end">
                       

                    </div> */}

                    <div className="col-md-8 text-end" style={{ marginLeft: 'auto' }}>

                        <div className="select-wrapper" >
                            
                            <select
                                className="form-control form-select"
                                value={priceSort}
                                onChange={(e) => setPriceSort(Number(e.target.value))}
                            >
                                <option value="" disabled>-- SX theo giá khám --</option> {/* Option mặc định */}
                                <option value="0" >Không</option>
                                <option value="1" >Tăng dần</option>
                                <option value="2" >Giảm dần</option> 
                            </select>
                        </div>

                        <div className="select-wrapper" style={{ marginLeft: '7px' }}>
                            <i className="fas fa-user"></i> {/* Icon user */}

                            <select
                                className="form-control form-select"
                                value={selecteTitle}
                                onChange={(e) => setSelecteTitle(Number(e.target.value))}
                            >
                                {listTitle.map((x: any) => (
                                    <option key={x.id} value={x.id}>
                                        {x.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* <div className="select-wrapper" style={{marginLeft: '7px'}}>
                            <i className="fas fa-map-marker-alt"></i> 
                            <select
                                className="form-control form-select"
                                value={selecteProvince}
                                onChange={(e) => setSelecteProvince(e.target.value)}
                            >
                                <option value="">Cả nước</option> 
                                {listProvince.map((provinceItem: any) => (
                                    <option key={provinceItem.id} value={provinceItem.name}>
                                        {provinceItem.name}
                                    </option>
                                ))}
                            </select>
                        </div> */}

                    </div>
                   
                    {/* <div className="col-md-2 text-end">
                        <div className="select-wrapper">
                            <i className="fas fa-map-marker-alt"></i> 
                            <select
                                className="form-control form-select"
                                value={selecteProvince}
                                onChange={(e) => setSelecteProvince(e.target.value)}
                            >
                                <option value="">Cả nước</option> 
                                {listProvince.map((provinceItem: any) => (
                                    <option key={provinceItem.id} value={provinceItem.name}>
                                        {provinceItem.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                    </div> */}
                    <div className="col-md-4 d-flex align-items-center" style={{marginLeft: 'auto'}}>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Tìm tên bác sĩ"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearch();
                                }
                            }}
                        />

                        <button
                            className="btn btn-primary" 
                            style={{ marginLeft: '7px' }}
                            onClick={handleSearch} 
                        >
                            <i className="fas fa-search"></i> {/* Icon Search */}
                        </button>
                    </div>
                </div>

                {/* <div className="col-md-10 d-flex flex-column align-items-center"> */}
                <div className="row g-1" >
                        {data.map((x: any, index: number) => (
                            <div className="col-md-10 mb-4 px-3" key={x.id} 
                                style={{
                                    margin: '10px auto',
                                    backgroundColor: index % 2 === 0 ? '#F5F5F5' : '#ffffff',
                                    borderRadius: 10 
                                }}>
                                <div className="doctor-card">
                                    <div className="row g-0">
                                        <div className="col-md-1 text-center">
                                            <img
                                                // src={`images/${x.image}`}
                                                src={`https://localhost:44393${x.avatar}`}
                                                className="img-fluid rounded-circle"
                                                alt="Doctor Image"
                                            />
                                            
                                            <Link to={"/doctor-info/" + x.doctorId}>Xem thêm</Link>
                                        </div>
                                        <div className="col-md-5" style={{ paddingLeft: 20 }}>
                                            <div className="card-body">
                                                <h5 className="card-title">{titles[x.titleId]} Bác sĩ {x.name}</h5>
                                                <p className="card-text">
                                                    <span dangerouslySetInnerHTML={{ __html: x.keyInfo }} /><br />
                                                    {/* <i className="bi bi-geo-alt" /> {x.address} */}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="col-md-6 p-3">
                                            <select
                                                className="form-select mb-3"
                                                value={selectedDates[x.doctorId] || ''} // Giá trị đã chọn cho doctorId
                                                onChange={(e) => handleDateChange(x.doctorId, e.target.value)} // Gọi hàm handleDateChange khi thay đổi
                                            >
                                                {days.map((day, index) => (
                                                    <option key={index} value={day.value}>
                                                        {day.text}
                                                    </option>
                                                ))}
                                            </select>

                                            <div className="row g-2">
                                                {schedules[x.doctorId]?.map((schedule: Schedule, index: number) => (
                                                    <div className="col-3" key={schedule.id}>
                                                        {schedule.sumBooking >= schedule.maxBooking ? (
                                                            <button
                                                                className="btn btn-outline-success w-100"
                                                                style={{fontSize: 14}}
                                                                disabled={true}
                                                                title="This schedule is full"
                                                            >
                                                                {schedule.time}
                                                            </button>
                                                        ) : (
                                                            <Link to={"/booking/" + schedule.id}>
                                                                <button
                                                                    className="btn btn-outline-success w-100"
                                                                    onClick={() => addToCart(x, 1)}
                                                                    style={{fontSize: 14}}
                                                                >
                                                                    {schedule.time}
                                                                </button>
                                                            </Link>
                                                        )}
                                                    </div>
                                                ))}
                                                
                                                {!schedules[x.doctorId] && <p>Không có lịch khám.</p>}
                                                <div className="col-md-12 p-3 doctor-add">

                                                    <div className="col-12">
                                                        <p>
                                                            <strong style={{ color: '#5BC0AB' }}>ĐỊA CHỈ KHÁM:</strong>
                                                            <br />
                                                            {x.clinicBranchName} - {x.clinicBranchAddress}
                                                        </p>
                                                    </div>
                                                   
                                                    <div className="d-flex gap-3">
                                                        <button className="px-3 py-2 d-flex align-items-center" style={{ border: '0px', backgroundColor: '#4abce2' }}>
                                                            <p className="booking-price mb-0">
                                                                GIÁ KHÁM: {x.bookingPrice}.000đ
                                                            </p>
                                                        </button>

                                                        {x.consultingPrice && x.consultingPrice > 0 && (
                                                            <button className="px-3 py-2 d-flex align-items-center" style={{ border: '0px', backgroundColor: '#84AE92' }}>
                                                                <p className="booking-price mb-0">
                                                                    GIÁ TƯ VẤN: {x.consultingPrice}.000đ
                                                                </p>
                                                            </button>
                                                        )}
                                                    </div>

                                                   
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    {/* </div> */}
                </div>
            </div>
            

            <div className="page">
                <select
                    name="pageSize"
                    onChange={(e) => changeInputValue(e)}
                    value={pageSize}
                    style={{height: '30px'}}
                >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                </select>
                <ReactPaginate
                    breakLabel="..."
                    nextLabel=">>"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={pageCount}
                    previousLabel="<<"
                    renderOnZeroPageCount={null}
                />
            </div>
        </div>

    );

}
export default Doctor;
