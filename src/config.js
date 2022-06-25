const Production = {

}

const Development = {
    BACKEND_URL: process.env.REACT_APP_BACKEND_URL,
    FILE_URL: process.env.REACT_APP_FILE_URL
}

module.exports = process.env.NODE_ENV === "production" ? Production : Development;