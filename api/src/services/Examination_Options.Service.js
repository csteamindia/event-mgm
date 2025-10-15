import db from "../models/index.js";
import "dotenv/config";
const { Examination_Options, Clinics, User } = db;
import { Op } from "sequelize";

const createExamination_OptionsService = async (req) => {
  let { title, clinic_id, client_id, type } = req.body;
  try {

    // if (req.role === "admin") {
    //   client_id = null;
    //   clinic_id = null;
    // }

    const payload = {
      title: title,
      clinic_id: clinic_id || null,
      client_id: client_id || null,
      type: type == 1 ? "complaints": "diagnosis",
      created_by: req.role,
    };
    const res = await Examination_Options.create(payload);

    return res;
  } catch (e) {
    console.log(e);
    return e;
  }
};

const getAllExamination_OptionsService = async (req) => {
  try {
    const { clinic_id, client_id } = req.query;

    const whereCondition = {
      status: 0,
      [Op.or]: [
        {
          clinic_id: clinic_id || null,
          client_id: client_id || null,
        },
        {
          clinic_id: null,
          client_id: null,
        },
      ],
    };

    const condition = {
      where: whereCondition,
      attributes: ["id", "title", "type"],
      order: [["id", "DESC"]],
    };

    const result = await Examination_Options.findAll(condition);

    // Group by type
    const groupedOptions = {};

    result.forEach((item) => {
      if (!groupedOptions[item.type]) {
        groupedOptions[item.type] = [];
      }
      groupedOptions[item.type].push({
        value: item.id,
        label: item.title
      });
    });

    // Convert to array of type-wise options
    let t = {};
    Object.entries(groupedOptions).map(([type, values]) => {
      t[type] = values
    });

    return t;
  } catch (e) {
    console.error("Error fetching all Examination_Options:", e.message);
    return { success: false, message: e.message };
  }
};

export { createExamination_OptionsService, getAllExamination_OptionsService };
