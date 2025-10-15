import React, { useState, useEffect } from "react";
import { Row, Col, Card, CardBody, Button, Modal } from "reactstrap";
import Datatables from "pages/utils/table/datatable";
import { post, get } from "helpers/api_helper";
import { EXAMINATIONS_URL, EXAMINATIONS_OPTIONS_URL, DOCTOR_URL, PATIENT_URL } from "helpers/url_helper";
import { showSuccessAlert } from "pages/utils/alertMessages";
import Select from "react-select";
import Flatpickr from "react-flatpickr";
import { ManageExaminationsColumns } from "pages/Patient/tableColumns";
import "flatpickr/dist/themes/material_blue.css";

const Examinations = ({ patientData }) => {
  const [rows, setRows] = useState([])
  const [options, setOptions] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [isForm, setIsForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date(),
    doctor_id: null,
    patient_id: null,
    diagnosis: [],
    complaints: [],
    remark: ''
  });
  const [addOptionModal, setAddOptionModal] = useState(false);
  const [newOptionvalue, setNewOptionvalue] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    Search: '',

  });

  const fetchExData = async () => {
    const { success, body } = await get(`${EXAMINATIONS_URL}?patient_id=${patientData?.id}&page=${pagination.page}&limit=${pagination.limit}&search=${pagination.Search}`);
    if (success) {
      setRows(body);
    }
  }

  useEffect(() => {
    fetchExData();
  }, [pagination]);


  const getOptions = async () => {
    const [doctorRes, examOptionsRes] = await Promise.all([
      get(`${PATIENT_URL}/options?_type=doctors`),
      get(EXAMINATIONS_OPTIONS_URL)
    ]);

    if (doctorRes.success) {
      setDoctors(doctorRes?.body);
      console.log(patientData?.clinic?.doctor_name)
      // const a = doctorRes?.body?.filter(v => v.code == patientData?.clinic?.doctor_name)
      // setFormData(p => ({ ...p, doctor_id: a }))
    }
    if (examOptionsRes.success) {
      setOptions(examOptionsRes.body);
    }
  }

  useEffect(() => {
    getOptions();
    fetchExData();
  }, [])
  const handleToggle = () => setIsForm(!isForm)

  const handleAddOption = async () => {
    const obj = {
      type: addOptionModal,
      title: newOptionvalue,
    };

    const { success, body } = await post(EXAMINATIONS_OPTIONS_URL, obj);

    if (success) {
      const key = addOptionModal == 1 ? 'complaints' : 'diagnosis';
      setOptions((prev) => ({
        ...prev,
        [key]: [
          ...(prev[key] || []),
          { value: body?.id, label: body?.title },
        ],
      }));

      setFormData(p => ({
        ...p, [key]: [
          ...p[key],
          { value: body?.id, label: body?.title },
        ],
      }))
    }
  };

  const handleSubmit = async () => {
    const obj = {
      examination_date: formData?.date,
      doctor: formData?.doctor_id?.value,
      tooth: JSON.stringify({
        complaint: formData?.complaints,
        diagnosis: formData?.diagnosis
      }),
      patient_id: patientData?.id,
      remark: formData?.remark
    }

    const { success, body } = await post(EXAMINATIONS_URL, obj);
    if (success) {
      showSuccessAlert('Examination created successfully!');
      setIsForm(false);
      fetchExData();
    }


    if (success) {
      setAddOptionModal(false)
    }
  }

  if (isForm) {
    return (
      <>
        <Row>
          <Col md={12}>
            <Card>
              <CardBody>
                <div className="d-flex justify-content-between mb-2">
                  <h5> <i role="button" className="me-2 fas fa-arrow-left" onClick={handleToggle} />{" "} {false ? "Edit" : "Add"} Examination </h5>
                  <button className="btn btn-danger" onClick={handleToggle}> <i className="mdi mdi-close noti-icon" /> Cancel </button>
                </div>

                <hr />

                <Row>
                  <Col md={4}>
                    <label>Doctor</label>
                    <Select
                      isClearable={true}
                      isSearchable={true}
                      value={formData?.doctor_id}
                      options={doctors}
                      onChange={(selected) => setFormData((prev) => ({ ...prev, doctor_id: selected || "" }))}
                      placeholder="Select Doctor"
                    />
                  </Col>

                  <Col md={4}>
                    <label>Select Date</label>
                    <Flatpickr
                      className="form-control"
                      options={{ altInput: true }}
                      value={formData?.date}
                      onChange={(date) => setFormData((prev) => ({ ...prev, date: date || "" }))}
                    />
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col md={8}>
                    <label>Chief Complaints</label>
                    <Select
                      isMulti={true}
                      isClearable={true}
                      isSearchable={true}
                      options={options?.complaints}
                      onChange={(e) => {
                        setFormData(p => ({ ...p, complaints: e }))
                      }}
                      value={formData?.complaints}
                      placeholder="Select Complaints"
                    />
                  </Col>
                  <Col md={2}>
                    <Button color="primary" className="w-50" style={{ marginTop: "31px" }} onClick={() => setAddOptionModal(1)} ><i className="mdi mdi-plus" /> </Button>
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col md={8}>
                    <label>Diagnosis Type</label>
                    <Select
                      isMulti={true}
                      isClearable={true}
                      isSearchable={true}
                      options={options?.diagnosis}
                      onChange={(e) => {
                        setFormData(p => ({ ...p, diagnosis: e }))
                      }}
                      value={formData?.diagnosis}
                      placeholder="Select Diagnosis"
                    />
                  </Col>
                  <Col md={2}>
                    <Button color="primary" className="w-50" style={{ marginTop: "31px" }} onClick={() => setAddOptionModal(2)} ><i className="mdi mdi-plus" /> </Button>
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col>
                    <label>Note</label>
                    <input type="text" className="form-control" name="remark" defaultValue={formData?.remarks || ''} onChange={(e) => { setFormData(p => ({ ...p, remark: e.target.value })) }} placeholder="Enter Notes" />
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col className="text-end">
                    <Button color="success" onClick={handleSubmit}>Submit </Button>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Addd Option Modal */}
        <Modal size="lg" isOpen={addOptionModal != 0} toggle={() => setAddOptionModal(false)}>
          <div className="modal-header">
            <h5 className="modal-title">Add {addOptionModal == 1 ? 'complaints' : 'diagnosis'}</h5>
            <button type="button" className="btn-close" onClick={() => setAddOptionModal(false)}></button>
          </div>
          <div className="modal-body">
            <Row className="align-items-center">
              <Col md={10}>
                <input type="text" className="form-control" placeholder="Add Option" value={newOptionvalue} onChange={(e) => setNewOptionvalue(e.target.value)} />
              </Col>
              <Col md={2}>
                <Button color="primary" className="w-100 me-2" onClick={handleAddOption}>Add </Button>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col md={12}>
                <label>{addOptionModal == 1 ? 'Complaints' : 'Diagnosis'}</label>
                <Select
                  isMulti={true}
                  isClearable={true}
                  isSearchable={true}
                  options={options[`${addOptionModal == 1 ? 'complaints' : 'diagnosis'}`]}
                  onChange={(e) => {
                    setFormData(p => ({ ...p, [`${addOptionModal == 1 ? 'complaints' : 'diagnosis'}`]: e }))
                  }}
                  value={formData[`${addOptionModal == 1 ? 'complaints' : 'diagnosis'}`]}
                  placeholder="Select Complaints"
                />
              </Col>
            </Row>
          </div>
          <div className="modal-footer mt-3">
            <Button className="btn btn-danger" onClick={() => setAddOptionModal(false)}>Close</Button>
          </div>
        </Modal>
      </>
    )
  }

  return (
    <Datatables
      isSearch={true}
      columns={ManageExaminationsColumns()}
      showTableOnly={true}
      rowsLength={rows?.totalItems || 0}
      rows={rows.items || []}
      keyField={"id"}
      handleAddButton={handleToggle}
      title="All Examinations"
      isAdd={true}
      isTableHead={true}
      ssr={() => { }}
    />
  )
}

export default Examinations;
