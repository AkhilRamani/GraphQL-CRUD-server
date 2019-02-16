import * as mongoose from 'mongoose';
import * as jwt from 'jsonwebtoken';

export interface Usermodel extends mongoose.Document {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    tokens: Array<string>,
    generateAuthToken
}

const UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    tokens: [String]
});

UserSchema.methods.generateAuthToken = function() {
    let user = this;
    let token = jwt.sign({ _id: user._id.toHexString()}, 'akhil').toString();

    user.tokens.push(token);
    return user.save().then(()=> token );
}

export default mongoose.model<Usermodel>('User-GraphQL', UserSchema);