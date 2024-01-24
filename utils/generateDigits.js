exports.uniqueString = () => {
  const strOne = Date.now().toString(36);
  const strTwo = Math.random().toString(36).substring(2);
  const d = strOne + strTwo;
  return d.slice(0, 4);
};

exports.uniqueFiveDigits = () => {
  return Math.floor(100000 + Math.random() * 900000);
};
