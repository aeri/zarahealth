import { setContext } from "apollo-link-context";
import { getStoredAccessToken } from "../../services/tokenService";

const authLink = setContext( (_, { headers }) => {
  const access_token = getStoredAccessToken();
  return {
    headers: {
      ...headers,
      authorization: access_token ? `Bearer ${access_token}` : "",
    },
  };
});

export default authLink;
