//import all the controllers and link them to their respective use cases and export them
import{
    addComment,
    editComment,
    listComments,
    removeComment
} from '../use-cases'
import makeDeleteComment from './delete-comment'
import makePostComment from './post-comment'
import makePatchComment from './patch-comment'
import makeGetComments from './get-comment'
import notFound from './not-found'

const deleteComment = makeDeleteComment({ removeComment })
const postComment = makePostComment({ addComment })
const patchComment = makePatchComment({ editComment })
const getComments = makeGetComments({ listComments})

const commentController = Object.freeze({
    deleteComment,
    postComment,
    patchComment,
    getComments,
    notFound

})
export default commentController
export{ deleteComment, getComments, notFound, postComment, patchComment}
