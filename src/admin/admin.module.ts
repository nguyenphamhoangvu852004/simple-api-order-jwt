import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "../entity/users";

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
