import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { AbstractSchema } from '../../common/schema/abstract.schema';
import { AccountRole } from '../enum/account-role.enum';
import { DbConstants } from '../../common/constant/db.constant';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true, collection: DbConstants.user })
export class User extends AbstractSchema {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 'user', enum: AccountRole })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
