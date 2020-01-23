// import the comment property from the entity, use cases can depend on entities not the other way round.
import makeComment from '../comment'
export default function makeAddComment({ commentsDb, handleModeration }) {
    return async function addComment(commentInfo){
        //commentInfo takes information from our comment entity and checks whether the comments are valid. It carries the info
        const comment = makeComment(commentInfo)
        const exists = await commentsDb.findByHash({ hash: comment.getHash() })
        if (exists){
            return exists
            // this checks whether the comment already exists if it does it returns it instead of double adding.
        }
        // the moderation thing is for microsoft azure for cecking if people are being rude and all
        const moderated = await handleModeration ({comment })
        const commentSource = moderated.getSource()
        return commentsDb.insert({
            // the things from comment entity that will beverified via commentInfo
            author: moderated.getAuthor(),
            createdOn: moderated.getCreatedOn(),
            hash: moderated.getHash(),
            id: moderated.getId(),
            modifiedOn: moderated.getModifiedOn(),
            postId: moderated.getPostId(),
            published: moderated.isPublished(),
            replyToId: moderated.getReplyToId(),
            source: {
                ip: commentSource.getIp(),
                browser: commentSource.getBrowser(),
                referrer: commentSource.getReferrer()
            },
            text: moderated.getText()
        })
    }
}