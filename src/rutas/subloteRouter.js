import { Router } from "express";
import SubLoteControlador from "../controladores/subloteControlador.js";

const subloteRouter = Router();

subloteRouter.post("/", SubLoteControlador.crear);


export { subloteRouter };