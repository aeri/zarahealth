const mongoosePaginate = require('mongoose-paginate-v2')
var UserModel = require('../mongo/model/user.js');
var tokenModel = require('../mongo/model/token.js');
var logger = require('../logger.js');
const {
    GraphQLError
} = require('graphql')

async function adminAuthentication(username) {
    if (!username) {
        throw new GraphQLError(`This query needs user authorization`, null, null, null, null, {
            extensions: {
                code: "UNAUTHORIZED",
            }
        })
    }
    else {
        user = await UserModel.findOne({
            username: username
        });

        if (!user) {
            throw new GraphQLError(`User ${username} not found`, null, null, null, null, {
                extensions: {
                    code: "INTERNAL_ERROR"
                }
            });
        } else {
            if (!user.isAdmin) {
                throw new GraphQLError(`User ${username} is not and admin`, null, null, null, null, {
                    extensions: {
                        code: "UNAUTHORIZED"
                    }
                });
            }
        }
    }
}

var retrieveUsers = async function ({
    page,
    limit
}, context) {

    var usernamePetition = context.response.locals.user;

    //User authentication
    await adminAuthentication(usernamePetition);

    const options = {
        page: Math.min(100, page),
        limit: limit,
        collation: {
            locale: 'en'
        }
    };

    var ret = await UserModel.paginate({}, options, function (err, result) {
        return result.docs;
    });

    return ret;
}

var updateUserStatus = async function ({ username, status }, context) {
    var usernamePetition = context.response.locals.user;

    //User authentication
    await adminAuthentication(usernamePetition);

    tokenModel.deleteMany({ 'user.username': username }, function (err) {
        if (err) logger.error(err);
    });

    return new Promise((resolve, reject) => {
        UserModel.findOneAndUpdate({
            username: username
        }, {
                $set: {
                status: status
                }
            }, {
                new: true
            })
            .then((doc) => {
                resolve(doc);
            })
            .catch((err) => {
                logger.error(err);
                reject(new GraphQLError(`Can not update this field.`, null, null, null, null, {
                    extensions: {
                        code: "UPDATE_FAILED",
                    }
                }));
            });
    });
}

module.exports = {
    retrieveUsers: retrieveUsers,
    updateUserStatus: updateUserStatus
};