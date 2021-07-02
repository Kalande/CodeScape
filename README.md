# CodeScape

## User stories


## Models
####Snippet model
```
  content: {
    type: String,
    required: true,
  },
  language: {
    type: String,
  },
  owner: {
    ref: 'User',
    type: mongoose.Schema.Types.ObjectId
  }
```

User model

```
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }
```

## Routes

GET /
GET /login
GET /signup
POST /login
POST /signup



## Backlog
- Possibility to follow othe rusers and see their snippets;
- Resources page;


## Links
[Trello](https://trello.com/b/gTyFyNr4/codescape)


### Git

[Repository Link](https://github.com/Kalande/CodeScape)

[Deploy Link]

### Slides

Slides Link