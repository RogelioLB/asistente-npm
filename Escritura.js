function Escritura(){
    console.clear();
    const say = require("say");
    const chrom = require("./chrome");
    const inquirer = require("inquirer");
    const ck = require("chalk");

    var prompt = inquirer.createPromptModule();

    prompt({type:"input",name:"type",message:"Que quiere que haga?"}).then(async res=>{
        if(res.type.toLowerCase().includes("reproducir")){
            let query = res.type.toLowerCase().replace("reproducir","");
            await chrom.spawnYT(query);
            console.log(ck.red("\n\nDebera esperar 30 segundos para usarla de nuevo."));
            setTimeout(Escritura,38000);
        }
        else if(res.type.toLowerCase().includes("salir")){
            console.log(ck.blueBright("Que tenga un buen dia."));
            process.exit(0);
        }
        else if(res.type.toLowerCase().includes("investigar")){
            let query = res.type.toLowerCase().replace("investigar","");
            await chrom.spawnLink(query);
            console.log(ck.red("\n\nDebera esperar 30 segundos para usarla de nuevo."));
            setTimeout(Escritura,38000);
        }
        else{
            setImmediate(Escritura);
        }
    })
}

module.exports = Escritura;