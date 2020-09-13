/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const listCommentsByTalkId = /* GraphQL */ `
  query ListCommentsByTalkId($talkId: ID!) {
    listCommentsByTalkId(talkId: $talkId) {
      items {
        id
        talkId
        message
        createdAt
        createdBy
        deviceId
        updatedAt
      }
      nextToken
    }
  }
`;
export const getTalk = /* GraphQL */ `
  query GetTalk($id: ID!) {
    getTalk(id: $id) {
      id
      name
      speakers {
        nextToken
      }
      subscribers {
        id
        talks
        createdAt
        updatedAt
      }
      time
      timeStamp
      date
      location
      summary
      twitter
      github
      comments {
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const listTalks = /* GraphQL */ `
  query ListTalks(
    $filter: ModelTalkFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTalks(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        time
        timeStamp
        date
        location
        summary
        twitter
        github
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getSpeaker = /* GraphQL */ `
  query GetSpeaker($id: ID!) {
    getSpeaker(id: $id) {
      id
      talk {
        id
        name
        time
        timeStamp
        date
        location
        summary
        twitter
        github
        createdAt
        updatedAt
      }
      speakerName
      speakerBio
      speakerAvatar
      createdAt
      updatedAt
    }
  }
`;
export const listSpeakers = /* GraphQL */ `
  query ListSpeakers(
    $filter: ModelSpeakerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSpeakers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        speakerName
        speakerBio
        speakerAvatar
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      talks
      createdAt
      updatedAt
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        talks
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getComment = /* GraphQL */ `
  query GetComment($id: ID!) {
    getComment(id: $id) {
      id
      talkId
      talk {
        id
        name
        time
        timeStamp
        date
        location
        summary
        twitter
        github
        createdAt
        updatedAt
      }
      message
      createdAt
      createdBy
      deviceId
      updatedAt
    }
  }
`;
export const listComments = /* GraphQL */ `
  query ListComments(
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listComments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        talkId
        message
        createdAt
        createdBy
        deviceId
        updatedAt
      }
      nextToken
    }
  }
`;
export const getReport = /* GraphQL */ `
  query GetReport($id: ID!) {
    getReport(id: $id) {
      id
      commentId
      comment
      talkTitle
      deviceId
      createdAt
      updatedAt
    }
  }
`;
export const listReports = /* GraphQL */ `
  query ListReports(
    $filter: ModelReportFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listReports(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        commentId
        comment
        talkTitle
        deviceId
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
