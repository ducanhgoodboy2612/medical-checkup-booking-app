import { createBrowserRouter } from "react-router-dom";
import ScrollToTop from "./shared/ScrollToTop";
import AppLayout from "./shared/AppLayout";
import ErrorBoundary from "./shared/ErrorBoundary";
import {
  HOME_PATH, DOCTOR_PATH, BOOKING_PATH, DOCTOR_INFO_PATH, LOGIN_PATH, CLINIC_PATH, SPECIALTIES_PATH,
  DOCTOR_PAGE, APPOINT_PAGE, DOCTOR_APPOINT_PAGE, PATIENT_INFO_PATH, DOCTOR_SCHEDULE_PATH, PATIENT_MEDICAL_RECORD_PATH,
  NOTIFICATION_PATH, SELECTED_DOCTOR_PATH, MULTI_DEPARTEMENT_CHECKUP_PATH, USER_INFO_PATH, REGISTER_PATH,
  MEDICAL_RECORDS_PATH
  
} from "./paths";
import Home from "./pages/Home";
import Doctor from "./pages/Doctors";
import Booking from "./pages/Booking";
import DoctorInfo from "./pages/DoctorInfo";
import Login from "./pages/Login";
import Home_Doctor from "./pages/doctor-pages/Home_Doctor";
import Appointments from "./pages/Appointment";
import Appointment_Doctor from "./pages/doctor-pages/Appointment_Doctor";
import DoctorPage_Info from "./pages/doctor-pages/Patient_Info";
import PatientInfo from "./pages/doctor-pages/Patient_Info";
import Schedule_Checking from "./pages/doctor-pages/Schedule_Checking";
import Clinic from "./pages/Clinics";
import Specialties from "./pages/Specialties";
import Medical_Record from "./pages/doctor-pages/Medical_Record";
import Notification from "./pages/Notification";
import Doctor_Cart from "./pages/Doctor_Cart";
import Multi_Specialty_Booking from "./pages/Multi_Specialty_Booking";
import ProtectedComponent from "./shared/ProtectComponent";
import ProtectedComponent_Doctor from "./shared/ProtectComponent_Doctor";
import UserInfo from "./pages/UserInfo";
import Register from "./pages/Register";
import Medical_Records from "./pages/MedicalRecords";

const routers = createBrowserRouter([
  {
    path: '',
    element: (
      <>
        {' '}
        <ScrollToTop />
        <AppLayout />
      </>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: HOME_PATH,
        element: <Home />,
      },
      {
        path: REGISTER_PATH,
        element: <Register />,
      },
      {
        path: DOCTOR_PATH,
        element: <Doctor />,
      },
      {
        path: CLINIC_PATH,
        element: <Clinic />,
      },
      {
        path: SPECIALTIES_PATH,
        element: <Specialties />,
      },
      {
        path: BOOKING_PATH,
        element: <Booking />,
      },
      {
        path: DOCTOR_INFO_PATH,
        element: <DoctorInfo />,
      },
      {
        path: LOGIN_PATH,
        element: <Login />,
      },
      {
        path: NOTIFICATION_PATH,
        element: <Notification />,
      },
      {
        path: MEDICAL_RECORDS_PATH,
        element: <Medical_Records />,
      },
      {
        path: DOCTOR_PAGE,
        element: (
          <ProtectedComponent_Doctor>
            <Appointment_Doctor />
          </ProtectedComponent_Doctor>
        ),
      },
      {
        path: APPOINT_PAGE,
        element: (
          <ProtectedComponent>
            <Appointments />
          </ProtectedComponent>
        ), 
      },
      {
        path: DOCTOR_APPOINT_PAGE,
        element: (
          <ProtectedComponent_Doctor>
            <Appointment_Doctor />
          </ProtectedComponent_Doctor>
        ),
      },
      {
        path: PATIENT_INFO_PATH,
        element: (
          <ProtectedComponent_Doctor>
            <PatientInfo />
          </ProtectedComponent_Doctor>
        ),
      },
      {
        path: DOCTOR_SCHEDULE_PATH,
        element: (
          <ProtectedComponent_Doctor>
            <Schedule_Checking />
          </ProtectedComponent_Doctor>
        ),
      },
      {
        path: PATIENT_MEDICAL_RECORD_PATH,
        element: <Medical_Record />,
      },
      {
        path: SELECTED_DOCTOR_PATH,
        element: <Doctor_Cart />,
      },
      {
        path: MULTI_DEPARTEMENT_CHECKUP_PATH,
        element: <Multi_Specialty_Booking />,
      },

      {
        path: USER_INFO_PATH,
        element: (
          <ProtectedComponent>
            <UserInfo />
          </ProtectedComponent>
        ),
      },
    ],
  }
]);

export default routers;