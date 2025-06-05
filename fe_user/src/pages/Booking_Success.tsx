import { Component } from "react";



import "../assets/style/doctor-info.css";


const Booking_Success = function () {


    return (
        <div className="container d-flex flex-column justify-content-center align-items-center mt-5">  
            <h2 className="text-success">Đặt lịch thành công !!</h2>
            <div className="text-center">
                <img
                    src="images/booking_success2.jpg"
                    className="img-fluid mb-4"
                    style={{ width: "800px", height: "600px" }}
                    alt="Ảnh trung tâm"
                />
                <a href="/" className="btn btn-primary" style={{ marginTop: '280px' }}>
                    Quay về trang chủ <i className="bi bi-arrow-right ms-2"></i>
                </a>
            </div>
        </div>
      
    );

}
export default Booking_Success;
