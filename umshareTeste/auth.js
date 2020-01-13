module.exports = {

    'facebookAuth' : {
        'clientID'      : 'your-secret-clientID-here', // your App ID
        'clientSecret'  : 'your-client-secret-here', // your App Secret
        'callbackURL'   : 'http://localhost:8080/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'       : 'your-consumer-key-here',
        'consumerSecret'    : 'your-client-secret-here',
        'callbackURL'       : 'http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : '226290249553-6ith8v975acgp8qmsp6ut670cnoahu3e.apps.googleusercontent.com',
        'clientSecret'  : 'Zz2yRH78p6G7slJGtaT1X1AI',
        'callbackURL'   : 'http://localhost:2222/login'
    }

};