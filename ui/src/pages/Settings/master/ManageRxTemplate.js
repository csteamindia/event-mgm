import React, { useEffect, useState } from 'react';
import { Row, Col, Card, CardBody, CardTitle } from 'reactstrap';
import { del, get, post } from 'helpers/api_helper';
import Datatables from 'pages/utils/table/datatable';
import { ManageRXTemplatetColumns } from './tableColumns';
import { RX_TEMPLATES_URL, PATIENT_URL } from 'helpers/url_helper';
import { showSuccessAlert } from "pages/utils/alertMessages";
import Select from "react-select";
import Addrows from 'pages/utils/incrementalRows';

const ManageRxTemplate = () => {
    const [isForm, setIsForm] = useState(false);
    const [formData, setFormData] = useState({ title: '', note: '', doctor_code: '', medicins: '' });
    const [rows, setRows] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, Search: '' });
    const [doctors, setDoctors] = useState([]);

    const fetchData = async () => {
        const { success, body } = await get(`${RX_TEMPLATES_URL}?page=${pagination.page}&limit=${pagination.limit}&search=${pagination.Search}`);
        if (success) {
            setRows(body);
        }
    };
    useEffect(() => fetchData(), [pagination]);

    const getExtraData = async () => {
        const { success, body } = await get(`${PATIENT_URL}/options?_type=doctors`); 
        if (success) {
            setDoctors(body);
        }
    };

    useEffect(() => getExtraData(), [])

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
        const res = await post(RX_TEMPLATES_URL, formData);
        if (res.success) {
            showSuccessAlert(editMode ? 'RX Template updated successfully!' : 'RX Template created successfully!');
            setIsForm(false);
            setEditMode(false);
            setEditingId(null);
            setFormData({});
            fetchData();
        }
    };

    const handleMultiRowData = (data) => {
        if(data?.length > 0){
            setFormData((prev) => ({
               ...prev, medicins: JSON.stringify(data),
            }))
        }
    }

    const handleEdit = async(rowData) => {
        setIsForm(true);
        setEditMode(true);
        setFormData({
            id: rowData.id,
            title: rowData.title,
            note: rowData.note,
            doctor_code: doctors?.filter(doctor => doctor.value === rowData.doctor_code),
            medicins: rowData.medicins
        })
    };

    const handleDelete = async (id, sts) => {
        const { success } = await del(`${RX_TEMPLATES_URL}/${id}?sts=${sts}`);
        if(success){
            fetchData();
        }
    }

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
                                    {`${editMode? 'Update': 'Create'}`} Rx Template
                                </h5>
                                <button className="btn btn-danger" onClick={handleToggle}>
                                    <i className="mdi mdi-close noti-icon" /> Cancel
                                </button>
                            </div>
                            <hr />
                            <Row>
                                <Col>
                                    <div className="mb-3">
                                        <label>Rx Template </label>
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
                                <Col md={4}>
                                    <label>Doctor</label>
                                    <Select
                                        id="doctor"
                                        className="basic-single"
                                        isClearable={true}
                                        isSearchable={true}
                                        options={doctors}
                                        value={formData.doctor_code || []}
                                        onChange={(selectedOption) => {
                                            setFormData((prev) => ({
                                                ...prev, doctor_code: selectedOption
                                            }))
                                        }}
                                        placeholder="Select Doctor" />
                                </Col>
                            </Row>
                            <div className="mb-4 bg-light p-3 rounded">
                                <CardTitle tag="h2" className="mb-3 mt-2" style={{ fontSize: "20px" }}>
                                    Medication
                                </CardTitle>
                                <Addrows editModa={editMode} editData={editMode ? JSON.parse(formData?.medicins): []} callback={handleMultiRowData} />
                            </div>
                            <Row>
                                <Col>
                                    <div className="mb-1">
                                        <label>Template Note</label>
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
            columns={ManageRXTemplatetColumns(handleEdit, handleDelete)}
            showTableOnly={true}
            rowsLength={rows?.totalItems || 0}
            rows={rows.items || []}
            keyField={'id'}
            handleAddButton={handleToggle}
            title="All Rx Template"
            isAdd={true}
            isTableHead={true}
            ssr={setPagination}
        />
    );
};

export default ManageRxTemplate;
