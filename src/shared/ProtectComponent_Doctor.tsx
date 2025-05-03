import { ReactNode } from "react";
import { Navigate, useLocation} from "react-router-dom";
interface Props {
  children: ReactNode;
}
const ProtectedComponent_Doctor: React.FC<Props> = ({ children }) => {
  // localStorage.removeItem("user");
  const user = JSON.parse(localStorage.getItem("user") || "{}"); 
   //alert(JSON.stringify(user));
  let location = useLocation();
  if (user && user.token && user.roleId == 2) {
    return (<>{children}</>);
  } else {
    return <Navigate to="/login" state={{ from: location}} replace />
  }
};

export default ProtectedComponent_Doctor;
