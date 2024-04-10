export function GET() {
  return new Response(process.env.WALLET_CONNECT_VERIFICATION, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}
