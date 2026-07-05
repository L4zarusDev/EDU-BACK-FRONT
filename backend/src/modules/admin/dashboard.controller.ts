import { Request, Response } from "express";

import { getDashboard } from "./dashboard.service";

export async function dashboard(
    req:Request,
    res:Response
){

    try{

        const data=await getDashboard();

        return res.json(data);

    }catch(error:any){

        return res.status(500).json({

            message:error.message

        });

    }

}