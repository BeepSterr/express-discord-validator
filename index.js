const nacl = require('tweetnacl');

module.exports = function(public_key){

    if(!public_key){
        throw new InvalidOptions("Argument needs to be a string containing your public key");
    }

    return function(req, res, next){

        const chunks = []
        req.on('data', (chunk) => chunks.push(chunk))
        req.on('end', () => {
            const body = chunks.join('');

            const signature = req.get('X-Signature-Ed25519');
            const timestamp = req.get('X-Signature-Timestamp');

            if(signature === undefined || timestamp === undefined){
                res.status(403);
                next(new InvalidSignature('Missing request headers'));
                return;
            }

            const isVerified = nacl.sign.detached.verify(
                Buffer.from(timestamp + body),
                Buffer.from(signature, 'hex'),
                Buffer.from(public_key, 'hex')
            );

            if (!isVerified) {
                res.status(403);
                next(new InvalidSignature('Could not validate interaction request'));
            }else{
                req.interaction = JSON.parse(body);
                next();
            }

        })

    }

}

class InvalidSignature extends Error {
    constructor(message) {
        super(message); // (1)
        this.name = "InvalidSignature"; // (2)
    }
}

class InvalidOptions extends Error {
    constructor(message) {
        super(message); // (1)
        this.name = "InvalidOptions"; // (2)
    }
}