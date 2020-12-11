import { Connection } from "@mikro-orm/core";
import { EntityManager, IDatabaseDriver } from "@mikro-orm/core";
import { Request, Response } from "express";
export interface IGetUserAuthInfoRequest extends Request {
  userId: number // or any other type
}

export type MyContext = {
    em:EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
    req: Request & {session : any  } ;
    res: Response;
}