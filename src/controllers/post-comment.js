//we inject the addcomment dependency
export default function makePostComment ({addComment}){
    return async function postComment (httpRequest){
        try{
        const {source = {}, ...commentInfo } = httpRequest.body
        source.ip = httpRequest.ipsource.browser = httpRequest.headers [ 'User-Agent']
        } catch (e){}
    }
}