import expressLoader from "./express";
import type { Express } from "express";
import mongoose from "./mongoose";

export default async function({app}:{app:Express}){
    await expressLoader({app})
    console.log('express loaded')

    await mongoose()
    console.log('database connected')
}



