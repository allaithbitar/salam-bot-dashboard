import { withRole } from "@/HOCs/with-role";
import UsersTable from "./components/users-table.component";
import { DASHBOARD_USER_ROLE } from "@/constants";

const AdminPage = () => {
  return (
    <div className="h-full">
      <UsersTable />
    </div>
  );
};

export default withRole(AdminPage, DASHBOARD_USER_ROLE.Admin);
