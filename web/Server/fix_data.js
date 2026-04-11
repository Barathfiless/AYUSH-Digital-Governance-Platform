const mongoose = require('mongoose');

async function run() {
    try {
        await mongoose.connect('mongodb+srv://S8-AYUSH:S8-AYUSH@s8-ayush.uxylwza.mongodb.net/?appName=S8-AYUSH');
        console.log('Connected to ayush database');

        const userUpdate = await mongoose.connection.db.collection('users').updateOne(
            { name: 'BARATH M' },
            { $set: { role: 'officer' } }
        );
        console.log('User update result:', userUpdate.modifiedCount);

        await mongoose.connection.db.collection('applications').deleteMany({});
        const appInsert = await mongoose.connection.db.collection('applications').insertOne({
            companyName: 'Ayush Herbal Solutions',
            gstin: '27AAACG1234F1Z1',
            status: 'Pending',
            submittedAt: new Date()
        });
        console.log('App insert result:', appInsert.insertedId);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

run();
