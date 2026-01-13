export default defineEventHandler(async (event) => {
    let body = await readBody(event);
    // console.log("body", body.payload);
    const runtimeConfig = useRuntimeConfig(event);
    const access_token = runtimeConfig.public.access_token;
     const pixel_id = runtimeConfig.public.pixel_id;
    const url = `https://graph.facebook.com/v19.0/${pixel_id}/events`;
    const eventData = {
      data: body.payload,
    };
    const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify(eventData),
      };
      let capiRes = await fetch(url, requestOptions);
     return await capiRes.json();
});