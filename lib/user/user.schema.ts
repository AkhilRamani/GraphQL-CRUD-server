import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLSchema,
    GraphQLList,
} from 'graphql';
import { userResolver } from './user.resolver';
import  { GetUser, CreateUser, AuthPayload, LoginUser } from './user.typedef';


const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
       CreateUser: {
           type: AuthPayload,
           args: { data: { type: CreateUser}},
           resolve: userResolver.createUser
       },

       LoginUser: {
           type: AuthPayload,
           args: { data: { type: LoginUser}},
           resolve: userResolver.loginUser
       },
       LogoutUser: {
           type: new GraphQLObjectType({
               name: 'LogoutUser',
               fields: { status: { type: GraphQLString} }
           }),
           resolve: userResolver.logoutUser
       }
    }
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        GetUser: {
            type: GetUser,
            //args: { id: { type: GraphQLID}},
            resolve: userResolver.getUser
        },
        GetAll: {
            type: new GraphQLList(GetUser),
            resolve : userResolver.getAll
        }   
    }
})

export default new GraphQLSchema({ query: RootQuery , mutation: Mutation})