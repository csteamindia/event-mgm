import React from 'react';
import { Link } from 'react-router-dom';

export let ManageUsersColumns = [
  { dataField: 'id', text: '#' },
  { dataField: 'title', text: 'Department' },
  {
    //     dataField: 'code',
    //     text: 'Code'
    // }, {
    //     dataField: 'actions',
    //     text: "",
    //     isDummyField: true,
    //     formatter: (cell, row) => <>
    //         <Link to="#" className="btn btn-outline-secondary btn-sm edit" onClick={() => handleEdit(row.id)} title="Edit" ><i className={`fas fa-pencil-alt`} /></Link>
    //         {" "}
    //         <Link to="#" className={`btn btn-${row.status == 0 ? "danger" : "success"} btn-sm edit`} onClick={() => handleRemove(row.id, row.status == 1 ? 0 : 1, row.code)} title={row.status == 0 ? 'delete' : 'restore'} ><i className={`fas fas fa-trash-alt`} /></Link>
    //     </>
  }
];

export let ManageClinicColumns = [
  { dataField: 'id', text: '#' },
  { dataField: 'clinic_name', text: 'Clinic Name' },
  { dataField: 'doctor_name', text: 'Doctor Name' },
  { dataField: 'email', text: 'Email' },
  { dataField: 'phone', text: 'Phone' },
  {
    dataField: 'actions',
    text: "",
    isDummyField: true,
    // eslint-disable-next-line react/display-name
    formatter: (cell, row) => (
      <>
        <button className="btn btn-outline-primary btn-sm" title="Edit">
          <i className="fas fa-pencil-alt" />
        </button>
        {" "}
        <button className="btn btn-danger btn-sm" title="Delete">
          <i className="fas fa-trash-alt" />
        </button>
      </>
    )
  }
];

export let ManageDoctorColumns = [
  { dataField: 'id', text: '#' },
  { dataField: 'name', text: 'Docotr Name' },
  { dataField: 'email', text: 'Email' },
  { dataField: 'mobile', text: 'Mobile' },
  { dataField: 'clinic', text: 'Clinic', formatter: (cell, row) => row.clinic?.clinic_name },
  { dataField: 'color_code', text: 'Color' },
  {
    dataField: 'actions',
    text: '',
    isDummyField: true,
    // eslint-disable-next-line react/display-name
    formatter: (cell, row) => (
      <>
        <Link to="#" className="btn btn-primary btn-sm edit" onClick={() => handleEdit(row.id)} title="Edit">
          <i className={`fas fa-pencil-alt`} />
        </Link>
        {' '}
        <Link to="#" className={`btn btn-danger btn-sm edit`} onClick={() => handleRemove(row.id, row.status == 1 ? 0 : 1, row.code)} title={row.status == 0 ? 'delete' : 'restore'}>
          <i className={`fas fas fa-trash-alt`} />
        </Link>
      </>
    )
  }
];

