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

let uniqueId = 1;
//props come from yargs command builder
function addTodo(uniqueId, todoBody, todoStatus){
    
    saveData({ id: uniqueId, todo:todoBody, status: todoStatus})
    ;
}

yargs.command({
    command: "add",
    describe: "add a todo",
    //building will help to read the [3] and [4] of each new todo
    builder: {
        id: {
            describe: "unique id of the task",
            demandOption: false,
            type: "number",
            default: uniqueId, 

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
    handler: function({id, todo, status}){
        addTodo(id, todo, status)
        uniqueId ++;
        console.log(chalk.green("New event added"))
        
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
        for (let {todo, status} of todos){
            if(args.status === "all"){
                console.log(chalk.blue(todo), chalk.yellow(status))
            } else if (status===args.status)
                console.log(chalk.blue(todo), chalk.yellow(status))
    }
    }
})

yargs.command({
    command: "delete",
    describe: "delete a todo",
    builder: {
        todo: {
            describe: "content of todo",
            demandOption: true,//is it required?
            type: "string",
        },
        status: {
            describe: "status of your todo",
            demandOption: false,
            type: "boolean",
            default: false,
        }
    },
    handler: function ({ todo, status }) {
        addTodo(todo, status)
        console.log(chalk.green("New event added : ", todo))

    }
})
yargs.parse()
//use ID to update the value of the todo