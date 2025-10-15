import React, { useEffect, useState } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { ManageUsersColumns } from './tableColumns';
import Datatables from "../../utils/table/datatable";
import { get, post } from 'helpers/api_helper';
import { USER_URL } from 'helpers/url_helper';

const ManageUsers = () => {
    // State for form fields
    const [userData, setUserData] = useState({
        name: '',
        mobile: '',
        email: '',
        role: ''
    });
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value
        });
    };

    const handleAddUser = () => {}


    return (
        <>
            <Row>
                <Col>
                    <Card>
                        <CardBody>
                            <h5 className='mb-3'>Add User</h5>
                            <Row>
                                <Col>
                                    <label>Full Name</label>
                                    <input
                                        className='form-control'
                                        name="name"
                                        value={userData.name}
                                        onChange={handleInputChange}
                                        placeholder='Fullname of the User'
                                    />
                                </Col>
                                <Col>
                                    <label>Contact No</label>
                                    <input
                                        className='form-control'
                                        name="mobile"
                                        value={userData.mobile}
                                        onChange={handleInputChange}
                                        placeholder='Contact Number'
                                    />
                                </Col>
                                <Col>
                                    <label>Email Address</label>
                                    <input
                                        className='form-control'
                                        name="email"
                                        value={userData.email}
                                        onChange={handleInputChange}
                                        placeholder='Email Address'
                                    />
                                </Col>
                                <Col>
                                    <label>Role</label>
                                    <select
                                        className='form-control'
                                        name="role"
                                        value={userData.role}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select Role</option>
                                        <option value="admin">Admin</option>
                                        <option value="doctor">Doctor</option>
                                        <option value="receptionist">receptionist</option>
                                    </select>
                                </Col>
                                <Col md={1} className='mt-1'>
                                    <button
                                        className='btn btn-primary mt-4 w-100'
                                        type="button"
                                        onClick={handleAddUser}
                                        disabled={loading}
                                    >
                                        {loading ? 'Adding...' : 'Add'}
                                    </button>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            {/* List Bootstrap Table  */}
            <Datatables
                isSearch={true}
                columns={ManageUsersColumns}
                showTableOnly={true}
                rows={users} // Pass the updated users list
                keyField={'id'}
                handleAddButton={() => { }}
                title="All Users"
                loading={false}
                isAdd={false}
                isTableHead={true}
                ssr={() => { }}
            />
        </>
    );
}

export default ManageUsers;
