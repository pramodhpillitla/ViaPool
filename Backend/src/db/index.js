import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI, {
            dbName : process.env.DB_NAME
        })
        console.log("MONGODB CONNECTED SUCCESSFULLY!!");
    } catch (error) {
        console.log(`MONGODB CONNECTION FAILED: ${error.message}`);
        process.exit(1);
    }
}