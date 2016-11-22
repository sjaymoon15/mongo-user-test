const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

before((done) => {
	mongoose.connect('mongodb://localhost/users_test');
	mongoose.connection
		.once('open', () => {
			console.log('mongo and mongoose connected');
			done();
		})
		.on('error', (error) => {
			console.warn('Warning', error);
		});
});

//when this is done, (after it hits done();) then run the rest
beforeEach((done) => {
	mongoose.connection.collections.users.drop(() => {
		//ready to run the next test!
		done();
	});
});