import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import { dbconfig } from './dbconfig';
import {Request, Response} from 'express';
import * as graphqlHTTP from 'express-graphql';
import schema from './schema/user.schema';
import * as cors from 'cors'

class App {

    public app: express.Application;
    public mongoUrl: string = `mongodb://${dbconfig.username}:${dbconfig.password}@ds111455.mlab.com:11455/zujo-task1`;

    constructor(){
         this.app = express();
         this.config();
         this.mongoSetup();
    }

    private config(): void{
        this.app.use(bodyParser.json());
        this.app.use(cors());
        this.app.use(bodyParser.urlencoded({ extended: false }));


        this.app.route('/')
            .get((req: Request, res: Response) => {            
                res.redirect('http://localhost:3080/graphql');
            });
        
        this.app.use('/graphql', graphqlHTTP({
            schema,
            graphiql: true
        }))

    }

    private mongoSetup(): void{
        //mongoose.Promise = global.Promise;

        mongoose.connect(this.mongoUrl, { useNewUrlParser: true }).then(()=> console.log('connected'));
        
    }
}

export default new App().app;