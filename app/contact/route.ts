import { NextResponse } from "next/server";
export async function POST(request:Request){
    const {name,email,message}=await request.json()
    console.log('Form Data',{name,email,message})
    return NextResponse.json({message:'Form is submitted Successfully....'})

}