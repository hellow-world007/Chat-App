import { useContext } from "react";
import { BiLogOut } from "react-icons/bi";
import { AuthContext } from "../../shared/context/auth-context";

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);
  return (
    <div className="mx-5">
      <BiLogOut
        className="w-6 h-6 text-slate-500 cursor-pointer"
        onClick={logout}
      />
    </div>
  );
};
export default LogoutButton;
