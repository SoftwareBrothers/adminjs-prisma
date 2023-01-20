## adminjs-prisma

This is an official [AdminJS](https://github.com/SoftwareBrothers/adminjs) adapter which integrates [Prisma](https://prisma.io/) into AdminJS.

### Installation

- yarn: `yarn add @adminjs/prisma`

- npm: `npm install @adminjs/prisma`

## Usage

The plugin can be registered using standard `AdminJS.registerAdapter` method.

```typescript
import { Database, Resource } from '@adminjs/prisma'
import AdminJS from 'adminjs'

AdminJS.registerAdapter({ Database, Resource })
```

## Example

Whole code can be found in `example-app` directory in the repository.

```typescript
import express from 'express'
import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import { Database, Resource } from '@adminjs/prisma'
import { PrismaClient } from '@prisma/client'
import { DMMFClass } from '@prisma/client/runtime'

const PORT = process.env.port || 3000

const prisma = new PrismaClient()

AdminJS.registerAdapter({ Database, Resource })

const run = async () => {
  const app = express()

  // `_baseDmmf` contains necessary Model metadata. `PrismaClient` type doesn't have it included
  const dmmf = ((prisma as any)._baseDmmf as DMMFClass)

  const admin = new AdminJS({
    resources: [{
      resource: { model: dmmf.modelMap.Post, client: prisma },
      options: {},
    }, {
      resource: { model: dmmf.modelMap.Profile, client: prisma },
      options: {},
    }, {
      resource: { model: dmmf.modelMap.User, client: prisma },
      options: {},
    }],
  })

  const router = AdminJSExpress.buildRouter(admin)

  app.use(admin.options.rootPath, router)

  app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
  })
}

run()
  .finally(async () => {
    await prisma.$disconnect()
  })
```

## ManyToOne / ManyToMany

These relationships are currently not supported by default. You can manage them using custom actions and components.

## Pull request

Before you make a PR make sure all tests pass and your code won't cause linter errors.
You can do this by running:

```
yarn lint
yarn test
```

Make sure you have an `.env` file with `DATABASE_URL` specified.

## License

AdminJS is copyrighted © 2023 rst.software. It is a free software, and may be redistributed under the terms specified in the [LICENSE](LICENSE.md) file.

## About rst.software

<img src="https://pbs.twimg.com/profile_images/1367119173604810752/dKVlj1YY_400x400.jpg" width=150>

We’re an open, friendly team that helps clients from all over the world to transform their businesses and create astonishing products.

* We are available for [hire](https://www.rst.software/estimate-your-project).
* If you want to work for us - check out the [career page](https://www.rst.software/join-us).
