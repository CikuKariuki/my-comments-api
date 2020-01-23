//refer to the structure of making comments
import makeComment from '../comment'
export default function makeEditComment ({ commentsDb, handleModeration }) {
    return async function editComment ({id, ...changes } = {}) {
        if(!id) {
            throw new Error("You must have an id.")
        }
        if (!changes.text){
            throw new Error("There must be text to comment")
        }
        const extisting = await commentsDb.findById({ id })

        if(!extisting) {
            throw new RangeError("Comment not found")
        }
        const comment = makeComment ({ ...extisting, ...changes, modifiedOn: null})
        if (comment.getHash() === existing.hash) {
            console.log(comment)
            return existing
        }
        //check if the comment is appropriate to be posted
        const moderated = await handleModeration({ comment })
        //using the update method to edit te comment of the selected id.
        const updated = await commentsDb.update({
            id: moderated.getId(),
            published: moderated.isPublished(),
            modifiedOn: moderated.getModifiedOn(),
            text: moderated.getText(),
            hash: moderated.getHash()
        })
        //return the comment that has been updated
        return { ...existing, ...updated }
    }
}