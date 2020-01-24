// injects the commentsdb as a dependency
export default function makeListComments ({ commentsDb }) {
    // calls/gets the comment using the id
    return async function listComments ({ postId } = {}) {
        if (!postId) {
            throw new Error("You must have a post id.")
        }
        const comments = await commentsDb.findByPostId ({
            postId,
            omitReplies: false
            //find the comment and its replies
        })
        const nestedComments = nest(comments)
        return nestedComments

        // if this gets slow learn how to introduce caching
        function nest (comments){
            if(comments.length === 0){
                return comments
            }
            return comments.reduce((nested, comment) =>{
                comment.replies = comments.filter(
                    reply => reply.replyToId === comment.id 
                )
                nest(comment.replies)
                if(comment.replyToId == null){
                    nested.push(comment)
                }
                return nested
            },[])
        }
    }
}