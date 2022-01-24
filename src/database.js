import mongoose from 'mongoose'

// MongoDB Connection
// mongoose.set('useCreateIndex', true);

try {
	mongoose.connect(
		`mongodb+srv://${process.env.DB_USER || 'admin'}:${process.env.DB_PASS || 'admin'}@cluster0.opnyh.mongodb.net/fixerapi`,
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