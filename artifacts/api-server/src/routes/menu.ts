import { Router } from "express";
import { db, menuItemsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { ListMenuItemsQueryParams } from "@workspace/api-zod";

const router = Router();

router.get("/menu", async (req, res) => {
  const parse = ListMenuItemsQueryParams.safeParse(req.query);
  if (!parse.success) {
    res.status(400).json({ error: "Invalid query params" });
    return;
  }
  const { category } = parse.data;

  const items = category
    ? await db.select().from(menuItemsTable).where(eq(menuItemsTable.category, category))
    : await db.select().from(menuItemsTable);

  res.json(items);
});

export default router;
