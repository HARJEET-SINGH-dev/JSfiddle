import { createClient } from "redis";
import fs from 'fs'
import { idText } from "typescript";
import { file } from "bun";
import { spawn } from "child_process";
import { prisma } from "./db";

const client = createClient();
client.connect()
    .then(async ()=>{
        while(1){
            const response = await client.rPop('problems');
            if(!response){
                await new Promise((r) => setTimeout(r , 1000))
                continue;
            }

            const parsedResponse = JSON.parse(response);
            const code = parsedResponse.code;
            const language = parsedResponse.language;
            const submissionId = parsedResponse.submissionId

            console.log("Processing question for user" + parsedResponse.userId)
            let finalOutput = "";

            if(language == 'cpp'){
                const filePath = __dirname + "/code/a.js";
                console.log("running users' C++ code");
                fs.writeFileSync(filePath , code);
                spawn("g++" , [filePath , "-o" , "./code/out"])
                await new Promise((r) => setTimeout(r , 2000));
                const response = spawn('node' , [filePath])
                response.stdout.on("data" , (chunk)=>{
                    finalOutput += chunk.toString();
                })

                await new Promise<void>(resolve=>{
                    response.on("exit" , ()=>{
                        prisma.submission.update({
                            where : {
                                id : submissionId
                            },
                            data : {
                                status : "Success",
                                output : finalOutput
                            }
                        })
                    })
                    resolve();
                })


            }
    

            //update the DB
        }
    });