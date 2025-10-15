import React, { useEffect, useState } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { get, post } from 'helpers/api_helper';
import Datatables from 'pages/utils/table/datatable';
import { ManageBankColumns } from './tableColumns';
import { BANK_URL } from 'helpers/url_helper';
import { showSuccessAlert } from "pages/utils/alertMessages";

const ManageBankAccount = () => {
    const [isForm, setIsForm] = useState(false);
    const [formData, setFormData] = useState({});
    const [rows, setRows] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        Search: ''
    });
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const fetchData = async () => {
        const { success, body } = await get(`${BANK_URL}?page=${pagination.page}&limit=${pagination.limit}&search=${pagination.Search}`);
        if (success) {
            setRows(body);
        }
    }

    useEffect(() => {
        fetchData();
    }, [pagination]);

    const handleToggle = () => {
        setIsForm(!isForm);
        setEditMode(false);
        setEditingId(null);
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
        // console.log('Submitting formData:', formData);
        const url = editMode ? `${BANK_URL}/${editingId}` : BANK_URL;
        const res = await post(url, formData);

        if (res.success) {
            showSuccessAlert(editMode ? 'Bank updated successfully!' : 'Bank created successfully!');
            setIsForm(false);
            setFormData({});
            setEditMode(false);
            setEditingId(null);
            fetchData(); // Refresh list
        }

    };

    const handleEdit = (row) => {
        setFormData({
            bank_name: row.bank_name,
            ac_no: row.ac_no,
            ifsc_code: row.ifsc_code,
            branch: row.branch,
            addrress: row.addrress,
            ac_type: row.ac_type,
        });
        setEditMode(true);
        setEditingId(row.id);
        setIsForm(true);
    };

    const handleDelete = async (id, newStatus) => {
        const res = await post(`${BANK_URL}/${id}?sts=${newStatus}`, {});
        if (res.success) {
            showSuccessAlert(newStatus === 1 ? 'Bank restored successfully!' : 'Bank deleted successfully!');
            fetchData(); // Refresh list
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
                                        {editMode ? 'Update' : 'Create'} Bank
                                    </h5>
                                    <button className="btn btn-danger" onClick={handleToggle}>
                                        <i className="mdi mdi-close noti-icon" /> Cancel
                                    </button>
                                </div>
                                <hr />
                                <Col md={4}>
                                    <div className="mb-1">
                                        <label>Bank Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Bank Name"
                                            name="bank_name"
                                            value={formData.bank_name || ''}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className="mb-1">
                                        <label>Account Number</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Enter Account Number"
                                            name="ac_no"
                                            value={formData.ac_no || ''}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className="mb-1">
                                        <label>IFSC Code</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter IFSC Code"
                                            name="ifsc_code"
                                            value={formData.ifsc_code || ''}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <Row className='mt-3'>
                                <Col md={4}>
                                    <div className="mb-1">
                                        <label>Branch</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Branch Name"
                                            name="branch"
                                            value={formData.branch || ''}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className="mb-1">
                                        <label>Bank Addrress</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Bank Addrress"
                                            name="addrress"
                                            value={formData.addrress || ''}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className="mb-1">
                                        <label>Account Type</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Account Type"
                                            name="ac_type"
                                            value={formData.ac_type || ''}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <Row >
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
            columns={ManageBankColumns(handleEdit, handleDelete)}
            showTableOnly={true}
            rowsLength={rows?.totalItems || 0}
            rows={rows.items || []}
            keyField={'id'}
            handleAddButton={handleToggle}
            title="All Banks"
            isAdd={true}
            isTableHead={true}
            ssr={() => { }}
        />
    );
};

export default ManageBankAccount;
