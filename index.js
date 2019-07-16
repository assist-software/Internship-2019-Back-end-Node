const express =require("express")
const bodyParser=require("body-parser")
const passport=require("passport")
const routes=require('./routes/routes')
const app=express()
const port=3000
const pass=require('./authentication/authentication');
const modelRole=require("./models/role")
const modelUser=require("./models/user")
const db=require("./db")
const protectedRoutes=require("./routes/protectedRoutes")
const cors=require("cors")

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(passport.initialize())
app.use(cors())


app.use("/",routes)
app.use("/api",passport.authenticate("jwt",{session:false}),protectedRoutes)

db.sync().then(
  async ()=>{
    await modelRole.insertDefaultRoles()
    await modelUser.insertDefaultUser()
    app.listen(port,()=>console.log(`The app is listen on port ${port}`))
  }
)
