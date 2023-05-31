import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'image' })
export class ImageEntity {
  @ApiProperty({
    example: 'b20649d2-9853-4add-a968-4f144064340b',
    description: 'Identifier',
    required: false,
  })
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'pk_user_id',
  })
  id: string;

  @ApiProperty({
    example:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    description: 'Description',
  })
  @Column({ type: 'varchar' })
  description: string;

  @ApiProperty({
    example: 'Lorem_Ipsum_is_simply.png',
    description: 'Image name',
  })
  @Column({ type: 'varchar' })
  name: string;

  @ApiProperty({
    example: 'https://www.example.com/',
    description: 'Image url',
  })
  @Column({ type: 'varchar', default: '', nullable: true })
  link?: string;

  @ApiProperty({
    example: '1S54eeldCEf78Xma7xl28a3bvaXsVFX_M',
    description: 'Google drive image id',
  })
  @Column({
    type: 'varchar',
    default: '',
    nullable: true,
    name: 'google_drive_id',
  })
  googleDriveId?: string;
}
