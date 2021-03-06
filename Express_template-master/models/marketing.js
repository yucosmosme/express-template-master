module.exports = (sequelize, Sequelize) => {
    return sequelize.define('marketing', {
        // id
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        // 제 3자 마케팅 동의 여부 
        is_third_party_agreement: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        // 이벤트 알림 수신 여부
        is_event_alarm: {
            type:Sequelize.BOOLEAN,
            allowNull: true
        },
    }, {
        // // 컬럼을 네이밍할 때, _를 사용해서 작명한다.
        // // (ex: createdAt -> created_at)
        underscored: true,

        // // updatedAt열, createdAt열 자동 추가
        timestamps: true,

        // /* 
        // 로우를 삭제하는 시퀄라이즈 명령을 내렸을 때, 
        // 로우를 제거하는 대신 deletedAt에 제거된 날짜를 입력한다.
        // (주의 : timestamps가 true여야만 설정할 수 있다.)
        // */
        paranoid: true,
        // 한글 지원
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci'
    })
};
