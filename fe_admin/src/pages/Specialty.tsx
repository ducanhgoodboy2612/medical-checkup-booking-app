import React, { useEffect, useState } from "react";
import { Breadcrumb, Button, Flex, Table } from "antd";
import { searchSpecialty, deleteSpecialty, getSpecialtyById } from "../services/specialty.services";
import { ColumnsType, TableProps } from "antd/es/table";
import { TableParams } from "../models/config.model";
import SpecialtyModel from "../components/Specialty/SpecialtyModel";
import SpecialtyDelete from "../components/Specialty/SpecialtyDelete";

import moment from "moment";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "../assets/styles/common.css"; 

interface SpecialtyDetailType {
  id: number;
  name: string;
  description: string;
  image: string;
  createdAt: string;
}

const Specialty: React.FC = () => {
  const [specialtyId, setSpecialtyId] = useState("");
  const [isOpenModel, setIsOpenModel] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [data, setData] = useState<SpecialtyDetailType[]>();
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 8,
    },
  });

  const [keyword, setKeyword] = useState('');

  const fetchData = async () => {
    setLoading(true);
    let results = await searchSpecialty({
      pageIndex: tableParams.pagination?.current,
      pageSize: tableParams.pagination?.pageSize,
      keyword: keyword,
    });
    const specialtyData = results;
    console.log("Specialty Data:", specialtyData);

    setData(specialtyData);

    setLoading(false);
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        total: results.totalItems,
      },
    });
  };

  const columns: ColumnsType<SpecialtyDetailType> = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Ảnh",
      dataIndex: "image",
      render: (image: string) => (
        <img
          src={`/img/spec/${image}`}
          alt="Specialty Image"
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
      title: "Tên chuyên khoa",
      dataIndex: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (_, record) => (<span>{moment(record.createdAt).format("DD-MM-YYYY")}</span>)
    },
    {
      title: "Hành động",
      width: "120px",
      render: (_, record) => (
        <Flex justify="center">
          <Button
            onClick={() => {
              setIsOpenModel(true);
              setSpecialtyId(record.id.toString());
            }}
          >
            Sửa
          </Button>
          <Button style={{ marginLeft: '5px' }}
            onClick={() => {
              setIsOpenDelete(true);
              setSpecialtyId(record.id.toString());
            }}
          >
            Xóa
          </Button>
        </Flex>
      ),
    },
  ];

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(tableParams), keyword]);

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
          <Breadcrumb.Item>Quản lý chuyên khoa</Breadcrumb.Item>
        </Breadcrumb>
      </Flex>
      <div className="row">
        <div className="col-md-2">
          <button className="btn-add" onClick={() => {
            setIsOpenModel(true);
            setSpecialtyId("");
          }}>
            Thêm mới
            <i className="fas fa-plus-circle ml-2"></i>
          </button>
        </div>
        <div className="row col-md-10 my-4 d-flex justify-content-end" >
          <input
            type="text"
            className="form-control col-md-3"
            placeholder="Tên chuyên khoa ..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button
            className="btn"
            style={{ marginLeft: '7px', backgroundColor: '#6A9AB0' }}
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
        <SpecialtyModel
          fetchData={fetchData}
          handleCancel={handleCancelModel}
          specialtyId={specialtyId}
          onSuccess={onSuc}
          onError={handleError}
        />
      ) : (
        <></>
      )}
      {isOpenDelete ? (
        <SpecialtyDelete  fetchData = {fetchData} handleCancelDelete={handleCancelDelete} specialtyId={specialtyId} />
      ) : (
        <></>
      )}

      <ToastContainer />
    </>
  );
};

export default Specialty;
