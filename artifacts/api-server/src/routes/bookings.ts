import { Router } from "express";
import { db, bookingsTable } from "@workspace/db";
import { eq, and, sql } from "drizzle-orm";
import {
  CreateBookingBody,
  GetAvailableSlotsQueryParams,
  GetBookingParams,
  CancelBookingParams,
} from "@workspace/api-zod";
import { sendBookingNotification } from "../lib/email";

const router = Router();

const ALL_SLOTS = [
  "07:00 - 08:00",
  "08:00 - 09:00",
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "12:00 - 13:00",
  "13:00 - 14:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
  "17:00 - 18:00",
  "18:00 - 19:00",
  "19:00 - 20:00",
  "20:00 - 21:00",
  "21:00 - 22:00",
];

router.get("/bookings", async (req, res) => {
  const bookings = await db.select().from(bookingsTable);
  res.json(
    bookings.map((b) => ({
      ...b,
      createdAt: b.createdAt.toISOString(),
    }))
  );
});

router.get("/bookings/available-slots", async (req, res) => {
  const parse = GetAvailableSlotsQueryParams.safeParse(req.query);
  if (!parse.success) {
    res.status(400).json({ error: "date query param is required (YYYY-MM-DD)" });
    return;
  }
  const { date } = parse.data;

  const bookedSlots = await db
    .select({ timeSlot: bookingsTable.timeSlot })
    .from(bookingsTable)
    .where(and(eq(bookingsTable.date, date), eq(bookingsTable.status, "confirmed")));

  const bookedSet = new Set(bookedSlots.map((b) => b.timeSlot));

  const slots = ALL_SLOTS.map((slot) => ({
    slot,
    available: !bookedSet.has(slot),
  }));

  res.json(slots);
});

router.get("/bookings/:id", async (req, res) => {
  const parse = GetBookingParams.safeParse(req.params);
  if (!parse.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const { id } = parse.data;
  const [booking] = await db.select().from(bookingsTable).where(eq(bookingsTable.id, id));
  if (!booking) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }
  res.json({ ...booking, createdAt: booking.createdAt.toISOString() });
});

router.post("/bookings", async (req, res) => {
  const parse = CreateBookingBody.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ error: "Invalid booking data" });
    return;
  }
  const data = parse.data;

  const existing = await db
    .select()
    .from(bookingsTable)
    .where(
      and(
        eq(bookingsTable.date, data.date),
        eq(bookingsTable.timeSlot, data.timeSlot),
        eq(bookingsTable.status, "confirmed")
      )
    );

  if (existing.length > 0) {
    res.status(409).json({ error: "This time slot is already booked" });
    return;
  }

  const [newBooking] = await db
    .insert(bookingsTable)
    .values({ ...data, status: "confirmed" })
    .returning();

  sendBookingNotification(newBooking).catch(() => {});

  res.status(201).json({ ...newBooking, createdAt: newBooking.createdAt.toISOString() });
});

router.delete("/bookings/:id", async (req, res) => {
  const parse = CancelBookingParams.safeParse(req.params);
  if (!parse.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const { id } = parse.data;
  const [booking] = await db
    .update(bookingsTable)
    .set({ status: "cancelled" })
    .where(eq(bookingsTable.id, id))
    .returning();

  if (!booking) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }
  res.json({ ...booking, createdAt: booking.createdAt.toISOString() });
});

router.get("/stats", async (req, res) => {
  const today = new Date().toISOString().split("T")[0];

  const [totalRow] = await db
    .select({ count: sql<number>`cast(count(*) as int)` })
    .from(bookingsTable)
    .where(eq(bookingsTable.status, "confirmed"));

  const [todayRow] = await db
    .select({ count: sql<number>`cast(count(*) as int)` })
    .from(bookingsTable)
    .where(and(eq(bookingsTable.date, today), eq(bookingsTable.status, "confirmed")));

  const popularSlotRows = await db
    .select({
      timeSlot: bookingsTable.timeSlot,
      count: sql<number>`cast(count(*) as int)`,
    })
    .from(bookingsTable)
    .where(eq(bookingsTable.status, "confirmed"))
    .groupBy(bookingsTable.timeSlot)
    .orderBy(sql`count(*) desc`)
    .limit(1);

  const popularPlayersRows = await db
    .select({
      players: bookingsTable.players,
      count: sql<number>`cast(count(*) as int)`,
    })
    .from(bookingsTable)
    .where(eq(bookingsTable.status, "confirmed"))
    .groupBy(bookingsTable.players)
    .orderBy(sql`count(*) desc`)
    .limit(1);

  res.json({
    totalBookings: totalRow?.count ?? 0,
    todayBookings: todayRow?.count ?? 0,
    popularSlot: popularSlotRows[0]?.timeSlot ?? null,
    popularPlayers: popularPlayersRows[0]?.players ?? null,
  });
});

export default router;
