/* eslint-disable react/jsx-key */
import React, { useState } from "react"
import MetaTags from 'react-meta-tags';
import {
  Container,
  Col,
  Row,
  Card,
  CardBody,
  ListGroup,
  ListGroupItem
} from "reactstrap"
import { Link } from "react-router-dom"

// Import icons
// Add these new icon imports at the top with other icon imports
import {
  FaCalendarAlt,
  FaUserInjured,
  FaComments,
  FaFlask,
  FaChartLine,
  FaFileAlt,
  FaMoneyBillWave,
  FaUserMd,
  FaBriefcaseMedical,
  FaCreditCard,
  FaChartPie,
  FaHospital,
  FaClipboardList,
  FaEnvelope,
  FaSms,
  FaWhatsapp,
  FaBirthdayCake,
  FaPhoneVolume,
  FaVial
} from "react-icons/fa"
import LoadingComponent from "./loadingComponent"

const Compoents = {
  Appointments: React.lazy(() => import("./appointments")),
  WaitingAnalysis: React.lazy(() => import("./waitingAnalysis")),
  Reminders: React.lazy(() => import("./reminders")),
};

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState("appointment");
  const [selectedSubReport, setSelectedSubReport] = useState(null);
  const [ActiveComponent, setActiveComponent] = useState(Compoents["Appointments"])

  const colors = ["primary", "success", "info", "warning", "danger", "secondary"];

  const reportCards = {
    "appointment": [
      { id:"Appointments", title: "Appointments Report", icon: FaCalendarAlt, color: "primary" },
      { id:"WaitingAnalysis", title: "Waiting Analysis Report", icon: FaChartLine, color: "success" },
      { id:"Reminders", title: "Reminders Report", icon: FaPhoneVolume, color: "info" },
    ],
    "patient": [
      { title: "Patient Analysis", icon: FaChartPie, color: colors[0] },
      // { title: "Patient Personal Attribute Report", icon: FaUserInjured, color: colors[1] },
      // { title: "Collection Report", icon: FaMoneyBillWave, color: colors[2] },
      // { title: "Outstanding Report", icon: FaFileAlt, color: colors[3] },
      // { title: "Revenue Analysis", icon: FaChartLine, color: colors[4] },
      { title: "Doctorwise Report", icon: FaUserMd, color: colors[5] },
      { title: "Work Report", icon: FaBriefcaseMedical, color: colors[0] },
      // { title: "Online Patient Payment Analysis", icon: FaCreditCard, color: colors[1] },
      // { title: "Clinic Insight", icon: FaHospital, color: colors[2] },
      // { title: "Consultant Billing Report", icon: FaFileAlt, color: colors[3] },
      { title: "Referrer Report", icon: FaUserMd, color: colors[4] },
      // { title: "Clinic Data Analysis", icon: FaChartPie, color: colors[5] },
      // { title: "Clinic Dashboard", icon: FaChartLine, color: colors[0] },
      // { title: "Customized Patient Report", icon: FaClipboardList, color: colors[1] },
      // { title: "General Report", icon: FaFileAlt, color: colors[2] },
      { title: "Patient Document Report", icon: FaClipboardList, color: colors[3] },
    ],
    "communication": [
      { title: "Email Analysis", icon: FaEnvelope, color: colors[0] },
      { title: "Transactional Sms", icon: FaSms, color: colors[1] },
      { title: "Promotional Sms", icon: FaComments, color: colors[2] },
      { title: "Whatsapp SMS Report", icon: FaWhatsapp, color: colors[3] },
      { title: "Birthday Report", icon: FaBirthdayCake, color: colors[4] },
      { title: "Patient Followup Analysis", icon: FaPhoneVolume, color: colors[5] },
    ],
    "labwork": [
      { title: "Labwork Report", icon: FaVial, color: colors[0] },
    ],
  };

  const handleReportSelect = async(data, id) => {
    setSelectedSubReport(data);
    setActiveComponent(Compoents[id])
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Reports | {process.env.REACT_APP_TITLE}</title>
        </MetaTags>
        <Container fluid>
          <h4>Reports</h4>
          <Row>
            <Col lg={3}>
              <Card>
                <CardBody>
                  {
                    selectedSubReport !=null ?
                    <>
                        <h5 className="card-title mb-3"><i className="fas fa-arrow-left" onClick={() => {
                          setSelectedSubReport(null);
                        }}/> {selectedReport}</h5>
                        <ListGroup flush>
                        {
                          reportCards[selectedReport].map((v,index) => (
                            <ListGroupItem
                              key={`SMGLI_${index}`}
                              tag="a"
                              href="#"
                              action
                              className="d-flex align-items-center"
                              active={selectedSubReport === index}
                              onClick={() => 
                                {
                                  setSelectedSubReport(index)
                                  setActiveComponent(Compoents[v.id])
                                }}
                            >
                              <FaCalendarAlt className={`${selectedSubReport === index ? "text-white": "text-primary"} me-3`} />
                              <span>{v.title}</span>
                            </ListGroupItem>
                          ))
                        }
                        </ListGroup>
                    </> : 
                    <>
                      <h5 className="card-title mb-3">Report Categories</h5>
                      <ListGroup flush>
                        <ListGroupItem
                          tag="a"
                          href="#"
                          action
                          className="d-flex align-items-center"
                          active={selectedReport === "appointment"}
                          onClick={() => setSelectedReport("appointment")}
                        >
                          <FaCalendarAlt className={`${selectedReport === "appointment" ? "text-white": "text-primary"} me-3`} />
                          <span>Appointment Reports</span>
                        </ListGroupItem>
                        <ListGroupItem
                          tag="a"
                          href="#"
                          action
                          className="d-flex align-items-center"
                          active={selectedReport === "patient"}
                          onClick={() => setSelectedReport("patient")}
                        >
                          <FaUserInjured className={`${selectedReport === "patient" ? "text-white": "text-success"} me-3`} />
                          <span>Patient Reports</span>
                        </ListGroupItem>
                        <ListGroupItem
                          tag="a"
                          href="#"
                          action
                          className="d-flex align-items-center"
                          active={selectedReport === "communication"}
                          onClick={() => setSelectedReport("communication")}
                        >
                          <FaComments className={`${selectedReport === "communication" ? "text-white": "text-info"} me-3`} />
                          <span>Communication Reports</span>
                        </ListGroupItem>
                        <ListGroupItem
                          tag="a"
                          href="#"
                          action
                          className="d-flex align-items-center"
                          active={selectedReport === "labwork"}
                          onClick={() => setSelectedReport("labwork")}
                        >
                          <FaFlask className={`${selectedReport === "labwork" ? "text-white": "text-warning"} me-3`} />
                          <span>Labwork Reports</span>
                        </ListGroupItem>
                      </ListGroup>
                    </>
                  }
                </CardBody>
              </Card>
            </Col>
            <Col lg={9}>
              
              {
                selectedSubReport != null ? 
                  <React.Suspense fallback={<LoadingComponent />}>
                    {ActiveComponent ? <ActiveComponent /> : <LoadingComponent />}
                  </React.Suspense>
                :
                <>
                  <h5 className="card-title mb-4">
                    {selectedReport.charAt(0).toUpperCase() + selectedReport.slice(1)} Reports
                  </h5>
                  <Row>
                    {reportCards[selectedReport].map((card, index) => (
                      <Col md={3} key={index}>
                        <Card
                          className="cursor-pointer"
                          onClick={() => handleReportSelect(index, card.id)}
                          style={{
                            backgroundColor: selectedSubReport === index ? `var(--bs-${card.color})` : 'white',
                            cursor: 'pointer'
                          }}
                        >
                          <CardBody className="text-center">
                            <card.icon
                              size={30}
                              className={`mb-3 ${selectedSubReport === index ? 'text-white' : `text-${card.color}`}`}
                            />
                            <h6 className={selectedSubReport === index ? 'text-white' : 'text-dark'}>
                              {card.title}
                            </h6>
                          </CardBody>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </>
              }
            </Col>

          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default Reports;
