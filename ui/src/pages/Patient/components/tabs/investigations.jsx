import React, { useEffect, useState } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { get, post } from 'helpers/api_helper';
import Datatables from 'pages/utils/table/datatable';
import { ManageInvestigationColumns } from 'pages/Patient/tableColumns';
import { INVESTIONGATIONS, DOCTOR_URL, PATIENT_URL } from 'helpers/url_helper';
import { showSuccessAlert } from "pages/utils/alertMessages";
import Select from "react-select";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";

const Investigations = ({ isFormPreOpen = false, patientData }) => {
    const [isForm, setIsForm] = useState(isFormPreOpen);
    const [formData, setFormData] = useState({
        patient_id: null,
        date: new Date().toISOString(),
        doctor_code: '',
        temperature: '',
        blood_pressure: '',
        blood_sugar: '',
        auscultation: '',
        note: ''
    });

    useEffect(() => {
        setFormData(p => ({ ...p, patient_id: patientData?.id }))
    }, [patientData])

    const [rows, setRows] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, Search: '' });
    const [doctors, setDoctors] = useState([]);

    const fetchData = async () => {
        const { success, body } = await get(`${INVESTIONGATIONS}?patient_id=${patientData?.id}&page=${pagination.page}&limit=${pagination.limit}&search=${pagination.Search}`);
        if (success) {
            setRows(body);
        }
    };

    useEffect(() => {
        fetchData();
    }, [pagination]);

    const getExtraData = async () => {
        const {success, body} = await get(`${PATIENT_URL}/options?_type=doctors`);
        if (success) {
            // const doctorsList = doctorsRes.body?.items || [];
            setDoctors(body);
        }
    };

    useEffect(() => {
        getExtraData();
    }, [])

    const handleToggle = () => {
        setIsForm(!isForm);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        const url = editMode ? `${INVESTIONGATIONS}/${editingId}` : INVESTIONGATIONS;
        const res = await post(url, formData);

        if (res.success) {
            showSuccessAlert(editMode ? 'Investigations Updated Successfully!' : 'Investigations Created Successfully!');
            setIsForm(false);
            setEditMode(false);
            setEditingId(null);
            setFormData({});
            fetchData();
        }
    };

    if (isForm) {
        return (
            <Row>
                <Col md={12}>
                    <Card>
                        <CardBody>
                            <div className="d-flex justify-content-between mb-2">
                                <h5> <i role="button" className="me-2 fas fa-arrow-left" onClick={handleToggle} /> Add Investigation </h5>
                                <button className="btn btn-danger" onClick={handleToggle}><i className="mdi mdi-close noti-icon" /> Cancel </button>
                            </div>
                            <hr />
                            <Row>
                                <Col md={4}>
                                    <div className="form-group mb-3">
                                        <label>Select Date</label>
                                        <Flatpickr
                                            className="form-control d-block"
                                            options={{
                                                altInput: true,
                                                dateFormat: "Y-m-d H:i",
                                            }}
                                            placeholder="MM, DD, YYYY"
                                            value={formData.date || ''}
                                            onChange={(date) => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    date: date[0]?.toISOString() || ''
                                                }));
                                            }}
                                        />
                                    </div>
                                </Col>

                                <Col md={4}>
                                    <label>Doctor</label>
                                    <Select
                                        id="doctor"
                                        className="basic-single"
                                        isClearable={true}
                                        isSearchable={true}
                                        options={doctors}
                                        onChange={(selectedOption) => {
                                            // console.log('Selected Option:', selectedOption);
                                            setFormData((prev) => ({
                                                ...prev, doctor_code: selectedOption?.value
                                            }))
                                        }}
                                        placeholder="Select Doctor" />
                                </Col>
                            </Row>

                            <Row className='mb-2'>
                                <Col>
                                    <div className="mb-1">
                                        <label>Temperature</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Temperature"
                                            name="temperature"
                                            value={formData?.temperature}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </Col>
                                <Col>
                                    <div className="mb-1">
                                        <label>Blood Pressure</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Enter Blood Pressure"
                                            name="blood_pressure"
                                            value={formData?.blood_pressure}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </Col>
                                <Col>
                                    <div className="mb-1">
                                        <label>blood Sugar</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Enter blood Sugar"
                                            name="blood_sugar"
                                            value={formData?.blood_sugar}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </Col>
                                <Col>
                                    <div className="mb-1">
                                        <label>Auscultation</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Enter Auscultation"
                                            name="auscultation"
                                            value={formData?.auscultation}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </Col>
                            </Row>

                            {/* <Row className='mb-2'>
                                <Col>
                                    <div className="mb-1">
                                        <label>Examination</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Examinations"
                                            name="examination"
                                            value={formData?.examination}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </Col>
                                <Col>
                                    <div className="mb-1">
                                        <label>Chief Complaint</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Chief Complaints"
                                            name="chief_complaint"
                                            value={formData?.chief_complaint}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </Col>
                                <Col>
                                    <div className="mb-1">
                                        <label>Diagnosis Type</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Diagnosis Types"
                                            name="diagnosis_type"
                                            value={formData?.diagnosis_type}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </Col>
                            </Row> */}
                            <Row>
                                <Col>
                                    <div className="mb-1">
                                        <label>Note</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Notes"
                                            name="note"
                                            value={formData?.note}
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
            columns={ManageInvestigationColumns()}
            showTableOnly={true}
            rowsLength={rows?.totalItems || 0}
            rows={rows.items || []}
            keyField={'id'}
            handleAddButton={handleToggle}
            title="All Investigations"
            isAdd={true}
            isTableHead={true}
            ssr={() => { }}
        />
    );
};

export default Investigations;
