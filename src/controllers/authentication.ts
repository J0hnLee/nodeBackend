import express from 'express'
import { getUserByEmail, createUser } from '../db/users';
import { authentication, random } from '../helpers';

export const login= () => {}

export const register= async(req:express.Request,res:express.Response) => {
    try {
        const {username,email,password}=req.body;
        if (!username||!email||!password){
            return res.sendStatus(400);
        }   
        const existingUser= await getUserByEmail(email);
        if (existingUser){
            return res.sendStatus(404);
        }

        const salt= random();
        const user = createUser({
            username,
            email,
            authentication:{
                salt,
                password:authentication(salt,password)
            }
        })
        //console.log(user)
        //console.log(res.status(200).json({"name":req.body.username,"email":req.body.email, "user":user}))
        //console.log(res.status(200).json(user))
        //console.log(user)

        return res.status(200).json().end()

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
      }


};


