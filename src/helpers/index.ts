import crypto from 'crypto'

const SECRET='JOHNLEE-REST-API'
//console.log(SECRET)
export const authentication=(salt:string,password:string)=>{
    return crypto.createHmac('sha256', [salt, password].join('/')).update(SECRET).digest('hex');
}

//console.log(authentication('123','aws'))

export const random = () => crypto.randomBytes(128).toString('base64');
