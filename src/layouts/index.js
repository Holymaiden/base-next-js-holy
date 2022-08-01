import PropTypes from "prop-types";
// components
import DashboardLayout from "./dashboard";

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["dashboard", "main", "logoOnly"]),
};

export default function Layout({ variant = "dashboard", children }) {
  return <DashboardLayout> {children} </DashboardLayout>;
}
