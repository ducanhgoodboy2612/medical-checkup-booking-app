import axios from 'axios';
import { Component } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
// import "../assets/css/style_category.css";
import { Link, useParams } from "react-router-dom";
import ReactPaginate from "react-paginate";

import { getPaged_Doctor } from "../../services/home.service";
import { getSchedules } from "../../services/booking.services";

import { getClinicByDoctor, createSchedule, deleteSchedules } from "../../services/doctor.services";
import "../../assets/style/bootstrap.min.css";
import "../../assets/style/doctor-info.css";


type DataParams = {
    id: string;

};

interface Schedule {
    id: number
    date: string;
    time: string;
}

interface Clinic {
    id: number;
    name: string;
}

interface SelectedTimeSlots {
    [key: string]: string[];
}
const Schedule_Checking = function () {
    const { id } = useParams<DataParams>();
    const [data, setDatas] = useState([]);
    const [clinics, setClinics] = useState<Clinic[]>([]);
    const [selectedTimeSlots, setSelectedTimeSlots] = useState<SelectedTimeSlots>({});
    const [selectedClinics, setSelectedClinics] = useState<{ [key: string]: number | null }>({});


    const [doctorId, setDoctorId] = useState(0);

    const navigate = useNavigate();
    useEffect(() => {
        const user = localStorage.getItem('user');
        const parsedUser = user ? JSON.parse(user) : null;
        if (!parsedUser || parsedUser.roleId != 2) {
            navigate('/login');
        }
        setDoctorId(parsedUser.id)
        async function loadClinics() {
            let items = await getClinicByDoctor({
                doctorId: parsedUser.id,

            });
            setClinics(items);

        }
        loadClinics();
        fetchSchedules(parsedUser.id);
    }, []);

    const getNext7Days = () => {
        const today = new Date();
        const days = [];
        for (let i = 1; i <= 7; i++) {
            const nextDay = new Date(today);
            nextDay.setDate(today.getDate() + i);

            const dayName = nextDay.toLocaleDateString('vi-VN', { weekday: 'long' });
            const dayNumber = nextDay.getDate();
            const month = nextDay.getMonth() + 1; // Tháng bắt đầu từ 0 nên phải cộng thêm 1
            const year = nextDay.getFullYear();

            const text = `${dayName.charAt(0).toUpperCase() + dayName.slice(1)} - ${dayNumber}/${month}`;
            const value = nextDay.toDateString();

            days.push({ text, value });
        }
        return days;
    };

    const fetchSchedules = async (doctorId: number) => {
        try {
            const days = getNext7Days();
            const schedulesData: SelectedTimeSlots = {};
            for (const day of days) {
                const response = await getSchedules({
                    doctorId: doctorId,
                    date: day.value
                });
                console.log("timeslots:  ", response);
                if (response) {
                    const timeslots = response.map((schedule: any) => schedule.time);
                    console.log("times:  ", timeslots);

                    schedulesData[day.value] = timeslots;
                }

            }

            setSelectedTimeSlots(schedulesData);
        } catch (error) {
            console.error("Error fetching schedules:", error);
        }
    };

    const handleTimeSlotClick = (day: string, slot: string) => {
        setSelectedTimeSlots((prevSelected) => {
            const selectedForDay = prevSelected[day] || [];

            // Check if the slot has already been selected
            if (selectedForDay.includes(slot)) {
                // Deselect the time slot
                return {
                    ...prevSelected,
                    [day]: selectedForDay.filter((s) => s !== slot),
                };
            } else {
                // Select the time slot
                return {
                    ...prevSelected,
                    [day]: [...selectedForDay, slot],
                };
            }
        });
    };



    const days = getNext7Days();
    const timeSlots: string[] = [];
    for (let hour = 8; hour < 18; hour++) {
        const nextHour = hour + 1;
        timeSlots.push(`${hour}:00 - ${nextHour}:00`);
    }

    const handleClinicChange = (day: string, clinicId: number) => {
        setSelectedClinics((prevSelected) => ({
            ...prevSelected,
            [day]: clinicId,
        }));
    };

    const handleSaveSchedules = async () => {
        console.log(selectedClinics);

        const days = getNext7Days();
        for (const day of days) {
            const response = await deleteSchedules({
                doctorId: doctorId,
                date: day.value
            });
            console.log("timeslots:  ", response);

        }

        const schedules = Object.keys(selectedTimeSlots).flatMap((day) => {
            return selectedTimeSlots[day].map((timeSlot: string) => ({
                doctorId: doctorId,
                date: day,
                time: timeSlot,
                maxBooking: "30",
                sumBooking: "0",
            }));
        });
        console.log(schedules);
        try {
            await createSchedule(schedules);
            alert('Lưu lịch thành công!');
        } catch (error) {
            console.error('Lỗi khi lưu lịch:', error);
            alert('Có lỗi xảy ra khi lưu lịch.');
        }
    };


    return (


        <div className="container mt-5 mb-5">

            {days.map((day, dayIndex) => (
                <div className="doctor-card" key={dayIndex}>
                    <div className="row g-0">
                        {/* Doctor Information Section */}
                        <p>{day.text}</p>
                        <div className="row g-2">
                            <div className="col-lg-8 col-md-6">
                                <div className="row">
                                    {timeSlots.map((slot, slotIndex) => (
                                        <div className="col-lg-3 mt-2" key={slotIndex}>
                                            <button
                                                className="w-100"
                                                style={{
                                                    fontSize: 16,
                                                    height: 40,
                                                    backgroundColor: selectedTimeSlots[day.value]?.includes(slot)
                                                        ? 'lightblue'
                                                        : 'white',
                                                }}
                                                onClick={() => handleTimeSlotClick(day.value, slot)}
                                            >
                                                {slot}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6 p-3">
                                <p>Chọn địa chỉ khám</p>
                                <select
                                    className="form-select"
                                    value={selectedClinics[day.value] || ''}
                                    onChange={(e) => handleClinicChange(day.value, parseInt(e.target.value))}
                                >
                                    <option value="" disabled>Chọn địa chỉ khám</option>
                                    {clinics.map((clinic: any, index: number) => (
                                        <option key={index} value={clinic.id}>
                                            {clinic.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                        </div>

                    </div>
                </div>
            ))}

            <div className=" bottom-0 end-0 mt-4 " >
                <button className="btn btn-primary px-5 py-2" style={{ backgroundColor: '#5ABFAA' }} onClick={handleSaveSchedules}>
                    Lưu lịch
                </button>
            </div>
        </div>

    );

}
export default Schedule_Checking;