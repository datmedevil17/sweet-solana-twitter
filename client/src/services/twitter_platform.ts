/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/twitter_platform.json`.
 */
export type TwitterPlatform = {
  "address": "72bRGCehS6GpgRDoUpEtdtw2PV5nJhiEZ2SiuzUwR3Cz",
  "metadata": {
    "name": "twitterPlatform",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "A decentralized Twitter-like platform on Solana"
  },
  "instructions": [
    {
      "name": "createCollaborationPost",
      "discriminator": [
        30,
        113,
        24,
        210,
        148,
        1,
        29,
        174
      ],
      "accounts": [
        {
          "name": "programState",
          "writable": true
        },
        {
          "name": "authorProfile",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  112,
                  114,
                  111,
                  102,
                  105,
                  108,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "author"
              }
            ]
          }
        },
        {
          "name": "collaboratorProfile",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  112,
                  114,
                  111,
                  102,
                  105,
                  108,
                  101
                ]
              },
              {
                "kind": "arg",
                "path": "collaborator"
              }
            ]
          }
        },
        {
          "name": "post",
          "writable": true
        },
        {
          "name": "author",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "collaborator",
          "type": "pubkey"
        },
        {
          "name": "content",
          "type": "string"
        },
        {
          "name": "imageUrl",
          "type": {
            "option": "string"
          }
        }
      ]
    },
    {
      "name": "createComment",
      "discriminator": [
        236,
        232,
        11,
        180,
        70,
        206,
        73,
        145
      ],
      "accounts": [
        {
          "name": "programState",
          "writable": true
        },
        {
          "name": "comment",
          "writable": true
        },
        {
          "name": "post",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  115,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "postId"
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "postId",
          "type": "u64"
        },
        {
          "name": "content",
          "type": "string"
        }
      ]
    },
    {
      "name": "createPost",
      "discriminator": [
        123,
        92,
        184,
        29,
        231,
        24,
        15,
        202
      ],
      "accounts": [
        {
          "name": "programState",
          "writable": true
        },
        {
          "name": "userProfile",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  112,
                  114,
                  111,
                  102,
                  105,
                  108,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "post",
          "writable": true
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "content",
          "type": "string"
        },
        {
          "name": "imageUrl",
          "type": {
            "option": "string"
          }
        }
      ]
    },
    {
      "name": "createProfile",
      "discriminator": [
        225,
        205,
        234,
        143,
        17,
        186,
        50,
        220
      ],
      "accounts": [
        {
          "name": "programState",
          "writable": true
        },
        {
          "name": "userProfile",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  112,
                  114,
                  111,
                  102,
                  105,
                  108,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "username",
          "type": "string"
        },
        {
          "name": "displayName",
          "type": "string"
        },
        {
          "name": "bio",
          "type": "string"
        },
        {
          "name": "profileImageUrl",
          "type": "string"
        }
      ]
    },
    {
      "name": "deleteComment",
      "discriminator": [
        40,
        183,
        112,
        58,
        215,
        240,
        57,
        82
      ],
      "accounts": [
        {
          "name": "comment",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  109,
                  109,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "commentId"
              }
            ]
          }
        },
        {
          "name": "post",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  115,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "comment.post_id",
                "account": "comment"
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "commentId",
          "type": "u64"
        }
      ]
    },
    {
      "name": "deletePost",
      "discriminator": [
        208,
        39,
        67,
        161,
        55,
        13,
        153,
        42
      ],
      "accounts": [
        {
          "name": "post",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  115,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "postId"
              }
            ]
          }
        },
        {
          "name": "userProfile",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  112,
                  114,
                  111,
                  102,
                  105,
                  108,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "postId",
          "type": "u64"
        }
      ]
    },
    {
      "name": "donateToCreator",
      "discriminator": [
        254,
        37,
        179,
        185,
        249,
        139,
        136,
        111
      ],
      "accounts": [
        {
          "name": "programState",
          "writable": true
        },
        {
          "name": "donation",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  111,
                  110,
                  97,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "donor"
              },
              {
                "kind": "arg",
                "path": "creator"
              }
            ]
          }
        },
        {
          "name": "creatorProfile",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  112,
                  114,
                  111,
                  102,
                  105,
                  108,
                  101
                ]
              },
              {
                "kind": "arg",
                "path": "creator"
              }
            ]
          }
        },
        {
          "name": "donor",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "creator",
          "type": "pubkey"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "followUser",
      "discriminator": [
        126,
        176,
        97,
        36,
        63,
        145,
        4,
        134
      ],
      "accounts": [
        {
          "name": "follow",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  111,
                  108,
                  108,
                  111,
                  119
                ]
              },
              {
                "kind": "account",
                "path": "follower"
              },
              {
                "kind": "arg",
                "path": "targetUser"
              }
            ]
          }
        },
        {
          "name": "followerProfile",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  112,
                  114,
                  111,
                  102,
                  105,
                  108,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "follower"
              }
            ]
          }
        },
        {
          "name": "followingProfile",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  112,
                  114,
                  111,
                  102,
                  105,
                  108,
                  101
                ]
              },
              {
                "kind": "arg",
                "path": "targetUser"
              }
            ]
          }
        },
        {
          "name": "follower",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "targetUser",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "programState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  103,
                  114,
                  97,
                  109,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "deployer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "likePost",
      "discriminator": [
        45,
        242,
        154,
        71,
        63,
        133,
        54,
        186
      ],
      "accounts": [
        {
          "name": "like",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  107,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "arg",
                "path": "postId"
              }
            ]
          }
        },
        {
          "name": "post",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  115,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "postId"
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "postId",
          "type": "u64"
        }
      ]
    },
    {
      "name": "unfollowUser",
      "discriminator": [
        204,
        183,
        196,
        110,
        97,
        165,
        226,
        213
      ],
      "accounts": [
        {
          "name": "follow",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  111,
                  108,
                  108,
                  111,
                  119
                ]
              },
              {
                "kind": "account",
                "path": "follower"
              },
              {
                "kind": "arg",
                "path": "targetUser"
              }
            ]
          }
        },
        {
          "name": "followerProfile",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  112,
                  114,
                  111,
                  102,
                  105,
                  108,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "follower"
              }
            ]
          }
        },
        {
          "name": "followingProfile",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  112,
                  114,
                  111,
                  102,
                  105,
                  108,
                  101
                ]
              },
              {
                "kind": "arg",
                "path": "targetUser"
              }
            ]
          }
        },
        {
          "name": "follower",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "targetUser",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "unlikePost",
      "discriminator": [
        236,
        63,
        6,
        34,
        128,
        3,
        114,
        174
      ],
      "accounts": [
        {
          "name": "like",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  107,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "arg",
                "path": "postId"
              }
            ]
          }
        },
        {
          "name": "post",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  115,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "postId"
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "postId",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updateProfile",
      "discriminator": [
        98,
        67,
        99,
        206,
        86,
        115,
        175,
        1
      ],
      "accounts": [
        {
          "name": "userProfile",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  112,
                  114,
                  111,
                  102,
                  105,
                  108,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "displayName",
          "type": {
            "option": "string"
          }
        },
        {
          "name": "bio",
          "type": {
            "option": "string"
          }
        },
        {
          "name": "profileImageUrl",
          "type": {
            "option": "string"
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "comment",
      "discriminator": [
        150,
        135,
        96,
        244,
        55,
        199,
        50,
        65
      ]
    },
    {
      "name": "donation",
      "discriminator": [
        189,
        210,
        54,
        77,
        216,
        85,
        7,
        68
      ]
    },
    {
      "name": "follow",
      "discriminator": [
        222,
        247,
        253,
        60,
        70,
        4,
        164,
        51
      ]
    },
    {
      "name": "like",
      "discriminator": [
        10,
        133,
        129,
        201,
        87,
        218,
        203,
        222
      ]
    },
    {
      "name": "post",
      "discriminator": [
        8,
        147,
        90,
        186,
        185,
        56,
        192,
        150
      ]
    },
    {
      "name": "programState",
      "discriminator": [
        77,
        209,
        137,
        229,
        149,
        67,
        167,
        230
      ]
    },
    {
      "name": "userProfile",
      "discriminator": [
        32,
        37,
        119,
        205,
        179,
        180,
        13,
        194
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "alreadyInitialized",
      "msg": "Program is already initialized"
    },
    {
      "code": 6001,
      "name": "usernameTooLong",
      "msg": "Username is too long"
    },
    {
      "code": 6002,
      "name": "displayNameTooLong",
      "msg": "Display name is too long"
    },
    {
      "code": 6003,
      "name": "bioTooLong",
      "msg": "Bio is too long"
    },
    {
      "code": 6004,
      "name": "postContentTooLong",
      "msg": "Post content is too long"
    },
    {
      "code": 6005,
      "name": "commentTooLong",
      "msg": "Comment is too long"
    },
    {
      "code": 6006,
      "name": "imageUrlTooLong",
      "msg": "Image URL is too long"
    },
    {
      "code": 6007,
      "name": "usernameAlreadyExists",
      "msg": "Username already exists"
    },
    {
      "code": 6008,
      "name": "profileNotFound",
      "msg": "Profile not found"
    },
    {
      "code": 6009,
      "name": "postNotFound",
      "msg": "Post not found"
    },
    {
      "code": 6010,
      "name": "commentNotFound",
      "msg": "Comment not found"
    },
    {
      "code": 6011,
      "name": "cannotFollowSelf",
      "msg": "Cannot follow yourself"
    },
    {
      "code": 6012,
      "name": "alreadyFollowing",
      "msg": "Already following user"
    },
    {
      "code": 6013,
      "name": "notFollowing",
      "msg": "Not following user"
    },
    {
      "code": 6014,
      "name": "alreadyLiked",
      "msg": "Already liked post"
    },
    {
      "code": 6015,
      "name": "notLiked",
      "msg": "Not liked post"
    },
    {
      "code": 6016,
      "name": "unauthorized",
      "msg": "Unauthorized action"
    },
    {
      "code": 6017,
      "name": "invalidDonationAmount",
      "msg": "Invalid donation amount"
    },
    {
      "code": 6018,
      "name": "cannotDonateToSelf",
      "msg": "Cannot donate to yourself"
    },
    {
      "code": 6019,
      "name": "collaboratorNotFound",
      "msg": "Collaborator not found"
    },
    {
      "code": 6020,
      "name": "postDeleted",
      "msg": "Post is deleted"
    },
    {
      "code": 6021,
      "name": "cannotDeleteOthersPost",
      "msg": "Cannot delete someone else's post"
    }
  ],
  "types": [
    {
      "name": "comment",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "commentId",
            "type": "u64"
          },
          {
            "name": "postId",
            "type": "u64"
          },
          {
            "name": "author",
            "type": "pubkey"
          },
          {
            "name": "content",
            "type": "string"
          },
          {
            "name": "createdAt",
            "type": "u64"
          },
          {
            "name": "isDeleted",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "donation",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "donor",
            "type": "pubkey"
          },
          {
            "name": "recipient",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "u64"
          },
          {
            "name": "transactionId",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "follow",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "follower",
            "type": "pubkey"
          },
          {
            "name": "following",
            "type": "pubkey"
          },
          {
            "name": "createdAt",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "like",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "postId",
            "type": "u64"
          },
          {
            "name": "createdAt",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "post",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "postId",
            "type": "u64"
          },
          {
            "name": "author",
            "type": "pubkey"
          },
          {
            "name": "collaborator",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "content",
            "type": "string"
          },
          {
            "name": "imageUrl",
            "type": {
              "option": "string"
            }
          },
          {
            "name": "likesCount",
            "type": "u64"
          },
          {
            "name": "commentsCount",
            "type": "u64"
          },
          {
            "name": "createdAt",
            "type": "u64"
          },
          {
            "name": "updatedAt",
            "type": "u64"
          },
          {
            "name": "isDeleted",
            "type": "bool"
          },
          {
            "name": "isCollaboration",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "programState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "initialized",
            "type": "bool"
          },
          {
            "name": "userCount",
            "type": "u64"
          },
          {
            "name": "postCount",
            "type": "u64"
          },
          {
            "name": "commentCount",
            "type": "u64"
          },
          {
            "name": "platformFee",
            "type": "u64"
          },
          {
            "name": "platformAddress",
            "type": "pubkey"
          },
          {
            "name": "totalDonations",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "userProfile",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "userId",
            "type": "u64"
          },
          {
            "name": "username",
            "type": "string"
          },
          {
            "name": "displayName",
            "type": "string"
          },
          {
            "name": "bio",
            "type": "string"
          },
          {
            "name": "profileImageUrl",
            "type": "string"
          },
          {
            "name": "followersCount",
            "type": "u64"
          },
          {
            "name": "followingCount",
            "type": "u64"
          },
          {
            "name": "postsCount",
            "type": "u64"
          },
          {
            "name": "createdAt",
            "type": "u64"
          },
          {
            "name": "totalDonationsReceived",
            "type": "u64"
          },
          {
            "name": "isVerified",
            "type": "bool"
          }
        ]
      }
    }
  ]
};
