import React, { useState, useEffect } from 'react';
import { getPaged_Spec, getAllTitles } from '../services/general.services';
import { DoctorSearch } from '../services/doctor.services';
import { Link, useParams, useLocation } from 'react-router-dom';
import { DatePicker } from 'antd';
import moment, { Moment } from 'moment';
import { Modal, Table } from 'antd'; // Import Modal and Table from antd


import { getSchedules } from '../services/schedule.services'; // Assuming you have a service to fetch schedules
import { getPatientsBySchedule } from '../services/schedule.services'; // Assuming you have a service to fetch patients

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

interface Patient {
  id: number;
  name: string;
  phone: string;
  email: string;
  gender: string;
  yearOfBirth: string;
  address: string;
  description: string;
  type: string;
  dateBooking: string;
  timeBooking: string;
}

interface PatientData {
  maxBooking: string;
  sumBooking: string;
  patients: Patient[];
}


type CartItem = {
  doctorId: string;
  doctorName: string;
  title: string;
  date: string;
  time: string;
  scheduleId: number;
  bookingPrice: number;
};

const Schedule = () => {
  const [specialties, setSpecialties] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [doctors, setDoctors] = useState([]);

  const { id } = useParams<DataParams>();
  const [data, setDatas] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageCount, setPageCount] = useState(0);
  const location = useLocation();
  const [schedules, setSchedules] = useState<{ [key: number]: Schedule[] }>({});
  const [selectedDates, setSelectedDates] = useState<Record<number, string>>({});

  const [keyword, setKeyword] = useState(''); // For doctor name search
  const [listTitle, setListTitle] = useState<any[]>([]); // To store titles
  const [selectedTitleId, setSelectedTitleId] = useState<number>(0); // For selected title

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('multi-spec-doctors');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [baseDate, setBaseDate] = useState<Date>(new Date());

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [patientData, setPatientData] = useState<PatientData | null>(null);


  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const response = await getPaged_Spec({ page: 1, pageSize: 100, keyword: '' });
        const fetchedSpecialties = response || [];
        setSpecialties(fetchedSpecialties);
        console.log('Specialties:', fetchedSpecialties);
        if (fetchedSpecialties.length > 0) {
          setSelectedSpecialty(fetchedSpecialties[0].id); // Automatically select the first specialty
        }
      } catch (error) {
        console.error('Error fetching specialties:', error);
      }
    };

    const loadTitles = async () => {
      try {
        const titles = await getAllTitles();
        setListTitle([{ id: 0, name: "Tất cả chức danh" }, ...titles]); // Add an option for all titles
      } catch (error) {
        console.error('Error fetching titles:', error);
      }
    };

    // No longer need to load from localStorage here as it's done in useState
    fetchSpecialties();
    loadTitles();
  }, []);

  const handleSearch = () => {
    // This function will trigger the doctor fetch with new search params
    // The actual fetching is handled by the useEffect below
    // We just need to ensure this function exists to be called by a button
    // and that the useEffect for fetchDoctors depends on keyword and selectedTitleId
    fetchDoctors();
  };

  const fetchDoctors = async () => {
    setDatas([]);
    if (selectedSpecialty) {
      try {
        const params: any = {
          page: 1,
          pageSize: 10,
          SpecialtyId: selectedSpecialty,
          name: keyword, // Add keyword for name search
        };
        if (selectedTitleId !== 0) {
          params.titleId = selectedTitleId; // Add titleId if selected
        }
        const items = await DoctorSearch(params);
        setDatas(items.data || []); // Ensure items.data is not undefined
        setPageCount(Math.ceil((items.totalItems || 0) / pageSize));


        const days = getNext7Days();

        if (items.data) {
          items.data.forEach((doctor: any) => {
            let selectedDate = selectedDates[doctor.doctorId] || days[0].value; // Chọn ngày đầu tiên nếu chưa có ngày nào được chọn
            handleDateChange(doctor.doctorId, selectedDate); // Gọi handleDateChange để cập nhật ngày đã chọn
          });
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setDatas([]); // Clear data on error
        setPageCount(0);
      }
    } else {
      setDoctors([]); // This state seems unused, data is used for doctors list
      setDatas([]); // Clear data if no specialty is selected
      setPageCount(0);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [selectedSpecialty, keyword, selectedTitleId, page, pageSize]); // Add keyword and selectedTitleId to dependencies

  // const getNext7Days = () => {
  //   const today = new Date();
  //   const days = [];
  //   for (let i = 1; i <= 7; i++) {
  //     const nextDay = new Date(today);
  //     nextDay.setDate(today.getDate() + i);

  //     const dayName = nextDay.toLocaleDateString('vi-VN', { weekday: 'long' });
  //     const dayNumber = nextDay.getDate();
  //     const month = nextDay.getMonth() + 1; // Tháng bắt đầu từ 0 nên phải cộng thêm 1
  //     const year = nextDay.getFullYear();

  //     const text = `${dayName.charAt(0).toUpperCase() + dayName.slice(1)} - ${dayNumber}/${month}`;
  //     const value = nextDay.toDateString();

  //     days.push({ text, value });
  //   }
  //   return days;
  // };

  const getNext7Days = (startDate: Date = new Date()) => {
    const days = [];
    for (let i = 1; i <= 7; i++) {
      const nextDay = new Date(startDate);
      nextDay.setDate(startDate.getDate() + i);

      const dayName = nextDay.toLocaleDateString('vi-VN', { weekday: 'long' });
      const dayNumber = nextDay.getDate();
      const month = nextDay.getMonth() + 1;
      const year = nextDay.getFullYear();

      const text = `${dayName.charAt(0).toUpperCase() + dayName.slice(1)} - ${dayNumber}/${month}`;
      const value = nextDay.toDateString();

      days.push({ text, value });
    }
    return days;
  };

  const days = getNext7Days(baseDate);

  useEffect(() => {
    if (data.length > 0) {
      const firstDay = days[0]?.value;
      if (firstDay) {
        const newSelectedDates: Record<number, string> = {};
        data.forEach((doctor: any) => {
          newSelectedDates[doctor.doctorId] = firstDay;
          loadSchedulesForDoctor(doctor.doctorId, firstDay);
        });
        setSelectedDates(newSelectedDates);
      }
    }
    // eslint-disable-next-line
  }, [baseDate, data.length]);


  const handleDateChange = (doctorId: number, date: string) => {
    setSelectedDates(prevDates => ({
      ...prevDates,
      [doctorId]: date,
    }));

    loadSchedulesForDoctor(doctorId, date);
    //console.log("... ", schedules);
  };

  const loadSchedulesForDoctor = async (doctorId: number, date: string) => {
    console.log("baseDate:", baseDate);
    console.log("moment(baseDate):", moment(baseDate).format('YYYY-MM-DD'));
    try {
      const schedule = await getSchedules({ doctorId, date });
      console.log(schedule);
      if (schedule != null) {
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

  const showPatientModal = async (scheduleId: number) => {
    try {
      const data = await getPatientsBySchedule(scheduleId);
      setPatientData(data);
      setIsModalVisible(true);
    } catch (error) {
      console.error('Error fetching patient data:', error);
      setPatientData(null);
      setIsModalVisible(true); // Still show modal to indicate error or no data
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setPatientData(null);
  };

  const patientTableColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: 'Năm sinh',
      dataIndex: 'yearOfBirth',
      key: 'yearOfBirth',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'dateBooking',
      key: 'dateBooking',
    },
    {
      title: 'Giờ đặt',
      dataIndex: 'timeBooking',
      key: 'timeBooking',
    },
  ];


  const titles: { [key: number]: string } = {
    1: "",
    2: "Thạc sĩ",
    3: "Phó Tiến sĩ",
    4: "Tiến sĩ",
    5: "Giáo sư",
    6: "Phó Giáo sư",
    7: "Phó Giáo sư, Tiến sĩ"
  };

  const addToCart = (doctor: any, scheduleId: number, time: string) => {
    const selectedDate = selectedDates[doctor.doctorId] || '';
    if (!selectedDate) {
      alert('Vui lòng chọn ngày khám');
      return;
    }
    console.log('Selected date:', selectedDate);
    // Find selected day text
    const selectedDay = days.find(day => day.value === selectedDate)?.text || '';

    // Create cart item
    const cartItem: CartItem = {
      doctorId: doctor.doctorId,
      doctorName: doctor.name,
      title: titles[doctor.titleId],
      date: selectedDate,
      time: time,
      scheduleId: scheduleId,
      bookingPrice: doctor.bookingPrice
    };

    // Check if this doctor already exists in cart
    let updatedCart: CartItem[] = [];

    const existingItemIndex = cartItems.findIndex(item => item.doctorId === doctor.doctorId);

    if (existingItemIndex >= 0) {
      updatedCart = [...cartItems];
      updatedCart[existingItemIndex] = cartItem;
    } else {
      updatedCart = [...cartItems, cartItem];
    }
    console.log('edit cart:', updatedCart);
    setCartItems(updatedCart);
    localStorage.setItem('multi-spec-doctors', JSON.stringify(updatedCart));
  };

  // Remove from cart
  const removeFromCart = (doctorId: string) => {
    const updatedCart = cartItems.filter(item => item.doctorId !== doctorId);
    setCartItems(updatedCart);
  };

  useEffect(() => {
    localStorage.setItem('multi-spec-doctors', JSON.stringify(cartItems));
    console.log('Cart items updated:', cartItems);
  }, [cartItems]);

  const [date, setDate] = useState(new Date());

  return (
    <div className="container mt-5">
      <div className="row">
        {/* Specialty Section */}
        <div className="col-md-3">
          <h3>Chuyên Khoa</h3>
          <ul className="list-group">
            {specialties.map((specialty: any) => (
              <li
                key={specialty.id}
                className={`list-group-item ${selectedSpecialty === specialty.id ? 'active' : ''}`}
                onClick={() => setSelectedSpecialty(specialty.id)}
                style={{ cursor: 'pointer' }}
              >
                {specialty.name}
              </li>
            ))}
          </ul>

          {/* Cart Summary Section */}
          {cartItems.length > 0 && (
            <div className="mt-4">
              <h3>Lịch Đã Chọn</h3>
              <div className="list-group">
                {cartItems.map((item) => (
                  <div key={item.doctorId} className="list-group-item">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6>{item.title} {item.doctorName}</h6>
                        <small>{item.date}</small><br />
                        <small>Giờ khám: {item.time}</small><br />
                        <small>Giá: {item.bookingPrice ? `${item.bookingPrice}.000đ` : 'N/A'}</small>
                      </div>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => removeFromCart(item.doctorId)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
                <div className="list-group-item">
                  <div className="d-flex justify-content-between">
                    <p>Tổng cộng:</p>
                    <strong>{cartItems.reduce((sum, item) => sum + (item.bookingPrice || 0), 0)}.000đ</strong>
                  </div>
                  <Link to="/booking" className="btn btn-success btn-sm w-100 mt-2">
                    Đặt lịch khám
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Doctors Section */}
        <div className="col-md-9">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>Bác Sĩ</h3>
            <div className="d-flex">

              <DatePicker
                className="me-2"
                // value={baseDate ? moment(baseDate) : null}
                format="DD/MM/YYYY"
                onChange={(date: Moment | null) => {
                  if (date) setBaseDate(date.toDate());
                }}
                style={{ width: '150px' }}
                allowClear={false}
              />

              {/* <DatePicker
                //value={moment(date)}
                format="DD/MM/YYYY"
                onChange={(value) => {
                  if (value) {
                    const jsDate = value.toDate();
                    console.log('Selected date:', jsDate);
                    // setDate(jsDate);
                  }
                }}
                allowClear={false}
                style={{ width: 200 }}
              /> */}

              <select
                className="form-select me-2"
                value={selectedTitleId}
                onChange={(e) => setSelectedTitleId(Number(e.target.value))}
                style={{ width: '200px' }}
              >
                {listTitle.map((title: any) => (
                  <option key={title.id} value={title.id}>
                    {title.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                className="form-control me-2"
                placeholder="Tìm theo tên bác sĩ"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
                style={{ width: '250px' }}
              />
              <button
                className="btn btn-primary"
                onClick={handleSearch}
              >
                Tìm
              </button>
            </div>
          </div>

          <div className="row g-1" >
            {data.length > 0 ? data.map((x: any, index: number) => (
             

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
                        src={`https://localhost:44393${x.avatar}`}
                        className="img-fluid rounded-circle"
                        alt="Doctor Image"
                      />

                      <Link to={"/doctor-info/" + x.doctorId}>Xem thêm</Link>
                    </div>
                    <div className="col-md-10" style={{ paddingLeft: 20 }}>
                      <div className="card-body">
                        <h5 className="card-title">{titles[x.titleId]} Bác sĩ {x.name}</h5>

                        
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
                                <button className="btn btn-info w-100 my-2" onClick={() => showPatientModal(schedule.id)} style={{ fontSize: 14 }}>
                                  {schedule.time}
                                </button>
                              </div>
                            ))}
                            {/* {schedules[x.doctorId]?.length > 0 && (
                              <div className="col-12">
                                <p>
                                  <strong style={{ color: '#5BC0AB' }}>ĐỊA CHỈ KHÁM:</strong>
                                  <br />
                                  {schedules[x.doctorId][0].clinicName}, {schedules[x.doctorId][0].clinicAdd}
                                </p>
                              </div>
                            )} */}
                            {!schedules[x.doctorId] && <p>Không có lịch khám.</p>}
                            <div className="col-md-12 doctor-add">
                              <p className="booking-price">
                                GIÁ KHÁM: {x.bookingPrice ? `${x.bookingPrice}.000đ` : 'N/A'}
                              </p>
                             
                            </div>
                          </div>
                        
                        
                      </div>
                    </div>
                    {/* <div className="col-md-6 p-3">


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
                            <button className="btn btn-outline-success w-100" onClick={() => addToCart(x, 1, schedule.time)} style={{ fontSize: 14 }}>
                              {schedule.time}
                            </button>
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
                          <p className="booking-price">
                            GIÁ KHÁM: {x.bookingPrice ? `${x.bookingPrice}.000đ` : 'N/A'}
                          </p>
                          <p>
                            Loại bảo hiểm áp dụng: <a className="view-detail-link" href="#">Xem chi tiết</a>
                          </p>
                        </div>
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
            )) : <p>Không tìm thấy bác sĩ nào phù hợp.</p>}
            {/* </div> */}
          </div>
          {/* Pagination can be added here if needed, similar to Doctors.tsx */}
        </div>
      </div>

      <Modal
        title="Danh sách bệnh nhân đã đặt lịch"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={800}
      >
        {patientData ? (
          <>
            <p>Số lượng đặt lịch tối đa: {patientData.maxBooking}</p>
            <p>Tổng số lượng đã đặt: {patientData.sumBooking}</p>
            <Table
              dataSource={patientData.patients}
              columns={patientTableColumns}
              rowKey="id"
              pagination={false}
            />
          </>
        ) : (
          <p>Không có dữ liệu bệnh nhân cho lịch này.</p>
        )}
      </Modal>
    </div>
  );
};

export default Schedule;
