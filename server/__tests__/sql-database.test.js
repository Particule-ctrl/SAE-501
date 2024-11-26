const {sequelize, User, Agent, Handicap} = require('../sql-database');

beforeAll(async () =>{
    await sequelize.sync({ force: true});
});

afterAll(async () => {
    await sequelize.drop();
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

describe('Handicap Model and Associations', () => {
    test('Handicap model should create a new Handicap record', async () => {
        const handicap = await Handicap.create({
            code: 'HC001'
        });

        expect(handicap.code).toBe('HC001');
    });

    test('User should associate with Handicap', async () => {
        // Create a Handicap
        const handicap = await Handicap.create({
            code: 'HC002'
        });

        // Create a User and associate it with the Handicap
        const user = await User.create({
            name: 'Jane Doe',
            birthdate: '1990-02-02',
            email: 'jane.doe@example.com',
            tel: 2211221122,
            password: 'securepassword',
            handicap: handicap.id // Associate via foreign key
        });

        const foundUser = await User.findOne({
            where: { id: user.id },
            include: [{ model: Handicap, as: 'Handicap' }]
        });

        expect(foundUser.handicap).toBe(handicap.id);
        expect(foundUser.Handicap.code).toBe('HC002');
    });
});

