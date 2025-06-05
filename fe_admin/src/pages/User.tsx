import React, { useEffect, useState } from "react";
import { Breadcrumb, Button, Flex, Table } from "antd";
import { UserSearch } from "../services/user.services";
import UserType from "../models/user.model";
import { ColumnsType, TableProps } from "antd/es/table";
import { TableParams } from "../models/config.model";
import UserModel from "../components/UserModel";
import UserDelete from "../components/UserDelete";

import UserModel2 from "../components/userModel2";
import moment from "moment";

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const User: React.FC = () => {
  const [userid, setUserid] = useState("");
  const [isOpenModel, setIsOpenModel] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [data, setData] = useState<UserType[]>();
  const [loading, setLoading] = useState(false);

  const [s_userName, setS_userName] = useState('');
  const [s_usertEmail, sets_usertEmail] = useState('');

  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 8,
    },
  });

  const fetchData = async () => {
    setLoading(true);
    let results = await UserSearch({
      page: tableParams.pagination?.current,
      pageSize: tableParams.pagination?.pageSize,
      name: s_userName,
      email: s_usertEmail,
      order: 1
    });
    console.log("res   ",results.data)
    setData(results.data);
    setLoading(false);
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        total: results.totalItems,
      },
    });
  };

  const columns: ColumnsType<UserType> = [
    {
      title: "ID",
      dataIndex: "id",
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
    {
      title: "Ngày sinh",
      dataIndex: "dateOfBirth",
      width: "200px",
      render: (_, record) => (<span>{moment(record.dateOfBirth).format("DD-MM-YYYY")}</span>)
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      width: "100px",
      render: (_, record) => (
        <span>{record.gender === "male" ? "Nam" : "Nữ"}</span>
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
      title: "Vai trò",
      dataIndex: "roleId",
      render: (roleId) => {
        switch (roleId) {
          case 1: return 'Admin';
          case 2: return 'Doctor';
          case 3: return 'Supporter';
          case 4: return 'User';
          default: return 'None';
        }
      }
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
          <Button style={{ marginLeft: '5px' }}
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
    fetchData();
  }, [JSON.stringify(tableParams), s_userName, s_usertEmail]);

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

  const onError = (message: string) => {
    toast.error(message);
  };

  return (
    <>
      <Flex justify="space-between" align="center">
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
          <Breadcrumb.Item>Quản lý người dùng</Breadcrumb.Item>
        </Breadcrumb>

      </Flex>
      <div className="row">
        <div className="col-md-2">
          <button  className="btn-add" onClick={() => {
            setIsOpenModel(true);
            setUserid("");
          }}>
            Thêm mới
          </button>
        </div>
        <div className="row col-md-10 my-4 d-flex justify-content-end" >


          <input
            type="text"
            className="form-control col-md-3 mx-2"
            placeholder="Email ..."
            value={s_usertEmail}
            onChange={(e) => sets_usertEmail(e.target.value)}
          />
          <input
            type="text"
            className="form-control col-md-3 mx-2"
            placeholder="Họ tên ..."
            value={s_userName}
            onChange={(e) => setS_userName(e.target.value)}
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
        <UserModel2
          fetchData={fetchData}
          handleCancel={handleCancelModel}
          userid={userid}
          onSuccess={onSuc}
          onError={onError}
        />
      ) : (
        <></>
      )}
      {isOpenDelete ? (
        <UserDelete
          fetchData={fetchData}
          handleCancelDelete={handleCancelDelete}
          userid={userid}
          onSuccess={onSuc}
          onError={onError}
        />
      ) : (
        <></>
      )}

      <ToastContainer

      />
    </>
  );
};

export default User;
