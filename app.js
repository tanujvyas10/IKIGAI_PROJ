var express= require("express")
var app=express();
var port=process.env.PORT || 8080;
var bodyParser=require("body-parser")
var methodOverride=require("method-override");
var mongoose=require("mongoose")

app.set("view engine","ejs")
app.use(methodOverride("_method"));

mongoose.connect("mongodb://localhost/ikigai_data");
var randomstring=require("randomstring")
var Inputs=require("./models/inputs")
app.use(bodyParser.urlencoded({extend:true}));
app.use(express.static("public"))


app.get("/",(req,res)=>{
    res.render("ikigai/ikigai_homepage")
})



app.get("/ikigai_form",(req,res)=>{
    res.render("ikigai/ikigai_form");
})


app.get("/records",(req,res)=>{
    Inputs.find({},(err,data)=>{
        if(err)
        {
            console.log(err)

        }

        res.render("ikigai/record",{data:data})
    })
})

/***************+++++SHOWING  THE IKIGAI OF A PARTICULAR PERSON+++++********** */
app.get("/person/:id/detail",(req,res)=>{
    Inputs.findById(req.params.id,(err,data)=>{
        if(err)
        {console.log(err)
            res.redirect("/")
        }

        res.render("ikigai/show_ikigai",{data:data})
    })
})



app.get("/person/:id/edit",(req,res)=>{
    Inputs.findById(req.params.id,(err,data)=>{
        if(err)
        {console.log(err)
            res.redirect("/")
        }

        res.render("ikigai/ikigai_formEdit",{data:data})
    })
})


app.post("/person/:id/editingRouting",(req,res)=>{
    Inputs.findById(req.params.id,(err,data)=>{
    if(data.secretKey==req.body.secretKey)
    {
        res.render("ikigai/ikigai_formEdit",{data:data});
    }
    else{
        console.log("UNauthorized")
        res.redirect("/")
    }
    })
})
/***************+++++UPDATE THE IKIGAI+++++********** */
app.put("/person/:id",(req,res)=>{

   
           Inputs.findByIdAndUpdate(req.params.id,req.body.data,function(err,updatedData){
                if(err)
                {
                    res.redirect("/")
                }
                else{
                    console.log(updatedData)
                    res.redirect("/records");
                }
            })
              

 
})

/***************+++++DELETE THE IKIGAI+++++********** */
app.delete("/person/:id/delete",(req,res)=>{
    Inputs.findById(req.params.id,(err,foundData)=>{
        if(foundData.secretKey===req.body.secretKey)
        {
            Inputs.findByIdAndRemove(req.params.id,function(err){
                if(err)
                {
                    console.log(err)
                }
                else{
                    res.redirect("/records")
                }
            })

        }
        else{
            res.redirect("/")
        }
    })

})

/***************+++++CREATE THE IKIGAI+++++********** */
app.post("/ikigai_inputData",function(req,res){
    
   
  
    var name=req.body.name;
  var love=req.body.love;
  var good=req.body.good;
  var paid=req.body.paid;
  var need=req.body.need;
  var secretKey=req.body.secretKey;
  
  
  var obj={name:name,love:love,good:good,paid:paid,need:need,secretKey:secretKey};
  
  Inputs.create(obj,(err,data)=>{
      if(err)
      {
          console.log(err)
          res.redirect("/")
          return;
      }

      console.log("data is saved")
      console.log(data)
      res.render("ikigai/ikigai_done",{data:data})


  })
  
  })

app.get("/person/:id/edit_verify",(req,res)=>{
    Inputs.findById(req.params.id,(err,data)=>{
        if(err)
        {
            console.log(err)
            res.redirect("/")
            return;
        }

        res.render("verify/edit_verify",{data:data})
    })
   
})

app.get("/person/:id/delete_verify",(req,res)=>{
    Inputs.findById(req.params.id,(err,data)=>{
        if(err)
        {
            console.log(err)
            res.redirect("/")
            return;
        }

        res.render("verify/delete_verify",{data:data})
    })
})



app.listen(port,function(){
    console.log("started...")
})
