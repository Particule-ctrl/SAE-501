const {sequelize, User, Agent, Handicap} = require('../sql-database');

beforeAll(async () =>{
    await sequelize.sync({ force: true});
});

afterAll(async () => {
    await sequelize.close();
});

describe('Database Models', () => {
    test('User model should create a new User record', async () => {
        const user = await User.create({
            name: 'John Doe',
            birthdate: '1980-01-01',
            email: 'john.doe@example.com',
            tel: 1234567890,
            password: 'securepassword'
        });

        expect(user.name).toBe('John Doe');
        expect(user.email).toBe('john.doe@example.com');
    });

    test('Agent should work as expected', async () => {

        const agent = await Agent.create({
            name: 'Agent Smith',
            email: 'smith@example.com',
            tel: 1122334455,
            password: 'agentpassword'
        });

        const foundAgent = await Agent.findOne({ where: { id: agent.id }});
        expect(foundAgent.name).toBe('Agent Smith');
    });
});
