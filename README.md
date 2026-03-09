## adminjs-prisma

This is an official [AdminJS](https://github.com/SoftwareBrothers/adminjs) adapter which integrates [Prisma](https://prisma.io/) into AdminJS.

### Installation

- yarn: `yarn add @adminjs/prisma`

- npm: `npm install @adminjs/prisma`

## Configuration

1. Add the `adminjs-prisma` generator to your `schema.prisma` file:

```prisma
generator adminjs {
  provider = "node node_modules/@adminjs/prisma/lib/generator.js"
}
```

2. Run `prisma generate` to generate the metadata file:

```bash
npx prisma generate
```

## Usage

The plugin can be registered using standard `AdminJS.registerAdapter` method.

```typescript
import { Database, Resource } from '@adminjs/prisma'
import { prismaMetadata } from './generated/adminjs/metadata.js' // Adjust path to where generate output is
import AdminJS from 'adminjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

AdminJS.registerAdapter({ Database, Resource })

const adminJs = new AdminJS({
  databases: [{
    client: prisma,
    dmmf: prismaMetadata, // Pass the generated metadata here
  }],
  // ...
})
```

## Example (Resource-based)

If you prefer to add resources manually:

```typescript
import { getModelByName } from '@adminjs/prisma'
import { prismaMetadata } from './generated/adminjs/metadata.js'

// ...

const adminJs = new AdminJS({
  resources: [{
    resource: {
      model: getModelByName('Post', prismaMetadata),
      client: prisma,
    },
    options: {},
  }],
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

## Running example app with local code modifications

MySQL database is required. You can use the database from `adminjs-example-app`:
https://github.com/SoftwareBrothers/adminjs-example-app/blob/master/docker-compose.yaml#L24

```
$ yarn
$ yarn build                  # after making changes or run "yarn dev" and open a new terminal for next command
$ yarn link
$ cd example-app
$ yarn
$ npx prisma generate
$ npx prisma migrate dev
```

Now copy `example-app/node_modules/.prisma` folder into `node_modules/.prisma`. This is required because installing library dependencies detects a different Prisma schema in test folder.

Continue in `example-app` folder:
```
$ yarn link "@adminjs/prisma"
$ yarn build
$ yarn start
```

The app should start at port 3000.

## License

AdminJS is copyrighted © 2023 rst.software. It is a free software, and may be redistributed under the terms specified in the [LICENSE](LICENSE.md) file.

## About rst.software

<img src="https://pbs.twimg.com/profile_images/1367119173604810752/dKVlj1YY_400x400.jpg" width=150>

We’re an open, friendly team that helps clients from all over the world to transform their businesses and create astonishing products.

* We are available for [hire](https://www.rst.software/estimate-your-project).
* If you want to work for us - check out the [career page](https://www.rst.software/join-us).
