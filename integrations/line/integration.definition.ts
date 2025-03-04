import { z, IntegrationDefinition, messages } from '@botpress/sdk'
import { sentry as sentryHelpers } from '@botpress/sdk-addons'

export default new IntegrationDefinition({
  name: 'line',
  version: '0.4.0',
  title: 'Line',
  description: 'This integration allows your bot to interact with Line.',
  icon: 'icon.svg',
  readme: 'hub.md',
  configuration: {
    schema: z.object({
      channelAccessToken: z.string(),
      channelSecret: z.string(),
    }),
  },
  channels: {
    channel: {
      messages: messages.defaults,
      message: {
        tags: { msgId: {} },
      },
      conversation: {
        tags: { usrId: {}, destId: {} },
        creation: { enabled: true, requiredTags: ['usrId', 'destId'] },
      },
    },
  },
  actions: {},
  events: {},
  states: {
    conversation: {
      type: 'conversation',
      schema: z.object({
        replyToken: z.string(),
      }),
    },
  },
  secrets: sentryHelpers.COMMON_SECRET_NAMES,
  user: {
    tags: {
      usrId: {},
    },
    creation: { enabled: true, requiredTags: ['usrId'] },
  },
})
