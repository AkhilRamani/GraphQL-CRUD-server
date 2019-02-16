import * as jwt from "jsonwebtoken";
import { has } from 'lodash';
import User from './user.model';

export const authenticate = async ( context: any ) => {
    let token = has(context.headers, "auth")
                    ? context.headers.auth
                    : null, payload;
    try{
        payload = jwt.verify(token, 'akhil' );
        let user = await User.findOne({
                    '_id': payload._id,
                    tokens: token
                });
        if(!user) throw new Error('Authentication failed');
        return user;
    }
    catch{
        throw new Error('Authentication failed');
    }
} 