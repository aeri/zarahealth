module.exports = {
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: String,
    social: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true
    },
};
