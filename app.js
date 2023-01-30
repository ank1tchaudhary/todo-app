
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongo = require("mongoose");
const { default: mongoose } = require("mongoose");
mongo.connect("mongodb://127.0.0.1:27017/TodoApp");


const listSchema = {
  name : String,
  items : []
};

const List = mongo.model("List",listSchema);


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const items = [];
app.get("/", function(req, res) {
  const day = date.getDate();

  List.findOne({name : 'Today'},(err,data)=>{
    if(!err){
      if(!data){
        const list = new List({
          name : 'Today',
          items : []
        });
  
        list.save();
        res.redirect("/Today");
      }else{
        res.render("list", {listTitle: "Today", newListItems: data}); 
      }
    }

})

 

});

app.post("/", function(req, res){

  const itemData = req.body.newItem;

  const list = new List({
    name : req.body.list,
    items : [itemData]
  });

  List.findOne({name : req.body.list},(err,listData) => {
    if(!err){
      listData.items.push(itemData);
      listData.save();
      res.redirect("/"+req.body.list);
  }
  });
});


app.post("/delete",(req,res)=>{
 let data = req.body.check.split("@");
 console.log("Data : ",data);

List.findOne({name : data[1]},(err,listData) => {
  if(!err){
    if(listData){
    
      listData.items.pop(data[0]);
      listData.save();
    
    res.redirect("/"+data[1]);
  }
  }
})
});


app.get("/about", function(req, res){
  res.render("about");
});



app.get("/:customList",(req,res)=> {
  const listName= req.params.customList;
  if (listName != "favicon.ico") {
  List.findOne({name : listName},(err,listData) => {
    if(!err){
      if(!listData){
      const list = new List({
        name : listName,
        items : []
      });
      console.log("Saving : ", list);
      list.save();
      res.redirect("/"+listName);
    }else{
      console.log("Showing else : ",listData)
      res.render("list", {listTitle: listName, newListItems: listData});
    }
  }
  })
}
  
});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});


