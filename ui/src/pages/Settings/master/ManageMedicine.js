import React, { useEffect, useState } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { get, post } from 'helpers/api_helper';
import Datatables from 'pages/utils/table/datatable';
import { ManageMedicineColumns } from './tableColumns';
import { MEDICINE_URL } from 'helpers/url_helper';
import { showSuccessAlert } from "pages/utils/alertMessages";

const ManageMedicine = () => {
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
        const { success, body } = await get(`${MEDICINE_URL}?page=${pagination.page}&limit=${pagination.limit}&search=${pagination.Search}`);
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
        const url = editMode ? `${MEDICINE_URL}/${editingId} ` : MEDICINE_URL;
        const res = await post(url, formData);
        if (res.success) {
            showSuccessAlert(editMode ? 'Medicine updated successfully!' : 'Medicine created successfully!');
            setIsForm(false);
            setFormData({});
        }
    };

    const handleEdit = (row) => {
        setFormData({
            name: row.name,
            molucule: row.molucule,
            dose: row.dose,
            frequent: row.frequent,
            duration: row.duration,
            is_fevrate: row.is_fevrate,
        });
        setEditMode(true);
        setEditingId(row.id);
        setIsForm(true);
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
                                        {editMode ? 'Update' : 'Create'} Medicines
                                    </h5>
                                    <button className="btn btn-danger" onClick={handleToggle}>
                                        <i className="mdi mdi-close noti-icon" /> Cancel
                                    </button>
                                </div>
                                <hr />
                                <Col md={4}>
                                    <div className="mb-1">
                                        <label>Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Medicine Name"
                                            name="name"
                                            value={formData.name || ''}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className="mb-1">
                                        <label>Molecule</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Molecule"
                                            name="molucule"
                                            value={formData.molucule || ''}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className="mb-1">
                                        <label>Frequent</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Frequent"
                                            name="frequent"
                                            value={formData.frequent || ''}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <Row className='mt-3'>
                                <Col md={4}>
                                    <div className="mb-1">
                                        <label>Duration</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Duration"
                                            name="duration"
                                            value={formData.duration || ''}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className="form-check form-switch form-switch-md mt-2 d-flex flex-column align-items-start">
                                        <label className="form-check-label" htmlFor="customSwitchsizemd" style={{ marginLeft: "-38px" }}>
                                            Is Favorite
                                        </label>
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="customSwitchsizemd"
                                            name="is_fevrate"
                                            checked={formData.is_fevrate || false}
                                            onChange={(e) =>
                                                setFormData(prev => ({
                                                    ...prev,
                                                    is_fevrate: e.target.checked,
                                                }))
                                            }
                                        />
                                    </div>
                                </Col>

                                <Col md={4}>
                                    <div className="mb-1">
                                        <label>Dose</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Dose"
                                            name="dose"
                                            value={formData.dose || ''}
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
            columns={ManageMedicineColumns(handleEdit)}
            showTableOnly={true}
            rowsLength={rows?.totalItems || 0}
            rows={rows.items || []}
            keyField={'id'}
            handleAddButton={handleToggle}
            title="All Medicines"
            isAdd={true}
            isTableHead={true}
            ssr={() => { }}
        />
    );
};

export default ManageMedicine;
