import PropTypes from "prop-types";
// ? guards
import AuthGuard from "../guards/AuthGuard";
// ? components
import DashboardLayout from "./dashboard";

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["dashboard", "main", "logoOnly"]),
};

export default function Layout({ variant = "dashboard", children }) {
  return (
    <AuthGuard>
      <DashboardLayout> {children} </DashboardLayout>
    </AuthGuard>
  );
}
