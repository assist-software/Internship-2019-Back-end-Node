const express =require("express")
const bodyParser=require("body-parser")
const passport=require("passport")
var routes=require('./routes/routes')
const app=express()
const port=3000
const pass=require('./authentication/authentication');
const modelRole=require("./models/role")
const modelUser=require("./models/user")
const db=require("./db")



app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(passport.initialize())
app.use(passport.session())




app.use("/",routes)

db.sync().then(
  async ()=>{
    await modelRole.insertDefaultRoles()
    await modelUser.insertDefaultUser()
    app.listen(port,()=>console.log(`The app is listen on port ${port}`))
  }
)
