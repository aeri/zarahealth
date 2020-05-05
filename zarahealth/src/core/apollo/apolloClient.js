import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { InMemoryCache } from "apollo-cache-inmemory";
import { persistCache } from 'apollo-cache-persist';

import tokenRefreshLink from "./links/tokenRefreshLink";
import authLink from "./links/authLink";
import errorLink from "./links/errorLink";
import httpLink from "./links/httpLink";

const link = ApolloLink.from([tokenRefreshLink, authLink, errorLink, httpLink]);

const cache = new InMemoryCache();

persistCache({
  cache,
  storage: window.localStorage,
});

const client = new ApolloClient({
  link: link,
  cache: cache,
  resolvers: []
});

export default client;
