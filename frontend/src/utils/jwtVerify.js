import jwt_decode from "jwt-decode";

export function verifyToken(token, secretKey) {
	let decoded = null;
	try {
		decoded = jwt_decode(token, secretKey);
	} catch (error) {
		console.error("jwt_decode() failed: ", error);
	}
	return decoded;
}