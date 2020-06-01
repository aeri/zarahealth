import { onError } from "apollo-link-error";

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    console.log("GraphQL error: " + JSON.stringify(graphQLErrors));
  }
  if (networkError) {
    console.log("Network error: " + JSON.stringify(networkError));
  }
});

export default errorLink;
