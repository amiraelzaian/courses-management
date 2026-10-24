

import type{ Request, Response,error, NextFunction } from "express";

export function errorHandler(err:error,req:Request,res:Response,next:NextFunction){
    console.error(err);
    if(res.headersSent)return next(err);

    res.status(500).json({
        success:false,
        message:err.message || "Internal Server Error"  ,
    })
}