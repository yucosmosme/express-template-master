const logger = require('../config/winstonConfig');
const response = require('./response');
const resMessage = require('./response/message');

const error_handling = {};

const asyncErrorLogger = (message) => {
    new Promise((resolve) => {
        logger.log('error', message);
        resolve();
    })
}

const axiosErrorHandler = async (err) => {
    new Promise(async (resolve) => {
        await asyncErrorLogger(err.stack);
        await asyncErrorLogger('url : ' + JSON.stringify(err.response.config.url, null, "\t"));
        await asyncErrorLogger('method : ' + JSON.stringify(err.response.config.method, null, "\t"));
        await asyncErrorLogger(JSON.stringify(err.response.data, null, "\t"));
        resolve();
    })
};

/* 
1. 함수 용도
    - winston을 이용한 err 기록
    - slack으로 err 알림
    - transaction rollback
    - 요청에 대한 응답 코드 및 응답 메시지 보내기
2. 파라미터 설명
    - err : catch()를 통해 날라오는 파라미터 err
    - res : 라우팅 코드에서 발생하는 res
    - transaction : sequelize에서 만든 transaction
3. 사용 방법
    - 라우팅의 try/catch문 catch 부분에서 사용하면 된다.
*/
error_handling.normal = async (err, res, transaction) => {
    try {
        // <axios 에러 내용을 자세하게 받아보기 위한 error 핸들링>
        /* 
        axios가 에러를 발생시키면 예외적으로 err의 객체에 response라는 프로퍼티를 가지게 된다.
        다른 에러는 err의 객체에 response라는 프로퍼티를 가지지 않으므로 밑과 같이 if문 처리를 해주어야 한다. 
        */
        if (err.response !== undefined) {
            axiosErrorHandler(err);
            
        // <일반적인 경우에서의 error 핸들링>
        } else if (err.name !== 'TokenExpiredError' && err.name !== 'JsonWebTokenError'){
            // axios 에러가 안터진 경우
            logger.log('error', err.stack);
            
        };

        // 트랜잭션을 사용하는 경우
        if (transaction !== undefined) {
            // transaction을 이용해 rollback 시키기
            transaction.rollback();
        } 

        // <JWT 토큰 관련 에러 처리>
        if (err.name === 'TokenExpiredError') {
            res.status(200).json(response(resMessage.EXPIRED_TOKEN));
        } else if (err.name === 'JsonWebTokenError') {
            res.status(200).json(response(resMessage.INVALID_TOKEN));
        } else {
            // 요청에 대한 응답 메시지를 보내는 역할
            res.status(200).json(response(resMessage.INTERNAL_SERVER_ERROR));
        }
        
    } catch (err) {
        logger.log('error', err.stack);
        res.status(200).json(response(resMessage.INTERNAL_SERVER_ERROR));
    }
}

///////////////////////////////////////////////////
error_handling.graphql = async (err, transaction) => {
    // <axios 에러 내용을 자세하게 받아보기 위한 error 핸들링>
    /* 
    axios가 에러를 발생시키면 예외적으로 err의 객체에 response라는 프로퍼티를 가지게 된다.
    다른 에러는 err의 객체에 response라는 프로퍼티를 가지지 않으므로 밑과 같이 if문 처리를 해주어야 한다. 
    */
    if (err.response !== undefined) {
        await axiosErrorHandler(err);
        throw err.response.data;

    // <일반적인 경우에서의 error 핸들링>
    } else {
        transaction.rollback();
        logger.log('error', err.stack);
        throw err;
    }
}

module.exports = error_handling;