// this is the page that controls the rude comments
export default function makeHandleModeration ({
    isQuestionable, //is a comment questionable?
    initiateReview //if it is, review it.
}) {
    return async function handleModeration ({ comment }){
        const shouldModerate = await isQuestionable({
            //if the comment is questionable, get this information from the sender.
            text: comment.getText(),
            ip: comment.getSource().getIp(),
            browser: comment.getSource().getBrowser(),
            referrer: comment.getSource().getReferrer(),
            author: comment.getAuthor(),
            createdOn: comment.getCreatedOn(),
            modifiedOn: comment.getModifiedOn()
        })
        //read into the comments array
        const moderated = { ...comment }
        if (shouldModerate){
            initiateReview({id: moderated.getId(), content: moderated.getText() })
            moderated.unPublish()
        } else {
            moderated.publish()
        }
        return moderated
    }
}
