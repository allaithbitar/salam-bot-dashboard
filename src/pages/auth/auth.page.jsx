import { DASHBOARD_USER_ROLE } from "@/constants";
import { useUserContext } from "@/context/user/user.context";
import { decrypt } from "@/lib/crypto-js";
import { useLocation } from "preact-iso";
import { useEffect } from "preact/hooks";

const AuthPage = () => {
  const { setUser } = useUserContext();
  const location = useLocation();

  useEffect(() => {
    (() => {
      try {
        const token = location.query.token;
        if (token) {
          const userObjString = decrypt(token);
          const userObj = JSON.parse(userObjString);
          setUser(userObj);
          if (userObj.role === DASHBOARD_USER_ROLE.Admin) {
            location.route("/admin");
          } else {
            location.route("/provider");
          }
        }
      } catch (error) {
        location.route("not_found");
      }
    })();
  }, [location, setUser]);

  return <div>AuthPage</div>;
};

export default AuthPage;
