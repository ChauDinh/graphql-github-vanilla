import React, { Fragment } from "react";

import RepositoryItem from "../RepositoryItem";
import Loading from "../../Loading";
import FetchMore from "../../FetchMore";
import Issues from "../../Issue";
import "../style.css";

const getUpdateQuery = entry => (prevResult, { fetchMoreResult }) => {
  if (!fetchMoreResult) return prevResult;

  return {
    ...prevResult,
    [entry]: {
      ...prevResult[entry],
      repositories: {
        ...prevResult[entry].repositories,
        ...fetchMoreResult[entry].repositories,
        edges: [
          ...prevResult[entry].repositories.edges,
          ...fetchMoreResult[entry].repositories.edges
        ]
      }
    }
  };
};

const RepositoryList = ({ repositories, loading, fetchMore, entry }) => (
  <Fragment>
    {loading ? (
      <Loading />
    ) : (
      repositories.edges.map(({ node }) => (
        <div key={node.id} className="RepositoryItem">
          <RepositoryItem {...node} />

          <Issues
            repositoryName={node.name}
            repositoryOwner={node.owner.login}
          />
        </div>
      ))
    )}

    <FetchMore
      loading={loading}
      hasNextPage={repositories.pageInfo.hasNextPage}
      variables={{ cursor: repositories.pageInfo.endCursor }}
      updateQuery={getUpdateQuery(entry)}
      fetchMore={fetchMore}
    >
      Repositories
    </FetchMore>
  </Fragment>
);

export default RepositoryList;
