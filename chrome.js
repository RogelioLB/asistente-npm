const defaultB = require("x-default-browser");
let path;
defaultB((err,res)=>{
    switch(res.commonName){
        case 'chrome':
            path = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
            break;
        case 'firefox':
            path = "C:\\Program Files (x86)\\Mozilla Firefox\\firefox.exe";
            break;
        case 'unknown':
            path = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
            break;
        default:
            path = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
            break;
    }
})
const cp = require("child_process");
const ck = require("chalk");
const request = require("request-promise-native");
const cheerio = require("cheerio");
const inquirer = require("inquirer");
const prompt = inquirer.createPromptModule();
const yt = require("ytdl-core");

async function obtenerVideos(query){
    let link=[];
    query = query.split(" ").join("+");
    await request(`https://www.google.com/search?tbm=vid&q=${query}`,(err,res,body)=>{
        const $ = cheerio.load(body);
        $("a").each(async(i,e)=>{
            if(e.attribs.href.includes("youtube.com/watch")){
                const l = decodeURIComponent(e.attribs.href.replace("/url?q=","").split("&")[0]);
                await link.push(`${l} | ${ck.blue((await yt.getBasicInfo(l)).videoDetails.title)}`);
            }
        })
    })
    return link;
}

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

async function spawnYT(query){
    const link = await (await obtenerVideos(query));
    link.push("Salir");
    console.log("Buscando videos...")
    await setTimeout(()=>{
        prompt([{message:"Que quieres escoger?",type:"list",choices:link.filter(onlyUnique),name:"Opciones"}]).then(res=>{
            if(res.Opciones == "Salir"){
                return;
            }else{
            cp.spawn(path,[res.Opciones.split("|")[0]],{
                    stdio:"ignore",detached:true
            }).unref();
        }
        })
    },8000)
}
async function spawnLink(query){
    const link = await (await obtenerLink(query));
    link.push("Salir")
    console.log("Buscando links...")
    await setTimeout(()=>{
        prompt([{message:"Que quieres escoger?",type:"list",choices:link.filter(onlyUnique),name:"Opciones"}]).then(res=>{
            if(res.Opciones == "Salir"){
                return;
            }else{
                cp.spawn(path,[res.Opciones.split("|")[0]],{
                    stdio:"ignore",detached:true
                }).unref();
            }
        })
    },8000)
}

async function obtenerLink(query){
    let link=[];
    query = query.split(" ").join("+");
    await request(`https://www.google.com/search?q=${query}`,(err,res,body)=>{
        const $ = cheerio.load(body);
        $("a").each(async(i,e)=>{
            if(!e.attribs.href.includes("google")&&!e.attribs.href.includes("img")){
                if(e.attribs.href.includes("https://")){
                    const l = decodeURIComponent(e.attribs.href.replace("/url?q=",""));
                    link.push(`${l.split("&")[0]} | ${ck.blue($(e).text())}`)
                }
            }
        })
    })
    return link;
}


module.exports = {spawnYT,spawnLink};