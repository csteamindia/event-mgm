import React, { useEffect, useState } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { get, post } from 'helpers/api_helper';
import Datatables from 'pages/utils/table/datatable';
import { ManageAppointmentColumns } from 'pages/Patient/tableColumns';
import { APPOINTMENT_URL, PATIENT_URL } from "helpers/url_helper"
import { showSuccessAlert } from "pages/utils/alertMessages";
import Select from "react-select";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";

const Appointments = ({ patientData }) => {
    const [isForm, setIsForm] = useState(false);
    const [rows, setRows] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);
    // const [pagination, setPagination] = useState({ page: 1, limit: 10, Search: '' });
    const [appointment, setAppointment] = useState({patient_id: patientData?.id})
    const [DDoptions, setDDOptions] = useState([]);

    useEffect(() => {
        if (isForm) {
            const fetchData = async () => {
                try {
                    const { success, body } = await get(`${PATIENT_URL}/options`);  // Fetch patients data
                    if (success) {
                        setDDOptions(body);
                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            };

            fetchData();
        }
    }, [isForm]);

    const handleToggle = () => {
        setIsForm(!isForm);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAppointment(prev => ({
            ...prev,
            [name]: value,
        }));
    };
    useEffect(() => {
        const fetchAppointments = async () => {
            const { success, body } = await get(`${APPOINTMENT_URL}?patient_id=${patientData?.id}`);
            if (success) {
                setRows(body);
            }
        };
        fetchAppointments();
    }, []);

    const handleSubmit = async () => {
        const url = editMode ? `${APPOINTMENT_URL}/${editingId}` : APPOINTMENT_URL;
        const res = await post(url, appointment);
        if (res.success) {
            showSuccessAlert(editMode ? 'Appointment updated successfully!' : 'Appointment created successfully!');
            setIsForm(false);
            setEditMode(false);
            setEditingId(null);
            setAppointment({});
            // fetchData();
        }
    };

    if (isForm) {
        return (
            <Row>
                <Col md={12}>
                    <Card>
                        <CardBody>
                            <div className="d-flex justify-content-between mb-2">
                                <h5> <i role="button" className="me-2 fas fa-arrow-left" onClick={handleToggle} /> Add Appointment </h5>
                                <button className="btn btn-danger" onClick={handleToggle}><i className="mdi mdi-close noti-icon" /> Cancel </button>
                            </div>
                            <hr />
                            <Row className='mt-2'>
                                <Col>
                                    <div className="form-group">
                                        <label>Appointment Date & Time</label>
                                        <Flatpickr
                                            className="form-control d-block"
                                            value={appointment.appointmentDate}
                                            onChange={([date]) =>
                                                setAppointment(prev => ({
                                                    ...prev,
                                                    appointment_date: date.toISOString().split("T")[0],
                                                }))
                                            }
                                            options={{
                                                altInput: true,
                                                altFormat: "F j, Y h:i K",
                                                dateFormat: "Y-m-d H:i",
                                                enableTime: true,
                                                time_24hr: false,
                                            }}
                                            placeholder="MM, DD, YYYY HH:MM"
                                        />
                                    </div>
                                </Col>
                                <Col>
                                    <div className="mb-3">
                                        <label className="control-label">
                                            Doctor
                                        </label>
                                        <Select
                                            id="doctor"
                                            className="basic-single"
                                            classNamePrefix="select"
                                            options={DDoptions?.doctors}
                                            onChange={(selectedOption) => {
                                                setAppointment((prev) => ({
                                                    ...prev,
                                                    doctor_code: selectedOption?.value,
                                                }));
                                            }}
                                            placeholder="Select Doctor"
                                        />
                                    </div>
                                </Col>

                            </Row>
                            <Row className='mt-1'>
                                <Col>
                                    <div className="mb-1">
                                        <label>Chair</label>
                                        <Select
                                            id="chair"
                                            className="basic-single"
                                            classNamePrefix="select"
                                            options={DDoptions?.chairs}
                                            onChange={(selectedOption) => {
                                                // console.log('Selected Option:', selectedOption);
                                                setAppointment((prev) => ({
                                                    ...prev, chair_code: selectedOption?.value
                                                }))
                                            }}
                                            placeholder="Select Chair"
                                        />
                                    </div>
                                </Col>
                                <Col>
                                    <div className="mb-1">
                                        <label>Treatment</label>
                                        <Select
                                            id="treatment"
                                            className="basic-single"
                                            classNamePrefix="select"
                                            options={DDoptions?.treatments}
                                            onChange={(selectedOption) => {
                                                setAppointment((prev) => ({
                                                    ...prev,
                                                    treatment_code: selectedOption?.value,
                                                }));
                                            }}
                                            placeholder="Select Treatment"
                                        />
                                    </div>
                                </Col>

                                <Col>
                                    <div className="w-100">
                                        <label className="form-check-label" htmlFor="customSwitchsizemd">Notification</label>
                                        <table className="w-100">
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <div className="form-check form-switch form-switch-md mt-2">
                                                            <input
                                                                type="checkbox"
                                                                className="form-check-input"
                                                                id="customSwitchsizemd"
                                                                name="is_fevrate"
                                                                checked={appointment.notification_status || false}
                                                                onChange={(e) =>
                                                                    setAppointment(prev => ({
                                                                        ...prev,
                                                                        notification_status: e.target.checked,
                                                                    }))
                                                                }
                                                            />
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="form-check form-switch form-switch-md mt-2">
                                                            <input
                                                                type="checkbox"
                                                                className="form-check-input"
                                                                id="customSwitchsizemd"
                                                                name="is_fevrate"
                                                                checked={appointment.notification_for_patient || false}
                                                                onChange={(e) =>
                                                                    setAppointment(prev => ({
                                                                        ...prev,
                                                                        notification_for_patient: e.target.checked,
                                                                    }))
                                                                }
                                                            />
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="form-check form-switch form-switch-md mt-2">
                                                            <input
                                                                type="checkbox"
                                                                className="form-check-input"
                                                                id="customSwitchsizemd"
                                                                name="is_fevrate"
                                                                checked={appointment.notification_for_doctor || false}
                                                                onChange={(e) =>
                                                                    setAppointment(prev => ({
                                                                        ...prev,
                                                                        notification_for_doctor: e.target.checked,
                                                                    }))
                                                                }
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>For Status</td>
                                                    <td>For Patient</td>
                                                    <td>For Doctor</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <div className="mt-2">
                                        <label>Notes</label>
                                        <textarea
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Notes"
                                            name="notes"
                                            value={appointment.notes || ''}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <Row className='mt-4'>
                                <Col md={12}>
                                    <div className="d-flex justify-content-end">
                                        <button className="btn btn-success" type="button" onClick={handleSubmit}> Submit </button>
                                    </div>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        );
    }

    return (
        <Datatables
            isSearch={true}
            columns={ManageAppointmentColumns()}
            showTableOnly={true}
            rowsLength={rows?.totalItems || 0}
            rows={rows?.items || []}
            keyField={'id'}
            handleAddButton={handleToggle}
            title="All Appointment"
            isAdd={true}
            isTableHead={true}
            rowClasses="cursor-pointer hover:bg-gray-100"
            ssr={() => setPagination}
        />
    );

};

export default Appointments;