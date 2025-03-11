import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type Novel {
    id: Int!
    title: String!
    description: String
    coverImage: String
    author: String!
    status: String!
    createdAt: String!
    updatedAt: String!
    chapters: [Chapter!]!
    genres: [Genre!]!
  }

  type Chapter {
    id: Int!
    number: Float!
    title: String!
    content: String!
    createdAt: String!
    updatedAt: String!
    novelId: Int!
    novel: Novel!
  }

  type Genre {
    id: Int!
    name: String!
    novels: [Novel!]!
  }

  type User {
    id: Int!
    email: String!
    name: String
    role: String!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    novels: [Novel!]!
    novel(id: Int!): Novel
    chapters(novelId: Int!): [Chapter!]!
    chapter(id: Int!): Chapter
    genres: [Genre!]!
    users: [User!]!
    user(id: Int!): User
  }

  input NovelInput {
    title: String!
    description: String
    coverImage: String
    author: String!
    status: String
    genreIds: [Int!]
  }

  input ChapterInput {
    number: Float!
    title: String!
    content: String!
    novelId: Int!
  }

  input GenreInput {
    name: String!
  }

  input UserInput {
    email: String!
    password: String!
    name: String
    role: String
  }

  type Mutation {
    createNovel(data: NovelInput!): Novel!
    updateNovel(id: Int!, data: NovelInput!): Novel!
    deleteNovel(id: Int!): Novel!
    
    createChapter(data: ChapterInput!): Chapter!
    updateChapter(id: Int!, data: ChapterInput!): Chapter!
    deleteChapter(id: Int!): Chapter!
    
    createGenre(data: GenreInput!): Genre!
    updateGenre(id: Int!, data: GenreInput!): Genre!
    deleteGenre(id: Int!): Genre!
    
    createUser(data: UserInput!): User!
    updateUser(id: Int!, data: UserInput!): User!
    deleteUser(id: Int!): User!
  }
`; 