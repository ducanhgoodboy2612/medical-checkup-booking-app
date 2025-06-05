import React, { useEffect, useState } from "react";
import { Breadcrumb, Button, Flex, Table } from "antd";
import { getPaged_Patients } from "../services/general.services";
import { getPaged_Clinic } from "../services/clinic.service";
import { getLocation } from "../services/general.services";
import { DatePicker } from 'antd';
import ClinicDetailType from "../models/clinic.model";
import { ColumnsType, TableProps } from "antd/es/table";
import { TableParams } from "../models/config.model";
import ClinicModel from "../components/Clinic/ClinicModel";
import ClinicDelete from "../components/Clinic/ClinicDelete";
import moment from "moment";

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "../assets/styles/common.css";


const Clinic: React.FC = () => {
    const [userid, setUserid] = useState("");
    const [isOpenModel, setIsOpenModel] = useState(false);
    const [isOpenDelete, setIsOpenDelete] = useState(false);
    const [data, setData] = useState<ClinicDetailType[]>();
    const [loading, setLoading] = useState(false);
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 8,
        },
    });
    const [listProvince, setListProvince] = useState([]);
    const [selecteProvince, setSelecteProvince] = useState('');
    const [selecteTitle, setSelecteTitle] = useState(0);
    const [keyword, setKeyword] = useState('');

    async function loadLocation() {
        let items = await getLocation({
            keyword: ""
        });
        setListProvince(items);
    }

    const fetchData = async () => {
        setLoading(true);

        let results = await getPaged_Clinic({
            page: tableParams.pagination?.current,
            pageSize: tableParams.pagination?.pageSize,
            key_name: keyword,
            address: selecteProvince,
        });
        console.log("cli  ", results)

        

        setData(results.data);

        // setData(results.data);
        setLoading(false);
        setTableParams({
            ...tableParams,
            pagination: {
                ...tableParams.pagination,
                total: results.totalItems,
            },
        });
    };

    const columns: ColumnsType<ClinicDetailType> = [
        {
            title: "ID",
            dataIndex: "id",
        },
        {
            title: "Tên Phòng Khám",
            dataIndex: "name",
        },
        {
            title: "Địa chỉ",
            dataIndex: "address",
        },
        {
            title: "Số điện thoại",
            dataIndex: "phone",
        },
        {
            title: "Ghi chú",
            dataIndex: "description",
        },
        // {
        //     title: "Giới thiệu HTML",
        //     dataIndex: "introductionHtml",
        //     render: (_, record) => (
        //         <span
        //             dangerouslySetInnerHTML={{ __html: record.introductionHtml }}
        //         />
        //     ),
        // },
        // {
        //     title: "Giới thiệu Markdown",
        //     dataIndex: "introductionMarkdown",
        // },
        {
            title: "Hình ảnh",
            dataIndex: "image",
            render: (_, record) => (
                <img
                    src={record.image}
                    alt="clinic image"
                    style={{ width: 100, height: 100 }}
                />
            ),
        },
        {
            title: "Hành động",
            width: "120px",
            render: (_, record) => (
                <Flex justify="center">
                    <Button
                        onClick={() => {
                            setIsOpenModel(true);
                            setUserid(record.id);
                        }}
                    >
                        Sửa
                    </Button>
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

    useEffect(() => {
        loadLocation();
        fetchData();
    }, [JSON.stringify(tableParams), keyword, selecteProvince]);

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

    

    return (
        <>
            <Flex justify="space-between" align="center">
                <Breadcrumb style={{ margin: "16px 0" }}>
                    <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
                    <Breadcrumb.Item>Quản lý bệnh viện</Breadcrumb.Item>
                </Breadcrumb>
                <Button className="btn-add" onClick={() => {
                    setIsOpenModel(true);
                    setUserid("");
                }}>
                    Thêm mới
                    <i className="fas fa-plus-circle ml-2"></i>

                </Button>
            </Flex>

            <div className="row col-md-12 my-4 d-flex justify-content-end" >

                <div className="select-wrapper col-md-3" style={{ marginLeft: '7px' }}>
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
                <input
                    type="text"
                    className="form-control col-md-3"
                    placeholder="Tên bệnh viện ..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
                <button
                    className="btn"
                    style={{ marginLeft: '7px', backgroundColor: '#6A9AB0' }}
                //onClick={handleSearch}
                >
                    <i className="fas fa-search" style={{ color: 'white' }}></i>
                </button>
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
                <ClinicModel
                    fetchData={fetchData}
                    handleCancel={handleCancelModel}
                    userid={userid}
                    onUpdateSuccess={handleUpdateSuccess} // Thêm hàm callback
                />
            ) : (
                <></>
            )}
            {isOpenDelete ? (
                <ClinicDelete  fetchData = {fetchData} handleCancelDelete={handleCancelDelete} userid={userid} />
            ) : (
                <></>
            )}  

            <ToastContainer

            />
        </>
    );
};

export default Clinic;
