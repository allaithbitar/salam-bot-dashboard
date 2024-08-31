/* eslint-disable react-hooks/rules-of-hooks */
import LoadingOverlay from "@/components/shared/loading-overlay.component";
import { useUserContext } from "@/context/user/user.context";
import { useLocation } from "preact-iso";

/* eslint-disable react/display-name */
export const withRole = (Component, role) => {
  return (...props) => {
    const location = useLocation();
    const { user } = useUserContext();
    console.log({ user, role });

    if (user?.role !== role) {
      location.route("/");
      return <LoadingOverlay />;
    }

    return <Component {...props} />;
  };
};
