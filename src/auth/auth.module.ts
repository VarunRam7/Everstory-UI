import { User, UserSchema } from './schema/user.schema';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DbConstants } from '../common/constant/db.constant';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepository } from './user.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: DbConstants.user, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository],
  exports: [UserRepository],
})
export class AuthModule {}
