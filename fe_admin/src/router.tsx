import { createBrowserRouter } from "react-router-dom";
import ScrollToTop from "./shared/ScrollToTop";
import AppLayout from "./shared/AppLayout";
import {
  HOME_PATH, LOGIN_URL, USER_PATH, AD_DOCTOR_PATH, APPOINT_PATH, CLINIC_PATH, SCHEDULE_PATH, SPECIALTY_PATH } from "./urls";
import Login from "./shared/Login";
import ProtectedComponent from "./shared/ProtectComponent";
import Home from "./pages/Home";
import User from "./pages/User";
import Doctor from "./pages/Doctor";
import Appointment from "./pages/Appointment";
import Clinic from "./pages/Clinic";
import Schedule from "./pages/Schedule";
import Specialty from "./pages/Specialty";
import { ErrorBoundaryPage } from "./shared/ErrorBoundary";


const routers = createBrowserRouter([
  {
    path: "",
    element: (
      <>
        {" "}
        <ScrollToTop />
        <AppLayout />
      </>
    ),
    errorElement: (
      <AppLayout>
        <ErrorBoundaryPage />
      </AppLayout>
    ),
    children: [
      {
        path: HOME_PATH,
        element: (
          <ProtectedComponent>
            <Home />
          </ProtectedComponent>
          // <Home></Home>
        ),
      },
      {
        path: USER_PATH,
        element: (
          <ProtectedComponent>
            <User />
          </ProtectedComponent>
        ),
      },
      {
        path: AD_DOCTOR_PATH,
        element: (
          <ProtectedComponent>
            <Doctor />
          </ProtectedComponent>
        ),
      },
      {
        path: APPOINT_PATH,
        element: (
          <ProtectedComponent>
            <Appointment />
          </ProtectedComponent>
        ),
      },
      {
        path: CLINIC_PATH,
        element: (
          <ProtectedComponent>
            <Clinic />
          </ProtectedComponent>
        ),
      },

      {
        path: SCHEDULE_PATH,
        element: (
          <ProtectedComponent>
            <Schedule />
          </ProtectedComponent>
        ),
      },

      {
        path: SPECIALTY_PATH,
        element: (
          <ProtectedComponent>
            <Specialty />
          </ProtectedComponent>
        ),
      },
    ],
  },
  {
    path: LOGIN_URL,
    element: <Login />,
  },
]);

export default routers;
