import { type NextRequest, NextResponse } from "next/server"

// GET /api/v3b/availability - Get available time slots
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0]

    // TODO: Query database for agent availability
    // TODO: Filter out already booked slots

    // Mock available slots (9 AM - 5 PM, 30-minute intervals)
    const slots = []
    const startHour = 9
    const endHour = 17

    for (let hour = startHour; hour < endHour; hour++) {
      for (const minute of [0, 30]) {
        const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
        slots.push({
          time,
          available: Math.random() > 0.3, // Mock availability
          agentId: "550e8400-e29b-41d4-a716-446655440001",
          agentName: "Sarah Johnson",
        })
      }
    }

    return NextResponse.json({ date, slots })
  } catch (error) {
    console.error("[v0] Error fetching availability:", error)
    return NextResponse.json({ error: "Failed to fetch availability" }, { status: 500 })
  }
}
