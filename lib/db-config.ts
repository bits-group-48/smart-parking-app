import mongoose from "mongoose";

export async function connect() {
    try {
        await mongoose.connect(process.env.MONGODBURI!, {
            dbName: "smartParking", 
        });

        const connection = mongoose.connection;

        connection.on("connected", () => {
            console.log("Mongoose connected to DB");
        });

        connection.on("error", (err) => {
            console.error("Mongoose connection error:", err);
            process.exit(1);
        });
    } catch (error) {
        console.error("Something went wrong while connecting to DB:", error);
        process.exit(1);
    }
}
