import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ length: 100 })
  houseNumber: string;

  @Column({ length: 200 })
  street: string;

  @Column({ length: 100 })
  subDistrict: string;

  @Column({ length: 100 })
  district: string;

  @Column({ length: 100 })
  province: string;

  @Column({ length: 10 })
  postalCode: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
