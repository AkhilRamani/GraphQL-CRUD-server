import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLSchema,
    GraphQLList,
    GraphQLInputObjectType,
    GraphQLNonNull
} from 'graphql';

export const GetUser = new GraphQLObjectType({
    name: 'GetUser',
    fields: {
        email: { type: GraphQLString},
        id: { type: GraphQLID},
        firstName: { type: GraphQLString},
        lastName: { type: GraphQLString}
    }
});

export const CreateUser = new GraphQLInputObjectType({
    name: 'CreateUser',
    fields: {
        firstName: { type: new GraphQLNonNull(GraphQLString)},
        lastName: { type: new GraphQLNonNull(GraphQLString)},
        email: { type: new GraphQLNonNull(GraphQLString)},
        password: { type: new GraphQLNonNull(GraphQLString)}
    }
})


export const AuthPayload = new GraphQLObjectType({
    name: 'AuthPayload',
    fields: {
        email: { type: GraphQLString},
        token: { type: GraphQLString},
        id: { type: GraphQLID}
    }
})

export const LoginUser = new GraphQLInputObjectType({
    name: 'LoginUser',
    fields: {
        email: { type: new GraphQLNonNull(GraphQLString)},
        password: { type: new GraphQLNonNull(GraphQLString)},
    }
})

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