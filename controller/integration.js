import axios from "axios";
import crypto from "crypto";
import base64 from "base-64";
import https from "https";

export const captureImage = async (req, res) => {
  const { cameraIP, username, password, channel = 1 } = req.body;
  try {
    // Agent untuk mengabaikan SSL verification
    const agent = new https.Agent({
      rejectUnauthorized: false, // Abaikan sertifikat self-signed
    });

    // Permintaan pertama untuk mendapatkan challenge digest
    const initialResponse = await axios.get(
      `https://${cameraIP}/cgi-bin/snapshot.cgi?channel=${channel}`,
      {
        validateStatus: (status) => status < 500,
        httpsAgent: agent, // Gunakan agent di sini
      }
    );

    if (initialResponse.status === 401) {
      const authHeader = initialResponse.headers["www-authenticate"];
      console.log(authHeader);
      if (authHeader.startsWith("Digest")) {
        // Extract digest params
        const realm = extractAuthParam(authHeader, "realm");
        const nonce = extractAuthParam(authHeader, "nonce");
        const uri = `/cgi-bin/snapshot.cgi?channel=${channel}`;
        const qop = "auth";
        const nc = "00000001";
        const cnonce = crypto.randomBytes(16).toString("hex");

        const ha1 = crypto
          .createHash("md5")
          .update(`${username}:${realm}:${password}`)
          .digest("hex");
        const ha2 = crypto.createHash("md5").update(`GET:${uri}`).digest("hex");
        const response = crypto
          .createHash("md5")
          .update(`${ha1}:${nonce}:${nc}:${cnonce}:${qop}:${ha2}`)
          .digest("hex");

        const digestAuthHeader = `Digest username="${username}", realm="${realm}", nonce="${nonce}", uri="${uri}", qop=${qop}, nc=${nc}, cnonce="${cnonce}", response="${response}"`;

        // Permintaan kedua dengan autentikasi digest
        const finalResponse = await axios.get(`https://${cameraIP}${uri}`, {
          headers: {
            Authorization: digestAuthHeader,
          },
          responseType: "arraybuffer",
          httpsAgent: agent, // Gunakan agent di sini juga
        });

        res.set("Content-Type", "image/jpeg");
        res.send(finalResponse.data);
      } else {
        res.status(500).send("Unknown authentication method");
      }
    }
  } catch (error) {
    console.error("Error capturing image:", error.message);
    res.status(500).send("Error capturing image");
  }
};

function extractAuthParam(header, param) {
  const match = new RegExp(`${param}="([^"]+)"`).exec(header);
  return match && match[1];
}
