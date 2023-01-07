const checkEmail = (email) => {
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const isValidEmail = emailRegex.test(email);

  return isValidEmail;
};

const checkPassword = (password) => {
  // Start with a capital letter
  // Do not start with a number
  // Do not end with a number
  // Do not start and end with an exclamation mark
  // Contain an exclamation mark
  const passwordRegex =
    /^[A-Z](?![0-9]|!{2})(?=.*!)[a-zA-Z0-9!@#$%^&*]*[a-zA-Z0-9]$/;

  const isValidPassword = passwordRegex.test(password);

  return isValidPassword;
};

const checkPhone = (phone) => {
  const phoneRegex = /^\+[0-9]{1,3}[\s.-]?[0-9]{1,3}[\s.-]?[0-9]{4,10}$/;
  const isValidPhone = phoneRegex.test(phone);

  return isValidPhone;
};

module.exports = { checkEmail, checkPassword, checkPhone };
