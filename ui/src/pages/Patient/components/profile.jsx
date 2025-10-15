import React, {useEffect, useState} from 'react'
import { Row, Col } from 'reactstrap'
import { get } from 'helpers/api_helper'
import { PATIENT_URL } from 'helpers/url_helper'
import WhatsappNotification from './notification/whatsapp'
import SmsNotification from './notification/sms'
import { useHistory } from "react-router-dom";

const PatientProfile = ({ data = null, callback=()=>{} }) => {
    const history = useHistory();
    const [patientData, setpatientData] = useState(data)
    const [notificationModal, setNotificationModal] = useState(null)

    const fetchpatientData = async () => {
        const { success, body } = await get(`${PATIENT_URL}/1`);
        if (success) {
            setpatientData(body);
        }
    };

    useEffect(() => {
        if(!data){
            fetchpatientData();
        }
    }, [data]);

    const handleNotificationModal = (type) => {
        console.log(type)
        setNotificationModal(type);
    }
    
    const handleTabOpen = (tab) => {
        history.push({
            pathname: '/patient',
            search: `?_p=${patientData?.id}&_t=${tab}`
        });
    }

    return (
        <div className='row'>
            <div className="col-lg-12">
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-lg-3">
                                <div className="d-flex">
                                    <div className="flex-shrink-0 me-3">
                                        <img 
                                            src={`${process.env.REACT_APP_API_URL}${patientData?.profile_pic}` || '/images/default-avatar.png'} 
                                            alt="" className="avatar-md rounded img-thumbnail" />
                                    </div>
                                    <div className="flex-grow-1 align-self-center">
                                        <div className="text-muted">
                                            <h5 className="mb-1">{`${patientData?.title} ${patientData?.first_name} ${patientData?.last_name}`} </h5>
                                            <p className="mb-1">{`Case #${patientData?.case_no}`}</p>
                                            <p className="mb-1">{`${patientData?.gender} | Age: ${patientData?.age} years`}</p>
                                            <p className="mb-0">{`${patientData?.mobile} | ${patientData?.email}`}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='mt-2'>
                                    <button onClick={() =>  handleNotificationModal(1)} className="me-2 btn btn-outline-primary text-start"><i className='bx bxl-whatsapp' /> Whatsapp</button>
                                    {/* <button onClick={() =>  handleNotificationModal(2)} className="me-2 btn btn-outline-primary text-start"><i className='bx bx-message-square' /> SMS</button> */}
                                    <button onClick={() =>  handleNotificationModal(3)} className="btn btn-outline-primary text-start"><i className='bx bx-envelope' /> e-Mail </button>
                                </div>
                            </div>

                            <div className="col-lg-2">
                                <div className="">
                                    <div className="flex-grow-1 align-self-center">
                                        <button className="btn btn-outline-primary w-100 mb-1 text-start" onClick={() => {
                                            window.open(`/patinet/summary/${patientData?.id}`)
                                        }}><i className='bx bx-printer p-1' />  Patient Summary</button>
                                        <button onClick={() => handleTabOpen('Investigations')} className="btn btn-outline-primary w-100 mb-1 text-start"><i className='fas fa-file-prescription p-1' />  Add investigation</button>
                                        <div className="d-flex justify-content-between mb-2">
                                            <button className="btn btn-outline-primary w-70 text-start "><i className='bx bx-envelope p-1' />  Covid-19 Consent </button>
                                            <button className="btn btn-outline-primary w-30 text-start ms-2"><i className='fas fa-eye p-1' />  View </button>
                                        </div>
                                        <button onClick={() => handleTabOpen('Notes')} className="btn btn-outline-primary w-100 mb-1 text-start"><i className='fas fa-file-alt p-1' />  Add Note</button>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-7">
                                <Row>
                                    <Col lg={3}>
                                        <button  onClick={() => handleTabOpen('Followup')} className="btn btn-outline-primary w-100 mb-1 text-start"><i className='fas fa-plus p-1' />  Add Follow-Up</button>
                                    </Col>
                                    <Col lg={9}>
                                        <div className="border border-danger p-1 pt-2">
                                            <div className="text-center">
                                                <b className="text-danger blink-text">{patientData?.allergies}</b>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                                <div className="mt-2">
                                    <Row>
                                        <Col lg={4}>
                                            <div className="alert alert-warning d-none d-lg-block">Billed Amount: <b>{`₹ ${1000}`}</b></div>
                                            <div className="alert alert-success d-none d-lg-block">Billed Balance: <b>{`₹ ${1000}`}</b></div>
                                        </Col>
                                        <Col lg={8}>
                                            <div className="text-center">
                                                <table className='table table-bordered'>
                                                    <thead>
                                                        <tr>
                                                            <th>Treatment Cost</th>
                                                            <th>Paid</th>
                                                            <th>Balance</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>1000</td>
                                                            <td>0</td>
                                                            <td>1000</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            { notificationModal == 1 && <WhatsappNotification mobile={patientData?.mobile} open={notificationModal == 1} callback={() => setNotificationModal(null)} />}
            { notificationModal == 2 && <SmsNotification mobile={patientData?.mobile} open={notificationModal == 2} callback={() => setNotificationModal(null)} />}
        </div>
    )
}

export default PatientProfile