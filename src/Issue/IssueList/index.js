import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import IssueItem from "../IssueItem";
import Loading from "../../Loading";
import ErrorMessage from "../../Error";
import { ButtonUnobtrusive } from "../../Button";
import "./style.css";

// Enum states of issues
const ISSUE_STATES = {
  NONE: "NONE",
  OPEN: "OPEN",
  CLOSED: "CLOSED"
};

// The function decides whether it is a state to show issues or not.
const isShow = issueState => issueState !== ISSUE_STATES.NONE;

// Enum label of button
const TRANSITION_LABELS = {
  [ISSUE_STATES.NONE]: "Show Open Issues",
  [ISSUE_STATES.OPEN]: "Show Closed Issues",
  [ISSUE_STATES.CLOSED]: "Hide Issues"
};

// Enum states of button
const TRANSITION_STATE = {
  [ISSUE_STATES.NONE]: ISSUE_STATES.OPEN,
  [ISSUE_STATES.OPEN]: ISSUE_STATES.CLOSED,
  [ISSUE_STATES.CLOSED]: ISSUE_STATES.NONE
};

const GET_ISSUES_OF_REPOSITORY = gql`
  query($repositoryOwner: String!, $repositoryName: String!) {
    repository(name: $repositoryName, owner: $repositoryOwner) {
      issues(first: 5) {
        edges {
          node {
            id
            number
            state
            title
            url
            bodyHTML
          }
        }
      }
    }
  }
`;

class Issues extends React.Component {
  state = {
    issueState: ISSUE_STATES.NONE
  };

  onChangeIssueState = nextIssueState => {
    this.setState({ issueState: nextIssueState });
  };

  render() {
    const { issueState } = this.state;
    const { repositoryOwner, repositoryName } = this.props;

    return (
      <div className="Issues">
        <ButtonUnobtrusive
          onClick={() => this.onChangeIssueState(TRANSITION_STATE[issueState])}
        >
          {TRANSITION_LABELS[issueState]}
        </ButtonUnobtrusive>
        {isShow(issueState) && (
          <Query
            query={GET_ISSUES_OF_REPOSITORY}
            variables={{ repositoryOwner, repositoryName }}
          >
            {({ data, loading, error }) => {
              if (loading) {
                return <Loading />;
              } else {
                if (error) {
                  return <ErrorMessage error={error} />;
                } else {
                  const { repository } = data;
                  if (!repository) return null;
                  if (!repository.issues.edges.length) {
                    return <div className="IssueList">No issues...</div>;
                  }

                  const filteredRepository = {
                    issues: {
                      edges: repository.issues.edges.filter(
                        issue => issue.node.state === issueState
                      )
                    }
                  };

                  if (!filteredRepository.issues.edges.length) {
                    return <div className="IssueList">No issues...</div>;
                  }

                  return <IssueList issues={repository.issues} />;
                }
              }
            }}
          </Query>
        )}
      </div>
    );
  }
}

const IssueList = ({ issues }) => (
  <div className="IssueList">
    {issues.edges.map(({ node }) => (
      <IssueItem key={node.id} issue={node} />
    ))}
  </div>
);

export default Issues;
