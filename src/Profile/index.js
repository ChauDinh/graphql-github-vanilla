import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import RepositoryList, { REPOSITORY_FRAGMENT } from "../Repository";
import Loading from "../Loading";
import ErrorMessage from "../Error";

const GET_REPOSITORIES_OF_CURRENT_USER = gql`
  query($cursor: String) {
    viewer {
      repositories(
        first: 5
        orderBy: { direction: DESC, field: STARGAZERS }
        after: $cursor
      ) {
        edges {
          node {
            ...repository
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
  ${REPOSITORY_FRAGMENT}
`;

const Profile = () => (
  <Query
    query={GET_REPOSITORIES_OF_CURRENT_USER}
    notifyOnNetworkStatusChange={true}
  >
    {({ data, loading, error, fetchMore }) => {
      if (loading) {
        return <Loading />;
      } else {
        if (error) {
          return <ErrorMessage error={error} />;
        } else {
          const { viewer } = data;

          if (!viewer) {
            return null;
          }

          return (
            <div>
              <RepositoryList
                repositories={viewer.repositories}
                fetchMore={fetchMore}
                loading={loading}
              />
            </div>
          );
        }
      }
    }}
  </Query>
);
export default Profile;
