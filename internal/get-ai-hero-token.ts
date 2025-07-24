/**
 * Gets an AI Hero token
 */
import * as client from "openid-client";

const ISSUER = "https://www.aihero.dev/oauth";

async function registerDevice() {
  try {
    const config = await client.discovery(
      new URL(ISSUER),
      "ai-hero",
    );
    const deviceResponse =
      await client.initiateDeviceAuthorization(
        config,
        {},
      );

    console.log(
      `Device code: ${deviceResponse.user_code}`,
    );
    console.log(
      `Go to: ${deviceResponse.verification_uri_complete}`,
    );

    const timeout = setTimeout(() => {
      throw new Error(
        "Device authorization timed out",
      );
    }, deviceResponse.expires_in * 1000);

    try {
      const tokenSet =
        await client.pollDeviceAuthorizationGrant(
          config,
          deviceResponse,
        );
      clearTimeout(timeout);

      if (!tokenSet) {
        console.log("AUTH_REJECTED, no token set");
        return;
      }

      const protectedResourceResponse =
        await client.fetchProtectedResource(
          config,
          tokenSet.access_token,
          new URL(`${ISSUER}/userinfo`),
          "GET",
        );
      const userinfo =
        await protectedResourceResponse.json();

      console.log(
        `AI_HERO_TOKEN=${tokenSet.access_token}`,
      );
      console.log(
        `AI_HERO_USER_ID=${(userinfo as any).id}`,
      );
      console.log("Place in .env");
    } catch (error) {
      clearTimeout(timeout);
      throw error;
    }
  } catch (error) {
    console.log("error", error);
    console.log("AUTH_REJECTED");
  }
}

await registerDevice();
