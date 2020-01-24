//instead of importing the use cases we inject it as a dependency with respect to what is needed. 
export default function makeGetComments ({ listComments }) { 
    return async function getComments (httpRequest) {
        const headers = {
            'Content-Type' : 'application/json'
        }
        try{
            //try posting this comment using a httprequest.
            const postComments = await listComments({
                postId: httpRequest.query.postId
            })
            //if successful return this
            return {
                headers,
                statusCode: 200,
                body: postComments
            }
            //if not successfull return error
        }catch (e) {
            console.log(e)
            return {
                headers,
                statusCode: 400,
                body: {
                    error: e.message
                }
            }
        }
    }
}