import { createBrowserRouter } from "react-router-dom";
import ScrollToTop from "./shared/ScrollToTop";
import AppLayout from "./shared/AppLayout";
import ErrorBoundary from "./shared/ErrorBoundary";
import {
  HOME_PATH, DOCTOR_PATH, BOOKING_PATH, DOCTOR_INFO_PATH, LOGIN_PATH, CLINIC_PATH, SPECIALTIES_PATH,
  DOCTOR_PAGE, APPOINT_PAGE, DOCTOR_APPOINT_PAGE, PATIENT_INFO_PATH, DOCTOR_SCHEDULE_PATH, PATIENT_MEDICAL_RECORD_PATH,
  NOTIFICATION_PATH, SELECTED_DOCTOR_PATH, MULTI_DEPARTEMENT_CHECKUP_PATH, USER_INFO_PATH, REGISTER_PATH,
  MEDICAL_RECORDS_PATH, CONSULT_BOOKING_PATH,
  MULTI_BOOKING_PATH, BOOKING_SUCCESS_PATH,
  CHATBOX_PATH,
  SUPPORTER_APPOINTMENT_PATH

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
import ProtectedComponent_Supporter from "./shared/ProtectComponent_Supporter";
import UserInfo from "./pages/UserInfo";
import Register from "./pages/Register";
import Medical_Records from "./pages/MedicalRecords";
import Multi_SpecialtiesBook from "./pages/Multi_SpecialtiesBook";
import AIChatBox from "./pages/AIChatBox";
import Consult_Booking from "./pages/Consult_Booking";
import Appointment_Support from "./pages/supporter-pages/Appointment_Support";
import Booking_Success from "./pages/Booking_Success";

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
        //element: <Doctor />,
        element: (
          <ProtectedComponent>
            <Doctor />
          </ProtectedComponent>
        ),
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
        element: (
          <ProtectedComponent>
            <Booking />
          </ProtectedComponent>
        ),
      },
      {
        path: MULTI_BOOKING_PATH,
        element: <Booking />,
      },
      {
        path: CONSULT_BOOKING_PATH,
        element: (
          <ProtectedComponent>
            <Consult_Booking />
          </ProtectedComponent>
        ),
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
        path: CHATBOX_PATH,
        element: <AIChatBox />,
      },
      {
        path: NOTIFICATION_PATH,
        //element: <Notification />,
        element: (
          <ProtectedComponent>
            <Notification />
          </ProtectedComponent>
        ),
        
      },
      {
        path: MEDICAL_RECORDS_PATH,
        // element: <Medical_Records />,
        element: (
          <ProtectedComponent>
            <Medical_Records />
          </ProtectedComponent>
        ),
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
      // {
      //   path: PATIENT_MEDICAL_RECORD_PATH,
      //   element: <Medical_Record />,
      // },
      {
        path: SELECTED_DOCTOR_PATH,
        element: <Doctor_Cart />,
      },
      {
        path: MULTI_DEPARTEMENT_CHECKUP_PATH,
        element: (
          <ProtectedComponent>
            <Multi_SpecialtiesBook />
          </ProtectedComponent>
        ),
      },

      {
        path: USER_INFO_PATH,
        element: (
          <ProtectedComponent>
            <UserInfo />
          </ProtectedComponent>
        ),
      },

      {
        path: BOOKING_SUCCESS_PATH,
        element: (
            <Booking_Success />
        ),
      },

      

      {
        path: SUPPORTER_APPOINTMENT_PATH,
        element: (
          <ProtectedComponent_Supporter>
            <Appointment_Support />
           </ProtectedComponent_Supporter>
        ),
      },


      
    ],
  }
]);

export default routers;
