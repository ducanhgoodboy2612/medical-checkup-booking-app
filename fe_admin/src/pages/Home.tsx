import { Breadcrumb, theme, Image } from "antd";
import hungyen from "../assets/images/hungyen.jpg";
import React, { useEffect, useState } from "react";
import { apiGetTotalRevenue, apiGetTotalRevenueByDateRange } from "../services/report.services";

import { json } from "stream/consumers";
const Home = function () {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [doctorCount, setDoctorCount] = useState<number>(0);
  const [patientCount, setPatientCount] = useState<number>(0);
  const [donePatientCount, setDonePatientCount] = useState<number>(0);


  useEffect(() => {

  }, []); //componentDidMount

  const fetchDoctorCount = async () => {
    try {
      const response = await fetch('https://localhost:44393/api/User/count-by-role');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const doctorData = data.find((item: any) => item.roleId === 2);
      if (doctorData) {
        setDoctorCount(doctorData.count);
      }
    } catch (error) {
      console.error("Error fetching doctor count:", error);
    }
  };

  useEffect(() => {

    fetchDoctorCount();
    fetchPatientCount();
    fetchDonePatientCount();
  }, []);

  const fetchPatientCount = async () => {
    try {
      const response = await fetch('https://localhost:44393/api/Patient/total-patients-year');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPatientCount(data); // Assuming the API returns the count directly
    } catch (error) {
      console.error("Error fetching patient count:", error);
    }
  };

  const fetchDonePatientCount = async () => {
    try {
      const response = await fetch('https://localhost:44393/api/Patient/total-done-patients-year');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setDonePatientCount(data); // Assuming the API returns the count directly
    } catch (error) {
      console.error("Error fetching done patient count:", error);
    }
  };

  function formatCurrency(number: number): string {

    const formattedNumber: string = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return formattedNumber + " đ";
  }

  return (
    <>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
        <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
      </Breadcrumb>
      <div id="content-wrapper" className="d-flex flex-column">
        {/* Main Content */}
        <div id="content">
          {/* Topbar */}

          {/* End of Topbar */}
          {/* Begin Page Content */}
          <div className="container-fluid">
            {/* Page Heading */}
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
              <h1 className="h3 mb-0 text-gray-800">Thống kê trong tháng</h1>
              {/* <a
                href="#"
                className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
              >
                <i className="fas fa-download fa-sm text-white-50" /> Generatef Report
              </a> */}
            </div>
            {/* Content Row */}
            <div className="row">
              <div className="col-xl-3 col-md-6 mb-4">
                <div className="card border-left-primary shadow h-100 py-2">
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                          Số lượng bác sĩ
                        </div>
                        <div className="h5 mb-0 font-weight-bold text-gray-800">
                          {doctorCount}
                        </div>
                      </div>
                      <div className="col-auto">
                        <i className="fas fa-calendar fa-2x text-gray-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Patient Count Card */}
              <div className="col-xl-3 col-md-6 mb-4">
                <div className="card border-left-success shadow h-100 py-2">
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                          Tổng số bệnh nhân
                        </div>
                        <div className="h5 mb-0 font-weight-bold text-gray-800">
                          {patientCount}
                        </div>
                      </div>
                      <div className="col-auto">
                        <i className="fas fa-users fa-2x text-gray-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
               {/* Done Patient Count Card */}
               <div className="col-xl-3 col-md-6 mb-4">
                <div className="card border-left-warning shadow h-100 py-2">
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                          Tổng số bệnh nhân đã khám
                        </div>
                        <div className="h5 mb-0 font-weight-bold text-gray-800">
                          {donePatientCount}
                        </div>
                      </div>
                      <div className="col-auto">
                        <i className="fas fa-clipboard-check fa-2x text-gray-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
            {/* Content Row */}
            <div className="row">
              
            </div>
            
          </div>
          {/* /.container-fluid */}
        </div>
        {/* End of Main Content */}
        {/* Footer */}
        <footer className="sticky-footer bg-white">
          <div className="container my-auto">
            <div className="copyright text-center my-auto">
              <span>Copyright © DucAnh React Website 2024</span>
            </div>
          </div>
        </footer>
        {/* End of Footer */}
      </div>

    </>
  );
};
export default Home;
