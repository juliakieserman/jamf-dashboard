type AuthToken = {
    token: string,
    expires: string
}

export async function getUserAuth(): Promise<AuthToken> {
    const auth = await
    fetch(
      `https://ohmnfr.jamfcloud.com${process.env.JAMF_PRO_URI}auth/token`, {
          method: "POST",
          headers: {
            Authorization: 'Basic ' + Buffer.from( process.env.JAMF_USERNAME + ":" + process.env.JAMF_PASSWORD ).toString( 'base64' )
          }
      }
    );
    const authObject = await auth.json();
    return authObject;
}
