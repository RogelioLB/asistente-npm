function Escuchar(){
    console.clear();
    const say = require("say");
    const vr = require("voice-recognition");
    const chrom = require("./chrome");
    const inquirer = require("inquirer");
    const ck = require("chalk");

    var prompt = inquirer.createPromptModule();


        console.log("Que quiere que haga?");
        const recognizer = new vr.vr("es-ES");
        recognizer.sameThread = true;
        recognizer.listen();

        recognizer.on( "vc:detected", ( audio ) => {
            console.log( "Audio!" );
        })
        recognizer.on( "vc:recognized", async( result ) => {
            console.log( ck.green(result.Text) );
            var text = result.Text;
            if(text.toLowerCase().includes("reproducir")){
                recognizer.stop();
                let reproduccion = text.toLowerCase().replace("reproducir","");
                var texto = "Reproducir"+reproduccion;
                console.log(ck.greenBright(texto+"?"));
                say.speak("Quieres reproducir "+reproduccion+"?");
                prompt([{type:"confirm",name:"confirm",message:"Este es lo que quieres buscar?"}]).then(async res=>{
                    if(res.confirm == true){
                        say.speak("Reproduciendo"+reproduccion);
                        await chrom.spawnYT( `${reproduccion}`);
                        console.log(ck.red("\n\nDebera esperar 30 segundos para usarla de nuevo."));
                        setTimeout(Escuchar,38000);
                    }else{
                        prompt([{type:"input",name:"name",message:"Ingrese el resultado a desear: "}]).then(async res=>{
                            texto = "Reproduciendo" + res.name;
                            say.speak(texto);
                            await chrom.spawnYT( `${res.name}`);
                            console.log(ck.red("\n\nDebera esperar 30 segundos para usarla de nuevo."));
                            setTimeout(Escuchar,38000);
                        })
                    }
                });
            }
            else if(text.toLowerCase().includes("salir")){
                console.log(ck.blueBright("Que tenga un buen dia."));
                process.exit(0);
            }
            else if(text.toLowerCase().includes("investigar")){
                let query = text.toLowerCase().replace("investigar","");
                chrom.spawnLink(query);
                console.log(ck.red("\n\nDebera esperar 30 segundos para usarla de nuevo."));
                setTimeout(Escuchar,38000);
            }
            else{
                return;
            }
        })
}


module.exports = Escuchar;