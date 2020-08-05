const graphql = require('graphql');
var _ = require ('lodash');


// Dummy Data
var usersData = [
    {id: "1", name: 'Bond', age: 36, profession: "Secret Agent"},
    {id: "13", name: 'Anna', age: 26, profession: "Zoologist"},
    {id: "211", name: 'Bella', age: 16, profession: "Meterologist"},
    {id: "19", name: 'Gina', age: 26, profession: "Server"},
    {id: "150", name: 'Georgina', age: 36, profession: "Accountant"}
];

var hobbiesData = [
    {id: "1", title: 'Programming', description: 'Using computers to make the world a better place', userID: '1'},
    {id: "2", title: 'Rowing', description: 'Sweat and feel better before eating donuts', userID: '1'},
    {id: "3", title: 'Swimming', description: 'Get in the water and learn to become the water', userID: '19'},
    {id: "4", title: 'Fencing', description: 'A hobby for fency people', userID: '211'},
    {id: "5", title: 'Hiking', description: 'Wear boots and explore the world', userID: '1'}
];

var postsData = [
    {id: '1', comment: 'Building a Mind', userID: '1'},
    {id: '2', comment: 'GraphQL is Amazing', userID: '1'},
    {id: '3', comment: 'How to Change the World', userID: '19'},
    {id: '4', comment: 'How to Change the World', userID: '211'},
    {id: '5', comment: 'How to Change the World', userID: '1'}
];

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList

} = graphql


// Create Types
const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'Documentation for user...',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        profession: {type: GraphQLString},

        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args) {
                return _.filter(postsData, {userID: parent.id});
            }
        },

        hobbies: {
            type: new GraphQLList(HobbyType),
            resolve(parent, args) {
                return _.filter(hobbiesData, {userID: parent.id});
            }
        }
    })

});

const HobbyType = new GraphQLObjectType({
    name: 'Hobby',
    description: 'Hobby description',
    fields: () => ({
        id: {type: GraphQLID},
        title: {type: GraphQLString},
        description: {type: GraphQLString},
        user: {
            type: UserType,
            resolve(parent, args) {
                return _.find(usersData, {id: parent.userID});
            }
        }
    })
});

const PostType = new GraphQLObjectType({
    name: 'Post',
    description: 'Post description',
    fields: () => ({
        id: {type: GraphQLID},
        comment: {type: GraphQLString},
        user: {
            type: UserType,
            resolve(parent, args) {
                return _.find(usersData, {id: parent.userID});
            }
        }
    })
});


// RootQuery
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    description: 'Description',
    fields: {
        user: {
            type: UserType,
            args: {id: {type: GraphQLID}},

            resolve(parent, args) {
                return _.find(usersData, {id: args.id})
                
                // we resolve with data
                // get and return data from a datasource
            }
        },

        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return usersData;
            }
        },

        hobby: {
            type: HobbyType,
            args: {id: {type: GraphQLID}},

            resolve(parent, args) {
                return _.find(hobbiesData, {id: args.id})
            }
        },

        hobbies: {
            type: new GraphQLList(HobbyType),
            resolve(parent, args) {
                return hobbiesData;
            }
        },

        post: {
            type: PostType,
            args: {id: {type: GraphQLID}},

            resolve(parent, args) {
                return _.find(postsData, {id: args.id})
            }
        },

        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args) {
                return postsData;
            }
        }

    }
});

// Mutations
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createUser: {
            type: UserType,
            args: {
                // id: {type: GraphQLID}
                name: {type: GraphQLString},
                age: {type: GraphQLInt},
                profession: {type: GraphQLString}
            },

            resolve(parent, args) {
                let user = {
                    name: args.name,
                    age: args.age,
                    profession: args.profession
                }
                return user;
            }
        },

        createPost: {
            type: PostType,
            args: {
                comment: {type: GraphQLString},
                userID: {type: GraphQLID}
            },

            resolve(parent, args) {
                let post = {
                    comment: args.comment,
                    userID: args.userID
                }
                return post;
            }
        },

        createHobby: {
            type: HobbyType,
            args: {
                title: {type: GraphQLString},
                description: {type: GraphQLString},
                userID: {type: GraphQLID}
            },

            resolve(parent, args) {
                let hobby = {
                    title: args.title,
                    description: args.description,
                    userID: args.userID
                }
                return hobby;
            }
        }

    }
});


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})