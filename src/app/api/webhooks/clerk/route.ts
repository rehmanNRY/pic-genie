export async function GET() {
  console.log("got req")
  return new Response("Webhook received", { status: 200 });
}
