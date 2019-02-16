import User,{ Usermodel } from './user.model';
import { authenticate } from './user.utils'

class UserResolver {

    getAll = async ( parent, args,  context ) => {
        await authenticate( context );
        return User.find().then((users)=> users);
    };

    getUser = async (parent, args, context) => {
        let user = await authenticate( context );
        return user;
    }

    loginUser = async (parent, args, context) => {
        console.log(args.data)
         const userExists = await User.findOne({ email: args.data.email});
         if(!userExists) throw new Error(`No such user found`);
         if(args.data.password !== userExists.password) throw new Error(`Password not match`);
         
         let token = await userExists.generateAuthToken()
         return { email: userExists.email, token, id:userExists._id };
    }

    createUser = async (parent, args) => {
        const userExists = await User.findOne({ email: args.data.email})
        if (userExists) throw new Error(`User with email ${args.data.email} already exists`);

        let user = new User({
            firstName: args.data.firstName,
            lastName: args.data.lastName,
            email: args.data.email,
            password: args.data.password
        })

        let token = await user.generateAuthToken()
        return {email: user.email, token};
    }

    logoutUser = async (parent, args, context) => {
        let user = await authenticate( context );
        return User.findByIdAndUpdate({
                    _id: user._id
                },{
                    $pull: {
                        tokens: context.headers.auth
                    }
                }).then(() => {
                    return { status: 'ok'}
                }).catch(() => { throw new Error()})
    }
}

export const userResolver = new UserResolver;