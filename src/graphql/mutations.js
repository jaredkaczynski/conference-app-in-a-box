/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createTalk = /* GraphQL */ `
  mutation CreateTalk(
    $input: CreateTalkInput!
    $condition: ModelTalkConditionInput
  ) {
    createTalk(input: $input, condition: $condition) {
      id
      name
      speakers {
        id
        speakerName
        speakerBio
        speakerAvatar
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
export const updateTalk = /* GraphQL */ `
  mutation UpdateTalk(
    $input: UpdateTalkInput!
    $condition: ModelTalkConditionInput
  ) {
    updateTalk(input: $input, condition: $condition) {
      id
      name
      speakers {
        id
        speakerName
        speakerBio
        speakerAvatar
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
export const deleteTalk = /* GraphQL */ `
  mutation DeleteTalk(
    $input: DeleteTalkInput!
    $condition: ModelTalkConditionInput
  ) {
    deleteTalk(input: $input, condition: $condition) {
      id
      name
      speakers {
        id
        speakerName
        speakerBio
        speakerAvatar
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
export const createSpeaker = /* GraphQL */ `
  mutation CreateSpeaker(
    $input: CreateSpeakerInput!
    $condition: ModelSpeakerConditionInput
  ) {
    createSpeaker(input: $input, condition: $condition) {
      id
      speakerName
      speakerBio
      speakerAvatar
      createdAt
      updatedAt
    }
  }
`;
export const updateSpeaker = /* GraphQL */ `
  mutation UpdateSpeaker(
    $input: UpdateSpeakerInput!
    $condition: ModelSpeakerConditionInput
  ) {
    updateSpeaker(input: $input, condition: $condition) {
      id
      speakerName
      speakerBio
      speakerAvatar
      createdAt
      updatedAt
    }
  }
`;
export const deleteSpeaker = /* GraphQL */ `
  mutation DeleteSpeaker(
    $input: DeleteSpeakerInput!
    $condition: ModelSpeakerConditionInput
  ) {
    deleteSpeaker(input: $input, condition: $condition) {
      id
      speakerName
      speakerBio
      speakerAvatar
      createdAt
      updatedAt
    }
  }
`;
export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
      id
      talks {
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
      createdAt
      updatedAt
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
      id
      talks {
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
      createdAt
      updatedAt
    }
  }
`;
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
      id
      talks {
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
      createdAt
      updatedAt
    }
  }
`;
export const createComment = /* GraphQL */ `
  mutation CreateComment(
    $input: CreateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    createComment(input: $input, condition: $condition) {
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
export const updateComment = /* GraphQL */ `
  mutation UpdateComment(
    $input: UpdateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    updateComment(input: $input, condition: $condition) {
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
export const deleteComment = /* GraphQL */ `
  mutation DeleteComment(
    $input: DeleteCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    deleteComment(input: $input, condition: $condition) {
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
export const createReport = /* GraphQL */ `
  mutation CreateReport(
    $input: CreateReportInput!
    $condition: ModelReportConditionInput
  ) {
    createReport(input: $input, condition: $condition) {
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
export const updateReport = /* GraphQL */ `
  mutation UpdateReport(
    $input: UpdateReportInput!
    $condition: ModelReportConditionInput
  ) {
    updateReport(input: $input, condition: $condition) {
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
export const deleteReport = /* GraphQL */ `
  mutation DeleteReport(
    $input: DeleteReportInput!
    $condition: ModelReportConditionInput
  ) {
    deleteReport(input: $input, condition: $condition) {
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
