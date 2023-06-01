module.exports = function setDocObjectError (docObject, error) {
  docObject.error = {
    code: error?.code ?? error?.meta?.statusCode,
    message: error?.message,
    stack: error?.stack,
    failuresList: error?.failuresList,
    failuresTypes: error?.failuresTypes,
  };

  return docObject;
};
