const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const customerRoutes = require("./routes/customerRoutes");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/customers", customerRoutes);

app.get("/", (req, res)=>{
    res.send("API is running");
});

mongoose
    .connect(process.env.MONGO_URI)
    .then(()=> {
        console.log("MongoDB connected");
        app.listen(process.env.PORT, ()=>{
            console.log("Server is running on PORT:", process.env.PORT);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection Failed:", error);
    })

