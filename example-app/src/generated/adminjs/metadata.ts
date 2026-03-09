export const prismaMetadata = {
  "models": {
    "Post": {
      "name": "Post",
      "idFields": [
        "id"
      ],
      "scalars": [
        {
          "name": "id",
          "kind": "scalar",
          "type": "Int",
          "isList": false,
          "isRequired": true,
          "isId": true,
          "isUnique": false,
          "isReadOnly": false,
          "isUpdatedAt": false,
          "hasDefaultValue": true
        },
        {
          "name": "createdAt",
          "kind": "scalar",
          "type": "DateTime",
          "isList": false,
          "isRequired": true,
          "isId": false,
          "isUnique": false,
          "isReadOnly": false,
          "isUpdatedAt": false,
          "hasDefaultValue": true
        },
        {
          "name": "updatedAt",
          "kind": "scalar",
          "type": "DateTime",
          "isList": false,
          "isRequired": true,
          "isId": false,
          "isUnique": false,
          "isReadOnly": false,
          "isUpdatedAt": true,
          "hasDefaultValue": false
        },
        {
          "name": "title",
          "kind": "scalar",
          "type": "String",
          "isList": false,
          "isRequired": true,
          "isId": false,
          "isUnique": false,
          "isReadOnly": false,
          "isUpdatedAt": false,
          "hasDefaultValue": false
        },
        {
          "name": "content",
          "kind": "scalar",
          "type": "String",
          "isList": false,
          "isRequired": false,
          "isId": false,
          "isUnique": false,
          "isReadOnly": false,
          "isUpdatedAt": false,
          "hasDefaultValue": false
        },
        {
          "name": "someJson",
          "kind": "scalar",
          "type": "Json",
          "isList": false,
          "isRequired": false,
          "isId": false,
          "isUnique": false,
          "isReadOnly": false,
          "isUpdatedAt": false,
          "hasDefaultValue": false
        },
        {
          "name": "published",
          "kind": "scalar",
          "type": "Boolean",
          "isList": false,
          "isRequired": true,
          "isId": false,
          "isUnique": false,
          "isReadOnly": false,
          "isUpdatedAt": false,
          "hasDefaultValue": true
        },
        {
          "name": "publisherId",
          "kind": "scalar",
          "type": "Int",
          "isList": false,
          "isRequired": true,
          "isId": false,
          "isUnique": false,
          "isReadOnly": true,
          "isUpdatedAt": false,
          "hasDefaultValue": false
        }
      ],
      "relations": [
        {
          "name": "publisher",
          "kind": "object",
          "type": "Publisher",
          "isList": false,
          "isRequired": true,
          "isId": false,
          "isUnique": false,
          "isReadOnly": false,
          "isUpdatedAt": false,
          "hasDefaultValue": false,
          "relationName": "PostToPublisher",
          "relationFromFields": [
            "publisherId"
          ],
          "relationToFields": [
            "id"
          ]
        }
      ],
      "enums": [
        {
          "name": "status",
          "kind": "enum",
          "type": "Status",
          "isList": false,
          "isRequired": true,
          "isId": false,
          "isUnique": false,
          "isReadOnly": false,
          "isUpdatedAt": false,
          "hasDefaultValue": true
        }
      ],
      "allFields": [
        {
          "name": "id",
          "kind": "scalar",
          "type": "Int",
          "isList": false,
          "isRequired": true,
          "isId": true,
          "isUnique": false,
          "isReadOnly": false,
          "isUpdatedAt": false,
          "hasDefaultValue": true
        },
        {
          "name": "createdAt",
          "kind": "scalar",
          "type": "DateTime",
          "isList": false,
          "isRequired": true,
          "isId": false,
          "isUnique": false,
          "isReadOnly": false,
          "isUpdatedAt": false,
          "hasDefaultValue": true
        },
        {
          "name": "updatedAt",
          "kind": "scalar",
          "type": "DateTime",
          "isList": false,
          "isRequired": true,
          "isId": false,
          "isUnique": false,
          "isReadOnly": false,
          "isUpdatedAt": true,
          "hasDefaultValue": false
        },
        {
          "name": "title",
          "kind": "scalar",
          "type": "String",
          "isList": false,
          "isRequired": true,
          "isId": false,
          "isUnique": false,
          "isReadOnly": false,
          "isUpdatedAt": false,
          "hasDefaultValue": false
        },
        {
          "name": "content",
          "kind": "scalar",
          "type": "String",
          "isList": false,
          "isRequired": false,
          "isId": false,
          "isUnique": false,
          "isReadOnly": false,
          "isUpdatedAt": false,
          "hasDefaultValue": false
        },
        {
          "name": "someJson",
          "kind": "scalar",
          "type": "Json",
          "isList": false,
          "isRequired": false,
          "isId": false,
          "isUnique": false,
          "isReadOnly": false,
          "isUpdatedAt": false,
          "hasDefaultValue": false
        },
        {
          "name": "status",
          "kind": "enum",
          "type": "Status",
          "isList": false,
          "isRequired": true,
          "isId": false,
          "isUnique": false,
          "isReadOnly": false,
          "isUpdatedAt": false,
          "hasDefaultValue": true
        },
        {
          "name": "published",
          "kind": "scalar",
          "type": "Boolean",
          "isList": false,
          "isRequired": true,
          "isId": false,
          "isUnique": false,
          "isReadOnly": false,
          "isUpdatedAt": false,
          "hasDefaultValue": true
        },
        {
          "name": "publisher",
          "kind": "object",
          "type": "Publisher",
          "isList": false,
          "isRequired": true,
          "isId": false,
          "isUnique": false,
          "isReadOnly": false,
          "isUpdatedAt": false,
          "hasDefaultValue": false
        },
        {
          "name": "publisherId",
          "kind": "scalar",
          "type": "Int",
          "isList": false,
          "isRequired": true,
          "isId": false,
          "isUnique": false,
          "isReadOnly": true,
          "isUpdatedAt": false,
          "hasDefaultValue": false
        }
      ],
      "fields": [
        {
          "name": "id",
          "kind": "scalar",
          "type": "Int",
          "isList": false,
          "isRequired": true,
          "isId": true,
          "isUnique": false,
          "isReadOnly": false,
          "isUpdatedAt": false,
          "hasDefaultValue": true
        },
        {
          "name": "createdAt",
          "kind": "scalar",
          "type": "DateTime",
          "isList": false,
          "isRequired": true,
          "isId": false,
          "isUnique": false,
          "isReadOnly": false,
          "isUpdatedAt": false,
          "hasDefaultValue": true
        },
        {
          "name": "updatedAt",
          "kind": "scalar",
          "type": "DateTime",
          "isList": false,
          "isRequired": true,
          "isId": false,
          "isUnique": false,
          "isReadOnly": false,
          "isUpdatedAt": true,
          "hasDefaultValue": false
        },
        {
          "name": "title",
          "kind": "scalar",
          "type": "String",
          "isList": false,
          "isRequired": true,
          "isId": false,
          "isUnique": false,
          "isReadOnly": false,
          "isUpdatedAt": false,
          "hasDefaultValue": false
        },
        {
          "name": "content",
          "kind": "scalar",
          "type": "String",
          "isList": false,
          "isRequired": false,
          "isId": false,
          "isUnique": false,
          "isReadOnly": false,
          "isUpdatedAt": false,
          "hasDefaultValue": false
        },
        {
          "name": "someJson",
          "kind": "scalar",
          "type": "Json",
          "isList": false,
          "isRequired": false,
          "isId": false,
          "isUnique": false,
          "isReadOnly": false,
          "isUpdatedAt": false,
          "hasDefaultValue": false
        },
        {
          "name": "status",
          "kind": "enum",
          "type": "Status",
          "isList": false,
          "isRequired": true,
          "isId": false,
          "isUnique": false,
          "isReadOnly": false,
          "isUpdatedAt": false,
          "hasDefaultValue": true
        },
        {
          "name": "published",
          "kind": "scalar",
          "type": "Boolean",
          "isList": false,
          "isRequired": true,
          "isId": false,
          "isUnique": false,
          "isReadOnly": false,
          "isUpdatedAt": false,
          "hasDefaultValue": true
        },
        {
          "name": "publisher",
          "kind": "object",
          "type": "Publisher",
          "isList": false,
          "isRequired": true,
          "isId": false,
          "isUnique": false,
          "isReadOnly": false,
          "isUpdatedAt": false,
          "hasDefaultValue": false
        },
        {
          "name": "publisherId",
          "kind": "scalar",
          "type": "Int",
          "isList": false,
          "isRequired": true,
          "isId": false,
          "isUnique": false,
          "isReadOnly": true,
          "isUpdatedAt": false,
          "hasDefaultValue": false
        }
      ]
    },
    "Profile": {
      "name": "Profile",
      "idFields": [
        "id"
      ],
      "scalars": [
        {
          "name": "id",
          "kind": "scalar",
          "type": "Int",
          "isList": false,
          "isRequired": true,
          "isId": true,
          "isUnique": false,
          "isReadOnly": false,
          "isUpdatedAt": false,
          "hasDefaultValue": true
        },
        {
          "name": "bio",
          "kind": "scalar",
          "type": "String",
          "isList": false,
          "isRequired": false,
          "isId": false,
          "isUnique": false,
          "isReadOnly": false,
          "isUpdatedAt": false,
          "hasDefaultValue": false
        },
        {
          "name": "publisherId",
          "kind": "scalar",
          "type": "Int",
          "isList": false,
          "isRequired": true,
          "isId": false,
          "isUnique": true,
          "isReadOnly": true,
          "isUpdatedAt": false,
          "hasDefaultValue": false
        }
      ],
      "relations": [
        {
          "name": "publisher",
          "kind": "object",
          "type": "Publisher",
          "isList": false,
          "isRequired": true,
          "isId": false,
          "isUnique": false,
          "isReadOnly": false,
          "isUpdatedAt": false,
          "hasDefaultValue": false,
          "relationName": "ProfileToPublisher",
          "relationFromFields": [
            "publisherId"
          ],
          "relationToFields": [
            "id"
          ]
        }
      ],
      "enums": [],
      "allFields": [
        {
          "name": "id",
          "kind": "scalar",
          "type": "Int",
          "isList": false,
          "isRequired": true,
          "isId": true,
          "isUnique": false,
          "isReadOnly": false,
          "isUpdatedAt": false,
          "hasDefaultValue": true
        },
        {
          "name": "bio",
          "kind": "scalar",
          "type": "String",
          "isList": false,
          "isRequired": false,
          "isId": false,
          "isUnique": false,
          "isReadOnly": false,
          "isUpdatedAt": false,
          "hasDefaultValue": false
        },
        {
          "name": "publisher",
          "kind": "object",
          "type": "Publisher",
          "isList": false,
          "isRequired": true,
          "isId": false,
          "isUnique": false,
          "isReadOnly": false,
          "isUpdatedAt": false,
          "hasDefaultValue": false
        },
        {
          "name": "publisherId",
          "kind": "scalar",
          "type": "Int",
          "isList": false,
          "isRequired": true,
          "isId": false,
          "isUnique": true,
          "isReadOnly": true,
          "isUpdatedAt": false,
          "hasDefaultValue": false
        }
      ],
      "fields": [
        {
          "name": "id",
          "kind": "scalar",
          "type": "Int",
          "isList": false,
          "isRequired": true,
          "isId": true,
          "isUnique": false,
          "isReadOnly": false,
          "isUpdatedAt": false,
          "hasDefaultValue": true
        },
        {
          "name": "bio",
          "kind": "scalar",
          "type": "String",
          "isList": false,
          "isRequired": false,
          "isId": false,
          "isUnique": false,
          "isReadOnly": false,
          "isUpdatedAt": false,
          "hasDefaultValue": false
        },
        {
          "name": "publisher",
          "kind": "object",
          "type": "Publisher",
          "isList": false,
          "isRequired": true,
          "isId": false,
          "isUnique": false,
          "isReadOnly": false,
          "isUpdatedAt": false,
          "hasDefaultValue": false
        },
        {
          "name": "publisherId",
          "kind": "scalar",
          "type": "Int",
          "isList": false,
          "isRequired": true,
          "isId": false,
          "isUnique": true,
          "isReadOnly": true,
          "isUpdatedAt": false,
          "hasDefaultValue": false
        }
      ]
    },
    "Publisher": {
      "name": "Publisher",
      "idFields": [
        "id"
      ],
      "scalars": [
        {
          "name": "id",
          "kind": "scalar",
          "type": "Int",
          "isList": false,
          "isRequired": true,
          "isId": true,
          "isUnique": false,
          "isReadOnly": false,
          "isUpdatedAt": false,
          "hasDefaultValue": true
        },
        {
          "name": "email",
          "kind": "scalar",
          "type": "String",
          "isList": false,
          "isRequired": true,
          "isId": false,
          "isUnique": true,
          "isReadOnly": false,
          "isUpdatedAt": false,
          "hasDefaultValue": false
        },
        {
          "name": "name",
          "kind": "scalar",
          "type": "String",
          "isList": false,
          "isRequired": false,
          "isId": false,
          "isUnique": false,
          "isReadOnly": false,
          "isUpdatedAt": false,
          "hasDefaultValue": false
        }
      ],
      "relations": [
        {
          "name": "posts",
          "kind": "object",
          "type": "Post",
          "isList": true,
          "isRequired": true,
          "isId": false,
          "isUnique": false,
          "isReadOnly": false,
          "isUpdatedAt": false,
          "hasDefaultValue": false,
          "relationName": "PostToPublisher",
          "relationFromFields": [],
          "relationToFields": []
        },
        {
          "name": "profile",
          "kind": "object",
          "type": "Profile",
          "isList": false,
          "isRequired": false,
          "isId": false,
          "isUnique": false,
          "isReadOnly": false,
          "isUpdatedAt": false,
          "hasDefaultValue": false,
          "relationName": "ProfileToPublisher",
          "relationFromFields": [],
          "relationToFields": []
        }
      ],
      "enums": [],
      "allFields": [
        {
          "name": "id",
          "kind": "scalar",
          "type": "Int",
          "isList": false,
          "isRequired": true,
          "isId": true,
          "isUnique": false,
          "isReadOnly": false,
          "isUpdatedAt": false,
          "hasDefaultValue": true
        },
        {
          "name": "email",
          "kind": "scalar",
          "type": "String",
          "isList": false,
          "isRequired": true,
          "isId": false,
          "isUnique": true,
          "isReadOnly": false,
          "isUpdatedAt": false,
          "hasDefaultValue": false
        },
        {
          "name": "name",
          "kind": "scalar",
          "type": "String",
          "isList": false,
          "isRequired": false,
          "isId": false,
          "isUnique": false,
          "isReadOnly": false,
          "isUpdatedAt": false,
          "hasDefaultValue": false
        },
        {
          "name": "posts",
          "kind": "object",
          "type": "Post",
          "isList": true,
          "isRequired": true,
          "isId": false,
          "isUnique": false,
          "isReadOnly": false,
          "isUpdatedAt": false,
          "hasDefaultValue": false
        },
        {
          "name": "profile",
          "kind": "object",
          "type": "Profile",
          "isList": false,
          "isRequired": false,
          "isId": false,
          "isUnique": false,
          "isReadOnly": false,
          "isUpdatedAt": false,
          "hasDefaultValue": false
        }
      ],
      "fields": [
        {
          "name": "id",
          "kind": "scalar",
          "type": "Int",
          "isList": false,
          "isRequired": true,
          "isId": true,
          "isUnique": false,
          "isReadOnly": false,
          "isUpdatedAt": false,
          "hasDefaultValue": true
        },
        {
          "name": "email",
          "kind": "scalar",
          "type": "String",
          "isList": false,
          "isRequired": true,
          "isId": false,
          "isUnique": true,
          "isReadOnly": false,
          "isUpdatedAt": false,
          "hasDefaultValue": false
        },
        {
          "name": "name",
          "kind": "scalar",
          "type": "String",
          "isList": false,
          "isRequired": false,
          "isId": false,
          "isUnique": false,
          "isReadOnly": false,
          "isUpdatedAt": false,
          "hasDefaultValue": false
        },
        {
          "name": "posts",
          "kind": "object",
          "type": "Post",
          "isList": true,
          "isRequired": true,
          "isId": false,
          "isUnique": false,
          "isReadOnly": false,
          "isUpdatedAt": false,
          "hasDefaultValue": false
        },
        {
          "name": "profile",
          "kind": "object",
          "type": "Profile",
          "isList": false,
          "isRequired": false,
          "isId": false,
          "isUnique": false,
          "isReadOnly": false,
          "isUpdatedAt": false,
          "hasDefaultValue": false
        }
      ]
    }
  },
  "enums": {
    "Status": [
      "ACTIVE",
      "REMOVED"
    ]
  }
} as const;
