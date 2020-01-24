// get the structure from comments entity
import makeComment from '../comment'
export default function makeRemoveComment ({ commentsDb }) {
    return async function removeComment ({ id } = {}){
        //if there's no id trow error
        if(!id){
            throw new Error ("Comment must have an id")
        }
        //otherwise if there's an id search for the comment via id, if the id is not found delete nothing.
        const commentToDelete = await commentsDb.findById({ id })
        if(!commentToDelete){
            return deleteNothing()
        }
        //if it has replies soft delete. Delete comment but not the replies.
        if(await hasReplies(commentToDelete)) {
            return softDelete(commentToDelete)
        }
        //if the comment was a reply of another deleted comment, delete both parent and child comments.
        if (await isOnlyReplyOfDeletedParent(commentToDelete)) {
            return deleteCommentAndParent(commentToDelete)
        }
        //otherwise, perform a hard delete, delete the comment and all its replies
        return hardDelete(commentToDelete)
    }

    //creating the functions referred above, hasreplies, isOnlyReplyOfDeletedParent, deleteNothing, softDelete, deleteCommentAndParent, hardDelete.
    async function hasReplies({id: commentId }) {
        const replies = await commentsDb.findReplies ({
            commentId,
            publishedOnly: false
        })
        return replies.length > 0
    }
    async function isOnlyReplyOfDeletedParent(comment){
        if (!comment.replyToId){
            return false
        }
        const parent = await commentsDb.findById({ id: comment.replyToId })
        if (parent && makeComment(parent).isDeleted()){
            const replies = await commentsDb.findReplies({
                commentId: parent.id,
                publishedOnly: false
            })
            return replies.length === 1
        }
        return false
    }
    function deleteNothing () {
        return {
            deletedCount: 0,
            softDelete: false,
            message: "Comment not found, nothing to delete."
        }
    }
    async function softDelete(commentInfo){
        const toDelete = makeComment(commentInfo)
        toDelete.markDeleted()
        await commentsDb.update({
            id: toDelete.getId(),
            author: toDelete.getAuthor(),
            text: toDelete.getText(),
            replyToId: toDelete.getReplyToId(),
            postId: toDelete.getPostId()
        })
        return { 
            deletedCount: 1,
            softDelete: true,
            message: "Comment has replies. Soft deleted."
        }
    }
        async function deleteCommentAndParent(comment){
            await Promise.all([
                commenstsDb.remove(comment),
                commentsDb.remove({ id: comment.replyToId })
            ])
            return {
                deletedCount: 2,
                softDelete: false,
                message: "comment and parent deleted."
            }
        }
        async function hardDelete(comment) {
            await commentsDb.remove(comment)
            return {
                deletedCount: 1,
                softDelete: false,
                message: "comment deleted"
            }
        }
    }
