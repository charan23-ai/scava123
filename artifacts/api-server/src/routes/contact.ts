import { Router } from "express";
import { db, contactInquiriesTable } from "@workspace/db";
import { SubmitContactBody } from "@workspace/api-zod";

const router = Router();

router.post("/contact", async (req, res) => {
  const parse = SubmitContactBody.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ error: "Invalid contact data" });
    return;
  }
  const data = parse.data;

  const [inquiry] = await db
    .insert(contactInquiriesTable)
    .values(data)
    .returning();

  res.status(201).json({ ...inquiry, createdAt: inquiry.createdAt.toISOString() });
});

export default router;
