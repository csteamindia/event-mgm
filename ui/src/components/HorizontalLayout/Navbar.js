import PropTypes from "prop-types";
import React, { useState, useEffect }  from "react";
import { Collapse } from "reactstrap";
import { Link, withRouter } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import cookieHelper from "helpers/getCookieData";

const Navbar = props => {
  const [clinic, setClinic] = useState(false);
  const [role, setRole] = useState(false);
  
  useEffect(() => {
    if (cookieHelper.getCookie("_c")) {
      const auth = JSON.parse(cookieHelper.getCookie("authUser"))
      const obj = JSON.parse(atob(cookieHelper.getCookie("_c")))
      setClinic(obj)
      setRole(auth.user.role)
    }
  }, [props.success])

  if(clinic === false) {
    return '';
  }

  return (
    <React.Fragment>
      <div className="topnav">
        <div className="container-fluid">
          <nav
            className="navbar navbar-light navbar-expand-lg topnav-menu"
            id="navigation"
          >
            <Collapse
              isOpen={props.leftMenu}
              className="navbar-collapse"
              id="topnav-menu-content"
            >
              <ul className="navbar-nav">
                {/* <li className="nav-item">
                  <Link className="nav-link" to="/dashboard"><i className="bx bx-home-circle me-2"></i>{props.t("Dashboard")} {props.menuOpen}</Link>
                </li> */}
                <li className="nav-item">
                  <Link to="/appointment" className="nav-link dropdown-togglez arrow-none" > <i className="bx bx-user-plus me-2"></i> {props.t("Appointment")}</Link>
                </li>
                {
                  (role == "admin" || role == "receptionist" ) && 
                  <li className="nav-item">
                    <Link to="/patients" className="nav-link dropdown-toggle arrow-none"><i className="bx bx-user me-2"></i> {props.t("Patients")} </Link>
                  </li>
                }
                {/* <li className="nav-item">
                  <Link to="/accounts" className="nav-link dropdown-togglez arrow-none" > <i className="bx bx-calendar me-2"></i> {props.t("Accounts")}</Link>
                </li> */}
                {
                  role == "admin" && 
                  <li className="nav-item">
                    <Link to="/reports" className="nav-link dropdown-togglez arrow-none" > <i className="bx bx-layer me-2"></i> {props.t("Reports")}</Link>
                  </li>
                }
                {
                  role == "admin" && 
                  <li className="nav-item">
                    <Link to="/settings" className="nav-link dropdown-togglez arrow-none" > <i className="bx bx-chip me-2"></i> {props.t("Settings")}</Link>
                  </li>
                }
              </ul>
            </Collapse>
          </nav>
        </div>
      </div>
    </React.Fragment>
  );
};

Navbar.propTypes = {
  leftMenu: PropTypes.any,
  location: PropTypes.any,
  menuOpen: PropTypes.any,
  t: PropTypes.any,
};

const mapStatetoProps = state => {
  const { leftMenu } = state.Layout;
  return { leftMenu };
};

export default withRouter(
  connect(mapStatetoProps, {})(withTranslation()(Navbar))
);
