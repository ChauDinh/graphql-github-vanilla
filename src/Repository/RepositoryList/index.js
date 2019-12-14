import React, { Fragment } from "react";

import RepositoryItem from "../RepositoryItem";
import Loading from "../../Loading";
import FetchMore from "../../FetchMore";
import "../style.css";

const updateQuery = (prevResult, { fetchMoreResult }) => {
  if (!fetchMoreResult) return prevResult;

  return {
    ...prevResult,
    viewer: {
      ...prevResult.viewer,
      repositories: {
        ...prevResult.viewer.repositories,
        ...fetchMoreResult.viewer.repositories,
        edges: [
          ...prevResult.viewer.repositories.edges,
          ...fetchMoreResult.viewer.repositories.edges
        ]
      }
    }
  };
};

const RepositoryList = ({ repositories, loading, fetchMore }) => (
  <Fragment>
    {loading ? (
      <Loading />
    ) : (
      repositories.edges.map(({ node }) => (
        <div key={node.id} className="RepositoryItem">
          <RepositoryItem {...node} />
        </div>
      ))
    )}

    <FetchMore
      loading={loading}
      hasNextPage={repositories.pageInfo.hasNextPage}
      variables={{ cursor: repositories.pageInfo.endCursor }}
      updateQuery={updateQuery}
      fetchMore={fetchMore}
    >
      Repositories
    </FetchMore>
  </Fragment>
);

export default RepositoryList;
