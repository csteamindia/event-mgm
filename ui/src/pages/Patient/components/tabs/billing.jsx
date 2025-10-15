import React, { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody, CardTitle } from 'reactstrap';
import { get, post } from 'helpers/api_helper';
import Datatables from 'pages/utils/table/datatable';
import { BILLING_URL } from 'helpers/url_helper';
import moment from 'moment';

const Billing = ({patientData}) => {
    const [isAdd, setIsAdd] = useState(false);
    const [rows, setRows] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, Search: '' });

    const billingColumns = [
        { dataField: 'id', text: '#', style: { width: '20px' }, },
        { dataField: 'date', text: 'Bill Date', formatter: (cell, row) => moment(row.date).format('DD-MM-YYYY')},
        { dataField: 'billing_no', text: 'Bill Number'},
        { dataField: 'total', text: 'Bill Total'},
        { dataField: 'paid', text: 'Bill paid'},
        { dataField: 'pending', text: 'Bill Pending'},
        { dataField: 'note', text: 'Note'},
        // eslint-disable-next-line react/display-name
        { dataField: 'status', text: 'Status', formatter: (cell, row) => {
            switch(row.status) {
                case '1':
                    return <span className="badge-soft-info">Partial Paid</span> 
                case '2':
                    return <span className="badge-soft-success">paid</span>
                case '3':
                    return <span className="badge-soft-danger">Canceled</span>
                default:
                    return <span className="badge-soft-warning">Pending</span>
            }
        }}
        // { dataField: 'actions0', style: { width: '20px' },  text: '', formatter: (cell, row) => {
        //     <>
        //         <a href="#" className="btn btn-info btn-sm edit" onClick={() => handleEdit(row)} title="Cancel bill"><i className="fas fa-print" /></a>
        //         <a href="#" className="btn btn-info btn-sm edit" onClick={() => handleEdit(row)} title="Print bill"><i className="fas fa-print" /></a>
        //     </>
        // } },
    ];

    const handleToggle = () => {
        setIsAdd(!isAdd);
    };

    const fetchBillings = async () => {
        const { success, body } = await get(`${BILLING_URL}?patient_id=${patientData?.id}&page=${pagination.page}&limit=${pagination.limit}&search=${pagination.Search}`);
        if(success) {
            setRows(body);
        }
    }

    useEffect(() => {
        fetchBillings();
    }, [])

    return(
        <Datatables
            isSearch={true}
            columns={billingColumns}
            showTableOnly={true}
            rowsLength={rows?.totalItems || 0}
            rows={rows.items || []}
            keyField={'id'}
            handleAddButton={handleToggle}
            title="All Bills"
            isAdd={true}
            isTableHead={true}
            ssr={() => { }}
        />
    )
}

export default Billing;