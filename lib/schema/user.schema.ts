import { graphql, GraphQLScalarType } from 'graphql';
import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLSchema,
    GraphQLList,
    GraphQLInputObjectType,
    GraphQLNonNull
} from 'graphql';
import User,{ Usermodel } from '../model/user.model';


const UserType = new GraphQLObjectType({
    name: 'User',
    fields: ()=> ({
        id: { type: GraphQLID},
        firstName: { type: GraphQLString},
        lastName: { type: GraphQLString},
        email: { type: GraphQLString},
        password: { type: GraphQLString}
    })
})

const CreateUser = new GraphQLInputObjectType({
    name: 'CreateUser',
    fields: {
        firstName: { type: new GraphQLNonNull(GraphQLString)},
        lastName: { type: new GraphQLNonNull(GraphQLString)},
        email: { type: new GraphQLNonNull(GraphQLString)},
        password: { type: new GraphQLNonNull(GraphQLString)}
    }
})

const LoginUser = new GraphQLInputObjectType({
    name: 'LoginUser',
    fields: {
        email: { type: new GraphQLNonNull(GraphQLString)},
        password: { type: new GraphQLNonNull(GraphQLString)},
    }
})

const GetUser = new GraphQLObjectType({
    name: 'GetUser',
    fields: {
        email: { type: GraphQLString},
        id: { type: GraphQLID},
        firstName: { type: GraphQLString},
        lastName: { type: GraphQLString}
    }
})

const AuthPayload = new GraphQLObjectType({
    name: 'AuthPayload',
    fields: {
        email: { type: GraphQLString},
        token: { type: GraphQLString},
        id: { type: GraphQLID}
    }
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
       CreateUser: {
           type: AuthPayload,
           args: { data: { type: CreateUser}},
           async resolve(parent, args){
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
       },

       LoginUser: {
           type: AuthPayload,
           args: { data: { type: LoginUser}},
           async resolve(parent, args){
               console.log(args.data)
                const userExists = await User.findOne({ email: args.data.email});
                if(!userExists) throw new Error(`No such user found`);
                if(args.data.password !== userExists.password) throw new Error(`Password not match`);
                
                let token = await userExists.generateAuthToken()
                return { email: userExists.email, token, id:userExists._id };
           }
       },
       
    }
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        GetUser: {
            type: GetUser,
            args: { id: { type: GraphQLID}},
            async resolve(parent, args){
                let user = await User.findById(args.id);
                return user;
            }
        },
        GetAll: {
            type: new GraphQLList(GetUser),
            resolve(){
                return User.find().then((users)=> users);
            } 
        }   
    }
})

export default new GraphQLSchema({ query: RootQuery , mutation: Mutation})