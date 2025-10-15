import React, { useEffect, useState } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { get, post } from 'helpers/api_helper';
import Datatables from 'pages/utils/table/datatable';
import { ManagePatientNotesColumns } from 'pages/Patient/tableColumns';
import { PATIENT_NOTES_URL, DOCTOR_URL, PATIENT_URL } from 'helpers/url_helper';
import { showSuccessAlert } from "pages/utils/alertMessages";
import Select from "react-select";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";

const Notes = ({ isFormPreOpen = false, patientData }) => {
    const [isForm, setIsForm] = useState(isFormPreOpen);
    const [rows, setRows] = useState([]);
    const [formsData, setFormsData] = useState({ doctor_code: '', note_date: '', note: '' })
    const [doctors, setDoctors] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, Search: '' });

    const fetchData = async () => {
        const { success, body } = await get(`${PATIENT_NOTES_URL}?page=${pagination.page}&limit=${pagination.limit}&search=${pagination.Search}`);
        if (success) {
            setRows(body);
        }
    };

    useEffect(() => {
        fetchData();
    }, [pagination]);

    const getExtraData = async () => {
        const {success, body} = await get(`${PATIENT_URL}/options?_type=doctors`);
        // console.log('Doctors:', doctorsRes);
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
        setFormsData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        const payload = {
            ...formsData,
            patient_id: patientData?.id,
        };
        const res = await post(PATIENT_NOTES_URL, payload);
        if (res.success) {
            showSuccessAlert('Patient Note created successfully!');
            setIsForm(false);
            setFormsData({});
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
                                <h5> <i role="button" className="me-2 fas fa-arrow-left" onClick={handleToggle} /> Add Patient Note </h5>
                                <button className="btn btn-danger" onClick={handleToggle}><i className="mdi mdi-close noti-icon" /> Cancel </button>
                            </div>
                            <hr />
                            <Row>
                                <Col >
                                    <label>Doctor</label>
                                    <Select
                                        id="doctor"
                                        className="basic-single"
                                        isClearable={true}
                                        isSearchable={true}
                                        options={doctors}
                                        onChange={(selectedOption) => {
                                            // console.log('Selected Option:', selectedOption);
                                            setFormsData((prev) => ({
                                                ...prev, doctor_code: selectedOption?.value
                                            }))
                                        }}
                                        placeholder="Select Doctor" />
                                </Col>

                                <Col >
                                    <div className="form-group mb-4">
                                        <label>Note Date </label>
                                        <Flatpickr
                                            className="form-control d-block"
                                            options={{
                                                altInput: true,
                                                dateFormat: "Y-m-d H:i",
                                            }}
                                            placeholder="MM, DD, YYYY"
                                            value={formsData.note_date}
                                            onChange={(date) => {
                                                setFormsData(prev => ({
                                                    ...prev,
                                                    note_date: date[0]?.toISOString() || ''
                                                }));
                                            }}
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <div className="mb-1">
                                        <label>Notes</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Notes"
                                            name="note"
                                            value={formsData?.note}
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
            columns={ManagePatientNotesColumns()}
            showTableOnly={true}
            rowsLength={rows?.totalItems || 0}
            rows={rows?.items || []}
            keyField={'id'}
            handleAddButton={handleToggle}
            title="Patient Notes"
            isAdd={true}
            isTableHead={true}
            rowClasses="cursor-pointer hover:bg-gray-100"
            ssr={() => setPagination}
        />
    );

};

export default Notes;
