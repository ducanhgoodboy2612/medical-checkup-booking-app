import { Component } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
// import "../assets/css/style_category.css";
import { Link, useParams } from "react-router-dom";
import ReactPaginate from "react-paginate";

import { getPaged_Doctor, getPaged_Spec } from "../services/home.service";
import { getSchedules } from "../services/booking.services";
import "../assets/style/bootstrap.min.css";
import "../assets/style/templatemo-kind-heart-charity.css";


type DataParams = {
    id: string;

};

interface Schedule {
    id: number
    date: string;
    time: string;
}

interface Doctor {
    doctorId: number;
}
const Specialties = function () {
    const { id } = useParams<DataParams>();
    const [data, setDatas] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [province, setProvince] = useState(''); 
    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        async function loadClinics() {

            let items = await getPaged_Spec({
                page: page,
                pageSize: pageSize,
                keyword: keyword, // Sử dụng keyword hiện tại
            });

            setDatas(items);
            setPageCount(Math.ceil(items.totalItems / pageSize));
        }

        loadClinics();
    }, [page, pageSize, keyword]); 

  

    return(
        <div className="container mt-5 mb-5">
            <div className="row mt-4">
                <div className="col-md-6">
                    <h2>Chuyên khoa</h2>
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
                    <Link to={"/doctors-specialty/" + x.id}>
                        <div className="card facility-card">
                            <img src={`/images/spec/${x.image}`} alt="Bệnh viện An Việt" />
                            <div className="card-body">
                                <h5 className="card-title" style={{fontSize: 22}}>{x.name}</h5>
                            </div>
                        </div>
                    </Link>
                </div>
                ))}
                
            </div>
        </div>

    );

}
export default Specialties;