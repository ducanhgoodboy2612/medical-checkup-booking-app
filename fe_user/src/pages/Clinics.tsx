import { Component } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
// import "../assets/css/style_category.css";
import { Link, useParams } from "react-router-dom";
import ReactPaginate from "react-paginate";

import { getPaged_Doctor, getPaged_Clinic, getLocation } from "../services/home.service";
import { getSchedules } from "../services/booking.services";
import "../assets/style/bootstrap.min.css";
import "../assets/style/templatemo-kind-heart-charity.css";



const Clinic = function () {
    const [data, setDatas] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [listProvince, setListProvince] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [selecteProvince, setSelecteProvince] = useState(''); 
    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        async function loadClinics() {
            let items = await getPaged_Clinic({
                page: page,
                pageSize: pageSize,
                key_name: "",
                address: selecteProvince
            });
            setDatas(items.data);
            setPageCount(Math.ceil(items.totalItems / pageSize));
            console.log("cli   ", items)
        }

        async function loadLocation() {
            let items = await getLocation({
                keyword: ""
            });
            setListProvince(items);
        }

       
        loadClinics();
        loadLocation();

    }, [page, pageSize, keyword, selecteProvince]);

  

    return(
        <div className="container mt-5 mb-5">
            <div className="row mt-4">
                <div className="col-md-6">
                    <h2>Cơ sở y tế</h2>
                </div>
                <div className="col-md-3 text-end">
                    <div className="select-wrapper">
                        <i className="fas fa-map-marker-alt"></i> {/* Icon location */}
                        <select
                            className="form-control form-select"
                            value={selecteProvince}
                            onChange={(e) => setSelecteProvince(e.target.value)}
                        >
                            <option value="">Cả nước</option> {/* Option mặc định */}
                            {listProvince.map((provinceItem: any) => (
                                <option key={provinceItem.id} value={provinceItem.name}>
                                    {provinceItem.name}
                                </option>
                            ))}
                        </select>
                    </div>

                </div>
                <div className="col-md-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Tìm kiếm"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)} // Update keyword state on input change
                    />
                </div>
            </div>
            {/* <div className="alphabet-nav my-3">
                <a href="#">A</a>
                <a href="#">B</a>
                <a href="#">C</a>
                <a href="#">Z</a>
                <a href="#">#</a>
            </div> */}
            {/* Facility Cards */}
            <div className="row mt-5">
                {data.map((x: any) => (
                <div className="col-md-3">
                    <div className="card facility-card">
                        <img src={`/images/clinics/${x.image}`} alt="Bệnh viện An Việt" />
                        <div className="card-body">
                            <h5 className="card-title" style={{fontSize: 22}}>{x.name}</h5>
                        </div>
                    </div>
                </div>
                ))}
                
            </div>
        </div>

    );

}
export default Clinic;