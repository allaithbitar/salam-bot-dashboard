import { DASHBOARD_USER_ROLE } from "@/constants";
import { useUserContext } from "@/context/user/user.context";
import { useValidateAuthTokenMutation } from "@/hooks/mutations";
import { useLocation } from "preact-iso";
import { useEffect } from "preact/hooks";

const AuthPage = () => {
  const { setUser } = useUserContext();
  const location = useLocation();
  const { mutateAsync: validate } = useValidateAuthTokenMutation();

  useEffect(() => {
    (async () => {
      try {
        const token = location.query.token;
        if (token) {
          const userObj = await validate(token);
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
  }, [location, setUser, validate]);

  return <div>AuthPage</div>;
};

export default AuthPage;
