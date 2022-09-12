module.exports = (sequelize, Sequelize) => {
  
    const RoleAccess = sequelize.define("role_access", {

        role: {
            type: Sequelize.INTEGER,
            references: { 
              model: 'roles',
              key: 'id'
            }
        },
        access: {
            type: Sequelize.INTEGER,
            references: { 
              model: 'access',
              key: 'id'
            }
        },
        status: {
            type: Sequelize.INTEGER,
            defaultValue: 1
        },
        create: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        read: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        update: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        delete: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        manage: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        }},
    {
        freezeTableName: true

    });  

    return RoleAccess;
};