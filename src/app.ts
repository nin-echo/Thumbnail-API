import { join } from 'path'
import AutoLoad, { AutoloadPluginOptions } from '@fastify/autoload'
import Env from '@fastify/env'
import { FastifyPluginAsync, FastifyServerOptions } from 'fastify'
import { EnvSchema } from './schemas/dotenv'

export interface AppOptions extends FastifyServerOptions, Partial<AutoloadPluginOptions> {}
// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {}

const app: FastifyPluginAsync<AppOptions> = async (fastify, opts): Promise<void> => {
  await fastify.register(Env, {
    schema: EnvSchema,
    dotenv: true,
    // data: opts.configData
  })

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'plugins'),
    options: opts,
    dirNameRoutePrefix: false,
    ignorePattern: /.*.no-load\.js/,
    indexPattern: /^no$/i,
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'routes'),
    options: opts,
    ignorePattern: /.*\.js/,
    autoHooksPattern: /.*hooks(\.js|\.cjs|\.ts)$/i,
    autoHooks: true,
    cascadeHooks: true,
  })

  if (fastify.config.NODE_ENV === 'development') {
    fastify.log.info('CURRENT ROUTES:')
    fastify.log.info(fastify.printRoutes())
  }

  fastify.addHook('onClose', async _fastify => {
    fastify.log.info('Running onClose hook...')
    if (fastify.kysely) {
      await fastify.kysely.destroy()
    }
    fastify.log.info('Running onClose hook complete')
  })
}

export default app
export { app, options }
