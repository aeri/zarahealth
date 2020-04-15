import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from "apollo-cache-inmemory";

const ZARAHEALTH_BASE_URL = "https://zgz.herokuapp.com/graphql";
const httpLink = createHttpLink({
  uri: ZARAHEALTH_BASE_URL,
});

const authLink = setContext((_, { headers }) => {
  const access_token = localStorage.getItem("access_token");
  
  return {
    headers: {
      ...headers,
      authorization: access_token ? `Bearer ${access_token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;