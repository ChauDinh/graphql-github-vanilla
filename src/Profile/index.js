import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import RepositoryList from "../Repository";
import Loading from "../Loading";
import ErrorMessage from "../Error";

const GET_REPOSITORIES_OF_CURRENT_USER = gql`
  {
    viewer {
      repositories(first: 5, orderBy: { direction: DESC, field: STARGAZERS }) {
        edges {
          node {
            id
            name
            url
            descriptionHTML
            primaryLanguage {
              name
            }
            owner {
              login
              url
            }
            stargazers {
              totalCount
            }
            viewerHasStarred
            watchers {
              totalCount
            }
            viewerSubscription
          }
        }
      }
    }
  }
`;

const Profile = () => (
  <Query query={GET_REPOSITORIES_OF_CURRENT_USER}>
    {({ data, loading, error }) => {
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
              <RepositoryList repositories={viewer.repositories} />
            </div>
          );
        }
      }
    }}
  </Query>
);
export default Profile;
