export const minCharacters = (v, min) => {
  return v.length >= min || `Minimum Character length is ${min}`;
};

export const maxCharacters = (v, max) => {
  return v.length <= max || `Minimum Character length is ${max}`;
};

export const noSpace = v => {
  return v.indexOf(" ") <= 0 || "This field shouldn't contain empty spaces!";
};

export const isEmail = v => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return (
    re.test(String(v).toLowerCase()) || "This is not a valid email Address!"
  );
};

export const notEmpty = v => {
  return v != "" || "This field shouldn't be empty!";
};
