export default {
  meta: { name: 'project' },
  rules: {
    'no-comments': {
      meta: {
        type: 'suggestion',
        docs: { description: 'Disallow comments in source code.' },
        messages: { noComments: 'Comments are not allowed. Express the intent through names instead.' },
      },
      create(context) {
        return {
          Program() {
            for (const comment of context.sourceCode.getAllComments()) {
              context.report({ loc: comment.loc, messageId: 'noComments' })
            }
          },
        }
      },
    },
  },
}
