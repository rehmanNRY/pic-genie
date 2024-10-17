// src/app/api/webhooks/clerk/route.ts

import { createUser, findUserByEmail } from "@/lib/actions/user.actions"; // Import both functions

export async function POST(req: Request) {
  console.log("Request reached the route!"); 
  const payload = await req.json();
  console.log("Payload:", payload); // Log the entire payload

  // Ensure the payload has the required fields
  const { id, email_addresses, username, first_name, last_name, image_url } = payload.data || {};
  
  // Log the extracted fields
  console.log("Extracted Fields:", { id, email_addresses, username, first_name, last_name, image_url });

  // Check for required fields
  if (!id || !email_addresses || !email_addresses[0]?.email_address || !username || !image_url) {
    console.error("Missing required fields");
    return new Response("Missing required fields", { status: 400 });
  }

  // Create user in the database
  try {
    const email = email_addresses[0].email_address; // Extract email

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      console.log("User already exists:", existingUser); // Log existing user
      return new Response("User already exists", { status: 409 }); // Conflict status
    }

    const userData = {
      clerkId: id,
      email,
      username,
      photo: image_url, // Assuming image_url corresponds to photo in your model
      firstName: first_name,
      lastName: last_name,
    };

    console.log("Creating user with data:", userData); // Log the user data before creation
    const newUser = await createUser(userData);
    
    console.log("User created successfully:", newUser); // Log the created user
    return new Response(JSON.stringify(newUser), { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error); // Log any errors that occur
    return new Response("Error creating user", { status: 500 });
  }
}
