import React, { useEffect, useState } from "react"
import { Row, Col, Card, CardBody } from "reactstrap"
import Dropzone from "react-dropzone"
import { get, post, uploadImg } from 'helpers/api_helper';
import { PATIENT_URL, FILES_URL } from 'helpers/url_helper';
import { showSuccessAlert } from "pages/utils/alertMessages";
import cookieHelper from "helpers/getCookieData";
import { useHistory } from "react-router-dom";

const AddPatient = ({ patientData, is_update = false }) => {
    const history = useHistory();
    const [formData, setFormData] = useState(patientData);
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [title, setTitle] = useState("Mr.");
    const [gender, setGender] = useState("Male");
    const [dob, setDob] = useState(patientData?.bob);
    const [age, setAge] = useState(0);
    const [options, setOptions] = useState([])
    
    const optionsFatch = async() => {
        const { success, body } = await get(`${PATIENT_URL}/profile/options`);
        if(success){
            setOptions(body);
        }
    }

    const clinic = cookieHelper.getCookie('_c') ? JSON.parse(atob(cookieHelper.getCookie('_c'))) : null

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (e.target.type == 'checkbox') {
            const a = e.target.checked
            setFormData(prev => ({
                ...prev,
                [name]: a
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

    };

    const calculateAge = (dateString) => {
        const dobDate = new Date(dateString);
        const now = new Date();
        let years = now.getFullYear() - dobDate.getFullYear();
        let months = now.getMonth() - dobDate.getMonth();

        if (months < 0) {
            years--;
            months += 12;
        }

        return `${years} years ${months} months`;
    };

    useEffect(() => {
        calculateAge(patientData?.dob)
    } ,[patientData])

    const handleSubmit = async () => {
        const formDataWithNewFields = {
            ...formData,
            date,
            gender,
            dob,
            title,
            age,
            clinic_id: clinic.id
        };

        // API request to submit the form data
        const response = await post(PATIENT_URL, formDataWithNewFields);
        if (response.success) {
            showSuccessAlert("Patient added successfully!");
            // Reset form data after submission
            // setDate(date);
            // setGender("Male");
            // setDob("");
            // setAge("");
            // setTitle("Mr");
            if(formData?.id){
                // localStorage.setItem("patientData", formData);
                history.push({
                    pathname: '/patient',
                    search: `?_p=${formData.id}`,
                    state: { patientData: formData }
                });
            }else{   
                setFormData({});
            }
        }
    };

    useEffect(optionsFatch, [])

    const handleAcceptedFiles = async(files) => {
        const data = new FormData();
        data.append('file_type', 'profile');
        data.append('files[]', files[0]);

        try {
            const {success, body} = await uploadImg(`${PATIENT_URL}/profile?patient_id=${patientData?.id}`, data);
            if(success){
                alert('Profile updated successfully.');
                history.push({
                    pathname: '/patient',
                    search: `?_p=${body.id}`,
                    state: { patientData: body }
                });
            }
        } catch (error) {
            alert('Error Updating Profile');
            console.error(error);
        }
    }

    return (

        <Row>
            <Col md={3}>
                <Card>
                    <CardBody>
                        <label>Profile Image</label>
                        <div style={{ width: "82px" }}>
                            <Dropzone
                                multiple={false}
                                onDrop={acceptedFiles => {
                                    handleAcceptedFiles(acceptedFiles)
                                }}
                            >
                                {({ getRootProps, getInputProps }) => (
                                    <div style={{ minHeight: "96px" }} className="dropzone">
                                        <div
                                            className="dz-message needsclick mt-3 p-0"
                                            {...getRootProps()}
                                        >
                                            <input {...getInputProps()} />
                                            {formData?.profile_pic ? (
                                            <img
                                                src={`${process.env.REACT_APP_API_URL}${formData?.profile_pic}`}
                                                    alt="Uploaded"
                                                    style={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: 4 }}
                                                />
                                            ) : (
                                                <div>
                                                <i className="display-4 text-muted bx bxs-cloud-upload" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </Dropzone>
                        </div>

                        <div className="form-check form-check-inline mt-3">
                            <input id="customRadioInline1" name="welcome_checkbox" onChange={handleChange} type="checkbox" className="form-check-input form-check-input" defaultValue="" />
                            <label className="form-check-label" htmlFor="customRadioInline1">Send a welcome message to the patient.</label>
                        </div>
                        <div className="form-check form-check-inline mt-3">
                            <input id="customRadioInline2" name="portal_access_checkbox" onChange={handleChange} type="checkbox" className="form-check-input form-check-input" defaultValue="" />
                            <label className="form-check-label" htmlFor="customRadioInline2">Enable sportal access for this patient.</label>
                        </div>
                        <Row className="mt-3">
                            <Col>
                                <label>Preferred Language</label>
                                <select className="form-control" name="language" onChange={handleChange} value={formData?.language}>
                                    {
                                        options?.language?.map((v, i) => <option key={`CGPOI_${i+1}`} value={v.value}>{v.label}</option>)
                                    }
                                </select>
                            </Col>
                        </Row>
                        <Row className="mt-3">
                            <Col>
                                <label style={{ width: '100%', display: 'inline-flex', justifyContent: 'space-between' }}><div>communication group</div> <i role="button" className="fas fa-plus" /></label>
                                <select className="form-control" multiple value={formData?.communication_group ? JSON.parse(formData?.communication_group) : []} onChange={(e) => {
                                    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
                                    setFormData(prev => ({
                                        ...prev,
                                        communication_group: JSON.stringify(selectedOptions)
                                    }));
                                }}>
                                    {
                                        options?.communicationGroup?.map((v, i) => <option key={`CGPOI_${i+1}`} value={v.value}>{v.label}</option>)
                                    }
                                </select>
                            </Col>
                        </Row>
                        <Row className="mt-3">
                            <Col>
                                <label style={{ width: '100%', display: 'inline-flex', justifyContent: 'space-between' }}><div>Tags</div> <i role="button" className="fas fa-plus" /></label>
                                <select className="form-control" multiple value={formData?.patient_tags ? JSON.parse(formData?.patient_tags) : []} onChange={(e) => {
                                    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
                                    setFormData(prev => ({
                                        ...prev,
                                        patient_tags: JSON.stringify(selectedOptions)
                                    }));
                                }}>
                                    {
                                        options?.tags?.map((v, i) => <option key={`TPOI_${i+1}`} value={v.value}>{v.label}</option>)
                                    }
                                </select>
                            </Col>
                        </Row>
                        <Row className="mt-3">
                            <Col>
                                <label style={{ width: '100%', display: 'inline-flex', justifyContent: 'space-between' }}><div>Medical Alerts</div> <i role="button" className="fas fa-plus" /></label>
                                <select className="form-control" multiple value={formData?.allergies ? JSON.parse(formData?.allergies) : []} onChange={(e) => {
                                    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
                                    setFormData(prev => ({
                                        ...prev,
                                        allergies: JSON.stringify(selectedOptions)
                                    }));
                                }}>
                                    {
                                        options?.allergies?.map((v, i) => <option key={`CGPOI_${i+1}`} value={v.value}>{v.label}</option>)
                                    }
                                </select>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Col>
            <Col md={9}>
                <Card>
                    <CardBody>
                        <h4>Personal Details</h4>
                        <Row>
                            <Col md={6} lg={4}>
                                <label>Registration Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    className="form-control"
                                    value={date}
                                    disabled={patientData}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </Col>

                            <Col md={6} lg={4}>
                                <label>Case Number</label>
                                <div className="input-group">
                                    <input type="text"
                                        name="case_no"
                                        className="form-control"
                                        id="inlineFormInputGroupUsername"
                                        placeholder="Case number"
                                        disabled={patientData}
                                        value={formData?.case_no || ''}
                                        onChange={handleChange}
                                    />
                                    <div className="input-group-text"><i className="fas fa-pencil-alt" /></div>
                                </div>
                            </Col>
                        </Row>

                        {/* Patient Details */}
                        <Row className="mt-2">
                            <Col md={1}>
                                <label>Title</label>
                                <select
                                    className="form-control"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                >
                                    <option>Mr.</option>
                                    <option>Mrs.</option>
                                    <option>Miss.</option>
                                    <option>Dr.</option>
                                </select>
                            </Col>

                            <Col md={6} lg={4}>
                                <label>FirstName</label>
                                <input
                                    type="text"
                                    name="first_name"
                                    className="form-control"
                                    placeholder="Firstname"
                                    value={formData?.first_name || ''}
                                    onChange={handleChange}
                                />
                            </Col>
                            <Col md={6} lg={4}>
                                <label>Lastname</label>
                                <input type="text"
                                    name="last_name"
                                    className="form-control"
                                    placeholder="Lastname"
                                    value={formData?.last_name || ''}
                                    onChange={handleChange}
                                />
                            </Col>
                            <Col md={6} lg={3}>
                                <div className="mb-3">
                                    <label className="d-block mb-3 form-label">Gender</label>

                                    <div className="form-check form-check-inline">
                                        <input
                                            id="customRadioInline3"
                                            name="gender"
                                            type="radio"
                                            className="form-check-input"
                                            value="Male"
                                            checked={gender === "Male"}
                                            onChange={(e) => setGender(e.target.value)}
                                        />
                                        <label className="form-check-label" htmlFor="customRadioInline3">Male</label>
                                    </div>
                                    &nbsp;
                                    <div className="form-check form-check-inline">
                                        <input
                                            id="customRadioInline4"
                                            name="gender"
                                            type="radio"
                                            className="form-check-input"
                                            value="Female"
                                            checked={gender === "Female"}
                                            onChange={(e) => setGender(e.target.value)}
                                        />
                                        <label className="form-check-label" htmlFor="customRadioInline4">Female</label>
                                    </div>
                                </div>
                            </Col>

                        </Row>
                        <Row className="mt-3">
                            <Col md={6} lg={4}>
                                <label>Date of Birth</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={dob}
                                    onChange={(e) => {
                                        const selectedDate = e.target.value;
                                        setDob(selectedDate);
                                        setAge(calculateAge(selectedDate));
                                    }}
                                />
                                {dob && <span>Patient Age is {age}</span>}
                            </Col>
                            <Col md={6} lg={4}>
                                <label>Contact Number</label>
                                <input type="text"
                                    name="mobile"
                                    className="form-control"
                                    placeholder="Contact Number"
                                    value={formData?.mobile || ''}
                                    onChange={handleChange}
                                />
                            </Col>
                            <Col md={6} lg={4}>
                                <label>Email Address</label>
                                <input type="text"
                                    name="email"
                                    className="form-control"
                                    placeholder="Email address"
                                    value={formData?.email || ''}
                                    onChange={handleChange}
                                />
                            </Col>
                        </Row>
                        <Row className="mt-3">
                            <Col>
                                <label>Address</label>
                                <textarea rows={4} type="text"
                                    className="form-control"
                                    placeholder="address"
                                    name="address"
                                    value={formData?.address || ''}
                                    onChange={handleChange}
                                />
                            </Col>
                        </Row>
                        <Row className="mt-3">
                            <Col md={6} lg={3}>
                                <label>Country</label>
                                <input type="text"
                                    className="form-control"
                                    placeholder="Contact Details"
                                    name="country"
                                    value={formData?.country || ''}
                                    onChange={handleChange}

                                />
                            </Col>
                            <Col md={6} lg={3}>
                                <label>City</label>
                                <input type="text"
                                    className="form-control"
                                    placeholder="Contact Details"
                                    name="city"
                                    value={formData?.city || ''}
                                    onChange={handleChange}
                                />
                            </Col>
                            <Col md={6} lg={3}>
                                <label>State</label>
                                <input type="text"
                                    className="form-control"
                                    placeholder="Contact Details"
                                    name="state"
                                    value={formData?.state || ''}
                                    onChange={handleChange}
                                />
                            </Col>
                            <Col md={6} lg={3}>
                                <label>Zip/Pin Code</label>
                                <input type="text"
                                    className="form-control"
                                    placeholder="Contact Details"
                                    name="zip_code"
                                    value={formData?.zip_code || ''}
                                    onChange={handleChange}
                                />
                            </Col>
                        </Row>
                        <Row className="mt-3">
                            <Col md={6} lg={3}>
                                <label>Alternative Email address</label>
                                <input type="text"
                                    className="form-control"
                                    placeholder="Contact Details"
                                    name="alternative_email"
                                    value={formData?.alternative_email || ''}
                                    onChange={handleChange}
                                />
                            </Col>
                            <Col md={6} lg={3}>
                                <label>Alternative Mobile Number</label>
                                <input type="text"
                                    className="form-control"
                                    placeholder="Contact Details"
                                    name="alternative_mobile"
                                    value={formData?.alternative_mobile || ''}
                                    onChange={handleChange}
                                />
                            </Col>
                        </Row>
                    </CardBody>
                </Card>

                {
                    !is_update &&
                    <Card>
                        <CardBody>
                            {/* Communication Details */}
                            <Row className="mt-3">
                                <Col md={6} lg={4}>
                                    <label>Reference Type</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Reference type"
                                        name="reference_type"
                                        value={formData?.reference_type || ''}
                                        onChange={handleChange}
                                    />
                                </Col>
                                <Col md={6} lg={4}>
                                    <label>Reference</label>
                                    <input type="text"
                                        className="form-control"
                                        placeholder="Contact Details"
                                        name="reference"
                                        value={formData?.reference || ''}
                                        onChange={handleChange}
                                    />
                                </Col>

                                <Col md={6} lg={4}>
                                    <label>Patient Relationship</label>
                                    <input type="text"
                                        className="form-control"
                                        placeholder="Contact Details"
                                        name="patient_relationship"
                                        value={formData?.patient_relationship || ''}
                                        onChange={handleChange}
                                    />
                                </Col>
                            </Row>
                            {/* END Communication Details */}
                        </CardBody>
                    </Card>
                }

                <Row>
                    <Col>
                        <Card>
                            <CardBody className="text-right">
                                <button className="btn btn-danger">Cancel</button>
                                <button className="btn btn-primary" style={{ float: 'right' }} onClick={handleSubmit}>submit</button>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

export default AddPatient;