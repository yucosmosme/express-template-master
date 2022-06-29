module.exports = {
    // CRUD
    READ_SUCCESS: {
        message: "데이터 조회 성공",
        status: 200,
    },
    SAVE_SUCCESS: {
        message: "데이터 저장 성공",
        status: 201,
    },
    UPDATE_SUCCESS: {
        message: "데이터 수정 성공",
        status: 204
    },
    DELETE_SUCCESS: {
        message: "데이터 삭제 성공",
        status: 204
    },
    DELETE_FAIL: {
        message: "데이터 삭제 실패",
        status: 444
    },

    // 응답 메시지
    NULL_VALUE: {
        message: "Params나 Body 중 필수적으로 입력해야 하는 값인데, 입력하지 않은 값(NULL)이 존재합니다.",
        status: 400
    },
    WRONG_PARAMS: {
        message: "Params나 Body에 잘못된 값이 입력되어서 조회(or 쓰기 or 수정 or 삭제)할 데이터가 없습니다.",
        status: 401
    },

    // 서버 에러 (보안상 자세히 적지 않음)
    INTERNAL_SERVER_ERROR: {
        message: "서버 측에서 발생한 에러입니다.",
        status: 500
    },

    // 토큰 & API KEY (600번대)
    EXPIRED_TOKEN: {
        message: "토큰이 만료되었습니다.",
        status: 600
    },
    INVALID_TOKEN: {
        message: "유효하지 않은 토큰입니다.",
        status: 601
    },
    EMPTY_TOKEN: {
        message: "입력된 토큰이 없습니다.",
        status: 602
    },
    INVALID_REFRESH_TOKEN: {
        message: "적절하지 않은 Refresh Token이거나 다른 기기에서 해당 아이디로 로그인 했습니다.",
        status: 603
    },
    UPDATE_ACCESS_TOKEN: {
        message: "Access Token 재발급이 완료되었습니다.",
        status: 200
    },
    EMPTY_API_KEY: {
        message: "입력된 API_KEY가 없습니다.",
        status: 610
    },
    INVALID_API_KEY: {
        message: "유효하지 않은 API_KEY입니다.",
        status: 611
    },
    
    // 로그인 및 회원가입
    ALREADY_USER: {
        message: "중복된 이메일(아이디 or 유저)이 존재합니다.",
        status: 700
    },
    NULL_USER: {
        message: "존재하지 않는 이메일(아이디 or 유저)입니다.",
        status: 701
    },
    INVALID_PASSWORD: {
        message: "비밀번호가 일치하지 않습니다.",
        status: 702
    }, 
    WRONG_USER_INFO: {
        message: "존재하지 않는 사용자의 정보입니다.",
        status: 703
    },
    ALREADY_PHONE: {
        message: "중복된 휴대폰 번호가 존재합니다.",
        status: 704
    },
    LOGIN_SUCCESS: {
        message: "로그인 성공",
        status: 204
    },
    RESET_PASSWORD: {
        message: "비밀번호 초기화에 성공했습니다. 그리고 초기화된 비밀번호를 이메일로 발송했습니다.",
        status: 204
    },

    // 가게 관련
    ALREADY_STORE: {
        message: "현재 계정에 이미 등록되어 있는 가게가 있습니다.",
        status: 800
    },
    NO_STORE: {
        message: "현재 계정에 등록된 가게가 없습니다.",
        status: 801
    },

    // 상품 관련
    NO_PRODUCT: {
        message: "상품 id가 잘못되어서 상품 조회(or 수정 or 삭제)가 되지 않습니다.",
        status: 900
    },
    NO_PRODUCT2: {
        message: "현재 계정으로 올린 상품이 아니거나, 상품 id가 잘못되어서 상품 조회가 되지 않습니다.",
        status: 901
    },

    // 쿠폰 관련
    ALREADY_COUPON: {
        message: "이미 발급된 쿠폰입니다.",
        status: 1000
    },
    CREATE_COUPON: {
        message: "쿠폰 발급에 성공했습니다.",
        status: 201
    },
    ALREADY_USED_COUPON: {
        message: "이미 사용된 쿠폰입니다.",
        status: 1002
    },
    USE_COUPON: {
        message: "쿠폰 사용을 성공적으로 완료했습니다.",
        status: 204
    },
    USE_COUPON_FAIL: {
        message: "쿠폰 사용을 실패했습니다.",
        status: 1004
    },
    EXPIRED_COUPON: {
        message: "기간이 만료된 쿠폰입니다.",
        status: 1005
    },
    REFUNDED_COUPON: {
        message: "환불된 쿠폰입니다.",
        status: 1006
    },
    LATER_USABLE_COUPON: {
        message: "현재는 사용 기간이 아니어서 사용할 수 없는 쿠폰입니다.",
        status: 1007
    },
    SOLD_OUT_COUPON: {
        message: "현재 쿠폰이 매진되었습니다.",
        status: 1008
    },
    NOT_ON_SALE_PERIOD_COUPON: {
        message: "현재는 쿠폰 발급이 가능한 기간이 아닙니다.",
        status: 1009
    },
    ONLY_ONE_TIME_PAYMENT: {
        message: "이 상품은 중복 구매가 불가능한 상품입니다. 이미 이 상품을 구매한 적이 있습니다.",
        status: 1010
    },

    // 관리자 권한 관련
    ONLY_ADMIN_PERMISSION: {
        message: "관리자만 접근이 가능합니다.",
        status: 1100
    },

    // 아임포트 관련
    CREATE_TOKEN_FAIL: {
        message: "아임포트 AccessToken 발급에 실패했습니다.",
        status: 1200
    },
    IAMPORT_API_HTTP_FAIL: {
        message: "아임포트 API 서버와의 통신에 실패했습니다.",
        status: 1201
    },
    PAYMENT_FORGERY: {
        message: "결제에서 사용자가 위조를 시도했습니다.",
        status: 1202
    },
    PAYMENT_SUCCESS: {
        message: "위조 여부 없이 성공적으로 결제가 완료되었습니다.",
        status: 201
    },
    PAYMENT_FAIL: {
        message: "결제창까지 들어갔지만, 결제 과정 중에 에러가 발생했거나, 결제창을 종료해서 결제가 이루어지지 않았습니다.",
        status: 1203
    },
    PAYMENT_ALREADY_REFUND: {
        message: "이미 전액환불된 주문입니다.",
        status: 1204
    },
    PAYMENT_REFUND_SUCCESS: {
        message: "정상적으로 환불되었습니다.",
        status: 204
    },
    PAYMENT_REFUND_FAIL: {
        message: "환불이 이루어지지 않았습니다.",
        status: 1205
    },
    
    // 파일 업로드 관련
    LIMIT_FILE_SIZE: {
        message: "파일 1개당 업로드 가능한 용량을 넘은 파일이 존재합니다.",
        status: 1300
    },

    // 버전 체크 관련
    ALLOWED_VERSION: {
        message: "이용 가능한 버전입니다.",
        status: 200
    },
    RECOMMEND_UPDATE_VERSION: {
        message: "업데이트를 권고합니다.",
        status: 1400
    }, 
    INVALID_VERSION: {
        message: "이용 가능하지 않은 버전입니다.",
        status: 1401
    },
    

    // 업주용 권한 관련
    ONLY_STOREKEEPER_PERMISSION: {
        message: "업주용 계정만 접근이 가능합니다.",
        status: 1500
    },

    // API 요청 권한 관련
    INVALID_AUTHENTICATION: {
        message: "API에 접근할 때 필요한 값들이 부적절합니다.",
        status: 1600
    },
};