import React, { useEffect, useState } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { get, post } from 'helpers/api_helper';
import Datatables from 'pages/utils/table/datatable';
import Filters from './filters';

const Appointments = () => {
    const [rows, setRows] = useState([])
    const columns = [
        { dataField: 'id', text: '#' },
        { dataField: 'patient_id', text: 'Patient'},
        { dataField: 'doctor_id', text: 'Doctor'},
        { dataField: 'mobile', text: 'Mobile'},
        { dataField: 'status', text: 'Status'},
        { dataField: 'doctor_id', text: 'Appointment Date'},
        { dataField: 'doctor_id', text: 'Arravel Time'},
        { dataField: 'doctor_id', text: 'Attend Time'},
        { dataField: 'doctor_id', text: 'Completed Time'},
        { dataField: 'doctor_id', text: 'Cancelled Reason'},
        { dataField: 'doctor_id', text: 'Cancelled By'},
        { dataField: 'doctor_id', text: 'Token Number'},
        { dataField: 'doctor_id', text: 'Remark'},
    ]


    return (
        <>
            <Filters />

            <Datatables
                isSearch={true}
                columns={columns}
                showTableOnly={true}
                rowsLength={rows?.totalItems || 0}
                rows={rows.items || []}
                keyField={'id'}
                title="Appointment Resports"
                isAdd={false}
                isTableHead={true}
                ssr={() => { }}
            />
        </>

    )
}

export default Appointments;