import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Card, CardBody } from 'reactstrap';
import { get, post } from 'helpers/api_helper';
import Datatables from 'pages/utils/table/datatable';
import { ManageDentalChartColumns } from './tableColumns';
import { DENTAL_CHART_EXAMINATION_URL } from 'helpers/url_helper';
import Select from "react-select";
import { dentalChartExaminationOptions } from '../../../constants/Constrant_dropdowns'

const ManageDentalChart = () => {
    const [isForm, setIsForm] = useState(false);
    const [formData, setFormData] = useState({});
    const [rows, setRows] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        Search: '',
    });
    
    const [examTitles, setExamTitles] = useState([{ title: '' }]);
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const fetchData = async () => {
        const { success, body } = await get(`${DENTAL_CHART_EXAMINATION_URL}?page=${pagination.page}&limit=${pagination.limit}&search=${pagination.Search}`);
        if (success) {
            setRows(body);
        }
    }
    useEffect(() => fetchData(), [pagination]);

    const handleToggle = () => {
        setIsForm(!isForm);
        setFormData({});
    };

    const handleAddRow = () => {
        const hasEmptyTitle = examTitles.some(item => item.title.trim() === '');
      
        if (hasEmptyTitle) {
          alert('Please fill all existing titles before adding a new one.');
          return;
        }
        setExamTitles([...examTitles, { title: '' }]);
    };

    const handleRemoveRow = (index) => {
        const updatedRows = [...examTitles];
        updatedRows.splice(index, 1);
        setExamTitles(updatedRows);
    };

    const handleSubmit = async () => {
        const a = {
            id: formData?.id || null,
            title: formData.toothtexamination?.value,
            _group: JSON.stringify(examTitles.map(item => {
                return {
                    tooth: 'selected',
                    label: item.title,
                    value: item.title?.replaceAll(' ', '_').toLowerCase(),
                }
            })),
        }
        
        const { success, body } = await post(DENTAL_CHART_EXAMINATION_URL, a);
        
        if (success) {
            setIsForm(false);
            setEditMode(false);
            setEditingId(null);
            setFormData({});
            fetchData();
        }
    };

    const handleEdit = (row) => {
        setFormData({
            id: row?.id,
            toothtexamination: dentalChartExaminationOptions.filter(v => v.value === row.title),
            group: row._group,
        });
        
        setExamTitles(JSON.parse(row._group)?.map(item => ({title: item.label})));
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
                                        <i role="button" className="me-2 fas fa-arrow-left"onClick={handleToggle} />
                                        {editMode ? 'Update' : 'Create'} Tooth Examination
                                    </h5>
                                    <button className="btn btn-danger" onClick={handleToggle}><i className="mdi mdi-close noti-icon" /> Cancel</button>
                                </div>
                                <hr />
                                <Col md={6}>
                                    <div className="mb-1">
                                        <label>Examination Type</label>
                                        <Select
                                            id="toothtexamination"
                                            className="basic-single"
                                            isClearable={true}
                                            isSearchable={true}
                                            options={dentalChartExaminationOptions}
                                            value={formData.toothtexamination || []}
                                            onChange={(selectedOption) => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    toothtexamination: selectedOption
                                                }))
                                            }}
                                            placeholder="Select Tooth Examination" />
                                    </div>
                                </Col>
                            </Row>
                            <div className="mb-1">
                                <label>Examination title</label>
                                {examTitles.map((item, index) => (
                                    <Row key={index} className="mb-2" >
                                        <Col md={1} className="d-flex flex-column">
                                            {(examTitles.length - 1) == index ? (
                                                <button className="btn btn-primary" type="button" onClick={handleAddRow} > <i className="mdi mdi-plus" /> </button>
                                            ) : (
                                                <button className="btn btn-danger" type="button" onClick={() => handleRemoveRow(index)} > <i className="mdi mdi-delete" /> </button>
                                            )}
                                        </Col>
                                        <Col md={11}>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter Title"
                                                name="title"
                                                value={item.title}
                                                onChange={(e) => {
                                                    setExamTitles((prev) => {
                                                        const updatedRows = [...prev];
                                                        updatedRows[index].title = e.target.value;
                                                        return updatedRows;
                                                    });
                                                }}
                                            />
                                        </Col>
                                    </Row>
                                ))}
                            </div>
                            <Row>
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
            columns={ManageDentalChartColumns(handleEdit)}
            showTableOnly={true}
            rows={rows.items || []}
            rowsLength={rows?.totalItems || 0}
            rowsPerPage={pagination.limit}
            keyField={'id'}
            handleAddButton={handleToggle}
            title="All Dental Charts"
            isAdd={true}
            isTableHead={true}
            ssr={setPagination}
        />
    );
};

export default ManageDentalChart;
