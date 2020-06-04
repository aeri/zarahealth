import { createUploadLink } from 'apollo-upload-client'

const ZARAHEALTH_BASE_URL = "https://zgz.herokuapp.com/graphql";

const httpLink = createUploadLink({
  uri: ZARAHEALTH_BASE_URL,
})

export default httpLink;