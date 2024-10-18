/* eslint-disable camelcase */
// import { clerkClient } from "@clerk/nextjs";
import { WebhookEvent, clerkClient } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { createUser, updateUser } from "@/lib/actions/user.actions";

export async function POST(req: Request) {
  console.log("Webhook triggered"); // Log start

  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("WEBHOOK_SECRET is missing");
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("Svix headers are missing");
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  console.log("Received headers", {
    svix_id,
    svix_timestamp,
    svix_signature,
  });

  const payload = await req.json();
  const body = JSON.stringify(payload);
  console.log("Received payload:", payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
    console.log("Webhook verified successfully");
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred", { status: 400 });
  }

  const { id } = evt.data;
  const eventType = evt.type;

  console.log(`Processing webhook of type: ${eventType} for user ID: ${id}`);

  // CREATE
  if (eventType === "user.created") {
    console.log("user created")
    const { id, email_addresses, image_url, first_name, last_name, username } = evt.data;

    const user = {
      clerkId: id,
      email: email_addresses[0].email_address,
      username: username!,
      firstName: first_name || '',
      lastName: last_name || '',
      photo: image_url,
    };

    console.log("Creating user with data:", user);
    try {
      const newUser = await createUser(user);
      if (newUser) {
        await clerkClient.users.updateUserMetadata(id, {
          publicMetadata: {
            userId: newUser._id,
          },
        });
      }
      console.log("User created successfully:", newUser);
      return NextResponse.json({ message: "User created", user: newUser });
    } catch (error) {
      console.error("Error creating user:", error);
      return NextResponse.json({ error: "Error creating user" }, { status: 500 });
    }
  }

  // UPDATE
  if (eventType === "user.updated") {
    const { id, image_url, first_name, last_name, username } = evt.data;

    const user = {
      firstName: first_name ||'',
      lastName: last_name || '',
      username: username || "Unknown",
      photo: image_url,
    };

    console.log("Updating user with ID:", id);
    try {
      const updatedUser = await updateUser(id, user);
      console.log("User updated successfully:", updatedUser);
      return NextResponse.json({ message: "User updated", user: updatedUser });
    } catch (error) {
      console.error("Error updating user:", error);
      return NextResponse.json({ error: "Error updating user" }, { status: 500 });
    }
  }

  // DELETE
  // if (eventType === "user.deleted") {
  //   const {id} = evt.data;
  //   console.log("Deleting user with ID:", id);
  //   try {
  //     const {id} = evt.data;
  //     const deletedUser = await deleteUser(id);
  //     console.log("User deleted successfully:", deletedUser);
  //     return NextResponse.json({ message: "User deleted", user: deletedUser });
  //   } catch (error) {
  //     console.error("Error deleting user:", error);
  //     return NextResponse.json({ error: "Error deleting user" }, { status: 500 });
  //   }
  // }

  console.log(`Webhook processed for ID: ${id} with type: ${eventType}`);
  return new Response("", { status: 200 });
}
