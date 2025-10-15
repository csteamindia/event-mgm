import React, { useEffect, useState } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { get, post } from 'helpers/api_helper';
import Datatables from 'pages/utils/table/datatable';
import { ROLES_URL } from 'helpers/url_helper';
import { showSuccessAlert } from "pages/utils/alertMessages";
import cookieHelper from 'helpers/getCookieData';
import { Link } from 'react-router-dom';

const UserRoleAccess = () => {
    const clinic = cookieHelper.getCookie('_c') ? JSON.parse(atob(cookieHelper.getCookie('_c'))) : null;
    const [isForm, setIsForm] = useState(false);
    const [formData, setFormData] = useState({});
    const [rows, setRows] = useState([]);
    const [permissionData, setPermissionData] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        Search: '',
    });

    const fetchData = async () => {
        const { success, body } = await get(`${ROLES_URL}?page=${pagination.page}&limit=${pagination.limit}&search=${pagination.Search}`);
        if (success) {
            setRows(body);
        }
    }

    useEffect(() => {
        if (clinic) {
            setFormData(prev => ({
                ...prev,
                clinic_id: clinic.id
            }));
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [pagination]);

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
        // console.log('Submitting formData:', formData);
        const res = await post(ROLES_URL, formData);
        if (res.success) {
            showSuccessAlert('Role created successfully!');
            setIsForm(false);
            setFormData({});
            formData();
        }
    };

    const handleEdit = () => {}

    const handlePrevilizes = async(rowId) => {
        const { success, body } = await get(`permissions?isconfig=1&clinic_id=${clinic?.id}&role_id=${rowId}`);
        
        if(success){
            const convertedArray = Object.entries(body?.modules).map(([name, perms]) => ({
                name,
                ...perms,
            }));
            setPermissionData(convertedArray);
        }
    }

    const ManageRoleColumns = [
        { dataField: 'role_id', text: '#' },
        { dataField: 'name', text: 'Role Name' },
        { dataField: 'description', text: 'Description' },
        {
            dataField: 'actions',
            text: '',
            isDummyField: true,
            // eslint-disable-next-line react/display-name
            formatter: (cell, row) => (
            <>
                <Link to="#" className="btn btn-warning btn-sm edit" onClick={() => handlePrevilizes(row.role_id)} title="Edit">
                <i className={`fas fa-table`} />
                </Link>
                {' '}
                <Link to="#" className="btn btn-primary btn-sm edit" onClick={() => handleEdit(row.role_id)} title="Edit">
                <i className={`fas fa-pencil-alt`} />
                </Link>
                {' '}
                <Link to="#" className={`btn btn-danger btn-sm edit`} onClick={() => handleRemove(row.role_id, row.status == 1 ? 0 : 1, row.code)} title={row.status == 0 ? 'delete' : 'restore'}>
                <i className={`fas fas fa-trash-alt`} />
                </Link>
            </>
            )
        }
    ];

    const updatePermission = async(data) => {
        const obj = {
            client_id: 1,
            role_id: 1,
            clinic_id: 1,
            ...data
        }
        console.log(obj);
    }

    /** Open Form for add or update */
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
                                        Create Role
                                    </h5>
                                    <button className="btn btn-danger" onClick={handleToggle}>
                                        <i className="mdi mdi-close noti-icon" /> Cancel
                                    </button>
                                </div>
                                <hr />
                                <Col md={4}>
                                    <div className="mb-1">
                                        <label>Role</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Role Name"
                                            name="name"
                                            value={formData.name || ''}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className="mb-1">
                                        <label>Description</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Description"
                                            name="description"
                                            value={formData.description || ''}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </Col>
                            </Row>

                            <Row className='mt-2'>
                                <Col md={12}>
                                    <div className="d-flex justify-content-end mb-2 mt-3">
                                        <button className="btn btn-primary" type="button" onClick={handleSubmit}>
                                            <i className=" mdi mdi-plus" /> Submit
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

    if (permissionData) {
        return (
            <Row>
                <Col md={12}>
                    <Card>
                        <CardBody>
                            <Row>
                                <div className="d-flex justify-content-between mb-2">
                                    <h5><i role="button" className="me-2 fas fa-arrow-left" onClick={handleToggle} /> User Permissions Update</h5>
                                    <button className="btn btn-danger" onClick={handleToggle}><i className="mdi mdi-close noti-icon" /> Cancel</button>
                                </div>
                                <hr />
                                <Col>
                                    <table className='table table-bordered'>
                                        <thead>
                                            <tr>
                                                <th>Module</th>
                                                {["is_accessable", "is_readable", "is_creatable", "is_writable", "is_deletable"].map((field, i) => (
                                                    <th key={`head_${i}`}>
                                                    {field.replace("is_", "").toUpperCase()}
                                                    <br />
                                                    <input
                                                        type="checkbox"
                                                        onChange={(e) => {
                                                            const updated = permissionData.map((item) => {
                                                                const newItem = { ...item };

                                                                if (field === "is_accessable") {
                                                                newItem[field] = e.target.checked;

                                                                // if disabling access, disable all children
                                                                if (!e.target.checked) {
                                                                    newItem.is_readable = false;
                                                                    newItem.is_creatable = false;
                                                                    newItem.is_writable = false;
                                                                    newItem.is_deletable = false;
                                                                }
                                                                } else {
                                                                newItem[field] = e.target.checked;

                                                                // if checking any child, enable is_accessable
                                                                if (e.target.checked) {
                                                                    newItem.is_accessable = true;
                                                                }
                                                                }

                                                                return newItem;
                                                            });

                                                            setPermissionData(updated);
                                                        }}
                                                    />
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {permissionData?.map((item, i) => (
                                                <tr key={`perm_${i}`}>
                                                    <td>{item.name || Object.keys(permissionData)[i]}</td>
                                                    {/* is_accessable checkbox */}
                                                    <td>
                                                    <input
                                                        type="checkbox"
                                                        checked={item.is_accessable}
                                                        onChange={async(e) => {
                                                            const updated = [...permissionData];
                                                            updated[i].is_accessable = e.target.checked;
                                                            const updatedRow = { ...updated[i] };
                                                            updatedRow[i] = e.target.checked;

                                                            if (!e.target.checked) {
                                                                // Uncheck all if access is revoked
                                                                updated[i].is_readable = false;
                                                                updated[i].is_creatable = false;
                                                                updated[i].is_writable = false;
                                                                updated[i].is_deletable = false;
                                                            }

                                                            setPermissionData(updated);
                                                            await updatePermission(updatedRow);
                                                        }}
                                                    />
                                                    </td>

                                                    {/* Other permissions - enabled only if is_accessable is true */}
                                                    {["is_readable", "is_creatable", "is_writable", "is_deletable"].map((field) => (
                                                    <td key={`${field}_${i}`}>
                                                        <input
                                                        type="checkbox"
                                                        checked={item[field]}
                                                        disabled={field !== "is_accessable" && !item.is_accessable}
                                                        onChange={async(e) => {
                                                            const updated = [...permissionData];
                                                            updated[i][field] = e.target.checked;
                                                            const updatedRow = { ...updated[i] };

                                                            updatedRow[field] = e.target.checked;

                                                            // If any field is checked, ensure is_accessable is true
                                                            if (e.target.checked) {
                                                                updated[i].is_accessable = true;
                                                            }

                                                            setPermissionData(updated);
                                                            await updatePermission(updatedRow);
                                                        }}
                                                        />
                                                    </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
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
            columns={ManageRoleColumns}
            showTableOnly={true}
            rowsLength={rows?.totalItems || 0}
            rows={rows.items || []}
            keyField={'id'}
            handleAddButton={handleToggle}
            title="All Roles"
            isAdd={true}
            isTableHead={true}
            ssr={() => { }}
        />
    );
};

export default UserRoleAccess;
