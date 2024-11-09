import { ApiProperty } from '@nestjs/swagger';

export class GetUserByIdInputDto {}

export class GetUserByIdOutputDto {
  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: 'Nguyễn Văn A' })
  fullname: string;

  @ApiProperty({ example: '0347283xyz' })
  phoneNumber: string;

  @ApiProperty({ example: 'Quận Gò Vấp, Thành phố Hồ Chí Minh' })
  address: string;
}
