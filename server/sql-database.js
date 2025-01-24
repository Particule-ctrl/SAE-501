const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DB_SCHEMA || 'postgres',
                                process.env.DB_USER,
                                process.env.DB_PASSWORD,
                                {
                                    host: process.env.DB_HOST || 'localhost',
                                    port: process.env.DB_PORT || 5432,
                                    dialect: 'postgres',
                                    logging: console.log,
                                    dialectOptions: {
                                    ssl: process.env.DB_SSL == "true"
                                    }
                                }
);

const User = sequelize.define('User',{
    firstname: {
        type: Sequelize.STRING,
        allowNull: false
    },
    lastname: {
        type: Sequelize.STRING,
        allowNull: false
    },
    birthdate: {
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    tel: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    civility: {
        type: Sequelize.STRING
    },
    note: {
        type: Sequelize.STRING
    },
    handicap: {
        type: Sequelize.INTEGER
    },
    googleUUID: {
        type: Sequelize.STRING
    }
});

const Agent = sequelize.define('Agent',{
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    entreprise: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

const Handicap = sequelize.define('Handicap',{
    code: {
        type: Sequelize.STRING
    }
});

Handicap.hasMany(User, {
    foreignKey: 'handicap'
});
User.belongsTo(Handicap, { foreignKey: 'handicap', as: 'Handicap'});


const db = {
    sequelize: sequelize,
    User: User,
    Agent: Agent,
    Handicap: Handicap
}

module.exports = db