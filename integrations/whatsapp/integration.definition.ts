import { z, IntegrationDefinition, messages } from '@botpress/sdk'
import { sentry as sentryHelpers } from '@botpress/sdk-addons'

export const channel = 'channel' // TODO: Rename to "whatsapp" once support for integration versioning is finished.

const TagsForCreatingConversation = {
  phoneNumberId: {
    title: 'Phone Number ID',
    description:
      'Whatsapp Phone Number ID to use as sender. If not provided it defaults to the one set in the configuration.',
  },
  userPhone: {
    title: 'User phone number',
    description: 'Phone number of the Whatsapp user to start the conversation with.',
  },
  templateName: {
    title: 'Message Template name',
    description: 'Name of the Whatsapp Message Template to start the conversation with.',
  },
  templateLanguage: {
    title: 'Message Template language (optional)',
    description:
      'Language of the Whatsapp Message Template to start the conversation with. Defaults to "en_US" (U.S. English).',
  },
  templateVariables: {
    title: 'Message Template variables (optional)',
    description: 'JSON array representation of variable values to pass to the Whatsapp Message Template.',
  },
}

export default new IntegrationDefinition({
  name: 'whatsapp',
  version: '0.4.0',
  title: 'WhatsApp',
  description: 'This integration allows your bot to interact with WhatsApp.',
  icon: 'icon.svg',
  readme: 'hub.md',
  configuration: {
    ui: {
      phoneNumberId: {
        title: 'Default Phone Number ID for starting conversations',
      },
    },
    schema: z.object({
      verifyToken: z.string(),
      accessToken: z.string(),
      phoneNumberId: z.string(),
    }),
  },
  channels: {
    [channel]: {
      messages: messages.defaults,
      message: {
        tags: {
          id: {},
        },
      },
      conversation: {
        creation: {
          enabled: true,
          requiredTags: ['phoneNumberId', 'userPhone'],
        },
        tags: TagsForCreatingConversation,
      },
    },
  },
  user: {
    tags: {
      userId: {},
      name: {},
    },
  },
  actions: {
    startConversation: {
      title: 'Start Conversation',
      description:
        "Proactively starts a conversation with a user's Whatsapp phone number by sending them a message using a Whatsapp Message Template.",
      input: {
        schema: z.object({
          userPhone: z.string().describe(TagsForCreatingConversation.userPhone.description),
          templateName: z.string().describe(TagsForCreatingConversation.templateName.description),
          templateLanguage: z.string().optional().describe(TagsForCreatingConversation.templateLanguage.description),
          templateVariablesJson: z
            .string()
            .optional()
            .describe(TagsForCreatingConversation.templateVariables.description),
          senderPhoneNumberId: z.string().optional().describe(TagsForCreatingConversation.phoneNumberId.description),
        }),
      },
      output: {
        schema: z.object({
          conversationId: z.string(),
        }),
      },
    },
  },
  events: {},
  secrets: sentryHelpers.COMMON_SECRET_NAMES,
})
