const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const config = require("../config");

const algorithm = "aes-256-ctr";
const secretKey = config.encryptSecret;

// verify the password
const verifyPassword = async (hash, password) => {
  const originalPassword = decrypt(hash);
  return originalPassword === password;
};

// encrypt the password
const encrypt = (text, iv) => {
  // create the iv
  const newIv = iv ? Buffer.from(iv, "hex") : crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, secretKey, newIv);

  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return {
    iv: newIv.toString("hex"),
    content: encrypted.toString("hex"),
  };
};

// decrypt the password
const decrypt = (hash) => {
  const decipher = crypto.createDecipheriv(
    algorithm,
    secretKey,
    Buffer.from(hash.iv, "hex")
  );

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(hash.content, "hex")),
    decipher.final(),
  ]);

  return decrypted.toString();
};

// generate auth token
const generateAuthToken = (payload) => {
  const token = jwt.sign(payload, config.jwtSecret, {
    expiresIn: "1d",
  });

  return token;
};

module.exports = { generateAuthToken, verifyPassword, encrypt, decrypt };
