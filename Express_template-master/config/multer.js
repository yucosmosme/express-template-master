const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
aws.config.loadFromPath(__dirname + '/awsconfig.json');
const s3 = new aws.S3();

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'S3 버킷 이름',
        acl: 'public-read',
        key: function(req, file, cb) {

            // pop() : 배열의 마지막 요소를 제거하고, 제거한 배열의 마지막 요소를 출력한다.
            cb(null, Math.floor(Math.random() * 1000).toString() + Date.now() + '.' + file.originalname.split('.').pop()); // 저장할 파일 이름 Format 설정
        }
    }),
    // 업로드 할 수 있는 파일 1개의 최대 용량을 제한
    limits: {
        fileSize: 1000 * 1000 * 10 // 10MB
    }
});

module.exports = upload;