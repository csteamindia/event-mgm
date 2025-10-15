import React, { useEffect, useState } from 'react';
import { Row, Col, Card, CardBody, CardTitle } from 'reactstrap';
import { get, post } from 'helpers/api_helper';
import Datatables from 'pages/utils/table/datatable';
import { TREATMENT_URL, PATIENT_URL, BILLING_URL } from 'helpers/url_helper';
import { showSuccessAlert } from "pages/utils/alertMessages";
import Select from "react-select";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import AddTreatmentRows from 'pages/utils/incrementalRowsTreatment';
import moment from 'moment';

const Prescription = ({patientData}) => {
    const [isForm, setIsForm] = useState(false);
    const [formData, setFormData] = useState({ tretment_date:'', note: '', doctor_code: '' });
    const [rows, setRows] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, Search: '' });
    const [doctors, setDoctors] = useState([]);
    const [isClearable, setIsClearable] = useState(true);
    const [isSearchable, setIsSearchable] = useState(true);

    const fetchData = async () => {
        const { success, body } = await get(`${TREATMENT_URL}?patient_id=${patientData?.id}&page=${pagination.page}&limit=${pagination.limit}&search=${pagination.Search}`);
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

    const handleSubmit = async () => {
        
        let objectData = [];
        formData?.treatments?.map( v =>{
            objectData.push({
                patient_id: patientData.id,
                doctor_code: formData.doctor_code,
                treatment_date: formData.tretment_date,
                tooths: v.teeth.join(','),
                treatment_type: v.treatment_type?.value,
                treatment_cost: v.cost,
                tretment_note: v.note,
                treatment_discount: v.discount,
                treatment_total_cost: v.total,
                treatment_discount_type: v.multiply_cost ? 1 : 0
            })
        });

        const url = editMode ? `${TREATMENT_URL}/${editingId}` : TREATMENT_URL;
        const res = await post(url, {
            _q: objectData
        });
        if (res.success) {
            showSuccessAlert(editMode ? 'Treatment updated successfully!' : 'Treatment created successfully!');
            setIsForm(false);
            setEditMode(false);
            setEditingId(null);
            setFormData({});
            fetchData();
        }
    };

    const handleMultiRowData = (data) => {
        setFormData(prev => ({
           ...prev, treatments: data
        }));
    }
    
    const treatmentsColumns = [
        { dataField: 'id', text: '#', style: { width: '20px' }, },
        // eslint-disable-next-line react/display-name
        { dataField: 'treatment_date', text: 'Date', formatter: (cell, row) => {
            return <>
                {moment(row.treatment_date).format('DD-MM-YYYY')}
            </>
        } },
        { dataField: 'doctor.name', text: 'Treatment By' },
        { dataField: 'treatment_type', text: 'Treatment Type'},
        { dataField: 'treatment_total_cost', text: 'Cost' },
        { dataField: 'treatment_status', text: 'Status' },
        // eslint-disable-next-line react/display-name
        { dataField: 'actions0', style: { width: '20px' },  text: '', formatter: (cell, row) => {

            return row.is_billed ?
            <a href="#" className="btn btn-info btn-sm edit" onClick={() => handleEdit(row)} title="Edit">
                <i className="fas fa-print" />
            </a>: 
            <a href="#" className="btn btn-info btn-sm edit" onClick={() => handleGenrateBill(row)} title="Genrate Bill">
                <i className="bx bx-cog bx-spin" /> Genrate Bill
            </a>

        } },
        {
            dataField: 'actions',
            text: '',
            style: { width: '60px' },
            isDummyField: true,
            // eslint-disable-next-line react/display-name
            formatter: (cell, row) => (
              <>
                <a href="#" className="btn btn-primary btn-sm edit" onClick={() => handleEdit(row)} title="Edit">
                  <i className="fas fa-pencil-alt" />
                </a>
                {' '}
                <a href="#" className="btn btn-danger btn-sm edit" onClick={() => handleDelete(row.id, row.status == 1 ? 0 : 1, row.code)} title={row.status == 0 ? 'Delete' : 'Restore'}>
                  <i className="fas fa-trash-alt" />
                </a>
              </>
            )
        }
    ];

    const handleGenrateBill = async (data) => {
        const res = await post(BILLING_URL, {_q: data?.id})
    }


    const expandRow = {
        renderer: row => {
            let notes = [{
                treatment_date: row.treatment_date,
                treatment_note: row.treatment_note,
                tooths: row.tooths,
            }];

            if(row?.notes?.length > 0){
                notes = [...notes, ...row?.notes];
            }
            
            return notes.map((note, index) => (
                <table className='table' key={`EXR_${index+1}`}>
                    <tbody>
                        <tr>
                            <td colSpan={2}><span style={{fontSize: '18px'}}>{row.doctor.name}</span> {moment(note.treatment_date).format('DD-MM-YYYY')} </td>
                        </tr>
                        <tr>
                            <td>
                                TOOTHS: <b>{note.tooths}</b> <br /><br />
                                {note.treatment_note}
                            </td>
                        </tr>
                    </tbody>
                </table>
            ))
        },
        showExpandColumn: true,
        expandByColumnOnly: true,
        onlyOneExpanding: true
    };

    if (isForm) {
        return (
            <Row>
                <Col md={12}>
                    <Card>
                        <CardBody>
                            <div className="d-flex justify-content-between mb-2">
                                <h5> <i role="button" className="me-2 fas fa-arrow-left" onClick={handleToggle} /> Add Treatment </h5>
                                <button className="btn btn-danger" onClick={handleToggle}><i className="mdi mdi-close noti-icon" /> Cancel </button>
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
                                            value={formData.tretment_date || ''}
                                            onChange={(date) => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    tretment_date: date[0]?.toISOString() || ''
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
                                            console.log('Selected Option:', selectedOption);
                                            setFormData((prev) => ({
                                                ...prev, doctor_code: selectedOption?.value
                                            }))
                                        }}
                                        placeholder="Select Doctor" />
                                </Col>
                            </Row>
                            <div className="mb-4 bg-light p-3 rounded">
                                <AddTreatmentRows callback={handleMultiRowData} />
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
                                            value={formData?.note}
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
            columns={treatmentsColumns}
            showTableOnly={true}
            rowsLength={rows?.totalItems || 0}
            rows={rows.items || []}
            keyField={'id'}
            expandRow={expandRow}
            handleAddButton={handleToggle}
            title="All Treatments"
            isAdd={true}
            isTableHead={true}
            ssr={() => { }}
        />
    );
};

export default Prescription;
