import { KEYS } from "../config/keys";
import mongoose from "mongoose";
import { IUser, User, UserSchema } from "./schema";

export default class DBUtils {
  private static instance: DBUtils;
  private _dbUrl: string;

  constructor() {
    this._dbUrl = KEYS.MONGO_URI;

    try {
      mongoose.connect(this._dbUrl);
    } catch (err) {
      console.log("Error connecting to MongoDB", err);
      throw err;
    }
  }

  public static getInstance() {
    if (!DBUtils.instance) {
      DBUtils.instance = new DBUtils();
    }
    return DBUtils.instance;
  }

  public getAllUsers() {
    return User.find();
  }

  public getUserByEmail(email: string) {
    return User.findOne({ email });
  }

  public createUser(user: IUser) {
    return User.create(user);
  }
}
