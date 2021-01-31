#! /usr/bin/env node
const Escuchar = require("./Audio");
const Escritura = require("./Escritura");
const inquirer = require("inquirer");

var prompt = inquirer.createPromptModule();

prompt({type:"list",choices:["Teclado","Audio"],message:"Escoga una forma de uso: ",name:"opc"}).then(res=>{
    if(res.opc === "Teclado") Escritura();
    if(res.opc === "Audio") Escuchar();
})