//import all the use cases
import makeAddComment from './add-comment'
import makeEditComment from './edit-comment'
import makeRemoveComment from './remove-comment'
import makeListComments from  './list-comment'
import makeHandleModeration from  './handle-moderation'
import commentsDb from '../data-access'
import isQuestionable from '../is-questionable/is-questionable'

const handleModeration = makeHandleModeration({ isQuestionable,
initiateReview: async ()=>{} //this is not a real initiateReview function but it works and doesn't affect the other code
})
const addComment = makeAddComment({ commentsDb, handleModeration })
const editComment = makeEditComment({ commentsDb, handleModeration})
const listComments = makeListComments ({ commentsDb})
const removeComment = makeRemoveComment ({ commentsDb })

const commentService = Object.freeze({
    addComent,
    editComment,
    handleModeration,
    listComments,
    removeComment
})
export default commentService
export { addComment, editComment, listComments, removeComment}