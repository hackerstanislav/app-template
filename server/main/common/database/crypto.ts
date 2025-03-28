import crypto from "crypto";

// CRYPTO

export async function comparePassword(stored: string, password: string) {
	const [hashedPassword, salt] = stored.split(".");
	const hashedPasswordBuf = Buffer.from(hashedPassword, "hex");
	const suppliedPasswordBuf = (await createPassword(password, salt)).password;

	return crypto.timingSafeEqual(hashedPasswordBuf, suppliedPasswordBuf);
}

export async function generateKey(id: string) {
	const generated = crypto
		.generateKeySync("hmac", { length: 256 })
		.export()
		.toString("base64");

	const token = await hashPassword(generated);
	const fullKey = Buffer.from(`${id}.${generated}`).toString("base64");

	return { token, fullKey };
}

async function hashPassword(password: string, salt?: string) {
	const psw = await createPassword(password, salt);

	return `${psw.password.toString("hex")}.${psw.salt}`;
}

function createPassword(password: string, salt?: string) {
	return new Promise<{ password: Buffer; salt: string }>((resolve, reject) => {
		const currentSalt = salt ?? crypto.randomBytes(16).toString("hex");
		crypto.scrypt(password, currentSalt, 64, (err, buffer) => {
			if (err) {
				reject(err);
			} else {
				resolve({
					password: buffer,
					salt: currentSalt,
				});
			}
		});
	});
}
