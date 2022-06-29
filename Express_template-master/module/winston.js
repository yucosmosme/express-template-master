const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');

let logger = {};


// 첫 번째 파라미터(server_or_client) : log 폴더 안에 저장할 폴더명을 넣으면 된다. ('server' or 'client')
const logger_config = (server_or_client) => {
    return createLogger({
        level: 'silly',
        format: format.combine(
            format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
            }),
            format.printf(({ level, message, timestamp }) => {
                return `${timestamp} [${level.toUpperCase()}] ${message}`;
            }),
        ),
        transports: [
            // morgan의 로그, error의 로그를 전부 기록
            new transports.DailyRotateFile({
                filename: `log/${server_or_client}/combined/%DATE%.log`, // 로그 파일을 저장할 위치
                datePattern: 'YYYY-MM-DD HH', // 로그 파일을 저장 할 때 사용하는 Date Format
                zippedArchive: true, // 로그 파일을 zip 형태로 저장
                maxSize: '20m', // 하나의 로그 파일이 20MB를 넘으면 새로운 로그 파일을 생성
                maxFiles: '14d', // 최근 14일 간의 로그 파일만 저장. 그 외의 로그 파일은 삭제
                level: 'silly' // silly 단계 이상의 log에 대해서 작동
            }),

            // error의 로그에 대해서만 기록
            new transports.DailyRotateFile({
                filename: `log/${server_or_client}/error/%DATE%.log`,
                datePattern: 'YYYY-MM-DD',
                zippedArchive: true,
                maxSize: '20m',
                maxFiles: '14d',
                level: 'error' // error 단계 이상의 log에 대해서 작동
            })
        ]
    });
}

logger.stream = {
    write: (message) => {
        logger_config('server').info(message);
    }
}




// [서버에서 에러가 발생한 경우를 기록]
// 첫 번째 파라미터(level) : 'silly', 'error' 등 winston에서 제공하는 level을 설정하면 된다.
// 두 번째 파라미터(content) : 로그로 남길 내용을 넣으면 된다.
logger.log = (level, content) => {
    logger_config('server').log(level, content);
    
    // 배포 환경이 아닌 경우에는 log를 남기는 것뿐만 아니라 console.log도 cmd창에 찍어준다.
    if (process.env.NODE_ENV !== 'production') {
        logger_config('server').add(new transports.Console())
    }
};

module.exports = logger;