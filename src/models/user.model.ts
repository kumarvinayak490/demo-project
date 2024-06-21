import mongoose, { Schema, Document, Model } from "mongoose";
import bcryptjs from "bcryptjs";
import httpStatus from "http-status";
import APIError from "../utils/APIError";

export const roles = ["user", "admin"] as const;

export interface IUser extends Document {
  email: string;
  password: string;
  name?: string;
  activationKey?: string;
  active: boolean;
  role: (typeof roles)[number];
  createdAt: Date;
  updatedAt: Date;
  passwordMatches(password: string): boolean;
  transform(): Record<string, any>;
}

interface IUserModel extends Model<IUser> {
  roles: typeof roles;
  checkDuplicateEmailError(err: any): Error;
  findAndGenerateToken(payload: {
    email: string;
    password: string;
  }): Promise<IUser>;
}

const userSchema = new Schema<IUser, IUserModel>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 128,
    },
    name: {
      type: String,
      maxlength: 50,
    },
    activationKey: {
      type: String,
      unique: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: "user",
      enum: roles,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre<IUser>("save", async function save(next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    this.password = bcryptjs.hashSync(this.password);

    return next();
  } catch (error) {
    return next(error);
  }
});

userSchema.post<IUser>("save", async function saved(doc, next) {
  try {
    return next();
  } catch (error) {
    return next(error);
  }
});

userSchema.method({
  transform() {
    const transformed: Record<string, any> = {};
    const fields = ["id", "name", "email", "createdAt", "role"];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
  passwordMatches(password: string) {
    return bcryptjs.compareSync(password, this.password);
  },
});

userSchema.statics = {
  checkDuplicateEmailError(err: any) {
    if (err.code === 11000) {
      const error: any = new Error("Email already taken");
      error.errors = [
        {
          field: "email",
          location: "body",
          messages: ["Email already taken"],
        },
      ];
      error.status = httpStatus.CONFLICT;
      return error;
    }

    return err;
  },

  async findAndGenerateToken(payload: { email: string; password: string }) {
    const { email, password } = payload;
    if (!email)
      throw new APIError(
        "Email must be provided for login",
        httpStatus.BAD_REQUEST
      );
    const user = await this.findOne({ email }).exec();
    if (!user)
      throw new APIError(
        `No user associated with ${email}`,
        httpStatus.NOT_FOUND
      );

    const passwordOK = user.passwordMatches(password);

    if (!passwordOK)
      throw new APIError("Password mismatch", httpStatus.UNAUTHORIZED);

    // if (!user.active)
    //   throw new APIError("User not activated", httpStatus.UNAUTHORIZED);

    return user;
  },
};

const User = mongoose.model<IUser, IUserModel>("User", userSchema);
export default User;
