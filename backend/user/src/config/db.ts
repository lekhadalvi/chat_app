import mongoose from 'mongoose';

const connectDB = async () => {
    const primaryUri = process.env.MONGO_URI;
    const localUri = "mongodb://127.0.0.1:27017/chat_app";

    if (primaryUri) {
        try {
            console.log("Connecting to primary MongoDB URI...");
            const conn = await mongoose.connect(primaryUri, {
                serverSelectionTimeoutMS: 4000,
            });
            if (conn) {
                console.log("✅ Successfully connected to MongoDB");
                return;
            }
        } catch (error: any) {
            console.warn(`⚠️ Primary MongoDB connection failed (${error.message}). Attempting local fallback...`);
        }
    }

    try {
        console.log(`Connecting to local MongoDB (${localUri})...`);
        const localConn = await mongoose.connect(localUri, {
            serverSelectionTimeoutMS: 4000,
        });
        if (localConn) {
            console.log("✅ Successfully connected to local MongoDB (Docker/127.0.0.1:27017)");
        }
    } catch (localError: any) {
        console.error("❌ Failed to connect to local MongoDB:", localError.message);
    }
};

export default connectDB;