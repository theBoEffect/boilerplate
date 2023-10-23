import mongoose, { ConnectOptions } from 'mongoose';

let i = 0;
const connect = {
    connectOptions(): ConnectOptions {
        return {
            connectTimeoutMS: 10000
        };
    },
    async create(mongoConnect: string): Promise<any> {
        try {
            mongoose.set('strictQuery', true);
            let mongoOptions = this.connectOptions();
            console.error(`mongo connecting - try: ${i}`);
            i++;
            await mongoose.connect(`${mongoConnect}?authSource=admin`, mongoOptions);
            return console.info('connected');
        } catch (err) {
            console.error(`******** DB attempted and failed:  ${mongoConnect} ********`);
            console.error(err);
            console.error('Retrying Connection');
            if (i < 20) return connect.create(mongoConnect);
            console.info('Retry limit for connection attempts hit. Ending process');
            return process.exit(1);
        }
    }
};

export default connect;
