import mongoose from 'mongoose'
import config from './config/index.js'

try {
	
	mongoose.connect(
		`${config.MONGODB_URI}`,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		},
		(err, res) => {
			if (err) throw err;

			console.log('DB online');
		}
	);
} catch (err) {
	console.log(err);
}