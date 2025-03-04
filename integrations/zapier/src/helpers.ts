import { ResourceNotFoundError } from '@botpress/client'
import { z, IntegrationContext } from '@botpress/sdk'
import {
  TriggerSubscriber,
  ZapierTriggersStateName,
  ZapierTriggersStateSchema,
  ZapierTriggersState,
  Client,
} from './types'
import type { Configuration } from '.botpress/implementation/configuration'

export async function unsubscribeZapierHook(url: string, ctx: IntegrationContext<Configuration>, client: Client) {
  let subscribers = await getTriggerSubscribers(ctx, client)
  subscribers = subscribers.filter((x) => x.url !== url)
  await saveTriggerSubscribers(subscribers, ctx, client)
  console.info(`Zapier hook ${url} was unsubscribed`)
}

export async function getTriggerSubscribers(ctx: IntegrationContext<Configuration>, client: Client) {
  const state = await getTriggersState(ctx, client)
  return state.subscribers
}

export async function saveTriggerSubscribers(
  subscribers: TriggerSubscriber[],
  ctx: IntegrationContext<Configuration>,
  client: Client
) {
  await client.setState({
    type: 'integration',
    name: ZapierTriggersStateName,
    id: ctx.integrationId,
    payload: buildTriggersState({ subscribers }),
  })
}

export async function getTriggersState(ctx: IntegrationContext<Configuration>, client: Client) {
  const defaultState = buildTriggersState()

  return await client
    .getState({
      type: 'integration',
      name: ZapierTriggersStateName,
      id: ctx.integrationId,
    })
    .then((res) => ZapierTriggersStateSchema.parse(res.state.payload))
    .catch((e) => {
      // TODO: Remove hard-coded "No State found" message check once the bridge client correctly receives the ResourceNotFoundError
      if (e instanceof ResourceNotFoundError || e.message === 'No State found') {
        console.info("Zapier triggers state doesn't exist yet and will be initialized")
        return defaultState
      } else if (e instanceof z.ZodError) {
        console.warn(`Zapier triggers state will be reset as it's corrupted: ${e.message}`)
        return defaultState
      } else {
        throw e
      }
    })
}

export function buildTriggersState(partial?: Partial<ZapierTriggersState>) {
  return <ZapierTriggersState>{
    subscribers: [],
    ...partial,
  }
}
