module.exports = (sequelize, Sequelize) => {
  
    const Role = sequelize.define("role", {

        id: {
            primaryKey: true,
            type: Sequelize.INTEGER,
            autoIncrement: true,
        },
        name: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.INTEGER,
            defaultValue: 1
        }

    });  

    return Role;
};