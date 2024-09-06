import { Router } from "express";
import LoteControlador from "../controladores/loteControlador.js";

const loteRouter = Router();

loteRouter.post("/", LoteControlador.crear);


export { loteRouter };