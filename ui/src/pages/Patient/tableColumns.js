import React from 'react';
import moment from 'moment';

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

export let ManagePrescriptionColumns = (handleEdit, handleDelete) => [
  { dataField: 'id', text: '#' },
  {
    dataField: 'deposit_date',
    text: 'Date',
    formatter: (cell) => moment(cell).format('YYYY-MM-DD'),
  },
  {
    dataField: 'doctor',
    text: 'Doctor',
    formatter: (cell, row) => row.doctor?.name,
  },
  { dataField: 'title', text: 'Prescription' },
  {
    dataField: 'actions',
    text: '',
    isDummyField: true,
    // eslint-disable-next-line react/display-name
    formatter: (cell, row) => (
      <>
        <a
          href="#"
          className="btn btn-primary btn-sm edit"
          onClick={() => handleEdit(row)}
          title="Edit"
        >
          <i className="fas fa-pencil-alt" />
        </a>{' '}
        <a
          href="#"
          className="btn btn-danger btn-sm edit"
          onClick={() => handleDelete(row.id, row.status == 1 ? 0 : 1, row.code)}
          title={row.status == 0 ? 'Restore' : 'Delete'}
        >
          <i className="fas fa-trash-alt" />
        </a>
      </>
    ),
  },
];

export let ManageExaminationsColumns = (handleEdit, handleDelete) => [
  { dataField: 'id', text: '#' },
  {
    dataField: 'examination_date',
    text: 'Date',
    formatter: (cell) => moment(cell).format('YYYY-MM-DD'),
  },
  { dataField: 'doctor', text: 'Doctor', formatter: (cell, row) => row.doctors?.name },
  {
    dataField: 'action1',
    text: 'Chief Complaint',
    isDummyField: true,
    // eslint-disable-next-line react/display-name
    formatter: (cell, row) => {
      const t = JSON.parse(row?.tooth)
      return <ul style={{ margin: 0, paddingLeft: '20px' }}>
        {t['complaint']?.map((v, i) => (
          <li key={i}>{v.label}</li>
        ))}
      </ul>
    }
  },
  {
    dataField: 'action2',
    text: 'Diagnosis',
    isDummyField: true,
    // eslint-disable-next-line react/display-name
    formatter: (cell, row) => {
      const t = JSON.parse(row.tooth)
      return <ul style={{ margin: 0, paddingLeft: '20px' }}>
        {t['diagnosis']?.map((v, i) => (
          <li key={i}>{v.label}</li>
        ))}
      </ul>
    }
  },
  { dataField: 'remark', text: 'Note' },
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

export let ManageInvestigationColumns = (handleEdit, handleDelete) => [
  { dataField: 'id', text: '#' },
  {
    dataField: 'examination_date',
    text: 'Date',
    formatter: (cell) => moment(cell).format('YYYY-MM-DD'),
  },
  {
    dataField: 'doctor_id',
    text: 'Doctor',
    formatter: (cell, row) => row.doctor?.name,
  },
  { dataField: 'temperature', text: 'Temperature' },
  { dataField: 'blood_pressure', text: 'Blood Pressure' },
  { dataField: 'blood_sugar', text: 'Blood Sugar' },
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

export let ManageAppointmentColumns = (handleEdit, handleDelete) => [
  { dataField: 'id', text: '#' },
  {
    dataField: 'appointment_date',
    text: 'Appointment Date',
    formatter: (cell) => moment(cell).format('YYYY-MM-DD'),
  },
  { dataField: 'doctor_code', text: 'Doctor', formatter: (cell, row) => row.doctor?.name },
  { dataField: 'is_visited',
    text: 'Is Visited',
    // eslint-disable-next-line react/display-name
    formatter: (cell, row) => {
      if (row.is_visited == 1) {
        return <span className="text-success">Visited</span>
      }
      if (row.is_visited == 2) {
        return <span className="text-danger">Cancelled</span>
      }
      return <span className="text-warning">Pending</span>
    }
  },
  { dataField: 'appointment_valid', text: 'Arrival Time', },
  { dataField: 'notes', text: 'notes', },
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

export let ManagePatientNotesColumns = (handleDelete) => [
  { dataField: 'id', text: '#' },
  {
    dataField: 'note_date',
    text: 'Notes Date',
    formatter: (cell) => cell ? moment(cell).format('YYYY-MM-DD') : 'N/A',
  },
  { dataField: 'doctor_code', text: 'Doctor', formatter: (cell, row) => row.doctor?.name },
  { dataField: 'note', text: 'View Notes', },
  {
    dataField: 'actions',
    text: '',
    isDummyField: true,
    // eslint-disable-next-line react/display-name
    formatter: (cell, row) => (
      <>
        <a href="#" className="btn btn-danger btn-sm edit" onClick={() => handleDelete(row.id, row.status == 1 ? 0 : 1, row.code)} title={row.status == 0 ? 'Restore' : 'Delete'}> <i className="fas fa-trash-alt" /> Delete </a>
      </>
    )
  }
];

export let ManagePatientFollowUpColumns = (handleDelete) => [
  { dataField: 'id', text: '#' },
  { dataField: 'patient.mobile', text: 'Mobile Number'},
  {
    dataField: 'followup_date',
    text: 'Follow Up Date',
    formatter: (cell) => cell ? moment(cell).format('DD-MM-YYYY') : 'N/A',
  },
  { dataField: 'remark', text: 'Follow Up Reason' },
  { dataField: 'client.name', text: 'Followed By' },
  // { dataField: 'added_by', text: 'Added By', },
  {
    dataField: 'actions',
    text: '',
    isDummyField: true,
    // eslint-disable-next-line react/display-name
    formatter: (cell, row) => (
      <>
        <a href="#" className="btn btn-danger btn-sm edit" onClick={() => handleDelete(row.id, row.status == 1 ? 0 : 1, row.code)} title={row.status == 0 ? 'Restore' : 'Delete'}> <i className="fas fa-trash-alt" /> Delete </a>
      </>
    )
  }
];
