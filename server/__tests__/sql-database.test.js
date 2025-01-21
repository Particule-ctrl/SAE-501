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
            firstname: 'John',
            lastname: 'Doe',
            birthdate: '1980-01-01',
            email: 'john.doe@example.com',
            tel: 1234567890,
            password: 'securepassword'
        });

        expect(user.firstname).toBe('John');
        expect(user.lastname).toBe('DOe');
        expect(user.email).toBe('john.doe@example.com');
    });

    test('Agent should work as expected', async () => {

        const agent = await Agent.create({
            email: 'smith@example.com',
            entreprise: 'SNCF',
            password: 'agentpassword'
        });

        const foundAgent = await Agent.findOne({ where: { id: agent.id }});
        expect(foundAgent.email).toBe('smith@example.com');
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
            firstname: 'John',
            lastname: 'Doe',
            birthdate: '1980-01-01',
            email: 'john.doe@example.com',
            tel: 1234567890,
            password: 'securepassword',
            handicap: handicap.id
        });

        const foundUser = await User.findOne({
            where: { id: user.id },
            include: [{ model: Handicap, as: 'Handicap' }]
        });

        expect(foundUser.handicap).toBe(handicap.id);
        expect(foundUser.Handicap.code).toBe('HC002');
    });
});

