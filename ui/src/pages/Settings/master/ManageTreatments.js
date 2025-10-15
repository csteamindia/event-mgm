import React, { useEffect, useState } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { get, post } from 'helpers/api_helper';
import Datatables from 'pages/utils/table/datatable';
import { ManageTreatmentsColumns } from './tableColumns';
import { TREATMENT_TYPE_URL } from 'helpers/url_helper';
import { showSuccessAlert } from "pages/utils/alertMessages";

const ManageTreatments = () => {
    const [isForm, setIsForm] = useState(false);
    const [formData, setFormData] = useState({});
    const [rows, setRows] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        Search: '',
    });
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const fetchData = async () => {
        const { success, body } = await get(`${TREATMENT_TYPE_URL}?page=${pagination.page}&limit=${pagination.limit}&search=${pagination.Search}`);
        if (success) {
            setRows(body);
        }
    }

    useEffect(() => {
        fetchData();
    }, [pagination]);

    const handleToggle = () => {
        setIsForm(!isForm);
        setFormData({});
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        // console.log('Submitting form data:', formData);
        const url = editMode ? `${TREATMENT_TYPE_URL}/${editingId}` : TREATMENT_TYPE_URL;
        const res = await post(url, formData);
        if (res.success) {
            showSuccessAlert(editMode ? 'Treatment updated successfully!' : 'Treatment created successfully!');
            setIsForm(false);
            setEditMode(false);
            setEditingId(null);
            setFormData({});
            fetchData();
        }
    };

    const handleEdit = (row) => {
        setFormData({
            title: row.title,
            cost: row.cost,
        });
        setEditMode(true);
        setEditingId(row.id);
        setIsForm(true);
    };

    const handleDelete = async (id, newStatus) => {
        const res = await post(`${TREATMENT_TYPE_URL}/${id}?sts=${newStatus}`);
        if (res.success) {
            showSuccessAlert(newStatus === 1 ? 'Treatment restored successfully!' : 'Treatment deleted successfully!');
            fetchData();
        } else {
            console.error('Delete error:', res.msg);
        }
    };


    if (isForm) {
        return (
            <Row>
                <Col md={12}>
                    <Card>
                        <CardBody>
                            <Row>
                                <div className="d-flex justify-content-between mb-2">
                                    <h5>
                                        <i
                                            role="button"
                                            className="me-2 fas fa-arrow-left"
                                            onClick={handleToggle}
                                        />
                                        {editMode ? 'Update' : 'Create'} Treatment
                                    </h5>
                                    <button className="btn btn-danger" onClick={handleToggle}>
                                        <i className="mdi mdi-close noti-icon" /> Cancel
                                    </button>
                                </div>
                                <hr />
                                <Col md={4}>
                                    <div className="mb-1">
                                        <label>Title</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Title"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className="mb-1">
                                        <label>Cost</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Cost"
                                            name="cost"
                                            value={formData.cost}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <div className="d-flex justify-content-end mt-3 mb-1">
                                        <button className="btn btn-primary" type="button" onClick={handleSubmit}>
                                            <i className=" mdi mdi-plus" /> {editMode ? 'Update' : 'Submit'}
                                        </button>
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
            columns={ManageTreatmentsColumns(handleEdit, handleDelete)}
            showTableOnly={true}
            rows={rows.items || []}
            rowsLength={rows?.totalItems || 0}
            rowsPerPage={pagination.limit}
            keyField={'id'}
            handleAddButton={handleToggle}
            title="All Treatments"
            isAdd={true}
            isTableHead={true}
            ssr={() => { }}
        />
    );
};

export default ManageTreatments;
