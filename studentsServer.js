let express =require("express");
let app = express();
app.use(express.json());
app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin","*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, OPTIONS, PATCH, DELETE, HEAD"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});
var port = process.env.PORT || 2410;
app.listen(port,()=>console.log(`Listening on port ${port}!`));

let {studentsData} =require("./studentsData.js");

let fs=require("fs");
let fname="students.json";

app.get("/svr/resetData",function(req,res){
    let data=JSON.stringify(studentsData);
    fs.writeFile(fname,data,function(err){
        if(err) res.status(404).send(err);
        else res.send("Data in File is reset");
    });
});

app.get("/svr/students",function(req,res){
    fs.readFile(fname,"utf-8",function(err,data){
        if(err) res.status(404).send(err);
        else{
            let dataArr=JSON.parse(data);
            res.send(dataArr);
        }
    })
})

app.get("/svr/students/:id",function(req,res){
    let id= +req.params.id;
    fs.readFile(fname,"utf-8",function(err,data){
        if(err) res.status(404).send(err);
        else{
            let dataArr=JSON.parse(data);
            let student=dataArr.find(stud=>stud.id===id);
            if(student)
            res.send(student);
            else
            res.status(404).send("Id not available");
        }
    });
});

app.get("/svr/students/course/:name",function(req,res){
    let name= req.params.name;
    fs.readFile(fname,"utf-8",function(err,data){
        if(err) res.status(404).send(err);
        else{
            let dataArr=JSON.parse(data);
            let filterStudents=dataArr.filter(stud=>stud.course==name);
            res.send(filterStudents);
        }
    });
});

app.post("/svr/students",function(req,res){
    let body=req.body;
    fs.readFile(fname,"utf-8",function(err,data){
        if(err) res.status(404).send(err);
        else
        {
            let dataArr=JSON.parse(data);
            let maxid=dataArr.reduce((acc,cur)=>cur.id>acc?cur.id:acc ,0);
            maxid = +maxid;
            let newid=maxid+1;
            let newStudent={...body,id:newid}
            dataArr.push(newStudent)
            let data1=JSON.stringify(dataArr);
            fs.writeFile(fname,data1,function(err){
                if(err) res.status(404).send(err);
                else
                res.send(newStudent);
            });

        }
    });
});

app.put("/svr/students/:id",function(req,res){
    let body=req.body;
    let id = +req.params.id;
    fs.readFile(fname,"utf-8",function(err,data){
        if(err) res.status(404).send(err);
        else
        {
            let dataArr=JSON.parse(data);
            let index=dataArr.findIndex(st=>st.id===id);
            if(index>=0)
            {
                let updatedStudent={...dataArr[index],...body};
                dataArr[index]=updatedStudent;
                let data1=JSON.stringify(dataArr);

                fs.writeFile(fname,data1,function(err){
                if(err) res.status(404).send(err);
                else
                res.send(updatedStudent);
                });
            }
            else
            {
                res.status(404).send("Student not found");
            }  
        }
    });
});

app.delete("/svr/students/:id",function(req,res){
    let id = +req.params.id;
    fs.readFile(fname,"utf-8",function(err,data){
        if(err) res.status(404).send(err);
        else
        {
            let dataArr=JSON.parse(data);
            let index=dataArr.findIndex(st=>st.id===id);
            if(index>=0)
            {
                let deletedStudent=dataArr.splice(index,1);
                let data1=JSON.stringify(dataArr);

                fs.writeFile(fname,data1,function(err){
                if(err) res.status(404).send(err);
                else
                res.send(deletedStudent);
                });
            }
            else
            {
                res.status(404).send("Student not found");
            }  
        }
    });
});
//console.log(studentsData);