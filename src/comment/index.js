import crypto from 'crypto'
import Id from '../Id'
import ipRegex from 'ip-regex'
import sanitizeHtml from 'sanitze-html'
import buildMakeComment from './comment'
import buildMakeSource from './source'

const makeSource = buildMakeSource({isValidIp})
const makeComment = buildMakeComment({Id, md5, sanitize, makeSource })

export default makeComment

function isValidIp (ip) {
    return ipRegex ({exact: true}).test(ip)
}
function md5 (text) {
    return crypto
    .createdHash('md5')
    .update(text, 'utf-8')
    .digest('hex')
}

function sanitize (text){
    return sanitizeHtml(text, {
        allowedIframeHostnames: ['codesandbox.io', 'repl.it']
    })
}