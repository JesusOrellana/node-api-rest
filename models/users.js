module.exports = (sequelize, Sequelize) => {
  
    const User = sequelize.define("user", {

        id: {
            primaryKey: true,
            type: Sequelize.INTEGER,
            autoIncrement: true,
        },
        dni: {
            type: Sequelize.STRING,
            defaultValue: 'PENDING'
        },
        name: {
            type: Sequelize.STRING,
            defaultValue: 'PENDING'
        },
        lastName: {
            type: Sequelize.STRING,
            defaultValue: 'PENDING'
        },
        email: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        role: {
            type: Sequelize.INTEGER,
            references: { 
              model: 'roles',
              key: 'id'
            }
        },
        status: {
            type: Sequelize.INTEGER,
            defaultValue: 1
        },
        emailCheck: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        google: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        phone: {
            type: Sequelize.STRING,
            defaultValue: 'PENDING'
        },
        dateBirth: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.DATE
        },
        address: {
            type: Sequelize.STRING,
            defaultValue: 'PENDING'
        },
        gender: {
            type: Sequelize.STRING,
            defaultValue: 'PENDING'
        },
        country: {
            type: Sequelize.STRING,
            defaultValue: 'PENDING'
        },
        city: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        }

    });  

    return User;
};