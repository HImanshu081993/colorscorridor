var express=require('express');
var nodeapp=express();
var bodyParser=require('body-parser');
var config=require("./DBconfig");
var sql=require("mssql");
var nodeapp = express();
//app.use(express.static('public/Admin'));

nodeapp.use(bodyParser.json());
nodeapp.use(bodyParser.urlencoded({extended:true}));

function closeSQL()
{
    sql.close(function(){
       console.log("Connection is closed.."); 
    });
}

nodeapp.get("/colorsget",function(req,res,next){
 var colors=['himanshu','jain'];
    res.send(colors);
});

nodeapp.post("/Login",function(req,res,next){
   closeSQL();
    sql.connect(config).then(pool=>{
       return pool.request()
        .input('Email',sql.NVarChar(255), req.body.EmailId)
        .execute('spGetAdminDetails')
    }).then(result=>{
        console.log(result); 
        res.send(result);
}).catch(err=>{
        console.log(err);
    });   
    
});

// Footer API

nodeapp.post("/AddFooter",function(req,res,next){
    var query="insert into dbo.CCFooter(CreatedBy,FooterName,FooterURL,FooterId) values('"+req.body.CreatedBy+"','"+req.body.FooterName+"','"+req.body.FooterURL+"',"+req.body.FooterId+")";   
    sql.close(function (){
        console.log("connection6 closed");
    });
    sql.connect(config,function(err){
        if(err)
            {
                console.log(err);
            }
        else
            {
                var request= new sql.Request();
                request.query(query,function(err,recordset){
                    if(err)
                        console.log(err);
                    res.send("Data saved Successfully..");
                    
                });
            }         
        
    });
});

nodeapp.get("/getFooter",function(req,res,next){
   sql.close(function () 
    {
        console.log("connection6 closed");
    });
    sql.connect(config,function(err){
        if(err)
            {
                console.log(err);
            }
        else
            {
                var request= new sql.Request();
                request.query("select * from dbo.CCFooter where ProjectStatus=1",function(err,recordset){
                    if(err)
                        console.log(err);
                    res.send(recordset);
                    
                });
            }         
        
    });
    
//    var query="select * from dbo.CCFooter where ProjectStatus=1;";
//    executeQuery(query,res);
});

nodeapp.put("/footerDelete",function(req,res,next){
   sql.close(function () 
    {
        console.log("FooterClose");
    });
    sql.connect(config,function(err){
        if(err)
            {
                console.log(err);
            }
        else
            {
                var request= new sql.Request();
                var query1="UPDATE dbo.CCFooter set ProjectStatus=0 where FooterId="+req.body.FooterId+"";
                console.log(query1);
                request.query(query1,function(err,recordset){
                    if(err)
                        {
                             console.log(err);
                        }
                    else                        
                        {
                            res.send("Delete Successfully...");                              
                        }
                       
                   
                    
                });
            }         
        
    });    
   });

//Menu API
nodeapp.post("/AddMenu",function(req,res,next){
   closeSQL();
    sql.connect(config).then(pool=>{
       return pool.request()
        .input('MenuName',sql.NVarChar(255), req.body.Name)
        .input('MenuURL',sql.NVarChar(255), req.body.URL)
        .input('ParentId',sql.Int, req.body.ParentId)
        .input('Level',sql.Int, req.body.MenuLevel)
        .execute('spInsertMenu')
    }).then(result=>{       
        res.send(result);
}).catch(err=>{
        console.log(err);
    });   
});

nodeapp.get("/getMenu",function(req,res,next){
    closeSQL();
    sql.connect(config).then(pool=>{
       return pool.request()       
        .execute('spGetMenuDetails')
    }).then(result=>{       
        res.send(result);
}).catch(err=>{
        console.log(err);
    });   
});

nodeapp.put("/Update",function(req,res,next){
      closeSQL();
    sql.connect(config).then(pool=>{
       return pool.request()
        .input('MenuName',sql.NVarChar(255), req.body.MenuName)
        .input('MenuUrl',sql.NVarChar(255), req.body.MenuURL)
        .input('Id',sql.Int, req.body.Id)
        .execute('spUpdateMenu')
    }).then(result=>{       
        res.send(result);
}).catch(err=>{
        console.log(err);
    }); 
});


nodeapp.use(express.static('public'));

nodeapp.use((req,res)=>{
    res.sendFile(__dirname+'/public/index.html');
});

nodeapp.listen(8081,(err)=>{
    if(err){
        console.log(err);
    }else{
        console.log('Server started');
    }
})