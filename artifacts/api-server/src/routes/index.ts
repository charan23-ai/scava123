import { Router, type IRouter } from "express";
import healthRouter from "./health";
import menuRouter from "./menu";
import bookingsRouter from "./bookings";
import contactRouter from "./contact";

const router: IRouter = Router();

router.use(healthRouter);
router.use(menuRouter);
router.use(bookingsRouter);
router.use(contactRouter);

export default router;
