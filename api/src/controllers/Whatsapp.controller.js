import httpStatus from "http-status";
import * as response from "../middlewares/response-handler.js";
import db from "../models/index.js";
import fetch from 'node-fetch';
const { Clinics, Sequelize } = db;

const responseHandler = response.default;

const getConfigData = async(clinic_id) => {
  return await Clinics.findOne({
    where: {id: clinic_id}
  })
}

const messages = (type, params) => {
  switch (type){
    case  'welcome': 
      return `Hello ${params?.name}, welcome to ${params?.clinic}! 🏥\n \n We\'re glad to have you with us. If you have any questions or need assistance, feel free to contact us anytime.`;
    case  'app_can': 
      return `Dear ${params?.name},\n\nWe regret to inform you that your appointment with Dr. ${params?.doctor} scheduled for ${params?.appointment_date} AM has been canceled due to unforeseen circumstances.\nPlease call us at ${params?.number} to reschedule.\nWe sincerely apologize for the inconvenience.\n\n– ${params?.clinic}`;
    default: 
      return ``;
  }
}

const SendWpMessage = async (data, message_type) => {
  const {wp_key, clinic_name, phone} = await getConfigData(data.clinic_id);

  const finaldata = {clinic: clinic_name, number: phone, name: `${data.first_name} ${data.last_name}`, ...data}

  console.log(finaldata)

  const message = await messages(message_type, finaldata);
  
  const postdata = {
    contact: [{
      number: data?.mobile,
      message
    }]
  };

  try {
    const response = await fetch("https://thedigitalizeclick.com/api/whatsapp/send", {
      method: "POST",
      headers: {
          "Api-key": wp_key,
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(postdata)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
  } catch (e) {
    console.log(e)
  }
};

export { SendWpMessage };
