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

const PMR = sequelize.define('PMR',{
    name: {
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
        type: Sequelize.INTEGER,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
});

const Accompagnateur = sequelize.define('Accompagnateur',{
    name: {
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
        type: Sequelize.INTEGER,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
});

const Agent = sequelize.define('Agent',{
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    tel: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    site_id: {
        type: Sequelize.INTEGER
    }
});

const Site = sequelize.define('Site',{
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    geoCoord: {
        type: Sequelize.STRING,
        allowNull: true
    },
    country: {
        type: Sequelize.STRING,
        allowNull: false
    },
    geoSubDiv: {
        type: Sequelize.STRING,
        allowNull: true
    },
    city: {
        type: Sequelize.STRING,
        allowNull: true
    }
});

Site.hasMany(Agent, {
    foreignKey: 'site_id'
});
Agent.belongsTo(Site, { foreignKey: 'site_id', as: 'Site' });


module.exports = {
    sequelize: sequelize,
    PMR: PMR,
    Accompagnateur: Accompagnateur,
    Agent: Agent,
    Site: Site
}