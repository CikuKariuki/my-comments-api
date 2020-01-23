// exporting the comment entity
export default function buildMakeComment ({Id,md5, sanitize, makeSource }) {
    return function makeComment({
        // creating the skeleton/specifications for the comments api. 
        // NOTICE! nothing is being imported, this is the creation phase.
        // Everything is now being exported to be used by use cases and the adapters.
        author,
        createdOn = Date.now(),
        id = Id.makeID(),
        source,
        modifiedOn = Date.now(),
        postId,
        published = false,
        replyToId,
        text
    } = {}){
// validations

        if (!Id.isValid(id)){
            throw new Error('Comment must have a valid Id.')
        }
        if(!author) { 
            throw new Error("Comment must have been written by someone")
        }
        if(!postId){
            throw new Error("Comment must contain a post Id. And this one doesn't")
        }
        if(!text || text.length<1){
            throw new Error ("Where is the text though?")
        }
        if(!source) {
            throw new Error ("Comment must have a source.")
        }
        if(replyToId && !Id.isValidId(replyToId)){
            throw new Error("If supplied, comment must have a valid replyToId")
        }

        let sanitizedText = sanitize(text).trim()
        if (sanitizedText.length < 1) {
            throw new Error("Comment contains no usable text.")
        }
        const validSource = makeSource(source)
        const deletedText = 'xX This comment has been deleted Xx'
        let hash

        return Object.freeze({
          getAuthor: ()=>author,
          getCreatedOn: ()=>createdOn,
          getHash: ()=> hash || (hash = makeHash()),
          getId: () => id,
          getModifiedOn: () => modifiedOn,
          getPostId: ()=> postId,
          getReplyToId: ()=> replyToId,
          getSource: ()=> validSource,
          getText: ()=> sanitizedText,
          isDeleted: ()=> sanitizedText === deletedText,
          isPublished: ()=> published,
          markDeleted: ()=> {
              sanitizedText = deletedText
              author = 'deleted'
          },
          publish: ()=> {
              published =true
          },
          unPublish: ()=> {
              published = false
          }          
          
        })
        function makeHash (){
            return md5(
                sanitizedText + published + (author || '')+(postId || '')+(replyToId || '')
            )
        }
    }
}