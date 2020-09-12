/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateCommentWithId = /* GraphQL */ `
  subscription OnCreateCommentWithId($talkId: ID!) {
    onCreateCommentWithId(talkId: $talkId) {
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
export const onCreateTalk = /* GraphQL */ `
  subscription OnCreateTalk {
    onCreateTalk {
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
export const onUpdateTalk = /* GraphQL */ `
  subscription OnUpdateTalk {
    onUpdateTalk {
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
export const onDeleteTalk = /* GraphQL */ `
  subscription OnDeleteTalk {
    onDeleteTalk {
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
export const onCreateSpeaker = /* GraphQL */ `
  subscription OnCreateSpeaker {
    onCreateSpeaker {
      id
      speakerName
      speakerBio
      speakerAvatar
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateSpeaker = /* GraphQL */ `
  subscription OnUpdateSpeaker {
    onUpdateSpeaker {
      id
      speakerName
      speakerBio
      speakerAvatar
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteSpeaker = /* GraphQL */ `
  subscription OnDeleteSpeaker {
    onDeleteSpeaker {
      id
      speakerName
      speakerBio
      speakerAvatar
      createdAt
      updatedAt
    }
  }
`;
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser {
    onCreateUser {
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser {
    onUpdateUser {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser {
    onDeleteUser {
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
export const onCreateComment = /* GraphQL */ `
  subscription OnCreateComment {
    onCreateComment {
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
export const onUpdateComment = /* GraphQL */ `
  subscription OnUpdateComment {
    onUpdateComment {
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
export const onDeleteComment = /* GraphQL */ `
  subscription OnDeleteComment {
    onDeleteComment {
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
export const onCreateReport = /* GraphQL */ `
  subscription OnCreateReport {
    onCreateReport {
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
export const onUpdateReport = /* GraphQL */ `
  subscription OnUpdateReport {
    onUpdateReport {
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
export const onDeleteReport = /* GraphQL */ `
  subscription OnDeleteReport {
    onDeleteReport {
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
