import React, { useEffect, useState } from "react";
import { Breadcrumb, Button, Flex, Table } from "antd";
import { DoctorSearch, getSpecialty } from "../services/doctor.services";
import DoctorDetailType from "../models/doctor.model";
import { ColumnsType, TableProps } from "antd/es/table";
import { TableParams } from "../models/config.model";
import DoctorModel from "../components/Doctor/DoctorModel";
import DoctorDelete from "../components/Doctor/DoctorDelete";

import moment from "moment";
import { getLocation, getAllTitle, getPaged_Spec } from "../services/general.services";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "../assets/styles/common.css"; 

const Doctor: React.FC = () => {
  const [doctorid, setdoctorid] = useState("");
  const [isOpenModel, setIsOpenModel] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [data, setData] = useState<DoctorDetailType[]>();
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 8,
    },
  });

  const [listProvince, setListProvince] = useState([]);
  const [listTitle, setListTitle] = useState([]);
  const [listSpecialties, setListSpecialties] = useState([]);
  const [selecteProvince, setSelecteProvince] = useState('');
  const [selecteTitle, setSelecteTitle] = useState(0);
  const [selectedSpecialty, setSelectedSpecialty] = useState(0);
  const [keyword, setKeyword] = useState('');


  async function loadTitle() {
    let items = await getAllTitle();
    setListTitle(items);
  }

  async function loadSpecialties() {
    let items = await getPaged_Spec({
      page: 1,
      pageSize: 100, 
    });
    setListSpecialties(items);
    console.log("listSpecialties", items);
  }

  const fetchData = async () => {
    setLoading(true);
    // let items = await getPaged_Doctor({
    //   page: page,
    //   pageSize: pageSize,
    //   specializationId: id,
    //   name: keyword,
    //   titleId: selecteTitle,
    //   address: selecteProvince,
    //   priceSorted: priceSort
    // });
    let results = await DoctorSearch({
      page: tableParams.pagination?.current,
      pageSize: tableParams.pagination?.pageSize,
      order: 1,
      name: keyword,
      titleId: selecteTitle,
      address: "",
      specialtyId: selectedSpecialty,
    });
    const doctorData = results.data;
    console.log("doccc  ", doctorData)

    setData(doctorData);

    setLoading(false);
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        total: results.totalItems,
      },
    });
  };

  const fetchDataWithSpecialty = async () => {
    setLoading(true);
    
    let results = await DoctorSearch({
      page: tableParams.pagination?.current,
      pageSize: tableParams.pagination?.pageSize,
      name: keyword,
      titleId: selecteTitle,
      address: "",
      specialtyId: selectedSpecialty,
    });
    const doctorData = results.data;
    console.log("doccc  ", doctorData)

    setData(doctorData);

    setLoading(false);
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        total: results.totalItems,
      },
    });
  };

  const columns: ColumnsType<DoctorDetailType> = [
    {
      title: "ID",
      dataIndex: "doctorId",
    },
    {
      title: "Ảnh",
      dataIndex: "avatar",
      render: (avatar: string) => (
        // <img src={`https://localhost:44393${avatar}`} alt="Doctor Avatar" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />

        <img
          src={`https://localhost:44393${avatar}`}
          alt="Doctor Avatar"
          style={{
            width: '50px',
            height: '50px',
            objectFit: 'cover',
            borderRadius: '50%'
          }}
        />

      ),
    },
    {
      title: "Họ và tên",
      dataIndex: "name",
    },
    // {
    //   title: "Ngày sinh",
    //   dataIndex: "dateOfBirth",
    //   //width: "200px",
    //   render: (_, record) => (<span>{moment(record.dateOfBirth).format("DD-MM-YYYY")}</span>)
    // },
    {
      title: "Giới tính",
      dataIndex: "gender",
      //width: "100px",
      render: (_, record) => (
        <span>
          {record.gender === "male"
            ? "Nam"
            : record.gender === "female"
              ? "Nữ"
              : "Không xác định"}
        </span>

      ),
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
    },
    {
      title: "Chuyên khoa", 
      dataIndex: "specName", 
      // render: (_, record: any) => <span>{record.specialtyName}</span>, 
    },
    {
      title: "Hành động",
      width: "120px",
      render: (_, record) => (
        <Flex justify="center">
          <Button
            onClick={() => {
              setIsOpenModel(true);
              setdoctorid(record.doctorId);
            }}
          >
            Sửa
          </Button>
          <Button style={{ marginLeft: '5px' }}
            onClick={() => {
              setIsOpenDelete(true);
              setdoctorid(record.doctorId);
            }}
          >
            Xóa
          </Button>
        </Flex>
      ),
    },
  ];

  // useEffect(() => {
  //   fetchDataWithSpecialty();
  //   loadTitle();
  //   loadSpecialties();
  // }, [selectedSpecialty]);


  useEffect(() => {
    fetchData();
    loadTitle();
    loadSpecialties();
  }, [JSON.stringify(tableParams), keyword, selecteProvince, selecteTitle, selectedSpecialty]);

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

  const onSuc = (message: string) => {
    
      toast.success(message, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    
  };


  const handleError = (message: string) => {

    toast.error(message);
  };

  return (
    <>
      <Flex justify="space-between" align="center">
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
          <Breadcrumb.Item>Quản lý thông tin bác sĩ</Breadcrumb.Item>
        </Breadcrumb>
        {/* <Button className="btn-add" onClick={() => {
          setIsOpenModel(true);
          setdoctorid("");
        }}>
          Thêm mới
          <i className="fas fa-plus-circle ml-2"></i>

        </Button> */}
      </Flex>
      {/* <button onClick={onSuc}>Nammo</button> */}
      <div className="row">
        <div className="col-md-2">
          <button className="btn-add" onClick={() => {
            setIsOpenModel(true);
            setdoctorid("");
          }}>
            Thêm mới
            <i className="fas fa-plus-circle ml-2"></i>

          </button>
        </div>

        <div className="row col-md-10 my-4 d-flex justify-content-end" >

          <div className="select-wrapper col-md-3" style={{ marginLeft: '7px' }}>
            <i className="far fa-address-card"></i>
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
          <div className="select-wrapper col-md-3" style={{ marginLeft: '7px' }}>
            <select
              className="form-control form-select"
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(Number(e.target.value))}
            >
              <option value={0}>Tất cả chuyên khoa</option>
              {listSpecialties.map((specItem: any) => (
                <option key={specItem.id} value={specItem.id}>
                  {specItem.name}
                </option>
              ))}
            </select>
          </div>
          <input
            type="text"
            className="form-control col-md-3"
            placeholder="Tên bác sĩ ..."
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
      </div>

      

      <Table
        columns={columns}

        dataSource={data}
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleTableChange}
      />
      {isOpenModel ? (
        <DoctorModel
          fetchData={fetchData}
          handleCancel={handleCancelModel}
          doctorid={doctorid}
          onSuccess={onSuc}
          onError={handleError}
        />
      ) : (
        <></>
      )}
      {isOpenDelete ? (
        <DoctorDelete  fetchData = {fetchData} handleCancelDelete={handleCancelDelete} doctorid={doctorid} />
      ) : (
        <></>
      )}  

      <ToastContainer

      />
    </>
  );
};

export default Doctor;
