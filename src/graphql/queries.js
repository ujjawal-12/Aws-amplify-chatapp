/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getChatty = /* GraphQL */ `
  query GetChatty($id: ID!) {
    getChatty(id: $id) {
      id
      user
      message
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const listChatties = /* GraphQL */ `
  query ListChatties(
    $filter: ModelChattyFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listChatties(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        user
        message
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncChatties = /* GraphQL */ `
  query SyncChatties(
    $filter: ModelChattyFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncChatties(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        user
        message
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
