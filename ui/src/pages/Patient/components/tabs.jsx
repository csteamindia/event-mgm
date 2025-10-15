import React, { useEffect, useState } from "react"
import {
    Card,
    CardBody,
    Col,
    Nav,
    NavItem,
    NavLink,
    Row
} from "reactstrap"
import LoadingComponent from "../../utils/loadingComponent"
import classnames from "classnames"
import { useLocation } from "react-router-dom"

// const tabs = [
//     "Profile",
//     "Investigations",
//     "Examination",
//     "Treatment",
//     "Prescription",
//     "Files",
//     // "Bills",
//     // "Payments",
//     // "Ledger",
//     "Appointments",
//     "Notes",
//     "Followup",
// ]

const tabs = {
    admin: [
        "Profile", "Investigations", "Examination", "Treatment", "Prescription",
        "Files", "Bills", "Payments", "Ledger", "Appointments", "Notes", "Followup"
    ],
    doctor: [
        "Profile", "Investigations", "Examination", "Treatment", "Prescription",
        "Files", "Appointments", "Notes", "Followup"
    ],
    receptionist: [
        "Profile", "Appointments", "Notes"
    ],
    lab: [
        "Profile", "Investigations", "Files"
    ],
    // add other roles as needed
};


const Compoents = {
    Profile: React.lazy(() => import("./tabs/profile")),
    Investigations: React.lazy(() => import("./tabs/investigations")),
    Examination: React.lazy(() => import("./tabs/examination")),
    Treatment: React.lazy(() => import("./tabs/treatment")),
    Prescription: React.lazy(() => import("./tabs/prescription")),
    Files: React.lazy(() => import("./tabs/files")),
    Bills: React.lazy(() => import("./tabs/billing")),
    Payments: React.lazy(() => import("./tabs/payments")),
    Ledger: React.lazy(() => import("./tabs/ledger")),
    Appointments: React.lazy(() => import("./tabs/appointments")),
    Notes: React.lazy(() => import("./tabs/notes")),
    Followup: React.lazy(() => import("./tabs/followUp"))
};

const Tabs = ({patientData, role = 'admin'}) => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const tabName = queryParams.get('_t');

    const [formAutoOpen, setFormAutoOpen] = useState(false)
    const [customIconActiveTab, setcustomIconActiveTab] = useState("1")
    const [ActiveComponent, setActiveComponent] = useState(Compoents["Profile"])

    console.log(ActiveComponent)
    
    const toggleIconCustom = tab => {
        if (customIconActiveTab !== tab) {
            setcustomIconActiveTab(tab)
            setActiveComponent(Compoents[tabs[role][tab-1]])
        }
    }
    useEffect(() => {
        setFormAutoOpen(false)
        if(tabName){
            setcustomIconActiveTab(`${tabs[role]?.indexOf(tabName)+1}`)
            setActiveComponent(Compoents[tabName])
            setFormAutoOpen(true)
        }
    }, [tabName]) // eslint-disable-lin


    return(
        <>
            <Card className="mb-1">
                <CardBody>
                    <Row>
                        <Col lg={11}>
                            <Nav className="navtab-bg nav-justified nav nav-pills">
                                {
                                    tabs[role].map((tab, index) => {
                                        return(
                                            <NavItem key={index}>
                                                <NavLink
                                                    style={{ cursor: "pointer" }}
                                                    className={classnames({
                                                        active: customIconActiveTab === `${index + 1}`,
                                                    })}
                                                    onClick={() => {
                                                        toggleIconCustom(`${index + 1}`)
                                                    }}
                                                >
                                                    {tab}
                                                </NavLink>
                                            </NavItem>
                                        )
                                    })
                                }
                            </Nav>
                        </Col>
                        <Col lg={1}  className="text-end">
                            <button className="btn btn-primary me-2 pt-2"><i className="bx bx-down-arrow" /></button>
                            <button className="btn btn-primary pt-2"><i className="fas fa-plus" /></button>
                        </Col>
                    </Row>

                </CardBody>
            </Card>
            <Row>
                <Col>
                    <React.Suspense fallback={<LoadingComponent />}>
                        {ActiveComponent ? <ActiveComponent isFormPreOpen={formAutoOpen} patientData={patientData} /> : <LoadingComponent />}
                    </React.Suspense>
                </Col>
            </Row>
        </>
    )
}

export default Tabs;