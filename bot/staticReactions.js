const reactions = {
  
    ping: { type: 'text', content: 'pong!' },
    
    'nlp-error': {
      type: 'text',
      content: 'Looks like that did not work.'
    },
    
  }
  
  const getReactions = () => reactions
  
  const getStaticReaction = reaction => getReactions()[reaction]
  
 