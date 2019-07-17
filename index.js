const express =require("express")
const bodyParser=require("body-parser")
const passport=require("passport")
const routes=require('./routes/routes')
const app=express()
const port=3000
const pass=require('./authentication/authentication');
const modelRole=require("./models/role")
const modelUser=require("./models/user")
const modelMovies=require("./models/movie")
const modelCategory=require("./models/category")
const db=require("./db")
const protectedRoutes=require("./routes/protectedRoutes")
const cors=require("cors")
const UnionTable=require("./models/UnionTable")


//Cors and initialization for passport and body-parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(passport.initialize())
app.use(cors())

//Routes
app.use("/",routes)
app.use("/api",passport.authenticate("jwt",{session:false}),protectedRoutes)


// Creating relationship one: one
modelUser.belongsTo(modelRole, {foreignKey: 'roleId'})

// Creating relationship many:many
modelMovies.belongsToMany(modelCategory, {through: UnionTable})
modelCategory.belongsToMany(modelMovies, {through: UnionTable})

db.sync().then(
     async()=>{ 
     await modelRole.insertDefaultRoles()
     await modelUser.insertDefaultUser()
     await modelCategory.insertDefaultcategory()
    app.listen(port,()=>console.log(`The app is listen on port ${port}`))
     }
)
