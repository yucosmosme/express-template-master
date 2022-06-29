const response = (resMessage, data) => {
    return {
        status: resMessage.status,
        message: resMessage.message,
        data: data
    }
};

module.exports = response;