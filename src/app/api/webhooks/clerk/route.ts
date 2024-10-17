// src/app/api/webhooks/clerk/route.js

export async function POST(req: Request) {
  console.log("Request reached the route!");

  try {
    const payload = await req.json();
    console.log("Payload received:", payload); // Log payload for debugging

    // Uncomment for production - validate headers (security check)
    /*
    const headerPayload = headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response("Error: Missing svix headers", { status: 400 });
    }
    */

    // Check for the event type - we expect user.created
    if (payload.type === "user.created") {
      console.log("User created event received");

      // Here, you could trigger additional logic like creating the user in your DB
      // Example: await createUser(payload.data);

      return new Response("User created successfully", { status: 200 });
    } else {
      return new Response("Event type not supported", { status: 400 });
    }
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
