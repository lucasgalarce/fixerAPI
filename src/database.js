import mongoose from 'mongoose'
import config from './config/index.js'

try {
	
	mongoose.connect(
		`mongodb+srv://${config.DB_USER || 'admin'}:${config.DB_PASS || 'admin'}@cluster0.opnyh.mongodb.net/fixerapi`,
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