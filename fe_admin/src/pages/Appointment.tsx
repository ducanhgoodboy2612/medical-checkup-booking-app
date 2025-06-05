import React, { useEffect, useState } from "react";
import { Breadcrumb, Button, Flex, Table } from "antd";
import { getPaged_Patients } from "../services/general.services";
import { getDoctor } from "../services/doctor.services";
import { DatePicker } from 'antd';
import PatientDetailType from "../models/appointment.model";
import { ColumnsType, TableProps } from "antd/es/table";
import { TableParams } from "../models/config.model";
import DoctorModel from "../components/Doctor/DoctorModel";
import moment from "moment";

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "../assets/styles/common.css"; 


const Appointment: React.FC = () => {
    const [userid, setUserid] = useState("");
    const [isOpenModel, setIsOpenModel] = useState(false);
    const [isOpenDelete, setIsOpenDelete] = useState(false);
    const [data, setData] = useState<PatientDetailType[]>();
    const [loading, setLoading] = useState(false);
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 8,
        },
    });
    const [s_patientName, setS_patientName] = useState('');
    const [s_patientPhone, setS_patientPhone] = useState('');
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const fetchData = async () => {
        setLoading(true);
        
        let results = await getPaged_Patients({
            page: tableParams.pagination?.current,
            pageSize: tableParams.pagination?.pageSize,
            name: s_patientName,
            phone: s_patientPhone,
            dateBooking: selectedDate
        });
        const appData = results.patients;
        console.log("pat  ", results.patients)

        // const updatedData = await Promise.all(
        //     appData.map(async (app: any) => {
        //         if (app.doctorId !== undefined && app.doctorId !== null) {
        //             const doctor_name = await getDoctor({ id: app.doctorId });

        //             return {
        //                 ...app,
        //                 doctor_name: doctor_name.name, 
        //             };
        //         }

        //     })
        // );

        setData(results.patients);

        // setData(results.data);
        setLoading(false);
        setTableParams({
            ...tableParams,
            pagination: {
                ...tableParams.pagination,
                total: results.totalRecords,
            },
        });
    };

    const columns: ColumnsType<PatientDetailType> = [
        {
            title: "ID",
            dataIndex: "id", 
        },
        {
            title: "Họ và tên",
            dataIndex: "name",
        },
        {
            title: "Ngày đặt lịch",
            dataIndex: "dateBooking", 
            render: (_, record) => (
                <span>{moment(record.dateBooking).format("DD-MM-YYYY")}</span>
            ),
        },
        {
            title: "Giới tính",
            dataIndex: "gender",
            render: (_, record) => (
                <span>{record.gender === "male" ? "Nam" : "Nữ"}</span>
            ),
        },
        // {
        //     title: "Địa chỉ",
        //     dataIndex: "address",
        // },
        // {
        //     title: "Email",
        //     dataIndex: "email",
        // },
        {
            title: "Số điện thoại",
            dataIndex: "phone",
        },
        {
            title: "Bác sĩ",
            dataIndex: "doctorName",
        },
        // {
        //     title: "Trạng thái", 
        //     dataIndex: "statusId", // Sử dụng statusId
        //     render: (_, record) => <span>{record.statusId}</span>, 
        // },
        {
            title: "Trạng thái",
            dataIndex: "statusId", // Sử dụng statusId
            render: (_, record) => {
                let statusText = "";
                let color = ""; // Màu nền của button

                switch (record.statusId) {
                    case 1:
                        statusText = "Đã XN";
                        color = "#1890ff"; // Green for success
                        break;
                    case 2:
                        statusText = "Hủy lich";
                        color = "#f5222d"; // Red for failure
                        break;
                    case 3:
                        statusText = "Chờ XN";
                        color = "#faad14"; // Yellow for pending
                        break;
                    case 4:
                        statusText = "Quá hạn";
                        color = "#A9A9A9"; // Grey for delete
                        break;
                    case 5:
                        statusText = "Đã khám";
                        color = "#5BC0AB"; // Blue for done
                        break;
                    case 7:
                        statusText = "Đã XNBN";
                        color = "skyblue"; // Blue for done
                        break;
                    default:
                        statusText = "UNKNOWN"; // Default text for unknown statusId
                        color = "#595959"; // Grey for unknown
                        break;
                }

                return (
                    <Button
                        type="default" // Sử dụng type hợp lệ như "default" hoặc "primary"
                        style={{ backgroundColor: color, borderColor: color, color: "#fff" }} // Tuỳ chỉnh màu sắc
                    >
                        {statusText}
                    </Button>
                );
            },
        },

        {
            title: "Hành động",
            width: "120px",
            render: (_, record) => (
                <Flex justify="center">
                    {/* <Button
                        onClick={() => {
                            setIsOpenModel(true);
                            setUserid(record.id); 
                        }}
                    >
                        Sửa
                    </Button> */}
                    <Button
                        style={{ marginLeft: '5px' }}
                        onClick={() => {
                            setIsOpenDelete(true);
                            setUserid(record.id); 
                        }}
                    >
                        Xóa
                    </Button>
                </Flex>
            ),
        },
    ];

    // async function handleSearch() {
    //     // console.log("key  ", keyword)
    //     // console.log("tit  ", selecteTitle)
    //     // console.log("loc  ", selecteProvince)
    //     let items = await getPaged_Patients({
    //         page: tableParams.pagination?.current,
    //         pageSize: tableParams.pagination?.pageSize,
    //         name: s_patientName
    //     });
    //     setDatas(items.data);
    //     setPageCount(Math.ceil(items.totalItems / pageSize));
    //     const days = getNext7Days();

    //     items.data.forEach((doctor: Doctor) => {
    //         let selectedDate = selectedDates[doctor.doctorId] || days[0].value; // Chọn ngày đầu tiên nếu chưa có ngày nào được chọn
    //         handleDateChange(doctor.doctorId, selectedDate); // Gọi handleDateChange để cập nhật ngày đã chọn
    //     });
    // }

    useEffect(() => {
        fetchData();
    }, [JSON.stringify(tableParams), s_patientName, s_patientPhone, selectedDate]);

    const handleTableChange: TableProps["onChange"] = (
        pagination,
        filters,
        sorter
    ) => {  
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setData([]);
        }
    };

    const handleCancelModel = () => {
        setIsOpenModel(false);
    };

    const handleCancelDelete = () => {
        setIsOpenDelete(false);
    };

    const handleUpdateSuccess = () => {
        toast.success("Cập nhật người dùng thành công!");
        fetchData();
    };

    const handleDateChange = (date: any, dateString: string | string[]) => {
        const formattedDate = date ? date.toDate().toDateString() : null;
        setSelectedDate(formattedDate);
        alert(formattedDate);
    };

    return (
        <>
            <Flex justify="space-between" align="center">
                <Breadcrumb style={{ margin: "16px 0" }}>
                    <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
                    <Breadcrumb.Item>Quản lý người dùng</Breadcrumb.Item>
                </Breadcrumb>
                {/* <button className="btn-add" onClick={() => {
                    setIsOpenModel(true);
                    setUserid("");
                }}>
                    Thêm mới
                    <i className="fas fa-plus-circle ml-2"></i>

                </button> */}
            </Flex>

            <div className="row">
                <div className="col-md-2">
                    
                </div>
                <div className="row col-md-10 my-4 d-flex justify-content-end" >

                    <DatePicker
                        className="form-control col-md-3"
                        placeholder="Chọn ngày ..."
                        onChange={handleDateChange}
                        format="DD-MM-YYYY"
                        style={{ marginLeft: '10px' }}
                    />
                    <input
                        type="text"
                        className="form-control col-md-3 mx-2"
                        placeholder="SĐT bệnh nhân ..."
                        value={s_patientPhone}
                        onChange={(e) => setS_patientPhone(e.target.value)}
                    />
                    <input
                        type="text"
                        className="form-control col-md-3 mx-2"
                        placeholder="Tên BN ..."
                        value={s_patientName}
                        onChange={(e) => setS_patientName(e.target.value)}
                    />
                    <button
                        className="btn"
                        style={{ marginLeft: '7px', backgroundColor: '#6A9AB0' }}
                    //onClick={handleSearch}
                    >
                        <i className="fas fa-search" style={{ color: 'white' }}></i>
                    </button>
                </div>

            </div>

            

            <Table
                columns={columns}
                rowKey={(record) => record.id}
                dataSource={data}
                pagination={tableParams.pagination}
                loading={loading}
                onChange={handleTableChange}
            />
            {isOpenModel ? (
                <DoctorModel
                    fetchData={fetchData}
                    handleCancel={handleCancelModel}
                    userid={userid}
                    onUpdateSuccess={handleUpdateSuccess} // Thêm hàm callback
                />
            ) : (
                <></>
            )}
            {/* {isOpenDelete ? (
        <UserDelete  fetchData = {fetchData} handleCancelDelete={handleCancelDelete} userid={userid} />
      ) : (
        <></>
      )}   */}

            <ToastContainer

            />
        </>
    );
};

export default Appointment;
