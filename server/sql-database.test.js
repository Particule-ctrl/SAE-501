const {sequelize, PMR, Accompagnateur, Agent, Site} = require('./sql-database');

beforeAll(async () =>{
    await sequelize.sync({ force: true});
});

afterAll(async () => {
    await sequelize.close();
});

describe('Database Models', () => {
    test('PMR model should create a new PMR record', async () => {
        const pmr = await PMR.create({
            name: 'John Doe',
            birthdate: '1980-01-01',
            email: 'john.doe@example.com',
            tel: 1234567890,
            password: 'securepassword'
        });

        expect(pmr.name).toBe('John Doe');
        expect(pmr.email).toBe('john.doe@example.com');
    });

    test('Accompagnateur model should create a new Accompagnateur record', async () => {
        const accompagnateur = await Accompagnateur.create({
            name: 'Jane Doe',
            birthdate: '1985-05-10',
            email: 'jane.doe@example.com',
            tel: 9876543210,
            password: 'anotherpassword'
        });

        expect(accompagnateur.name).toBe('Jane Doe');
        expect(accompagnateur.email).toBe('jane.doe@example.com');
    });

    test('Site and Agent relationship should work as expected', async () => {
        const site = await Site.create({
            name: 'Main Office',
            country: 'CountryX',
            city: 'CityY'
        });

        const agent = await Agent.create({
            name: 'Agent Smith',
            email: 'smith@example.com',
            tel: 1122334455,
            password: 'agentpassword',
            site_id: site.id
        });

        const foundAgent = await Agent.findOne({ where: { id: agent.id }, include: 'Site' });
        expect(foundAgent.Site.name).toBe('Main Office');
    });
});
