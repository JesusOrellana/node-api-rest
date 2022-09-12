module.exports = (sequelize, Sequelize) => {
  
    const Access = sequelize.define("access", {

        id: {
            primaryKey: true,
            type: Sequelize.INTEGER,
            autoIncrement: true,
        },
        module: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.INTEGER,
            defaultValue: 1
        }
    },
    {
        freezeTableName: true
    });  

    return Access;
};