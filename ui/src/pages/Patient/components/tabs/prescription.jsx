import React, { useEffect, useState } from 'react';
import { Row, Col, Card, CardBody, CardTitle } from 'reactstrap';
import { get, post } from 'helpers/api_helper';
import Datatables from 'pages/utils/table/datatable';
import { ManagePrescriptionColumns } from 'pages/Patient/tableColumns';
import { PRESCRIPTION_URL, PATIENT_URL } from 'helpers/url_helper';
import { showSuccessAlert } from "pages/utils/alertMessages";
import Select from "react-select";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import Addrows from 'pages/utils/incrementalRows';

const Prescription = ({ patientData }) => {
    const [isForm, setIsForm] = useState(false);
    const [formData, setFormData] = useState({ title: '', note: '', doctor_code: '', patient_id: patientData?.id });
    const [rows, setRows] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, Search: '' });
    const [doctors, setDoctors] = useState([]);
    const [isClearable, setIsClearable] = useState(true);
    const [isSearchable, setIsSearchable] = useState(true);

    const fetchData = async () => {
        const { success, body } = await get(`${PRESCRIPTION_URL}?patient_id=${patientData?.id}&page=${pagination.page}&limit=${pagination.limit}&search=${pagination.Search}`);
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
        // setRows1([{ id: 1 }]);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleMultiRowData = (data) => {
        // console.log("callbak", data)
        setFormData(prev => ({
            ...prev,
            medicine: JSON.stringify(data),
        }));
    }

    const handleSubmit = async () => {
        const url = editMode ? `${PRESCRIPTION_URL}/${editingId}` : PRESCRIPTION_URL;
        const res = await post(url, formData);
        if (res.success) {
            showSuccessAlert(editMode ? 'Prescription updated successfully!' : 'Prescription created successfully!');
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
                                <h5>
                                    <i
                                        role="button"
                                        className="me-2 fas fa-arrow-left"
                                        onClick={handleToggle}
                                    />
                                    Create Prescription
                                </h5>
                                <button className="btn btn-danger" onClick={handleToggle}>
                                    <i className="mdi mdi-close noti-icon" /> Cancel
                                </button>
                            </div>
                            <hr />
                            <Row>
                                <Col md={4}>
                                    <div className="form-group mb-4">
                                        <label>Select Date</label>
                                        <Flatpickr
                                            className="form-control d-block"
                                            options={{
                                                altInput: true,
                                                dateFormat: "Y-m-d H:i",
                                            }}
                                            placeholder="MM, DD, YYYY"
                                            value={formData.deposit_date || ''}
                                            onChange={(date) => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    deposit_date: date[0]?.toISOString() || ''
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
                                        isClearable={isClearable}
                                        isSearchable={isSearchable}
                                        options={doctors}
                                        onChange={(selectedOption) => {
                                            // console.log('Selected Option:', selectedOption);
                                            setFormData((prev) => ({
                                                ...prev, doctor_code: selectedOption?.value
                                            }))
                                        }}
                                        placeholder="Select Doctor" />
                                </Col>
                                <Col md={4}>
                                    <div className="mb-3">
                                        <label>Prescription Template </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Notes"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <div className="mb-4 bg-light p-3 rounded">
                                <CardTitle tag="h2" className="mb-3 mt-2" style={{ fontSize: "20px" }}>
                                    Medication
                                </CardTitle>
                                <Addrows callback={handleMultiRowData} />
                            </div>
                            <Row>
                                <Col>
                                    <div className="mb-1">
                                        <label>Note</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Notes"
                                            name="note"
                                            value={formData.note}
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
            columns={ManagePrescriptionColumns()}
            showTableOnly={true}
            rowsLength={rows?.totalItems || 0}
            rows={rows.items || []}
            keyField={'id'}
            handleAddButton={handleToggle}
            title="All Prescriptions"
            isAdd={true}
            isTableHead={true}
            ssr={() => { }}
        />
    );
};

export default Prescription;
