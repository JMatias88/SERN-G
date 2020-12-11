import { Resolver , Ctx, Arg, Mutation, InputType, Field, ObjectType, Query} from "type-graphql";
import { MyContext } from "../types";
import { User } from '../entities/User';
import { COOKIE_NAME } from "../constants";
const argon2 = require('argon2');

//minuto 1:56:00

@InputType()
class UserNamePasswordInput{
    @Field()
    username:string
    @Field()
    password:string
}

@ObjectType()
class FieldError{
    @Field()
    field:string;
    @Field()
    message:string
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], {nullable:true})
    errors?: FieldError[]
    @Field(() => User, {nullable:true})
    user?:User    
}


@Resolver()
export class UserResolver {

    @Query(() => User, {nullable:true})
    async me(
        @Ctx() {req, em}:MyContext
    ) {

        const user = await em.findOne(User, { id: req.session!.userId | 0 });
        return user;
    }

    @Mutation(() => UserResponse)
    async register(
        @Arg('options') options:UserNamePasswordInput,
        @Ctx() {req,em}:MyContext
        ):Promise<UserResponse>{
            console.log(options)
        if (options.username.length<=2){
            return {
                errors:[{
                    field:"username",
                    message:"username too short"
                }]
            }
        }
        if (options.password.length<=3){
            return {
                errors:[{
                    field:"password",
                    message:"password too short"
                }]
            }
        }
        const hashedPassword = await argon2.hash(options.password);
        const user = em.create(User, {
            username:options.username,
            password:hashedPassword
        });
        try {
            await em.persistAndFlush(user);
        } catch (error) {    
            if (error.code === 'ER_DUP_ENTRY' || error.sqlMessage.includes("Duplicate")){
                //Duplicate error
                return {
                    errors:[{
                        field:'username',
                        message:'Username ya tomado'
                    }]
                }
            }
            
        }
        req.session!.userId = user.id;
        return {
            user
        };
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg('options') options:UserNamePasswordInput,
        @Ctx() {em, req}:MyContext
        ):Promise<UserResponse>{
        const user = await em.findOne(User,{ username:options.username });
        console.log(user);
        if (!user){
            return {
                errors: [{
                    field:"username",
                    message:"no existe el usuario"
                 }]
            }
        }
        const valid = await argon2.verify(user.password,options.password);
        if (!valid){
            return {
                errors: [{
                    field:"password",
                    message:"incorrecto"
                 }]
            }
        }
        req.session!.userId = user.id;
        return {            
            user,
        };

    }

    @Mutation(() => Boolean)
    logout(
        @Ctx() {req, res}: MyContext
    ){        
        return new Promise(resolve => req.session.destroy((err: any) => {
            res.clearCookie(COOKIE_NAME)
            if (err) {
                console.log(err);
                resolve(false);
                return
            } 
            resolve(true);
            
        })
        );
    }
}