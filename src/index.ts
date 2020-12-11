import { MikroORM } from '@mikro-orm/core';
import { COOKIE_NAME, __prod__ } from './constants';
import microConfig from './mikro-orm.config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { PostResolver,UserResolver } from './resolvers'

import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { MyContext } from './types';
import cors from 'cors';
import { sendEmail } from './utils/sendEmail';


  const main = async () => {
    sendEmail("matias1588@hotmail.com","hola");
    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator().up();

    const app = express();

     
    const RedisStore = connectRedis(session)
    const redisClient = redis.createClient()
    app.use(cors({
      origin:"http://localhost:3000",
      credentials:true
    }))
    app.use(
      session({
        name:COOKIE_NAME,
        store: new RedisStore({ 
          client: redisClient,
          disableTouch:true
        }),
        cookie:{
          maxAge:1000* 60 * 60 * 24 * 365 * 10,
          httpOnly:true,
          sameSite:'lax',//csrf
          secure:__prod__,
        },
        saveUninitialized:false,
        secret: 'qwekqwlkeasasasda',
        resave: false,
      })
    );

    const apolloServer = new ApolloServer({
      schema: await buildSchema({
        resolvers:[PostResolver,UserResolver],
        validate:false
      }),
      context: ({req,res}): MyContext => ({em: orm.em, req, res})
    })

  apolloServer.applyMiddleware({
    app, 
    cors:false
  });

    app.listen(4000,() => {
      console.log(`listen on 4000`)
    })

  }
  

  main().catch(
      (err) => {
          console.error(err)
      }
  )
