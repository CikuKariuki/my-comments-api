//inject dependency instead of importing
export default function makePatchComment ({ editComment }) {
    return async function patchComment (httpRequest ){
        //update through editComment and if error, log error
        try{ 
            const {source = {}, ...commentInfo} = httpRequest.body
            source.ip = httpRequest.ip
            source.browser = httpRequest.headers['User-Agent']
            if (httpRequest.headers['Referer']) {
                source.referer = httpRequest.headers['Referer']
            }
            const toEdit = {
                ...commentInfo,
                source,
                id: httpRequest.params.id
            }
            const patched = await editComment(toEdit)
            return {
                headers: {
                    'Content-Type': 'application/json',
                    'Last-Modified': new Date(patched.modifiedOn).toUTCString()
                },
                statusCode: 200,
                body: {patched}
            }
        }catch(e){
            console.log(e)
            if(e.name === 'RangeError'){
                return { 
                    headers: {
                        'content-Type': 'application/json'
                    }, 
                    statusCode: 404,
                    body: {
                        error: e.message
                    }
                }
            }
            return{
                headers: {
                    'Content-Type': 'appication/json'
                },
                statusCode: 400,
                body: {
                    error: e.message
                }
            }
        }
    }
}