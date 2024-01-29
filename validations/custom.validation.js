const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message(`"{{#label}}" must be a valid mongoId, ${value}`);
  }
  return value;
};

const password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message("");
  }
};
