// src/app/api/webhooks/clerk/route.ts

import { createUser, findUserByEmail } from "@/lib/actions/user.actions"; // Import both functions

export async function POST(req: Request) {
  console.log("req",req)
  console.log("Request reached the route!");

  // Dummy hardcoded data for testing
  const dummyData = {
    id: "dummy-324chhlerk-id",
    email_addresses: [{ email_address: "tes423hggh4t@example.com" }],
    username: "testsbbfsdfuser",
    first_name: "John",
    last_name: "Doe",
    image_url: "https://example.com/photo.jpg",
  };

  console.log("Using dummy data:", dummyData); // Log the dummy data

  // Use the hardcoded data for user creation
  try {
    const email = dummyData.email_addresses[0].email_address; // Extract email from dummy data

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      console.log("User already exists:", existingUser); // Log existing user
      return new Response("User already exists", { status: 409 }); // Conflict status
    }

    const userData = {
      clerkId: dummyData.id,
      email,
      username: dummyData.username,
      photo: dummyData.image_url, // Use the photo URL from dummy data
      firstName: dummyData.first_name,
      lastName: dummyData.last_name,
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
