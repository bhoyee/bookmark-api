import { INestApplication, ValidationPipe } from "@nestjs/common";
import { AppModule } from "../src/app.module";
import  {Test} from '@nestjs/testing';
import { PrismaService } from "@prisma/prisma.service";

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = 
     await Test.createTestingModule({
      imports: [AppModule],
     }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();

    prisma = app.get(PrismaService)

    await prisma.cleanDb
  });

  afterAll(() => {
    app.close();
  });


  it.todo('should pass');
});