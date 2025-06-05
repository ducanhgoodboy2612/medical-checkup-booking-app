import { ReactNode } from "react";
import { Navigate, useLocation} from "react-router-dom";
interface Props {
  children: ReactNode;
}
const ProtectedComponent: React.FC<Props> = ({ children }) => {
  // localStorage.removeItem("user");
  const user = JSON.parse(localStorage.getItem("user") || "{}"); 
   //alert(JSON.stringify(user));
  let location = useLocation();
  if (user && user.token) {
    return (<>{children}</>);
  } else {
    return <Navigate to="/login" state={{ from: location}} replace />
  }
};

export default ProtectedComponent;
