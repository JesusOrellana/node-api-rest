const jwt = require("jsonwebtoken");
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generarJWT = ( uid = '' ) => {

    return new Promise( ( resolve, reject ) => {

        const payload = { uid };

        jwt.sign( payload, process.env.PRIVATE_SIGNATURE, {
            expiresIn: '30d'
        }, ( err, token ) => { 

            if(err){
                reject( 'No se pudo generar el token' );
            } else {
                resolve( token );
            }

        })

    });
    
}

const googleVerify = async ( token = '' ) => {
    
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
    
        const { email, given_name, family_name, picture } = ticket.getPayload();
        
        return {
            email: email, 
            name: given_name, 
            lastName: family_name, 
            profilePicture: picture,
            expired: false
        }

    } catch (error) {
        
        return {
            email: '', 
            name: '', 
            lastName: '', 
            profilePicture: '',
            expired: true
        }
        
    }
}


// Generate a password string
const generatePassword = () => {
    var dataSet = 'a-z,A-Z,0-9,#'; 
    var possible = '';
    if(dataSet.includes('a-z')){
      possible += 'abcdefghijklmnopqrstuvwxyz';
    }
    if(dataSet.includes('A-Z')){
      possible += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }
    if(dataSet.includes('0-9')){
      possible += '0123456789';
    }
    if(dataSet.includes('#')){
      possible += '![]{}()%&*$#^<>~@|';
    }
    var text = '';
    for(var i=0; i < 32; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

module.exports = { generarJWT, googleVerify, generatePassword };