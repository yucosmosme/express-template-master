const jwt = require('jsonwebtoken');
const response = require('../response');
const resMessage = require('../response/message');
const logger = require('../../config/winstonConfig');

// sign 함수 : JWT 토큰을 발행하는 함수
exports.sign = (user) => { // 'DB에서 조회한 user'를 인자로 받는다.
	// 옵션 설정
	const options = {
		algorithm: "HS256", // 알고리즘 종류
		expiresIn: "1h", // 만료 기간
		issuer: "jaeseong" // 발행자
	};

	// payload : JWT 토큰에 담을 내용
	const payload = {
		id: user.id,
		name: user.name,
		email: user.email,
		role: user.role
	};
	// sign 함수 : JWT 토큰을 발행하는 함수
	// 첫 번째 인자(payload) : JWT 토큰에 담은 내용
	// 두 번째 인자(secretOrPrivateKey) : JWT를 암호화시킬 비밀번호
	// 세 번째 인자(options) : 기타 옵션
	const token = jwt.sign(payload, process.env.JWT_SECRET, options)
	return token;
};

// refresh_token_sign 함수 : JWT 리프레시 토큰을 발행하는 함수
exports.refresh_token_sign = (user) => {
	// 옵션 설정
	const options = {
		algorithm: "HS256", // 알고리즘 종류
		expiresIn: "365d", // 만료 기간
		issuer: "jaeseong" // 발행자
	};

	// payload : JWT 토큰에 담을 내용
	const payload = {
		id: user.id, 
		name: user.name,
		email: user.email,
		role: user.role
	};
	const refresh_token = jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET, options);
	return refresh_token;
}

// verify 함수 : JWT 토큰을 해독하는 함수
const verify = (token) => {
	try {
		// verify 함수 : JWT 토큰을 해독하는 함수
		// 첫 번째 인자(token) : 해독할 JWT 토큰
		// 두 번째 인자(secretOrPublicKey) : JWT를 암호화시켰던 비밀번호
		// 출력값 : JWT 토큰에 담겨있었던 payload
		let decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
		// console.log(decodedPayload)
		return decodedPayload;
	} catch (err) {
		// console.log('에러 던지기!!')
		// console.log(err);
		throw err
	}
}
exports.verify = verify;

// refresh_token_verify 함수 : refresh_token을 해독하는 함수
const refresh_token_verify = (token) => {
	try {
		// verify 함수 : JWT 토큰을 해독하는 함수
		// 첫 번째 인자(token) : 해독할 JWT 토큰
		// 두 번째 인자(secretOrPublicKey) : JWT를 암호화시켰던 비밀번호
		// 출력값 : JWT 토큰에 담겨있었던 payload
		let decodedPayload = jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET);
		// console.log(decodedPayload)
		return decodedPayload;
	} catch (err) {
		// console.log('에러 던지기!!')
		// console.log(err);
		throw err;
	}
}
exports.refresh_token_verify = refresh_token_verify;

// 대부분의 라우터에 쓰이므로, 사용하기 쉽게 미들웨어 형태(req, res, next를 인자로 받는 함수)로 만들었다.
// 미들웨어의 기능
// 1. token이 있는지 없는지 확인
// - token이 있다면 verify 함수를 이용해서 JWT 토큰의 정보를 해독

// 2.1. token이 있다면 verify 함수를 이용해서 JWT 토큰의 정보를 해독
// && 해독한 정보를 req.decoded에 할당해서, 다음 미들웨어에서 쓸 수 있도록 만들기
// (req.decoded가 있는지 없는지를 통해서 로그인 유무를 확인하는 용도로 쓸 수 있다.)

// 2.2. token이 없다면 에러 응답 메시지 출력

// 3. token은 있는데, 만료된 token이거나 잘못된 token일 경우 에러 응답 메시지 출력
exports.isLoggedIn = async(req, res, next) => {
	try {
		/* Express에서 req.headers의 값들은 자동적으로 소문자로 변환시켜서 
		Authorization으로 요청하더라도 authorization으로 값이 출력된다.
		(단, Request를 할 때는 반드시 Authorization을 header에 담아서 요청해야 한다.)*/
		let { authorization } = req.headers;
		// console.log('req.headers : ', req.headers);
		// console.log('req.headers.authorization : ', authorization);

		// 토큰이 헤더에 없는 경우
		if (!authorization) {
			res.json(response.failure(resMessage.EMPTY_TOKEN));
		
		// 토큰이 헤더에 있는 경우
		} else {
			// Access Token이 Bearer로 시작하는 경우
			if (authorization.startsWith('Bearer ')) {
				authorization = authorization.slice(7, authorization.length);
				// console.log('테스트 : ', authorization);

				//만든 jwt 모듈 사용하여 토큰 확인
				const user = verify(authorization);
				req.decoded = user;
				next();

			// Access Token이 Bearer로 시작하지 않는 경우
			} else {
				console.log('Bearer 에러');
				res.json(response.failure(resMessage.INVALID_TOKEN));
			}
		}
	} catch (err) {
		// logger.log('error', err.stack);
		// console.log('verify에서 throw한 err를 받음');
		if (err.name === 'TokenExpiredError') {
			res.json(response(resMessage.EXPIRED_TOKEN));
		} else if (err.name === 'JsonWebTokenError') {
			res.json(response(resMessage.INVALID_TOKEN));
		} else {
			res.json(response(resMessage.INVALID_TOKEN));
			logger.log('error', err.stack);
		}
	}
};

// 업주용 계정인지 체크하는 기능 (일반 사용자는 접근 금지)
exports.isStorekeeperLoggedIn = async(req, res, next) => {
	try {
		/* Express에서 req.headers의 값들은 자동적으로 소문자로 변환시켜서 
		Authorization으로 요청하더라도 authorization으로 값이 출력된다.
		(단, Request를 할 때는 반드시 Authorization을 header에 담아서 요청해야 한다.)*/
		let { authorization } = req.headers;
		// console.log('req.headers : ', req.headers);
		// console.log('req.headers.authorization : ', authorization);

		// 토큰이 헤더에 없는 경우
		if (!authorization) {
			res.json(response(resMessage.EMPTY_TOKEN));
		
		// 토큰이 헤더에 있는 경우
		} else {
			// Access Token이 Bearer로 시작하는 경우
			if (authorization.startsWith('Bearer ')) {
				authorization = authorization.slice(7, authorization.length);
				// console.log('테스트 : ', authorization);

				//만든 jwt 모듈 사용하여 토큰 확인
				const user = verify(authorization);
				req.decoded = user;


				// 접근을 허락한 업주용 계정일 경우만 접근이 가능하도록 만들기
				if (user.role === 'storekeeper') {
					// console.log('테스트 : ', user.role)
					next();

				// 업주용 계정이 아닌 경우
				} else {
					res.json(response(resMessage.ONLY_STOREKEEPER_PERMISSION));
				}
			// Access Token이 Bearer로 시작하지 않는 경우
			} else {
				console.log('Bearer 에러');
				res.json(response(resMessage.INVALID_TOKEN));
			}
		}
	} catch (err) {
		// console.log('verify에서 throw한 err를 받음');
		// logger.log('error', err.stack);
        
		if (err.name === 'TokenExpiredError') {
			res.json(response(resMessage.EXPIRED_TOKEN));
		} else if (err.name === 'JsonWebTokenError') {
			res.json(response(resMessage.INVALID_TOKEN));
		} else {
			res.json(response(resMessage.INVALID_TOKEN))
			logger.log('error', err.stack);
		}
	}
};


// 관리자인지 체크하는 기능
exports.isAdminLoggedIn = async(req, res, next) => {
	try {
		// console.log('isAdminLoggedIn 미들웨어 실행 시작');

		/* Express에서 req.headers의 값들은 자동적으로 소문자로 변환시켜서 
		Authorization으로 요청하더라도 authorization으로 값이 출력된다.
		(단, Request를 할 때는 반드시 Authorization을 header에 담아서 요청해야 한다.)*/
		let { authorization } = req.headers;
		// console.log('req.headers : ', req.headers);
		// console.log('req.headers.authorization : ', authorization);

		// 토큰이 헤더에 없는 경우
		if (!authorization) {
			res.json(response(resMessage.EMPTY_TOKEN));
		
		// 토큰이 헤더에 있는 경우
		} else {
			// Access Token이 Bearer로 시작하는 경우
			if (authorization.startsWith('Bearer ')) {
				authorization = authorization.slice(7, authorization.length);
				// console.log('테스트 : ', authorization);

				//만든 jwt 모듈 사용하여 토큰 확인
				const user = verify(authorization);
				req.decoded = user;

				// 접근을 허락한 관리자 이메일일 경우만 접근이 가능하도록 만들기
				if (user.role === 'admin') {
					// console.log('테스트 : ', user.role)
					next();

				// 관리자 이메일이 아닌 경우
				} else {
					res.json(response(resMessage.ONLY_ADMIN_PERMISSION));
				}
			// Access Token이 Bearer로 시작하지 않는 경우
			} else {
				console.log('Bearer 에러');
				res.json(response(resMessage.INVALID_TOKEN));
			}
		}
	} catch (err) {
		// console.log('verify에서 throw한 err를 받음');
		// logger.log('error', err.stack);
        
		if (err.name === 'TokenExpiredError') {
			res.json(response(resMessage.EXPIRED_TOKEN));
		} else if (err.name === 'JsonWebTokenError') {
			res.json(response(resMessage.INVALID_TOKEN));
		} else {
			res.json(response(resMessage.INVALID_TOKEN))
			logger.log('error', err.stack);
		}
	}
};

exports.graphql = {
	isLoggedIn: async(req, res, next) => {
		try {
			/* Express에서 req.headers의 값들은 자동적으로 소문자로 변환시켜서 
			Authorization으로 요청하더라도 authorization으로 값이 출력된다.
			(단, Request를 할 때는 반드시 Authorization을 header에 담아서 요청해야 한다.)*/
			let { authorization } = req.headers;
			// console.log('req.headers : ', req.headers);
			// console.log('req.headers.authorization : ', authorization);
	
			// 토큰이 헤더에 없는 경우
			if (!authorization) {
				next();
			
			// 토큰이 헤더에 있는 경우
			} else {
				// Access Token이 Bearer로 시작하는 경우
				if (authorization.startsWith('Bearer ')) {
					authorization = authorization.slice(7, authorization.length);
					// console.log('테스트 : ', authorization);
					//만든 jwt 모듈 사용하여 토큰 확인
					const user = verify(authorization);
					req.decoded = user;
					next();
				// Access Token이 Bearer로 시작하지 않는 경우
				} else {
					console.log('Bearer 에러');
					res.json(response(resMessage.INVALID_TOKEN));
				}
			}
		} catch (err) {
			// logger.log('error', err.stack);
			// console.log('verify에서 throw한 err를 받음');
			if (err.name === 'TokenExpiredError') {
				res.json(response(resMessage.EXPIRED_TOKEN));
			} else if (err.name === 'JsonWebTokenError') {
				res.json(response(resMessage.INVALID_TOKEN));
			} else {
				res.json(response(resMessage.INVALID_TOKEN));
				logger.log('error', err.stack);
			}
		}
	}
}