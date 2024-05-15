import { INestApplication, ValidationPipe } from "@nestjs/common";
import { AppModule } from "../src/app.module";
import  {Test} from '@nestjs/testing';
import * as pactum from 'pactum';
import { PrismaService } from "../src/prisma/prisma.service";
import passport, { authorize } from "passport";
import { AuthDto } from "src/auth/dto";
import { EditUserDto } from "src/user/dto";
import { CreateBookmarkDto, EditBookmarkDto } from "src/bookmark/dto";

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
        it("Should get empty bookmarks", () => {
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

      describe('Create bookmarks', () => {
        it('Should create bookmarks', () => {
          const dto: CreateBookmarkDto = {
            title: 'First Bookmarks',
            link: 'bhoyee.com',
          };
          return pactum
          .spec()
          .post('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201)
          .stores('bookmarkId', 'id')
          // .inspect();            
        })   
      });

      describe('Get bookmarks', () => {
        it("Should get bookmarks", () => {
          return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(1);

        });

      });

      describe('Get bookmark by id', () => {
        it("Should get bookmark by Id", () => {
          return pactum
          .spec()
          .get('/bookmarks/{id}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withPathParams('id', '$S{bookmarkId}')
          .expectStatus(200)
          .expectBodyContains('$S{bookmarkId}')
          // .inspect();

        });
      });

      describe('Edit bookmark by id', () =>{
        const dto: EditBookmarkDto = {
          title: 'Test title',
          description:'Full description of the bookmark here'
        };
        it("Should edit bookmark", () => {
          return pactum
          .spec()
          .patch('/bookmarks/{id}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withPathParams('id', '$S{bookmarkId}')
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.description)
       
        });

      });

      describe('Delete bookmark by id', () =>{
        it("Should delete bookmark", () => {
          return pactum
          .spec()
          .delete('/bookmarks/{id}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withPathParams('id', '$S{bookmarkId}')
          .expectStatus(204)
          
        });

        it('should get empty bookmarks', () => {
          return pactum
            .spec()
            .get('/bookmarks')
            .withHeaders({
              Authorization: 'Bearer $S{userAt}',
            })
            .expectStatus(200)
            .expectJsonLength(0);
        })
      });
    });
  });

  
});

function expectBodyContains(firstName: string) {
  throw new Error("Function not implemented.");
}
