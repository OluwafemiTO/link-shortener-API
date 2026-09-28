import { join, dirname } from 'node:path'
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { fileURLToPath } from 'node:url';
import routes from './routes.js';
import AutoLoad, { AutoloadPluginOptions } from '@fastify/autoload'
import { FastifyPluginAsync, FastifyServerOptions } from 'fastify'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)


export interface AppOptions extends FastifyServerOptions, Partial<AutoloadPluginOptions> {

}
// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {
}

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  // Place here your custom code!

  fastify.withTypeProvider<ZodTypeProvider>();

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  // eslint-disable-next-line no-void
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'plugins'),
    options: opts
  })

  // This loads all plugins defined in guards
  // define your guards in one of these
  // eslint-disable-next-line no-void
  // void fastify.register(AutoLoad, {
  //   dir: join(__dirname, 'guards'),
  //   options: opts
  // })

  await fastify.register(routes);

}

export default app
export { app, options }