const apiai = require('apiai')

const staticReaction = require('./staticReactions')
const conversation = require('./conversations')

const {
  DIALOGFLOW_CLIENT_ACCESS_KEY,
  BOT_KEYWORD
} = process.env
const botKeywordRegexp = new RegExp(BOT_KEYWORD)

const nlp =
  DIALOGFLOW_CLIENT_ACCESS_KEY !== '' ?
  apiai(DIALOGFLOW_CLIENT_ACCESS_KEY) :
  false

const doNlpRequest = bot => msg => {
  const request = nlp.textRequest(msg.content, {
    sessionId: msg.author.id,
  })
  request.on('response', response => {
    const {
      result,
      status
    } = response
    if (parseInt(status.code) !== 200)
      throw new Error(
        `Error ${status.errorType || ''} when calling the NLP api`,
      )
    return (
      result.action &&
      (result.fulfillment && Array.isArray(result.fulfillment.messages)) &&
      result.fulfillment.messages.forEach(
        message =>
        message.speech !== '' &&
        bot.createMessage(msg.channel.id, message.speech),
      )
    )
  })
  request.on(
    'error',
    e =>
    bot.createMessage(
      msg.channel.id,
      getStaticReaction('nlp-error').content,
    ) && console.error(e),
  )
  request.end()
}

function nlpAgent(nlp) {
  nlp
    ?
    doNlpRequest :
    _ => __ => // ugly shit
    console.warn(
      '[NLP]-NLP disabled because a DialogFlow key was not provided',
    )
}


return bot => msg =>
  msg.content === '?ping' ?
  bot.createMessage(msg.channel.id, getStaticReaction('ping').content) :
  onActiveConversation(msg) ||
  botKeywordRegexp.test(String(msg.content).toLowerCase()) ?
  rememberConversation(msg) && nlpAgent(bot)(msg) :
  void 0