import mongoose from 'mongoose';

 const connectDB = async () => {
    try {
       const MONGO = process.env.MONGO_URI as string;
        
        const connection = await mongoose.connect(MONGO);
        if (connection) {
            console.log("sucessfully conected to mongo db");
        }
        else {
            console.log("error in connection");
        }


    } catch (error:any) {
        console.log(`error in db ${error.message}`);
    }
}

export default connectDB;