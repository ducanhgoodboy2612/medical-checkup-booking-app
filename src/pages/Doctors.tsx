import { Component } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
// import "../assets/css/style_category.css";
import { Link, useParams, useLocation } from "react-router-dom";
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
    id: number
    date: string;
    time: string;
    clinicName: string;
    clinicAdd: string;
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
        console.log("key  ", keyword)
        console.log("tit  ", selecteTitle)
        console.log("loc  ", selecteProvince)
        let items = await getPaged_Doctor({
            page: page,
            pageSize: pageSize,
            specializationId: id,
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
    }

    const getQueryParams = () => {
        const params = new URLSearchParams(location.search);
        return {
            name: params.get('name') || '',
        };
    };

    useEffect(() => {
        //loadLocation();
        loadTitle();
        const { name } = getQueryParams();
        setKeyword(name);
    }, []);

    useEffect(() => {
        async function loadDoctor() {
            setDatas([]);
            let items = await getPaged_Doctor({
                page: page,
                pageSize: pageSize,
                specializationId: id,
                name: keyword,
                
            });
            setDatas(items.data);
            // alert(JSON.stringify(items.data))

            setPageCount(Math.ceil(items.totalItems / pageSize));
            const days = getNext7Days(); 

            items.data.forEach((doctor: Doctor) => {
                let selectedDate = selectedDates[doctor.doctorId] || days[0].value; // Chọn ngày đầu tiên nếu chưa có ngày nào được chọn
                handleDateChange(doctor.doctorId, selectedDate); // Gọi handleDateChange để cập nhật ngày đã chọn
            });
            
            // const promises = data.map(async (doctor: Doctor) => {

            //     try {
            //         let selectedDate = selectedDates[doctor.doctorId] || ''; 
            //         const days = getNext7Days();
            //         if(selectedDate == ''){
            //             selectedDate = days[0].value;
            //             handleDateChange(doctor.doctorId, selectedDate);
            //         }
            //         const schedule = await getSchedules({ doctorId: doctor.doctorId, date: selectedDate });
            //         return { [doctor.doctorId]: schedule.length > 0 ? schedule : null };
            //     } catch (error: any) {
            //         if (error.response && error.response.status === 404) {
            //             return { [doctor.doctorId]: null };
            //         }
            //         console.error('Error fetching schedules:', error);
            //         return null;
            //     }
            // });

            // const schedulesList = await Promise.all(promises);
            // const mergedSchedules = Object.assign({}, ...schedulesList.filter(item => item !== null));
            // console.log(JSON.stringify(mergedSchedules));
            // setSchedules(mergedSchedules);
        }

       
        loadDoctor();
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
            console.log(schedule);
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
        // <section className="">
        //     <div className="container">
        //         <div className="row">
        //             {/* sidebar */}
        //             <div className="col-lg-3">
        //                 {/* Toggle button */}
        //                 <button
        //                     className="btn btn-outline-secondary mb-3 w-100 d-lg-none"
        //                     type="button"
        //                     data-mdb-toggle="collapse"
        //                     data-mdb-target="#navbarSupportedContent"
        //                     aria-controls="navbarSupportedContent"
        //                     aria-expanded="false"
        //                     aria-label="Toggle navigation"
        //                 >
        //                     <span>Show filter</span>
        //                 </button>
        //                 {/* Collapsible wrapper */}
        //                 <div
        //                     className="collapse card d-lg-block mb-5"
        //                     id="navbarSupportedContent"
        //                 >
        //                     <div className="accordion" id="accordionPanelsStayOpenExample">
        //                         <div className="accordion-item">
        //                             <h2 className="accordion-header" id="headingOne">
        //                                 <button
        //                                     className="accordion-button text-dark bg-light"
        //                                     type="button"
        //                                     data-mdb-toggle="collapse"
        //                                     data-mdb-target="#panelsStayOpen-collapseOne"
        //                                     aria-expanded="true"
        //                                     aria-controls="panelsStayOpen-collapseOne"
        //                                 >
        //                                     Related items
        //                                 </button>
        //                             </h2>
        //                             <div
        //                                 id="panelsStayOpen-collapseOne"
        //                                 className="accordion-collapse collapse show"
        //                                 aria-labelledby="headingOne"
        //                             >
        //                                 <div className="accordion-body">
        //                                     <ul className="list-unstyled">
        //                                         <li>
        //                                             <a href="#" className="text-dark">
        //                                                 Electronics{" "}
        //                                             </a>
        //                                         </li>
        //                                         <li>
        //                                             <a href="#" className="text-dark">
        //                                                 Home items{" "}
        //                                             </a>
        //                                         </li>
        //                                         <li>
        //                                             <a href="#" className="text-dark">
        //                                                 Books, Magazines{" "}
        //                                             </a>
        //                                         </li>
        //                                         <li>
        //                                             <a href="#" className="text-dark">
        //                                                 Men's clothing{" "}
        //                                             </a>
        //                                         </li>
        //                                         <li>
        //                                             <a href="#" className="text-dark">
        //                                                 Interiors items{" "}
        //                                             </a>
        //                                         </li>
        //                                         <li>
        //                                             <a href="#" className="text-dark">
        //                                                 Underwears{" "}
        //                                             </a>
        //                                         </li>
        //                                         <li>
        //                                             <a href="#" className="text-dark">
        //                                                 Shoes for men{" "}
        //                                             </a>
        //                                         </li>
        //                                         <li>
        //                                             <a href="#" className="text-dark">
        //                                                 Accessories{" "}
        //                                             </a>
        //                                         </li>
        //                                     </ul>
        //                                 </div>
        //                             </div>
        //                         </div>
        //                         <div className="accordion-item">
        //                             <h2 className="accordion-header" id="headingTwo">
        //                                 <button
        //                                     className="accordion-button text-dark bg-light"
        //                                     type="button"
        //                                     data-mdb-toggle="collapse"
        //                                     data-mdb-target="#panelsStayOpen-collapseTwo"
        //                                     aria-expanded="true"
        //                                     aria-controls="panelsStayOpen-collapseTwo"
        //                                 >
        //                                     Brands
        //                                 </button>
        //                             </h2>
        //                             <div
        //                                 id="panelsStayOpen-collapseTwo"
        //                                 className="accordion-collapse collapse show"
        //                                 aria-labelledby="headingTwo"
        //                             >
        //                                 <div className="accordion-body">
        //                                     <div>
        //                                         {/* Checked checkbox */}
        //                                         <div className="form-check">
        //                                             <input
        //                                                 className="form-check-input"
        //                                                 type="checkbox"
        //                                                 defaultValue=""
        //                                                 id="flexCheckChecked1"

        //                                             />
        //                                             <label
        //                                                 className="form-check-label"
        //                                                 htmlFor="flexCheckChecked1"
        //                                             >
        //                                                 Mercedes
        //                                             </label>
        //                                             <span className="badge badge-secondary float-end">
        //                                                 120
        //                                             </span>
        //                                         </div>
        //                                         {/* Checked checkbox */}
        //                                         <div className="form-check">
        //                                             <input
        //                                                 className="form-check-input"
        //                                                 type="checkbox"
        //                                                 defaultValue=""
        //                                                 id="flexCheckChecked2"

        //                                             />
        //                                             <label
        //                                                 className="form-check-label"
        //                                                 htmlFor="flexCheckChecked2"
        //                                             >
        //                                                 Toyota
        //                                             </label>
        //                                             <span className="badge badge-secondary float-end">
        //                                                 15
        //                                             </span>
        //                                         </div>
        //                                         {/* Checked checkbox */}
        //                                         <div className="form-check">
        //                                             <input
        //                                                 className="form-check-input"
        //                                                 type="checkbox"
        //                                                 defaultValue=""
        //                                                 id="flexCheckChecked3"

        //                                             />
        //                                             <label
        //                                                 className="form-check-label"
        //                                                 htmlFor="flexCheckChecked3"
        //                                             >
        //                                                 Mitsubishi
        //                                             </label>
        //                                             <span className="badge badge-secondary float-end">
        //                                                 35
        //                                             </span>
        //                                         </div>
        //                                         {/* Checked checkbox */}
        //                                         <div className="form-check">
        //                                             <input
        //                                                 className="form-check-input"
        //                                                 type="checkbox"
        //                                                 defaultValue=""
        //                                                 id="flexCheckChecked4"

        //                                             />
        //                                             <label
        //                                                 className="form-check-label"
        //                                                 htmlFor="flexCheckChecked4"
        //                                             >
        //                                                 Nissan
        //                                             </label>
        //                                             <span className="badge badge-secondary float-end">
        //                                                 89
        //                                             </span>
        //                                         </div>
        //                                         {/* Default checkbox */}
        //                                         <div className="form-check">
        //                                             <input
        //                                                 className="form-check-input"
        //                                                 type="checkbox"
        //                                                 defaultValue=""
        //                                                 id="flexCheckDefault"
        //                                             />
        //                                             <label
        //                                                 className="form-check-label"
        //                                                 htmlFor="flexCheckDefault"
        //                                             >
        //                                                 Honda
        //                                             </label>
        //                                             <span className="badge badge-secondary float-end">
        //                                                 30
        //                                             </span>
        //                                         </div>
        //                                         {/* Default checkbox */}
        //                                         <div className="form-check">
        //                                             <input
        //                                                 className="form-check-input"
        //                                                 type="checkbox"
        //                                                 defaultValue=""
        //                                                 id="flexCheckDefault"
        //                                             />
        //                                             <label
        //                                                 className="form-check-label"
        //                                                 htmlFor="flexCheckDefault"
        //                                             >
        //                                                 Suzuki
        //                                             </label>
        //                                             <span className="badge badge-secondary float-end">
        //                                                 30
        //                                             </span>
        //                                         </div>
        //                                     </div>
        //                                 </div>
        //                             </div>
        //                         </div>
        //                         <div className="accordion-item">
        //                             <h2 className="accordion-header" id="headingThree">
        //                                 <button
        //                                     className="accordion-button text-dark bg-light"
        //                                     type="button"
        //                                     data-mdb-toggle="collapse"
        //                                     data-mdb-target="#panelsStayOpen-collapseThree"
        //                                     aria-expanded="false"
        //                                     aria-controls="panelsStayOpen-collapseThree"
        //                                 >
        //                                     Price
        //                                 </button>
        //                             </h2>
        //                             <div
        //                                 id="panelsStayOpen-collapseThree"
        //                                 className="accordion-collapse collapse show"
        //                                 aria-labelledby="headingThree"
        //                             >
        //                                 <div className="accordion-body">
        //                                     <div className="range">
        //                                         <input
        //                                             type="range"
        //                                             className="form-range"
        //                                             id="customRange1"
        //                                         />
        //                                     </div>
        //                                     <div className="row mb-3">
        //                                         <div className="col-6">
        //                                             <p className="mb-0">Min</p>
        //                                             <div className="form-outline">
        //                                                 <input
        //                                                     type="number"
        //                                                     id="typeNumber"
        //                                                     className="form-control"
        //                                                 />
        //                                                 <label className="form-label" htmlFor="typeNumber">
        //                                                     $0
        //                                                 </label>
        //                                             </div>
        //                                         </div>
        //                                         <div className="col-6">
        //                                             <p className="mb-0">Max</p>
        //                                             <div className="form-outline">
        //                                                 <input
        //                                                     type="number"
        //                                                     id="typeNumber"
        //                                                     className="form-control"
        //                                                 />
        //                                                 <label className="form-label" htmlFor="typeNumber">
        //                                                     $1,0000
        //                                                 </label>
        //                                             </div>
        //                                         </div>
        //                                     </div>
        //                                     <button
        //                                         type="button"
        //                                         className="btn btn-white w-100 border border-secondary"
        //                                     >
        //                                         apply
        //                                     </button>
        //                                 </div>
        //                             </div>
        //                         </div>
        //                         <div className="accordion-item">
        //                             <h2 className="accordion-header" id="headingThree">
        //                                 <button
        //                                     className="accordion-button text-dark bg-light"
        //                                     type="button"
        //                                     data-mdb-toggle="collapse"
        //                                     data-mdb-target="#panelsStayOpen-collapseFour"
        //                                     aria-expanded="false"
        //                                     aria-controls="panelsStayOpen-collapseFour"
        //                                 >
        //                                     Size
        //                                 </button>
        //                             </h2>
        //                             <div
        //                                 id="panelsStayOpen-collapseFour"
        //                                 className="accordion-collapse collapse show"
        //                                 aria-labelledby="headingThree"
        //                             >
        //                                 <div className="accordion-body">
        //                                     <input
        //                                         type="checkbox"
        //                                         className="btn-check border justify-content-center"
        //                                         id="btn-check1"

        //                                         autoComplete="off"
        //                                     />
        //                                     <label
        //                                         className="btn btn-white mb-1 px-1"
        //                                         style={{ width: 60 }}
        //                                         htmlFor="btn-check1"
        //                                     >
        //                                         XS
        //                                     </label>
        //                                     <input
        //                                         type="checkbox"
        //                                         className="btn-check border justify-content-center"
        //                                         id="btn-check2"

        //                                         autoComplete="off"
        //                                     />
        //                                     <label
        //                                         className="btn btn-white mb-1 px-1"
        //                                         style={{ width: 60 }}
        //                                         htmlFor="btn-check2"
        //                                     >
        //                                         SM
        //                                     </label>
        //                                     <input
        //                                         type="checkbox"
        //                                         className="btn-check border justify-content-center"
        //                                         id="btn-check3"

        //                                         autoComplete="off"
        //                                     />
        //                                     <label
        //                                         className="btn btn-white mb-1 px-1"
        //                                         style={{ width: 60 }}
        //                                         htmlFor="btn-check3"
        //                                     >
        //                                         LG
        //                                     </label>
        //                                     <input
        //                                         type="checkbox"
        //                                         className="btn-check border justify-content-center"
        //                                         id="btn-check4"

        //                                         autoComplete="off"
        //                                     />
        //                                     <label
        //                                         className="btn btn-white mb-1 px-1"
        //                                         style={{ width: 60 }}
        //                                         htmlFor="btn-check4"
        //                                     >
        //                                         XXL
        //                                     </label>
        //                                 </div>
        //                             </div>
        //                         </div>
        //                         <div className="accordion-item">
        //                             <h2 className="accordion-header" id="headingThree">
        //                                 <button
        //                                     className="accordion-button text-dark bg-light"
        //                                     type="button"
        //                                     data-mdb-toggle="collapse"
        //                                     data-mdb-target="#panelsStayOpen-collapseFive"
        //                                     aria-expanded="false"
        //                                     aria-controls="panelsStayOpen-collapseFive"
        //                                 >
        //                                     Ratings
        //                                 </button>
        //                             </h2>
        //                             <div
        //                                 id="panelsStayOpen-collapseFive"
        //                                 className="accordion-collapse collapse show"
        //                                 aria-labelledby="headingThree"
        //                             >
        //                                 <div className="accordion-body">
        //                                     {/* Default checkbox */}
        //                                     <div className="form-check">
        //                                         <input
        //                                             className="form-check-input"
        //                                             type="checkbox"
        //                                             defaultValue=""
        //                                             id="flexCheckDefault"

        //                                         />
        //                                         <label
        //                                             className="form-check-label"
        //                                             htmlFor="flexCheckDefault"
        //                                         >
        //                                             <i className="fas fa-star text-warning" />
        //                                             <i className="fas fa-star text-warning" />
        //                                             <i className="fas fa-star text-warning" />
        //                                             <i className="fas fa-star text-warning" />
        //                                             <i className="fas fa-star text-warning" />
        //                                         </label>
        //                                     </div>
        //                                     {/* Default checkbox */}
        //                                     <div className="form-check">
        //                                         <input
        //                                             className="form-check-input"
        //                                             type="checkbox"
        //                                             defaultValue=""
        //                                             id="flexCheckDefault"

        //                                         />
        //                                         <label
        //                                             className="form-check-label"
        //                                             htmlFor="flexCheckDefault"
        //                                         >
        //                                             <i className="fas fa-star text-warning" />
        //                                             <i className="fas fa-star text-warning" />
        //                                             <i className="fas fa-star text-warning" />
        //                                             <i className="fas fa-star text-warning" />
        //                                             <i className="fas fa-star text-secondary" />
        //                                         </label>
        //                                     </div>
        //                                     {/* Default checkbox */}
        //                                     <div className="form-check">
        //                                         <input
        //                                             className="form-check-input"
        //                                             type="checkbox"
        //                                             defaultValue=""
        //                                             id="flexCheckDefault"

        //                                         />
        //                                         <label
        //                                             className="form-check-label"
        //                                             htmlFor="flexCheckDefault"
        //                                         >
        //                                             <i className="fas fa-star text-warning" />
        //                                             <i className="fas fa-star text-warning" />
        //                                             <i className="fas fa-star text-warning" />
        //                                             <i className="fas fa-star text-secondary" />
        //                                             <i className="fas fa-star text-secondary" />
        //                                         </label>
        //                                     </div>
        //                                     {/* Default checkbox */}
        //                                     <div className="form-check">
        //                                         <input
        //                                             className="form-check-input"
        //                                             type="checkbox"
        //                                             defaultValue=""
        //                                             id="flexCheckDefault"

        //                                         />
        //                                         <label
        //                                             className="form-check-label"
        //                                             htmlFor="flexCheckDefault"
        //                                         >
        //                                             <i className="fas fa-star text-warning" />
        //                                             <i className="fas fa-star text-warning" />
        //                                             <i className="fas fa-star text-secondary" />
        //                                             <i className="fas fa-star text-secondary" />
        //                                             <i className="fas fa-star text-secondary" />
        //                                         </label>
        //                                     </div>
        //                                 </div>
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </div>
        //             </div>
        //             {/* sidebar */}
        //             {/* content */}
        //             <div className="col-lg-9">
        //                 <header className="d-sm-flex align-items-center border-bottom mb-4 pb-3">
        //                     <strong className="d-block py-2">32 Items found </strong>
        //                     <div className="ms-auto">
        //                         <select className="form-select d-inline-block w-auto border pt-1">
        //                             <option value={0}>Best match</option>
        //                             <option value={1}>Recommended</option>
        //                             <option value={2}>High rated</option>
        //                             <option value={3}>Randomly</option>
        //                         </select>
        //                         <div className="btn-group shadow-0 border">
        //                             <a href="#" className="btn btn-light" title="List view">
        //                                 <i className="fa fa-bars fa-lg" />
        //                             </a>
        //                             <a href="#" className="btn btn-light active" title="Grid view">
        //                                 <i className="fa fa-th fa-lg" />
        //                             </a>
        //                         </div>
        //                     </div>
        //                 </header>
        //                 <div className="row justify-content-center mb-3">
        //                     <div className="col-md-12">
        //                         <div className="card shadow-0 border rounded-3">
        //                             <div className="card-body">
        //                                 <div className="row g-0">
        //                                     <div className="col-xl-3 col-md-4 d-flex justify-content-center">
        //                                         <div className="bg-image hover-zoom ripple rounded ripple-surface me-md-3 mb-3 mb-md-0">
        //                                             <img
        //                                                 src="https://mdbootstrap.com/img/bootstrap-ecommerce/items/8.webp"
        //                                                 className="w-100"
        //                                             />
        //                                             <a href="#!">
        //                                                 <div className="hover-overlay">
        //                                                     <div
        //                                                         className="mask"
        //                                                         style={{
        //                                                             backgroundColor: "rgba(253, 253, 253, 0.15)"
        //                                                         }}
        //                                                     />
        //                                                 </div>
        //                                             </a>
        //                                         </div>
        //                                     </div>
        //                                     <div className="col-xl-6 col-md-5 col-sm-7">
        //                                         <h5>Rucksack Backpack Jeans</h5>
        //                                         <div className="d-flex flex-row">
        //                                             <div className="text-warning mb-1 me-2">
        //                                                 <i className="fa fa-star" />
        //                                                 <i className="fa fa-star" />
        //                                                 <i className="fa fa-star" />
        //                                                 <i className="fa fa-star" />
        //                                                 <i className="fas fa-star-half-alt" />
        //                                                 <span className="ms-1">4.5</span>
        //                                             </div>
        //                                             <span className="text-muted">154 orders</span>
        //                                         </div>
        //                                         <p className="text mb-4 mb-md-0">
        //                                             Short description about the product goes here, for ex its
        //                                             features. Lorem ipsum dolor sit amet with hapti you enter
        //                                             into any new area of science, you almost lorem ipsum is
        //                                             great text consectetur adipisicing
        //                                         </p>
        //                                     </div>
        //                                     <div className="col-xl-3 col-md-3 col-sm-5">
        //                                         <div className="d-flex flex-row align-items-center mb-1">
        //                                             <h4 className="mb-1 me-1">$34,50</h4>
        //                                             <span className="text-danger">
        //                                                 <s>$49.99</s>
        //                                             </span>
        //                                         </div>
        //                                         <h6 className="text-success">Free shipping</h6>
        //                                         <div className="mt-4">
        //                                             <button
        //                                                 className="btn btn-primary shadow-0"
        //                                                 type="button"
        //                                             >
        //                                                 Buy this
        //                                             </button>
        //                                             <a
        //                                                 href="#!"
        //                                                 className="btn btn-light border px-2 pt-2 icon-hover"
        //                                             >
        //                                                 <i className="fas fa-heart fa-lg px-1" />
        //                                             </a>
        //                                         </div>
        //                                     </div>
        //                                 </div>
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </div>
        //                 <div className="row justify-content-center mb-3">
        //                     <div className="col-md-12">
        //                         <div className="card shadow-0 border rounded-3">
        //                             <div className="card-body">
        //                                 <div className="row g-0">
        //                                     <div className="col-xl-3 col-md-4 d-flex justify-content-center">
        //                                         <div className="bg-image hover-zoom ripple rounded ripple-surface me-md-3 mb-3 mb-md-0">
        //                                             <img
        //                                                 src="https://mdbootstrap.com/img/bootstrap-ecommerce/items/9.webp"
        //                                                 className="w-100"
        //                                             />
        //                                             <a href="#!">
        //                                                 <div className="hover-overlay">
        //                                                     <div
        //                                                         className="mask"
        //                                                         style={{
        //                                                             backgroundColor: "rgba(253, 253, 253, 0.15)"
        //                                                         }}
        //                                                     />
        //                                                 </div>
        //                                             </a>
        //                                         </div>
        //                                     </div>
        //                                     <div className="col-xl-6 col-md-5 col-sm-7">
        //                                         <h5>Men's Denim Jeans Shorts</h5>
        //                                         <div className="d-flex flex-row">
        //                                             <div className="text-warning mb-1 me-2">
        //                                                 <i className="fa fa-star" />
        //                                                 <i className="fa fa-star" />
        //                                                 <i className="fa fa-star" />
        //                                                 <i className="far fa-star" />
        //                                                 <i className="far fa-star" />
        //                                                 <span className="ms-1">3</span>
        //                                             </div>
        //                                             <span className="text-muted">73 orders</span>
        //                                         </div>
        //                                         <p className="text mb-4 mb-md-0">
        //                                             Re-engineered Digital Crown with hapti Lorem ipsum dolor
        //                                             sit amet, consectetur adipisicing elit, sed do eiusmod
        //                                             tempor incididunt ut labore et dolore magna aliqua tempor
        //                                             incididunt ut labore et dolore magna [...]
        //                                         </p>
        //                                     </div>
        //                                     <div className="col-xl-3 col-md-3 col-sm-5">
        //                                         <div className="d-flex flex-row align-items-center mb-1">
        //                                             <h4 className="mb-1 me-1">$34,50</h4>
        //                                             <span className="text-danger">
        //                                                 <s>$49.99</s>
        //                                             </span>
        //                                         </div>
        //                                         <h6 className="text-warning">Paid shipping</h6>
        //                                         <div className="mt-4">
        //                                             <button
        //                                                 className="btn btn-primary shadow-0"
        //                                                 type="button"
        //                                             >
        //                                                 Buy this
        //                                             </button>
        //                                             <a
        //                                                 href="#!"
        //                                                 className="btn btn-light border px-2 pt-2 icon-hover"
        //                                             >
        //                                                 <i className="fas fa-heart fa-lg px-1" />
        //                                             </a>
        //                                         </div>
        //                                     </div>
        //                                 </div>
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </div>
        //                 <div className="row justify-content-center mb-3">
        //                     <div className="col-md-12">
        //                         <div className="card shadow-0 border rounded-3">
        //                             <div className="card-body">
        //                                 <div className="row g-0">
        //                                     <div className="col-xl-3 col-md-4 d-flex justify-content-center">
        //                                         <div className="bg-image hover-zoom ripple rounded ripple-surface me-md-3 mb-3 mb-md-0">
        //                                             <img
        //                                                 src="https://mdbootstrap.com/img/bootstrap-ecommerce/items/10.webp"
        //                                                 className="w-100"
        //                                             />
        //                                             <a href="#!">
        //                                                 <div className="hover-overlay">
        //                                                     <div
        //                                                         className="mask"
        //                                                         style={{
        //                                                             backgroundColor: "rgba(253, 253, 253, 0.15)"
        //                                                         }}
        //                                                     />
        //                                                 </div>
        //                                             </a>
        //                                         </div>
        //                                     </div>
        //                                     <div className="col-xl-6 col-md-5 col-sm-7">
        //                                         <h5>T-shirt for Men Blue Cotton Base</h5>
        //                                         <div className="d-flex flex-row">
        //                                             <div className="text-warning mb-1 me-2">
        //                                                 <i className="fa fa-star" />
        //                                                 <i className="fa fa-star" />
        //                                                 <i className="fa fa-star" />
        //                                                 <i className="fas fa-star-half-alt" />
        //                                                 <i className="far fa-star" />
        //                                                 <span className="ms-1">3.5</span>
        //                                             </div>
        //                                             <span className="text-muted">910 orders</span>
        //                                         </div>
        //                                         <p className="text mb-4 mb-md-0">
        //                                             Short description about the product goes here, for ex its
        //                                             features. Lorem ipsum dolor sit amet with hapti you enter
        //                                             into any new area of science, you almost lorem ipsum is
        //                                             great text consectetur adipisicing
        //                                         </p>
        //                                     </div>
        //                                     <div className="col-xl-3 col-md-3 col-sm-5">
        //                                         <div className="d-flex flex-row align-items-center mb-1">
        //                                             <h4 className="mb-1 me-1">$99,50</h4>
        //                                         </div>
        //                                         <h6 className="text-success">Free shipping</h6>
        //                                         <div className="mt-4">
        //                                             <button
        //                                                 className="btn btn-primary shadow-0"
        //                                                 type="button"
        //                                             >
        //                                                 Buy this
        //                                             </button>
        //                                             <a
        //                                                 href="#!"
        //                                                 className="btn btn-light border px-2 pt-2 icon-hover"
        //                                             >
        //                                                 <i className="fas fa-heart fa-lg px-1" />
        //                                             </a>
        //                                         </div>
        //                                     </div>
        //                                 </div>
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </div>
        //                 <div className="row justify-content-center mb-3">
        //                     <div className="col-md-12">
        //                         <div className="card shadow-0 border rounded-3">
        //                             <div className="card-body">
        //                                 <div className="row g-0">
        //                                     <div className="col-xl-3 col-md-4 d-flex justify-content-center">
        //                                         <div className="bg-image hover-zoom ripple rounded ripple-surface me-md-3 mb-3 mb-md-0">
        //                                             <img
        //                                                 src="https://mdbootstrap.com/img/bootstrap-ecommerce/items/11.webp"
        //                                                 className="w-100"
        //                                             />
        //                                             <a href="#!">
        //                                                 <div className="hover-overlay">
        //                                                     <div
        //                                                         className="mask"
        //                                                         style={{
        //                                                             backgroundColor: "rgba(253, 253, 253, 0.15)"
        //                                                         }}
        //                                                     />
        //                                                 </div>
        //                                             </a>
        //                                         </div>
        //                                     </div>
        //                                     <div className="col-xl-6 col-md-5 col-sm-7">
        //                                         <h5>Winter Jacket for Men and Women</h5>
        //                                         <div className="d-flex flex-row">
        //                                             <div className="text-warning mb-1 me-2">
        //                                                 <i className="fa fa-star" />
        //                                                 <i className="fa fa-star" />
        //                                                 <i className="fa fa-star" />
        //                                                 <i className="fa fa-star" />
        //                                                 <i className="fas fa-star-half-alt" />
        //                                                 <span className="ms-1">4.5</span>
        //                                             </div>
        //                                             <span className="text-muted">154 orders</span>
        //                                         </div>
        //                                         <p className="text mb-4 mb-md-0">
        //                                             Short description about the product goes here, for ex its
        //                                             features. Lorem ipsum dolor sit amet with hapti you enter
        //                                             into any new area of science, you almost lorem ipsum is
        //                                             great text
        //                                         </p>
        //                                     </div>
        //                                     <div className="col-xl-3 col-md-3 col-sm-5">
        //                                         <div className="d-flex flex-row align-items-center mb-1">
        //                                             <h4 className="mb-1 me-1">$140</h4>
        //                                             <span className="text-danger">
        //                                                 <s>$190</s>
        //                                             </span>
        //                                         </div>
        //                                         <h6 className="text-success">Free shipping</h6>
        //                                         <div className="mt-4">
        //                                             <button
        //                                                 className="btn btn-primary shadow-0"
        //                                                 type="button"
        //                                             >
        //                                                 Buy this
        //                                             </button>
        //                                             <a
        //                                                 href="#!"
        //                                                 className="btn btn-light border px-2 pt-2 icon-hover"
        //                                             >
        //                                                 <i className="fas fa-heart fa-lg px-1" />
        //                                             </a>
        //                                         </div>
        //                                     </div>
        //                                 </div>
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </div>
        //                 <div className="row justify-content-center mb-3">
        //                     <div className="col-md-12">
        //                         <div className="card shadow-0 border rounded-3">
        //                             <div className="card-body">
        //                                 <div className="row g-0">
        //                                     <div className="col-xl-3 col-md-4 d-flex justify-content-center">
        //                                         <div className="bg-image hover-zoom ripple rounded ripple-surface me-md-3 mb-3 mb-md-0">
        //                                             <img
        //                                                 src="https://mdbootstrap.com/img/bootstrap-ecommerce/items/12.webp"
        //                                                 className="w-100"
        //                                             />
        //                                             <a href="#!">
        //                                                 <div className="hover-overlay">
        //                                                     <div
        //                                                         className="mask"
        //                                                         style={{
        //                                                             backgroundColor: "rgba(253, 253, 253, 0.15)"
        //                                                         }}
        //                                                     />
        //                                                 </div>
        //                                             </a>
        //                                         </div>
        //                                     </div>
        //                                     <div className="col-xl-6 col-md-5 col-sm-7">
        //                                         <h5>T-shirt for Men Blue Cotton Base</h5>
        //                                         <div className="d-flex flex-row">
        //                                             <div className="text-warning mb-1 me-2">
        //                                                 <i className="fa fa-star" />
        //                                                 <i className="fa fa-star" />
        //                                                 <i className="fa fa-star" />
        //                                                 <i className="fa fa-star" />
        //                                                 <i className="fas fa-star-half-alt" />
        //                                                 <span className="ms-1">4.5</span>
        //                                             </div>
        //                                             <span className="text-muted">154 orders</span>
        //                                         </div>
        //                                         <p className="text mb-4 mb-md-0">
        //                                             Short description about the product goes here, for ex its
        //                                             features. Lorem ipsum dolor sit amet with hapti you enter
        //                                             into any new area of science, you almost lorem ipsum is
        //                                             great text
        //                                         </p>
        //                                     </div>
        //                                     <div className="col-xl-3 col-md-3 col-sm-5">
        //                                         <div className="d-flex flex-row align-items-center mb-1">
        //                                             <h4 className="mb-1 me-1">$99.50</h4>
        //                                             <span className="text-danger">
        //                                                 <s>$190</s>
        //                                             </span>
        //                                         </div>
        //                                         <h6 className="text-success">Free shipping</h6>
        //                                         <div className="mt-4">
        //                                             <button
        //                                                 className="btn btn-primary shadow-0"
        //                                                 type="button"
        //                                             >
        //                                                 Buy this
        //                                             </button>
        //                                             <a
        //                                                 href="#!"
        //                                                 className="btn btn-light border px-2 pt-2 icon-hover"
        //                                             >
        //                                                 <i className="fas fa-heart fa-lg px-1" />
        //                                             </a>
        //                                         </div>
        //                                     </div>
        //                                 </div>
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </div>
        //                 <hr />
        //                 {/* Pagination */}
        //                 <nav
        //                     aria-label="Page navigation example"
        //                     className="d-flex justify-content-center mt-3"
        //                 >
        //                     <ul className="pagination">
        //                         <li className="page-item disabled">
        //                             <a className="page-link" href="#" aria-label="Previous">
        //                                 <span aria-hidden="true">«</span>
        //                             </a>
        //                         </li>
        //                         <li className="page-item active">
        //                             <a className="page-link" href="#">
        //                                 1
        //                             </a>
        //                         </li>
        //                         <li className="page-item">
        //                             <a className="page-link" href="#">
        //                                 2
        //                             </a>
        //                         </li>
        //                         <li className="page-item">
        //                             <a className="page-link" href="#">
        //                                 3
        //                             </a>
        //                         </li>
        //                         <li className="page-item">
        //                             <a className="page-link" href="#">
        //                                 4
        //                             </a>
        //                         </li>
        //                         <li className="page-item">
        //                             <a className="page-link" href="#">
        //                                 5
        //                             </a>
        //                         </li>
        //                         <li className="page-item">
        //                             <a className="page-link" href="#" aria-label="Next">
        //                                 <span aria-hidden="true">»</span>
        //                             </a>
        //                         </li>
        //                     </ul>
        //                 </nav>
        //                 {/* Pagination */}
        //             </div>
        //         </div>
        //     </div>
        // </section>

        <div className="container mt-5 py-5 " style={{minWidth: 1300, backgroundColor: 'darkseagreen'}} >

            
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
                            <i className="fas fa-map-marker-alt"></i> {/* Icon location */}
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

                        <div className="select-wrapper" style={{marginLeft: '7px'}}>
                            <i className="fas fa-map-marker-alt"></i> {/* Icon location */}
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
                                                src={`https://localhost:44384${x.avatar}`}
                                                className="img-fluid rounded-circle"
                                                alt="Doctor Image"
                                            />
                                            
                                            <Link to={"/doctor-info/" + x.doctorId}>Xem thêm</Link>
                                        </div>
                                        <div className="col-md-5" style={{ paddingLeft: 20 }}>
                                            <div className="card-body">
                                                <h5 className="card-title">{titles[x.titleId]} Bác sĩ {x.name}</h5>
                                                <p className="card-text">
                                                    <span dangerouslySetInnerHTML={{ __html: x.keyInfo }} />
                                                    <i className="bi bi-geo-alt" /> {x.address}
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
                                                        <Link to={"/booking/" + schedule.id}>
                                                            <button className="btn btn-outline-success w-100" onClick={() => addToCart(x, 1)} style={{fontSize: 14}}>
                                                                {schedule.time}
                                                            </button>
                                                        </Link>
                                                    </div>
                                                ))}
                                                {schedules[x.doctorId]?.length > 0 && (
                                                    <div className="col-12">
                                                        <p>
                                                            <strong style={{ color: '#5BC0AB' }}>ĐỊA CHỈ KHÁM:</strong>
                                                            <br />
                                                            {schedules[x.doctorId][0].clinicName}, {schedules[x.doctorId][0].clinicAdd}
                                                        </p>
                                                    </div>
                                                )}
                                                {!schedules[x.doctorId] && <p>Không có lịch khám.</p>}
                                                <div className="col-md-12 p-3 doctor-add">
                                                   
                                                    <p>
                                                        GIÁ KHÁM: <strong>{x.price}.000đ</strong> <a href="#">Xem chi tiết</a>
                                                    </p>
                                                    <p>
                                                        LOẠI BẢO HIỂM ÁP DỤNG: <a href="#">Xem chi tiết</a>
                                                    </p>
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