import { Request, Response } from "express";
import { IFormErrorMessage } from "../utils/schema";

export function login(req: Request, res: Response) {
  const { email, password } = req.body;

  let errors: IFormErrorMessage[] = [];

  if (!email || !password) {
    errors.push({ msg: "All fields are required" });
  }

  if (errors.length > 0) {
    res.render("login", { errors, email, password });
  }
}
