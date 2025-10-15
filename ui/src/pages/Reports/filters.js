import React, { useEffect, useState } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { get, post } from 'helpers/api_helper';
import Select from "react-select";
import "flatpickr/dist/themes/material_red.css"
import Flatpickr from "react-flatpickr"
import Timezone from "../utils/timezone";

const status = [
   {
      "label":"All",
      "value":""
   },
   {
      "label":"Waiting",
      "value":"Waiting"
   },
   {
      "label":"Scheduled",
      "value":"Scheduled"
   },
   {
      "label":"Completed",
      "value":"Completed"
   },
   {
      "label":"Cancelled",
      "value":"Cancelled"
   },
   {
      "label":"Engaged",
      "value":"Engaged"
   },
   {
      "label":"DirectCheckIn",
      "value":"DirectCheckIn"
   },
   {
      "label":"Missed",
      "value":"Missed"
   },
   {
      "label":"Rescheduled",
      "value":"Rescheduled"
   }
];

const Filters = () => {
    const [filterData, setFilterData] = useState({
        status: [],
        doctor_code: []
    })
    const [options, setOptions] = useState({
        doctors:[],
        status:status
    })
    const [dateRange, setDateRange] = useState([new Date(), new Date()]);

    return (
        <Row style={{marginBottom: '-16px'}}>
            <Col>
                <Card>
                    <CardBody>
                        <Row>
                            <Col md={3}>
                                <label>By Doctor</label>
                                <Select
                                    id="doctor"
                                    className="basic-single"
                                    isClearable={true}
                                    isSearchable={true}
                                    options={options?.doctors}
                                    value={filterData?.doctor_code || []}
                                    onChange={(selectedOption) => {
                                        setFilterData((prev) => ({
                                            ...prev, doctor_code: selectedOption
                                        }))
                                    }}
                                    placeholder="Select Doctor" />
                            </Col>
                            <Col md={3}>
                                <label>By Status</label>
                                <Select
                                    id="doctor"
                                    className="basic-single"
                                    isClearable={true}
                                    isSearchable={true}
                                    options={status}
                                    value={filterData?.status || []}
                                    onChange={(selectedOption) => {
                                        setFilterData((prev) => ({
                                            ...prev, status: selectedOption
                                        }))
                                    }}
                                    placeholder="Select Doctor" />
                            </Col>
                            <Col md={3}>
                                <label>By Date</label>
                                <Flatpickr
                                    value={dateRange}
                                    className="form-control d-block bg-white"
                                    placeholder="DD-MM-YYYY"
                                    options={{
                                        mode: "range",
                                        dateFormat: "d-m-Y"
                                    }}
                                    onChange={
                                        (e) => {
                                            const dates = e.map(dateString => Timezone(dateString));
                                            setDateRange(dates)
                                        }
                                    }
                                />
                            </Col>
                            <Col md={2} className='mt-1'>
                                <button className='btn btn-primary mt-4'> Filter Data </button>  
                            </Col>
                        </Row>

                    </CardBody>
                </Card>
            </Col>
        </Row>
    )
}

export default Filters;