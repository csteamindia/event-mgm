import db from "../models/index.js";
import "dotenv/config";
const { Patient_Follow_Up, Appointment, CommunicationGroup, Files, User, Clinics, Patients, ReferenceTypes, Doctors, Billing, Tretment, Vouchers, Voucher_Transactions, sequelize, Sequelize } = db;
import moment from "moment";

const appointmentReportService = async (data) => {
    const {clinic_id, dates, status, doctor, limit, page, search} = data.query;
    const parsedPage = parseInt(page) || 1;
    const parsedLimit = limit === "all" ? null : parseInt(limit) || 10;
    const offset = parsedLimit ? (parsedPage - 1) * parsedLimit : null
    
    const where = { status: 0 };
    
    if (clinic_id) where.clinic_id = clinic_id;
    if (status) where.status = status;
    if (doctor) where.doctor_code = doctor;

    const conditions = {
        where,
        attributes: ["appointment_date", "chair_code", "tretment_code", "notes", "is_visited", "status", "id", "arravel_time", "attened_time", "canceled_at", "canceled_note", "token"],
        include: [
            {
                model: Clinics,
                as: "clinic",
                required: true,
                attributes: ["clinic_name", "doctor_code", "id"],
            }, {
                model: Patients,
                as: "patient",
                attributes: [[Sequelize.fn('CONCAT', Sequelize.col('title'), ' ', Sequelize.col('first_name'), ' ', Sequelize.col('last_name')), 'full_name']],
            }, {
                model: Doctors,
                as: "doctor",
                attributes: ["name"],
            }
        ],
        order: [["appointment_date", "DESC"]],
        limit: parsedLimit,
        offset
    };
    try{
        const res = await Appointment.findAndCountAll(conditions);

        
        return {
            limit: parsedLimit,
            page: parsedPage,
            ...res,
        };
    } catch (error) {
        console.error("Error fetching appointment reports:", error);
        return { errors: [{ message: "Failed to fetch appointment reports" }] };
    }
}

// appointmentWaitningReportsService
const appointmentWaitningReportsService = async (data) => {
    const {clinic_id, dates, doctor, limit, page, search} = data.query;
    const parsedPage = parseInt(page) || 1;
    const parsedLimit = limit === "all" ? null : parseInt(limit) || 10;
    const offset = parsedLimit ? (parsedPage - 1) * parsedLimit : null
    
    const where = { status: 0, is_visited: 1 };
    
    if (clinic_id) where.clinic_id = clinic_id;
    if (doctor) where.doctor_code = doctor;

    const conditions = {
        where,
        attributes: ["appointment_date", "chair_code", "tretment_code", "notes", "id", "arravel_time", "attened_time", "canceled_at", "canceled_note", "token"],
        include: [
            {
                model: Clinics,
                as: "clinic",
                required: true,
                attributes: ["clinic_name", "doctor_code", "id"],
            }, {
                model: Patients,
                as: "patient",
                attributes: [[Sequelize.fn('CONCAT', Sequelize.col('title'), ' ', Sequelize.col('first_name'), ' ', Sequelize.col('last_name')), 'full_name']],
            }, {
                model: Doctors,
                as: "doctor",
                attributes: ["name"],
            }
        ],
        order: [["appointment_date", "DESC"]],
        limit: parsedLimit,
        offset
    };
    try{
        let res = await Appointment.findAndCountAll(conditions);

        if (res.count !== 0) {
            res.rows =  JSON.parse(JSON.stringify(res.rows)).map((row) => {
                const arrTime = row.arravel_time;
                const attTime = row.attened_time;

                // Convert to moment objects
                const start = moment(arrTime);
                const end = attTime ? moment(attTime) : moment(); // Use current time if null

                const duration = moment.duration(end.diff(start));

                // Get hours and minutes
                const hours = Math.floor(duration.asHours());
                const minutes = duration.minutes();

                row.wating_time = `${hours}h ${minutes}m`;
                return row;
            });
            
            
            console.log("No waiting appointments found.", res.rows);
        }
        
        
        return {
            limit: parsedLimit,
            page: parsedPage,
            ...res,
        };
    } catch (error) {
        console.error("Error fetching appointment reports:", error);
        return { errors: [{ message: "Failed to fetch appointment reports" }] };
    }
}

// patientgReportsService
const patientgReportsService = async (data) => {
    const {clinic_id, dates, doctor, limit, page, search} = data.query;
    const parsedPage = parseInt(page) || 1;
    const parsedLimit = limit === "all" ? null : parseInt(limit) || 10;
    const offset = parsedLimit ? (parsedPage - 1) * parsedLimit : null
    
    const where = { status: 0 };
    
    if (clinic_id) where.clinic_id = clinic_id;
    if (doctor) where.doctor = doctor;

    const conditions = {
        where,
        attributes: [
            [Sequelize.fn('CONCAT', Sequelize.col('title'), ' ', Sequelize.col('first_name'), ' ', Sequelize.col('last_name')), 'full_name'],
            'case_no', 'dob', 'mobile', "email", 'city', "zip_code", "date", "communication_group", "reference_type"],
        include: [
            {
                model: Clinics,
                as: "clinic",
                required: true,
                attributes: ["clinic_name", "doctor_code", "id"],
            }, {
                model: Doctors,
                as: "doctors",
                attributes: ["name"],
            }
        ],
        order: [["id", "DESC"]],
        limit: parsedLimit,
        offset
    };
    try{
        const res = await Patients.findAndCountAll(conditions);

        if (res.count !== 0) {
            // Convert rows and map asynchronously
            const parsedRows = JSON.parse(JSON.stringify(res.rows));

            res.rows = await Promise.all(
                parsedRows.map(async (row) => {
                    // Parse JSON field
                    const CG = row.communication_group ? JSON.parse(row.communication_group) : [];

                    // Fetch matching communication groups, if needed
                    const CGRes = await CommunicationGroup.findAll({
                        attributes: ["title"],
                        where: {
                            id: {
                                [Sequelize.Op.in]: CG.map(c => c),
                            }
                        }
                    });

                    row.communication_group = CGRes.map(cg => cg.title).join(", ");
                    return row;
                })
            );
            console.log("Waiting appointments found.", res.rows);
        }
        
        return {
            limit: parsedLimit,
            page: parsedPage,
            ...res,
        };
    } catch (error) {
        console.error("Error fetching appointment reports:", error);
        return { errors: [{ message: "Failed to fetch appointment reports" }] };
    }
}

// doctorsWorkReportsService
const doctorsWorkReportsService = async (data) => {
    const {clinic_id, dates, doctor, limit, page, search} = data.query;
    const parsedPage = parseInt(page) || 1;
    const parsedLimit = limit === "all" ? null : parseInt(limit) || 10;
    const offset = parsedLimit ? (parsedPage - 1) * parsedLimit : null
    
    const where = { status: 0 };
    
    if (clinic_id) where.clinic_id = clinic_id;
    if (doctor) where.doctor = doctor;

    const conditions = {
        where,
        attributes: [
            'treatment_date', 'treatment_note', 'tooths', 'treatment_cost', "treatment_discount", 'treatment_total_cost', "treatment_status", "is_billed", "billed_date", "treatment_note"],
        include: [
            {
                model: Patients,
                as: "patients",
                required: true,
                attributes: [
                    [Sequelize.fn('CONCAT', Sequelize.col('title'), ' ', Sequelize.col('first_name'), ' ', Sequelize.col('last_name')), 'full_name'],
                    'mobile', "email",
                ],
            }, {
                model: Doctors,
                as: "doctor",
                attributes: ["name"],
            }
        ],
        order: [["id", "DESC"]],
        limit: parsedLimit,
        offset
    };
    try{
        const res = await Tretment.findAndCountAll(conditions);

        if (res.count !== 0) {
            // Convert rows and map asynchronously
            const parsedRows = JSON.parse(JSON.stringify(res.rows));

            res.rows = await Promise.all(
                parsedRows.map(async (row) => {
                    row.doctor = row.doctor ? row.doctor.name : "N/A";
                    row.patients = row.patients[0];               
                    return row;
                })
            );
            console.log("Waiting appointments found.", res.rows);
        }
        
        return {
            limit: parsedLimit,
            page: parsedPage,
            ...res,
        };
    } catch (error) {
        console.error("Error fetching appointment reports:", error);
        return { errors: [{ message: "Failed to fetch appointment reports" }] };
    }
}

// doctorsWorkReportsService
const patientFilesReportsService = async (data) => {
    const {clinic_id, dates, limit, page, search} = data.query;
    const parsedPage = parseInt(page) || 1;
    const parsedLimit = limit === "all" ? null : parseInt(limit) || 10;
    const offset = parsedLimit ? (parsedPage - 1) * parsedLimit : null
    
    const where = { status: 0 };
    
    if (clinic_id) where.clinic_id = clinic_id;
    
    const conditions = {
        where,
        attributes: ['file_type', 'file_path', 'description', 'created_at'],
        include: [
            {
                model: Patients,
                as: "patients",
                required: true,
                attributes: [
                    [Sequelize.fn('CONCAT', Sequelize.col('title'), ' ', Sequelize.col('first_name'), ' ', Sequelize.col('last_name')), 'full_name'],
                    'mobile', "email",
                ],
            }
        ],
        order: [["id", "DESC"]],
        limit: parsedLimit,
        offset
    };

    const fileTypeObject = {
        "1": "Testimonials",
        "2": "Scanned Image",
        "3": "Patient Reports",
        "4": "Other"
    };


    try{
        const res = await Files.findAndCountAll(conditions);

        if (res.count !== 0) {
            // Convert rows and map asynchronously
            const parsedRows = JSON.parse(JSON.stringify(res.rows));

            res.rows = await Promise.all(
                parsedRows.map(async (row) => {
                    row.file_path = JSON.parse(row.file_path); 
                    row.file_type = fileTypeObject[row.file_type] || "Other";
                    row.patients = row.patients
                    row.created_datetime = row.created_at
                    delete row.created_at; // Remove created_at if not needed

                    return row;
                })
            );
            console.log("Waiting appointments found.", res.rows);
        }
        
        return {
            limit: parsedLimit,
            page: parsedPage,
            ...res,
        };
    } catch (error) {
        console.error("Error fetching appointment reports:", error);
        return { errors: [{ message: "Failed to fetch appointment reports" }] };
    }
}

// referenceReportsService
const referenceReportsService = async (data) => {
    const {clinic_id, dates, limit, page, search} = data.query;
    const parsedPage = parseInt(page) || 1;
    const parsedLimit = limit === "all" ? null : parseInt(limit) || 10;
    const offset = parsedLimit ? (parsedPage - 1) * parsedLimit : null
    
    const where = { status: 0 };
    
    if (clinic_id) where.clinic_id = clinic_id;
    
    const conditions = {
        where,
        attributes: [ [Sequelize.fn('CONCAT', Sequelize.col('Patients.title'), ' ', Sequelize.col('Patients.first_name'), ' ', Sequelize.col('Patients.last_name')), 'full_name'], 'mobile', "email", 'reference_type', 'referance'],
        include: [
            {
                model: Doctors,
                as: "ref_doctors",
                attributes: ['name']
            },
            {
                model: Patients,
                as: "ref_patient",
                attributes: [[Sequelize.fn('CONCAT', Sequelize.col('Patients.title'), ' ', Sequelize.col('Patients.first_name'), ' ', Sequelize.col('Patients.last_name')), 'name']]
            },
            {
                model: User,
                as: "ref_client",
                attributes: ['name']
            }
        ],
        order: [["id", "DESC"]],
        limit: parsedLimit,
        offset
    };

    const RefType = {
        "1": "Doctor",
        "2": "Patient",
        "3": "Other"
    }

    try{
        const res = await Patients.findAndCountAll(conditions);

        if (res.count !== 0) {
            // Convert rows and map asynchronously
            const parsedRows = JSON.parse(JSON.stringify(res.rows));

            res.rows = await Promise.all(
                parsedRows.map(async (row) => {
                    row.reference_type =  row.reference_type ? RefType[row.reference_type] : "Self";
                    // Remove null reference fields
                    ['ref_doctors', 'ref_patient', 'ref_client'].forEach((field) => {
                        if (row[field] !== null) {
                            row.reference = row[field].name
                        }
                        delete row[field];
                    });

                    return row;
                })
            );
            console.log("Waiting appointments found.", res.rows);
        }
        
        return {
            limit: parsedLimit,
            page: parsedPage,
            ...res,
        };
    } catch (error) {
        console.error("Error fetching appointment reports:", error);
        return { errors: [{ message: "Failed to fetch appointment reports" }] };
    }
}

// patientgReportsService
const birthdayReportsService = async (data) => {
    const {clinic_id, dates, doctor, limit, page, search} = data.query;
    const parsedPage = parseInt(page) || 1;
    const parsedLimit = limit === "all" ? null : parseInt(limit) || 10;
    const offset = parsedLimit ? (parsedPage - 1) * parsedLimit : null
    
    const where = { status: 0 };
    
    if (clinic_id) where.clinic_id = clinic_id;
    if (doctor) where.doctor = doctor;

    try{
        const res = await Patients.findAndCountAll({
            where,
            attributes: [
                [Sequelize.fn('CONCAT', Sequelize.col('title'), ' ', Sequelize.col('first_name'), ' ', Sequelize.col('last_name')), 'full_name'],
                'case_no', 'dob', 'mobile', "email"],
            order: [["id", "DESC"]],
            limit: parsedLimit,
            offset
        });
        
        return {
            limit: parsedLimit,
            page: parsedPage,
            ...res,
        };
    } catch (error) {
        console.error("Error fetching appointment reports:", error);
        return { errors: [{ message: "Failed to fetch appointment reports" }] };
    }
}

// followsReportsService
const followsReportsService = async (data) => {
    const {clinic_id, dates, patient_id, limit, page, search} = data.query;
    const parsedPage = parseInt(page) || 1;
    const parsedLimit = limit === "all" ? null : parseInt(limit) || 10;
    const offset = parsedLimit ? (parsedPage - 1) * parsedLimit : null
    
    const where = { status: 0 };
    
    if (clinic_id) where.clinic_id = clinic_id;
    if (patient_id) where.patient_id = patient_id;

    try{
        const res = await Patient_Follow_Up.findAndCountAll({
            where,
            attributes: ["id", "followup_date", "remark"],
            include: [
                {
                    model: Patients,
                    as: "patient",
                    attributes: [[Sequelize.fn('CONCAT', Sequelize.col('title'), ' ', Sequelize.col('first_name'), ' ', Sequelize.col('last_name')), 'full_name']],
                },
                {
                    attributes: ["name"],
                    model: User,
                    as: "client",
                }
            ],
            order: [["id", "DESC"]],
            limit: parsedLimit,
            offset
        });


        if (res.count !== 0) {
            // Convert rows and map asynchronously
            const parsedRows = JSON.parse(JSON.stringify(res.rows));

            res.rows = await Promise.all(
                parsedRows.map(async (row) => {
                    row.patient = row.patient.full_name; 
                    row.added_by = row.client.name; 
                    delete row.client;

                    return row;
                })
            );
        }
        
        return {
            limit: parsedLimit,
            page: parsedPage,
            ...res,
        };
    } catch (error) {
        console.error("Error fetching appointment reports:", error);
        return { errors: [{ message: "Failed to fetch appointment reports" }] };
    }
}

export { followsReportsService, birthdayReportsService, appointmentReportService, appointmentWaitningReportsService, patientgReportsService, doctorsWorkReportsService, patientFilesReportsService, referenceReportsService };
