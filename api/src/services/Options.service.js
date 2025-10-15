import db from '../models/index.js';
const { Allergies, Mediciens, TretmentTypes, Patients, Doctors, Chairs, Tags, CommunicationGroup, Language, Sequelize } = db;
import { getDocCodeByClientId, getAllClinicsByClinicClientIdUseingClinicId } from '../utils/Basicutils.js';

// options patient (soft delete)
const patientsOptionsService = async (req) => {
  try {
    const { clinic_id } = req.query;

    const result = await Patients.findAll(
      {
        attributes: [
          [Sequelize.literal('id'), 'value'],
          [Sequelize.literal("CONCAT(first_name, ' ', last_name)"), 'label']
        ],
        where: {
          clinic_id: clinic_id,
          status: 0
        }
      }
    );
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// options patient (soft delete)
const dynamicOptionsService = async (req) => {
  try {
    const { query: {client_id, clinic_id, _type}, tokendata } = req;
    const clientid = client_id? client_id: tokendata?.user_id;

    const docCode = await getDocCodeByClientId(client_id || tokendata?.user_id);

    const where = { status: 0, clinic_id: clinic_id }
    
    if(clinic_id){
      const cId = await getAllClinicsByClinicClientIdUseingClinicId(clinic_id);
      where.clinic_id = { [Sequelize.Op.in]: [cId] }
    }

    switch(_type){
      case 'mediciens':
        return await Mediciens.findAll({
          attributes: [ [Sequelize.literal('id'), 'value'], [Sequelize.literal("name"), 'label'], "molucule",'dose','frequent',"duration",],
          where: where
        });
      case 'patients':
        return await Patients.findAll({
          attributes: [
            [Sequelize.literal('id'), 'value'],
            [Sequelize.literal("CONCAT(first_name, ' ', last_name)"), 'label']
          ],
          where: { clinic_id, status: 0 }
        });
      case 'doctors':
        return await Doctors.findAll({
          attributes: [
            [Sequelize.literal('code'), 'value'],
            [Sequelize.literal('name'), 'label']
          ],
          where: { 
            [Sequelize.Op.or]: [
              {client_id: clientid},
              {code: docCode}
            ],
            status: 0,
          }
        });
      case 'treatment':
        return await TretmentTypes.findAll({
          attributes: [
            [Sequelize.literal('id'), 'value'],
            [Sequelize.literal('title'), 'label']
          ],
          where: where
        });
      case 'chair':
        return await Chairs.findAll({
          attributes: [
            [Sequelize.literal('id'), 'value'],
            [Sequelize.literal('title'), 'label']
          ],
          where: where
        });
      default:
        const [patients, doctors, treatments, chairs] = await Promise.all([
          Patients.findAll({
            attributes: [
              [Sequelize.literal('case_no'), 'value'],
              [Sequelize.literal("CONCAT(first_name, ' ', last_name)"), 'label']
            ],
            where: { clinic_id, status: 0 }
          }),
          Doctors.findAll({
            attributes: [
              [Sequelize.literal('code'), 'value'],
              [Sequelize.literal('name'), 'label']
            ],
            where: {
              [Sequelize.Op.or]: [
                {client_id: clientid},
                {code: docCode}
              ],
              status: 0
            }
          }),
          TretmentTypes.findAll({
            attributes: [
              [Sequelize.literal('id'), 'value'],
              [Sequelize.literal('title'), 'label']
            ],
            where: where
          }),
          Chairs.findAll({
            attributes: [
              [Sequelize.literal('id'), 'value'],
              [Sequelize.literal('title'), 'label']
            ],
            where: where
          })
        ]);
        return {
          patients,
          doctors,
          treatments,
          chairs
        };
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const dynamicPatientOptionsService = async (req) => {
  try {
    const { query: {client_id, clinic_id }, tokendata } = req;
    const clientid = client_id? client_id: tokendata?.user_id;

    const docCode = await getDocCodeByClientId(client_id || tokendata?.user_id);

    const where = { status: 0, clinic_id: clinic_id }
    
    if(clinic_id){
      const cId = await getAllClinicsByClinicClientIdUseingClinicId(clinic_id);
      where.clinic_id = { [Sequelize.Op.in]: [cId] }
    }

    const [tags, communicationGroup, language, allergies] = await Promise.all([
      Tags.findAll({
        attributes: [
          [Sequelize.literal('id'), 'value'],
          [Sequelize.literal('title'), 'label']
        ],
        where: { client_id, status: 0 }
      }),
      CommunicationGroup.findAll({
        attributes: [
          [Sequelize.literal('id'), 'value'],
          [Sequelize.literal('title'), 'label']
        ],
        where: { client_id, status: 0 }
      }),
      Language.findAll({
        attributes: [
          [Sequelize.literal('id'), 'value'],
          [Sequelize.literal('title'), 'label']
        ],
        where: { client_id, status: 0 }
      }),
      Allergies.findAll({
        attributes: [
          [Sequelize.literal('id'), 'value'],
          [Sequelize.literal('title'), 'label']
        ],
        where: { client_id, status: 0 }
      }),
    ]);

    return {tags, communicationGroup, language, allergies};
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export {
  patientsOptionsService,
  dynamicOptionsService,
  dynamicPatientOptionsService
};
