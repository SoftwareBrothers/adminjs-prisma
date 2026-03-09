/**
 * @module @adminjs/prisma
 * @subcategory Adapters
 * @section modules
 *
 * @description
 * ### This is an official [AdminJS](https://github.com/SoftwareBrothers/adminjs) adapter which integrates
 * [Prisma](https://prisma.io/) into AdminJS.
 *
 * ### Installation
 *
 * ```bash
 * $ yarn add @adminjs/prisma
 * or
 * $ npm install @adminjs/prisma
 * ```
 *
 * ## Usage
 *
 * The plugin can be registered using standard `AdminJS.registerAdapter` method.
 *
 * ```typescript
 * import { Database, Resource } from '@adminjs/prisma'
 * import AdminJS from 'adminjs'
 *
 * AdminJS.registerAdapter({ Database, Resource })
 * ```
 *
 * ## Example
 *
 * Whole code can be found in `example-app` directory in the repository.
 *
 * ```typescript
 * import express from 'express'
 * import AdminJS from 'adminjs'
 * import AdminJSExpress from '@adminjs/express'
 * import { Database, Resource } from '@adminjs/prisma'
 * import { PrismaClient } from '@prisma/client'
 * import { DMMFClass } from '@prisma/client/runtime'
 *
 * const PORT = process.env.port || 3000
 *
 * const prisma = new PrismaClient()
 *
 * AdminJS.registerAdapter({ Database, Resource })
 *
 * const run = async () => {
 *   const app = express()
 *
 *   // `_baseDmmf` contains necessary Model metadata. `PrismaClient` type doesn't have it included
 *   const dmmf = ((prisma as any)._baseDmmf as DMMFClass)
 *
 *   const admin = new AdminJS({
 *     resources: [{
 *       resource: { model: dmmf.modelMap.Post, client: prisma },
 *       options: {},
 *     }, {
 *       resource: { model: dmmf.modelMap.Profile, client: prisma },
 *       options: {},
 *     }, {
 *       resource: { model: dmmf.modelMap.User, client: prisma },
 *       options: {},
 *     }],
 *   })
 *
 *   const router = AdminJSExpress.buildRouter(admin)
 *
 *   app.use(admin.options.rootPath, router)
 *
 *   app.listen(PORT, () => {
 *     console.log(`Example app listening at http://localhost:${PORT}`)
 *   })
 * }
 *
 * run()
 *   .finally(async () => {
 *     await prisma.$disconnect()
 *   })
 * ```
 *
 * ## ManyToOne / ManyToMany
 *
 * These relationships are currently not supported by default.
 * You can manage them using custom actions and components.
 *
 */

/**
 * Implementation of {@link BaseDatabase} for Prisma Adapter
 *
 * @memberof module:@adminjs/prisma
 * @type {typeof BaseDatabase}
 * @static
 */
import { Database } from './Database.js';

/**
 * Implementation of {@link BaseResource} for Prisma Adapter
 *
 * @memberof module:@adminjs/prisma
 * @type {typeof BaseResource}
 * @static
 */
import { Resource } from './Resource.js';

export { Resource } from './Resource.js';
export { Database } from './Database.js';
export { convertParam, convertFilter } from './utils/converters.js';
export { getModelByName } from './utils/get-model-by-name.js';
export { getEnums } from './utils/get-enums.js';
export type { Enums, ModelManager, PrismaModel, PrismaField, PrismaMetadata, PrismaCompositePrimaryKey } from './types.js';
export default { Database, Resource };
