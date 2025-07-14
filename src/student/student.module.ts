import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from '../entities';
import { StudentService } from './student.service';
import { PDFService } from 'src/pdf/pdf.service';
import { StudentController } from './student.controller';
import { UserModule } from '@hilma/auth-nest';
import { MailModule } from 'src/mail/mail.module';
import { ClassesModule } from 'src/classes/classes.module';
import { SchoolModule } from 'src/school/school.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Student]),
        UserModule,
        MailModule,
        forwardRef(() => ClassesModule),
        forwardRef(() => SchoolModule),
    ],
    providers: [StudentService, PDFService],
    controllers: [StudentController],
    exports: [StudentService],
})
export class StudentModule {}
