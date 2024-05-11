import { INestApplication, ValidationPipe } from "@nestjs/common";
import { AppModule } from "../src/app.module";
import  {Test} from '@nestjs/testing';
import * as pactum from 'pactum';
import { PrismaService } from "../src/prisma/prisma.service";
import passport, { authorize } from "passport";
import { AuthDto } from "src/auth/dto";
import { EditUserDto } from "src/user/dto";

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
      await app.listen(3333);
      pactum.request.setBaseUrl('http://localhost:3333')

      prisma = app.get(PrismaService)
      await prisma.cleanDb();
    });

    afterAll(() => {
      //app.close();
    });

    describe('Auth',  () => {
    
        const dto: AuthDto = {
          email: 'bola@gmail.com',
          password: '12345',
        };
      describe('Signup', () => {
        it('should throw if email empty', () => {
          return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400)
          //.inspect();
        });

        it('should throw if password empty', () => {
          return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.email,
          })
          .expectStatus(400)
         // .inspect();
        });

        it('should throw nothing provided', () => {
          return pactum
          .spec()
          .post('/auth/signup')
          .expectStatus(400)
          //.inspect();
        });

        
        it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201)
        //  .inspect();
          
        });
      });

      describe('Signin', () => {

        it('should throw if email empty', () => {
          return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400)
          //.inspect();
        });

        it('should throw if password empty', () => {
          return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: dto.email,
          })
          .expectStatus(400)
         // .inspect();
        });

        it('should throw nothing provided', () => {
          return pactum
          .spec()
          .post('/auth/signin')
          .expectStatus(400)
         // .inspect();
        });


        it('should signin', () => {
          return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token')
         // .inspect();
        });
      });
  
    describe('User', () => {
      describe('Get me', () =>{
        it('should get current user', () => {
          return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          //.inspect();
        })
      });

      describe('Edit user', () =>{
        it('should edit user', () => {
          const dto: EditUserDto = {
            firstName: 'Bhoyee',
            lastName: "Salisu",
            email:'bolas@gmail.com',
          };
          return pactum
            .spec()
            .patch('/users')
            .withHeaders({
              Authorization: 'Bearer $S{userAt}',
            })
            .withBody(dto)
            .expectStatus(200)
            .expectBodyContains(dto.firstName)
            .expectBodyContains(dto.email)
        });
      });
    });

    describe('Bookmarks', () => {
      describe('Get empty bookmarks', () => {
        it("Should get bookmarks", () => {
          return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          // .withBody(dto)
          .expectStatus(200)
          .expectBody([])
          //.inspect();

        })
      });
      describe('Create bookmarks', () => {});
      describe('GGet bookmarks', () => {});
      describe('Get bookmark by id', () => {});
      describe('Edit bookmark by id', () =>{});
      describe('Delete bookmark by id', () =>{});
    });
  });

  
});

function expectBodyContains(firstName: string) {
  throw new Error("Function not implemented.");
}
