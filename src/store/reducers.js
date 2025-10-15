import { combineReducers } from "redux"

// Front
import Layout from "./layout/reducer"

// Authentication
import Login from "./auth/login/reducer"
import ForgetPassword from "./auth/forgetpwd/reducer"
import Profile from "./auth/profile/reducer"

//Calendar
import calendar from "./calendar/reducer"

//Dashboard 
import Dashboard from "./dashboard/reducer";

const rootReducer = combineReducers({
  // public
  Layout,
  Login,
  ForgetPassword,
  Profile,
  calendar,
  Dashboard
})

export default rootReducer
