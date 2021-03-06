//Read all the comands from the terminal, will return an argument
// console.log(process.argv)
//Do something based on the commands (add /read todos)

//function to read/write data
const fs = require('fs');//
const chalk = require('chalk');//chalk library for terminal colors
const yargs = require('yargs');//helps build interactive command line tools by parsing arguments 

//Load the file and return an object
function loadData(){
    //read the file from system using fs
    const buffer = fs.readFileSync('database.json')
    //convert the incoming file to a string
    const data = buffer.toString()
    //convert the string to a js object
    return JSON.parse(data)
}
loadData()

function saveData(todo){
    //todo should be an object
    console.log("this is data", todo)
    //read the excisting data. returns array of excisting
    let data = loadData()
    //make changes
    data.push(todo)
    //save changes
    fs.writeFileSync('database.json', JSON.stringify(data))
}


//props come from yargs command builder
function addTodo(todoBody, todoStatus){
    let data = loadData()
    if (data.length === 0) {
        todoId =1
    } else if (data.length > 0) {
        todoId = data[data.length-1].id+1
    }
    saveData({ id:todoId, todo:todoBody, status: todoStatus});
    console.log(chalk.green("New event added"))
}

function deleteTodo (todoId) {
    let data = loadData();
    let filteredtodos = data.filter((data)=>data.id !== todoId);
    fs.writeFileSync('database.json', JSON.stringify(filteredtodos))
    console.log(chalk.blue(`Task ${todoId} has been deleted`))
}

function deleteAll(){
    fs.writeFileSync('database.json', JSON.stringify([]))
}

function deleteStatus(bool){
    let data = loadData();
    let filteredtodos = data.filter((data) => data.status !== bool);
    fs.writeFileSync('database.json', JSON.stringify(filteredtodos))
    console.log(chalk.blue("Tasks has been deleted"))
}

yargs.command({
    command: "add",
    describe: "add a todo",
    //building will help to read the [3] and [4] of each new todo
    builder: {
        todoId: {
            describe: "Id of todo",
            demandOption: false,//is it required?
            type: '',
        },
        todo: {
            describe: "content of todo",
            demandOption: true,//is it required?
            type:"string",
        },
        status: {
            describe: "status of your todo",
            demandOption: false,
            type: "boolean",
            default: false,
        }
    },
    handler: function({todo, status}){
        addTodo( todo, status)      
    }
})

yargs.command({
    command: "list",
    describe: "list of todos",
    builder: {
        status:{
            describe: "todo status",
            type: "boolean",
            demandOption: false,
            default: "all"
        }
    },
    handler: function (args) {
        const todos = loadData();
        for (let {id, todo, status} of todos){
            if(args.status === "all"){
                console.log(chalk.red(id), chalk.blue(todo), chalk.yellow(status))
            } else if (status===args.status)
                console.log(chalk.red(id), chalk.blue(todo), chalk.yellow(status))
    }
    }
})

yargs.command({
    command: "delete",
    describe: "delete a todo",
    builder: {
        id: {
            describe: "id of todo",
            demandOption: false,//is it required?
            type: "integer",
        },
        status: {
            describe: "status of your todo",
            demandOption: false,
            type: "string"
        },
        all: {
            describe: "status of your todo",
            demandOption: false,
            type: "boolean",
            default: false,
        }
    },
    handler: function ({ id, all, status }) {
        if(id){
            deleteTodo(id)
        } else if (status){
            if(status==="complete") deleteStatus(true) 
            else if (status ==="incomplete") deleteStatus(false)
        } else if (all){
            deleteAll()
        } else {
            console.log("Enter a proper command")
        }
    }
})
yargs.parse()
//use ID to update the value of the todo