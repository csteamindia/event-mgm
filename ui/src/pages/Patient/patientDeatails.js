import React, { useState, useEffect } from "react"
import MetaTags from 'react-meta-tags';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody
} from "reactstrap"
import PatientProfile from "./components/profile";
import Tabs from "./components/tabs";
import { useLocation } from "react-router-dom";
//redux
import { useSelector, useDispatch } from "react-redux"

const PatientDetails = () => {
  const location = useLocation();
  const role = localStorage.getItem('role')
  const [patientData, setPatientData] = useState(null);
  const [isPatinetSummary, setIsPatinetSummary] = useState(false);

  useEffect(() => {
    if(location?.state?.patientData){
      setPatientData(location.state?.patientData)
      localStorage.setItem("patientData", JSON.stringify(location.state?.patientData)); 
    }else{
      const getPD = JSON.parse(localStorage.getItem("patientData"));
      setPatientData(getPD)
    }
  },[location])

  if(!patientData){
    return <h1>Loading...</h1>
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Patient | {process.env.REACT_APP_TITLE}</title>
        </MetaTags>
        <Container fluid>
          <h4>Patients Details</h4>
          <PatientProfile data={patientData} callback={setIsPatinetSummary}/>
          <Tabs patientData={patientData} role={role}/>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default PatientDetails;
