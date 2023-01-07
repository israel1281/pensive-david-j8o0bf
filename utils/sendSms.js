const axios = require("axios");

const sendSms = async (phone, token) => {
  const url = new URL("https://www.bulksmsnigeria.com/api/v1/sms/create");

  const params = {
    to: phone,
    from: "Purscliq",
    body: `You can verify your phone number with this token ${token}`,
    gateway: "0",
    append_sender: "0",
  };
  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key])
  );

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const body = {
    api_token: process.env.BULK_SMS_KEY,
  };

  try {
    const response = await axios.post(url, body, { headers });
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

module.exports = sendSms;
