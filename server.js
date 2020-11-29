const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const connectDB = require("./config/db");

connectDB();
app.use("/api/users",require("./routes/api/users.js"))
app.use("/api/auth",require("./routes/api/auth.js"))
app.use("/api/posts",require("./routes/api/posts.js"))
app.use("/api/profile",require("./routes/api/profile.js"))

app.listen(port,()=> console.log(`server started on port ${port}`));
app.get('/',(req,res)=>res.send('API running'));