import { TokenRefreshLink } from "apollo-link-token-refresh";
import {
  isTokenValid,
  refreshAccessToken,
  handleResponse,
} from "../../services/tokenService";

const tokenRefreshLink = new TokenRefreshLink({
  isTokenValidOrUndefined: isTokenValid,
  fetchAccessToken: refreshAccessToken,
  handleResponse: (operation, accessTokenField) => response => handleResponse(response),
});

export default tokenRefreshLink;
