import { createHttpLink } from "apollo-link-http";

const ZARAHEALTH_BASE_URL = "https://zgz.herokuapp.com/graphql";

const httpLink = createHttpLink({
  uri: ZARAHEALTH_BASE_URL,
});

export default httpLink;