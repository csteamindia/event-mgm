import React from 'react';

export let ManageTreatmentsColumns = (handleEdit, handleDelete) => [
  { dataField: 'id', text: '#' },
  { dataField: 'title', text: 'Title' },
  { dataField: 'cost', text: 'Cost' },
  {
    dataField: 'actions',
    text: '',
    isDummyField: true,
    // eslint-disable-next-line react/display-name
    formatter: (cell, row) => (
      <>
        <button
          className="btn btn-primary btn-sm me-1"
          onClick={() => handleEdit(row)}
          title="Edit"
        >
          <i className="fas fa-pencil-alt" />
        </button>
        <button
          className={`btn btn-sm ${row.status === 0 ? 'btn-success' : 'btn-danger'}`}
          onClick={() => handleDelete(row.id, row.status === 1 ? 0 : 1)}
          title={row.status === 0 ? 'Restore' : 'Delete'}
        >
          <i className={row.status === 0 ? 'fas fa-undo' : 'fas fa-trash-alt'} />
        </button>
      </>
    )
  }
];

export let ManageMedicineColumns = (handleEdit, handleDelete) => [
  { dataField: 'id', text: '#' },
  { dataField: 'name', text: 'Name' },
  { dataField: 'dose', text: 'Dose' },
  // { dataField: 'frequent', text: 'Frequent' },
  { dataField: 'duration', text: 'Duration' },
  {
    dataField: 'actions',
    text: '',
    isDummyField: true,
    // eslint-disable-next-line react/display-name
    formatter: (cell, row) => (
      <>
        <a href="#" className="btn btn-primary btn-sm edit" onClick={() => handleEdit(row)} title="Edit">
          <i className="fas fa-pencil-alt" />
        </a>
        {' '}
        <a href="#" className="btn btn-danger btn-sm edit" onClick={() => handleDelete(row.id, row.status == 1 ? 0 : 1, row.code)} title={row.status == 0 ? 'Restore' : 'Delete'}>
          <i className="fas fa-trash-alt" />
        </a>
      </>
    )
  }
];

export let ManageBankColumns = (handleEdit, handleDelete) => [
  { dataField: 'id', text: '#' },
  { dataField: 'bank_name', text: 'Bank Name' },
  { dataField: 'ac_no', text: 'Account Number' },
  { dataField: 'ifsc_code', text: 'IFSC Code' },
  { dataField: 'branch', text: 'Branch' },
  { dataField: 'addrress', text: 'Address' },
  { dataField: 'ac_type', text: 'Account Type' },
  {
    dataField: 'actions',
    text: '',
    isDummyField: true,
    // eslint-disable-next-line react/display-name
    formatter: (cell, row) => (
      <>
        <a href="#" className="btn btn-primary btn-sm edit" onClick={() => handleEdit(row)} title="Edit">
          <i className="fas fa-pencil-alt" />
        </a>
        {' '}
        <a href="#" className="btn btn-danger btn-sm edit" onClick={() => handleDelete(row.id, row.is_deleted === 1 ? 0 : 1)} title={row.is_deleted === 1 ? 'Restore' : 'Delete'}>
          <i className="fas fa-trash-alt" />
        </a>
      </>
    )
  }
];

export let ManageAllergiesColumns = (handleEdit, handleDelete) => [
  { dataField: 'id', text: '#' },
  { dataField: 'title', text: 'Title' },
  {
    dataField: 'actions',
    text: '',
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

export let ManageChairsColumns = (handleEdit, handleDelete) => [
  { dataField: 'id', text: '#' },
  { dataField: 'title', text: 'Title' },
  { dataField: 'cabin_no', text: 'Cabin No' },
  { dataField: 'start_time', text: 'Start Time' },
  { dataField: 'end_time', text: 'End Time' },
  { dataField: 'intervel', text: 'Intervel' },
  {
    dataField: 'actions',
    text: '',
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

export let ManageReferencesColumns = (handleEdit, handleDelete) => [
  { dataField: 'id', text: '#' },
  { dataField: 'title', text: 'Title' },
  {
    dataField: 'actions',
    text: '',
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

export let ManageRXTemplatetColumns = (handleEdit, handleDelete) => [
  { dataField: 'id', text: '#' },
  { dataField: 'title', text: 'Template Name' },
  { dataField: 'doctor_code', text: 'Doctor' },
  // { dataField: 'medicine_name', text: 'Medicine' },
  { dataField: 'note', text: 'Note' },
  {
    dataField: 'actions',
    text: '',
    isDummyField: true,
    // eslint-disable-next-line react/display-name
    formatter: (cell, row) => (
      <>
        <a href="#" className="btn btn-primary btn-sm edit" onClick={() => handleEdit(row)} title="Edit">
          <i className="fas fa-pencil-alt" />
        </a>
        {' '}
        <a href="#" className={`btn btn-${row.status == 0 ? 'danger' : 'success'} btn-sm edit`} onClick={() => handleDelete(row.id, row.status == 1 ? 0 : 1, row.code)} title={row.status == 0 ? 'Delete' : 'Restore'}>
          <i className={`fas ${row.status == 0 ? 'fa-trash-alt' : 'fa-check'}`} />
        </a>
      </>
    )
  }
];
export let ManageDentalChartColumns = (handleEdit, handleDelete) => [
  { dataField: 'id', text: '#' },
  { dataField: 'title', text: 'Examination Type', formatter: (cell, row) => row.title.replaceAll('_', ' ').toUpperCase() },
  {
    dataField: 'actions',
    text: '',
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
