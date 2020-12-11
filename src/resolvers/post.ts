import { Post } from "../entities/Post";
import { Resolver ,Query, Ctx, Int, Arg, Mutation} from "type-graphql";
import { MyContext } from "../types";


//video :https://www.youtube.com/watch?v=I6ypD7qv3Z8&t=13s
//min : 58

@Resolver()
export class PostResolver {
    @Query(() => [Post])
    posts(
        @Ctx() {em}: MyContext ):Promise<Post[]> {
        return em.find(Post, {});
    }

    @Query(() => Post, {nullable:true})
    post(
        @Arg('id', () => Int) id:number,
        @Ctx() {em}: MyContext ):Promise<Post | null> {
        return em.findOne(Post, {id});
    }

    @Mutation(() => Post)
    async createPost(
        @Arg('title', () => String) title:string,
        @Ctx() {em}: MyContext ):Promise<Post> {
            const post = em.create(Post, {title});
            await em.persistAndFlush(post)
            return post;
    }

    @Mutation(() => Post ,{nullable:true})
    async updatePost(
        @Arg('id', () => Int) id:number,
        @Arg('title', () => String,{ nullable:true}) title:string,
        @Ctx() {em}: MyContext ):Promise<Post | null> {
            const post = await em.findOne(Post,{id});
            if(!post){
                return null;
            }
            if (typeof title !== 'undefined'){
                post.title = title;
                await em.persistAndFlush(post);
            }
            return post;
    }

    @Mutation(() => Boolean)
    async deletePostById(
        @Arg('id', () => Int) id:number,
        @Ctx() {em}: MyContext ):Promise<Boolean> {
            try {
                await em.nativeDelete(Post,{id});                
                return true;
            } catch (error) {
                return false
            }
        }
}