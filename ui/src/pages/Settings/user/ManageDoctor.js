import React, { useEffect, useState, useRef } from 'react';
import { Row, Col, Card, CardBody, Button } from 'reactstrap';
import { ManageDoctorColumns } from './tableColumns';
import Datatables from "../../utils/table/datatable";
import Dropzone from "react-dropzone"
import SignaturePad from 'react-signature-pad-wrapper';
import { get, post } from 'helpers/api_helper';
import { DOCTOR_URL, DOCTOR_TIMING_URL } from 'helpers/url_helper';
import { showSuccessAlert } from "pages/utils/alertMessages";
import "flatpickr/dist/themes/material_blue.css"
import Flatpickr from "react-flatpickr"


const ManageDoctor = () => {
    const [isForm, setIsForm] = useState(false);
    const [selectedColor, setSelectedColor] = useState('#563d7c');
    const [isSignatureEmpty, setIsSignatureEmpty] = useState(true);
    const [signature, setSignature] = useState(null);
    const [formData, setFormData] = useState({});
    const [rows, setRows] = useState([]);
    const [doctorTiming, setDoctorTiming] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        Search: '',
    });

    const signaturePad = useRef(null);

    const handleToggle = () => {
        setIsForm(!isForm)
    }

    const handleClearSignature = () => {
        signaturePad.current.clear();
        setSignature(null);
    };

    const handleSaveSignature = () => {
        if (signaturePad.current.isEmpty()) {
            alert('Please provide signature');
            return;
        }
        setSignature(signaturePad.current.getTrimmedCanvas().toDataURL('image/png'));
    };

    const handleSignatureChange = () => {
        const isEmpty = signaturePad.current.isEmpty();
        console.log('Signature changed, isEmpty:', isEmpty);
        setIsSignatureEmpty(isEmpty);
    };

    useEffect(() => {
        // console.log('isSignatureEmpty state changed:', isSignatureEmpty);
    }, [signaturePad]);

    const fetchData = async () => {
        const { success, body } = await get(`${DOCTOR_URL}?page=${pagination.page}&limit=${pagination.limit}&search=${pagination.Search}`);
        if (success) {
            setRows(body);
        }
    }

    useEffect(() => {
        fetchData();
    }, [pagination]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        const finalDoctorData = {
            ...formData,
            color_code: selectedColor,
            signature: signature,
        };

        const doctorRes = await post(DOCTOR_URL, finalDoctorData);
        if (doctorRes.success) {
            showSuccessAlert('Doctor created successfully!');
            const doctorId = doctorRes.body?.id;
            // Now save doctor timing
            const timingData = {};
            const timingRes = await post(DOCTOR_TIMING_URL, timingData);
            if (timingRes.success) {
                showSuccessAlert('Doctor timing saved successfully!');
            }
            setIsForm(false);
            setFormData({});
        }
    };

    const handleColorChange = (e) => {
        const color = e.target.value;
        setSelectedColor(color);
        setFormData(prev => ({
            ...prev,
            color_code: color
        }));
    };

    const [rows1, setrows1] = useState([{ id: 1 }])

    function handleAddRowNested() {
        const modifiedRows = [...rows1]
        modifiedRows.push({ id: modifiedRows.length + 1 })
        setrows1(modifiedRows)
    }

    function handleRemoveRow(id) {
        if (id !== 1) {
            var modifiedRows = [...rows1]
            modifiedRows = modifiedRows.filter(x => x["id"] !== id)
            setrows1(modifiedRows)
        }
    }

    const handleTimingChange = (id, field, value) => {
        setrows1(prevRows =>
            prevRows.map(row =>
                row.id === id
                    ? { ...row, [field]: value }
                    : row
            )
        );
    };

    if (isForm) {
        return (
            <Row>
                <Col>
                    <Card>
                        <CardBody>
                            <div className='d-flex justify-content-between mb-2'>
                                <h5><i role="button" className='me-2 fas fa-arrow-left' onClick={handleToggle} /> Add Doctor</h5>
                                <button className='btn btn-danger' onClick={handleToggle} > <i className='mdi mdi-close noti-icon' /> Cancel</button>
                            </div>
                            <hr />

                            <Row className='mb-2'>
                                <Col md={5}>
                                    <label>Full Name</label>
                                    <input className='form-control' name="name" value={formData.name || ''}
                                        onChange={handleChange} placeholder='Fullname of the User' />
                                </Col>
                                <Col md={2}>
                                    <label>Code</label>
                                    <input className='form-control' name="code" value={formData.code || ''}
                                        onChange={handleChange} placeholder='Code' />
                                </Col>
                                <Col md={5}>
                                    <label>Licence / Registration Number</label>
                                    <input className='form-control' name="registration_no" value={formData.registration_no || ''}
                                        onChange={handleChange} placeholder='Licence / Registration Number' />
                                </Col>
                            </Row>
                            <Row className='mt-2'>
                                <Col>
                                    <label>Contact No</label>
                                    <input className='form-control' name="mobile" value={formData.mobile || ''}
                                        onChange={handleChange} placeholder='Contact Number' />
                                </Col>
                                <Col>
                                    <label>Email Address</label>
                                    <input className='form-control' name="email" value={formData.email || ''}
                                        onChange={handleChange} placeholder='Email Address' />
                                </Col>
                                <Col>
                                    <label>Doctor Color Code</label>
                                    <div className="d-flex align-items-center">
                                        <input
                                            type="color"
                                            className="form-control form-control-color"
                                            value={selectedColor}
                                            onChange={handleColorChange}
                                            title="Choose your color"
                                            style={{ width: '60px' }}
                                        />
                                        <span className="ms-2 text-muted">{selectedColor}</span>
                                    </div>
                                </Col>
                            </Row>

                            <Row className='mt-2'>
                                <Col>
                                    <label>Signature</label>
                                    <Dropzone onDrop={acceptedFiles => { handleAcceptedFiles(acceptedFiles) }} >
                                        {({ getRootProps, getInputProps }) => (
                                            <div style={{ minHeight: "96px" }} className="dropzone">
                                                <div
                                                    className="dz-message needsclick mt-3 p-0"
                                                    {...getRootProps()}
                                                >
                                                    <input {...getInputProps()} />
                                                    <div className="">
                                                        <i className="display-4 text-muted bx bxs-cloud-upload" />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </Dropzone>
                                </Col>
                                <Col>
                                    <div className='mt-4 pt-1' style={{ border: '2px dashed #ced4da', borderRadius: '6px' }} onClick={handleSignatureChange} >
                                        {
                                            isSignatureEmpty ?
                                                <span style={{ position: 'absolute', marginLeft: '32%', marginTop: '18px', fontSize: '32px' }}>Sign here</span> : ''
                                        }
                                        <SignaturePad ref={signaturePad} height={86} />
                                    </div>
                                </Col>
                            </Row>

                            <br />
                            <hr />
                            <h5 className='text-info' >Appointment Timing</h5>
                            <hr />
                            {/* <br /> */}

                            <div className="inner-repeater mb-4">
                                {(rows1 || []).map((formRow, key) => (
                                    <div key={key} className="mb-3 border p-3 rounded">
                                        <Row>
                                            <Col>
                                                <label>Start Time</label>
                                                <Flatpickr
                                                    className="form-control"
                                                    options={{
                                                        enableTime: true,
                                                        noCalendar: true,
                                                        dateFormat: "h:i K",
                                                        time_24hr: false,
                                                    }}
                                                    value={formRow.startTime}
                                                    onChange={([date]) => handleTimingChange(formRow.id, 'startTime', date)}

                                                    placeholder="Select Time"
                                                />
                                            </Col>
                                            <Col >
                                                <label>End Time</label>
                                                <Flatpickr
                                                    className="form-control"
                                                    options={{
                                                        enableTime: true,
                                                        noCalendar: true,
                                                        dateFormat: "h:i K",
                                                        time_24hr: false,
                                                    }}
                                                    value={formRow.endTime}
                                                    onChange={([date]) => handleTimingChange(formRow.id, 'endTime', date)}
                                                    placeholder="Select Time"
                                                />
                                            </Col>
                                            <Col>
                                                <label>Extra Time</label>
                                                <input
                                                    type="number" // Set input type to number
                                                    className="form-control"
                                                    name="exe_time"
                                                    value={formData.exe_time || ''}
                                                    onChange={handleChange}
                                                    placeholder="Extra Time"
                                                />
                                            </Col>
                                            <Col md={2} className="text-end mt-4">
                                                <Button className='me-2' color="primary" onClick={handleAddRowNested} title="Add Row">
                                                    {/* <FaPlus /> */}   Add
                                                </Button>
                                                {rows1.length > 1 && (
                                                    <Button className='me-2' color="danger" onClick={() => handleRemoveRow(formRow.id)} title="Delete Row">
                                                        Delete
                                                    </Button>
                                                )}
                                            </Col>
                                        </Row>
                                    </div>
                                ))}
                            </div>
                            <Row className='mt-2'>
                                <Col>
                                    <div className="text-end mt-2">
                                        <button className="m-2 btn btn-primary" onClick={handleSubmit}>Submit</button>
                                    </div>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        )
    }

    {/* List Bootstrap Table  */ }
    return (
        <Datatables
            isSearch={true}
            columns={ManageDoctorColumns}
            showTableOnly={true}
            rowsLength={rows?.totalItems || 0}
            rows={rows.items || []}
            keyField={'id'}
            handleAddButton={handleToggle}
            title="All Doctors"
            isAdd={true}
            isTableHead={true}
            ssr={() => { }}
        />
    );
}

export default ManageDoctor;
