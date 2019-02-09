import * as expect from 'expect';
import * as request from 'supertest';
import app from '../app';
const req = request(app);

describe('Graphql: /', ()=>{
    it('should register new user', (done)=>{
        req.post('/graphql')
            .send({ query: 'mutation{ CreateUser(data: { firstName:"Test", lastName:"Testing", email:"Test@akhil.com", password:"test"}){ email,token} }'})
            .expect(200)
            .expect((res)=> {
                expect(res.body.data.CreateUser.email).toBe('Test@akhil.com');
                expect(res.body.data.CreateUser.token).toBeTruthy();
            })
            .end(done)
    })

    it('Should login the User', (done)=> {
        req.post('/graphql')
            .send({ query: `mutation{ LoginUser(data: { email: "Test@akhil.com", password: "test"}){ email, token}}`})
            .expect(200)
            .expect((res)=> {
                expect(res.body.data.LoginUser.email).toBe('Test@akhil.com');
                expect(res.body.data.LoginUser.token).toBeTruthy();
            })
            .end(done);
    })
})